import { chromium, Browser, Page } from 'playwright';
import path from 'path';
import fs from 'fs';

function extractActualWebsite(url: string | null | undefined): string | null {
  if (!url) return null;
  const clean = url.trim();
  try {
    const urlWithProto = clean.includes('://') ? clean : `https://${clean}`;
    const parsed = new URL(urlWithProto);
    
    // Extract true destination URL from Google redirect wrapper
    if (parsed.hostname.includes('google.') && (parsed.pathname === '/url' || parsed.pathname.endsWith('/url'))) {
      const actualUrl = parsed.searchParams.get('q') || parsed.searchParams.get('url');
      if (actualUrl) {
        return actualUrl;
      }
    }
  } catch {
    // Return original if parsing fails
  }
  return clean;
}


class PageStateHarvester {
  public static extractFromText(text: string, businessName: string): { phone?: string | null; website?: string | null } {
    const escapedName = businessName.replace(/"/g, '\\"');
    let nameIndex = text.indexOf(`"${escapedName}"`);
    if (nameIndex === -1) {
      nameIndex = text.toLowerCase().indexOf(businessName.toLowerCase());
    }

    if (nameIndex === -1) return {};

    const chunk = text.substring(nameIndex, nameIndex + 4000);

    let phone: string | null = null;
    let website: string | null = null;

    // 1. Check for tel: link in the chunk
    const telMatches = [...chunk.matchAll(/"tel:([^"]+)"/g)];
    if (telMatches.length > 0) {
      phone = telMatches[0][1].trim();
    }

    // 2. Schema telephone match
    if (!phone) {
      const phoneMeta = chunk.match(/itemprop="telephone"\s+content="([^"]+)"/) || chunk.match(/"telephone"\s*:\s*"([^"]+)"/);
      if (phoneMeta && phoneMeta[1]) phone = phoneMeta[1].trim();
    }

    // 3. Search for any quoted numbers in the chunk
    if (!phone) {
      const phoneMatches = [...chunk.matchAll(/"(\+?[0-9][0-9\s\-\(\)]{8,20})"/g)];
      for (const m of phoneMatches) {
        const num = m[1].trim();
        const digitCount = (num.match(/\d/g) || []).length;
        if (digitCount >= 8 && digitCount <= 15 && !num.startsWith('0000') && !num.includes('1970') && !num.includes('2026')) {
          phone = num;
          break;
        }
      }
    }

    // 4. Look for websites
    const webMatches = [...chunk.matchAll(/(?:itemprop="url"|href)="(https?:\/\/[^"]+)"/g)].concat(
        [...chunk.matchAll(/"(https?:\/\/[^"]+)"/g)]
    );
    
    for (const m of webMatches) {
       const url = m[1];
       if (url.startsWith('http') && 
           !url.includes('google.com') && 
           !url.includes('gstatic.com') && 
           !url.includes('schema.org') && 
           !url.includes('w3.org') &&
           !url.includes('youtube.com')) {
           
           if (!url.includes('facebook.com') && !url.includes('instagram.com') && !url.includes('linkedin.com') && !url.includes('twitter.com') && !url.includes('x.com')) {
              website = url;
              break; 
           }
       }
    }

    // Fallback: if no website yet, look for any http link excluding google
    if (!website) {
       for (const m of webMatches) {
         const url = m[1];
         if (url.startsWith('http') && 
             !url.includes('google.com') && 
             !url.includes('gstatic.com') && 
             !url.includes('schema.org') && 
             !url.includes('w3.org')) {
             website = url;
             break;
         }
       }
    }

    return { 
      phone, 
      website: extractActualWebsite(website) 
    };
  }
}




export interface LeadData {
  id: string;
  name: string;
  category: string;
  location: string;
  phone?: string | null;
  website?: string | null;
  mapsUrl: string;
  rating?: number | null;
  reviewsCount?: number;
  score?: number;
  siteStatus?: 'present' | 'missing';
  source: string;
  coordinates?: { lat: number; lng: number } | null;
  address?: string | null;
}

export class ScraperEngine {
  private browser: Browser | null = null;
  private logs: string[] = [];
  
  public getLogs(): string[] {
    return this.logs;
  }

  private log(message: string) {
    const ts = new Date().toISOString();
    const entry = `[${ts}] ${message}`;
    console.log(entry);
    this.logs.push(entry);
  }

  async init() {
    this.log('Initializing Playwright Browser...');
    this.browser = await chromium.launch({
      headless: false, // Set to false so you can see it open
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async close() {
    if (this.browser) {
      this.log('Closing Playwright Browser...');
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Scrapes leads for a given search query (e.g. "Cafe in Mumbai")
   * utilizing Scrolling and DOM extraction. 
   */
  async scrapeCity(searchQuery: string, city: string, category: string): Promise<LeadData[]> {
    if (!this.browser) {
      throw new Error("Browser not initialized. Call init() first.");
    }

    const page = await this.browser.newPage();
    const extractedLeads: LeadData[] = [];
    const seenUrls = new Set<string>();

    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const interceptedPayloads: string[] = [];

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('/search') || url.includes('/batchexecute') || url.includes('/maps/preview/entity')) {
        try {
          const text = await response.text();
          interceptedPayloads.push(text);
        } catch(e) {}
      }
    });

    try {
      this.log(`Navigating to Google Maps...`);
      await page.goto('https://www.google.com/maps', { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      // VALIDATION: Check URL
      const currentUrl = page.url();
      if (!currentUrl.includes('google.com/maps')) {
        this.log(`URL validation failed. Current URL: ${currentUrl}`);
        throw new Error('Failed to load Google Maps.');
      }
      this.log(`Google Maps loaded successfully. URL: ${currentUrl}`);
      await page.screenshot({ path: path.join(screenshotsDir, '01-maps-loaded.png') });

      this.log(`Locating search input...`);
      await page.waitForSelector('input[name="q"], input#searchboxinput', { timeout: 15000 });
      
      this.log(`Entering search query: ${searchQuery}`);
      await page.fill('input[name="q"], input#searchboxinput', searchQuery);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000); // Give it a moment to submit
      await page.screenshot({ path: path.join(screenshotsDir, '02-search-submitted.png') });

      this.log(`Waiting for results panel...`);
      try {
        await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 20000 });
      } catch (e) {
        await page.screenshot({ path: path.join(screenshotsDir, 'error-no-results.png') });
        this.log(`No results found or results panel failed to load for ${searchQuery}.`);
        return [];
      }

      // VALIDATION: Verify business cards exist
      const cardsCount = await page.locator('a[href*="/maps/place/"]').count();
      this.log(`Detected ${cardsCount} business cards initially.`);
      await page.screenshot({ path: path.join(screenshotsDir, '03-results-loaded.png') });

      if (cardsCount === 0) {
        this.log(`Validation failed: No business cards detected for ${searchQuery}. Aborting extraction.`);
        return [];
      }

      this.log(`Extraction starting for ${searchQuery}...`);
      let hasReachedEnd = false;
      let lastCount = 0;
      let retries = 0;

      while (!hasReachedEnd && retries < 5) {
        const cards = page.locator('a[href*="/maps/place/"]');
        const currentCount = await cards.count();
        
        for (let i = lastCount; i < currentCount; i++) {
          try {
            const card = cards.nth(i);
            const href = await card.getAttribute('href');
            if (href && !seenUrls.has(href)) {
              seenUrls.add(href);
              
              const ariaLabel = await card.getAttribute('aria-label');
              const parentDiv = page.locator('a[href*="/maps/place/"]').nth(i).locator('xpath=..');
              const textContent = await parentDiv.textContent() || '';
              
              const ratingMatch = textContent.match(/(\d\.\d)\s*stars/i) || textContent.match(/(\d\.\d)\(/);
              const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
              
              const reviewsMatch = textContent.match(/\(([\d,]+)\)/);
              const reviewsCount = reviewsMatch ? parseInt(reviewsMatch[1].replace(/,/g, '')) : 0;
              
              let lat = 0, lng = 0;
              const latMatch = href.match(/!3d(-?\d+\.\d+)/);
              const lngMatch = href.match(/!4d(-?\d+\.\d+)/);
              if (latMatch && lngMatch) {
                lat = parseFloat(latMatch[1]);
                lng = parseFloat(lngMatch[1]);
              }

              // Extract website directly from card if present in sidebar DOM
              const websiteLink = parentDiv.locator('a[href*="/url?q="]').first();
              let cardWebsite: string | null = null;
              if (await websiteLink.isVisible().catch(() => false)) {
                const rawUrl = await websiteLink.getAttribute('href').catch(() => null);
                cardWebsite = extractActualWebsite(rawUrl);
              }

              extractedLeads.push({
                id: href,
                name: ariaLabel || 'Unknown',
                category: category,
                location: city,
                mapsUrl: href,
                rating: rating,
                reviewsCount: reviewsCount,
                source: 'playwright_sidebar',
                website: cardWebsite,
                coordinates: lat && lng ? { lat, lng } : null
              });
            }
          } catch (e) {
            // Element detached
          }
        }
        
        lastCount = currentCount;

        try {
          const feed = page.locator('div[role="feed"]').first();
          await feed.evaluate(el => el.scrollTo(0, el.scrollHeight));
          await page.waitForTimeout(1500);
        } catch(e) {
          await page.mouse.wheel(0, 5000);
          await page.waitForTimeout(1500);
        }

        const newCount = await page.locator('a[href*="/maps/place/"]').count();
        if (newCount === lastCount) {
          retries++;
          const endTextVisible = await page.locator('text="You\'ve reached the end of the list."').isVisible().catch(()=>false);
          if (endTextVisible) {
            this.log(`Reached the end of the list for ${searchQuery}.`);
            hasReachedEnd = true;
          }
        } else {
          retries = 0;
        }
      }

      this.log(`Surface extraction complete. Total ${extractedLeads.length} leads extracted from ${city}.`);
      this.log(`Starting Network-Intercept Deep Extraction...`);

      for (let lead of extractedLeads) {
         // Skip if we already got the website from the card DOM
         if (lead.phone && lead.website) continue;
         
         try {
           const card = page.locator(`a[href="${lead.mapsUrl}"]`).first();
           if (!(await card.isVisible().catch(() => false))) {
              await card.scrollIntoViewIfNeeded().catch(() => {});
           }
           
           // Setup response listener for the click
           const responsePromise = page.waitForResponse(response => 
             (response.url().includes('/maps/preview/entity') || response.url().includes('/batchexecute')) &&
             response.status() === 200,
             { timeout: 6000 }
           ).catch(() => null);

           // Click to trigger background payload fetch
           await card.click({ force: true });
           
           const response = await responsePromise;
           if (response) {
             const text = await response.text().catch(() => '');
             if (text) {
               const harvested = PageStateHarvester.extractFromText(text, lead.name);
               if (harvested.phone && !lead.phone) {
                 lead.phone = harvested.phone;
               }
               if (harvested.website && !lead.website) {
                 lead.website = harvested.website;
               }
             }
           }
           
           if (lead.phone || lead.website) {
              this.log(`[Deep Intercept] Resolved ${lead.name} -> Phone: ${lead.phone || 'N/A'}, Website: ${lead.website || 'N/A'}`);
           }
           
           // Small delay to prevent rate limiting / request overlap
           await page.waitForTimeout(250);
         } catch(e: any) {
           this.log(`Skipping deep extraction for ${lead.name}: ${e.message}`);
         }
      }
      
      this.log(`Deep Extraction complete for ${city}.`);
      
    } catch (error: any) {
      this.log(`Critical Extraction Error for ${city}: ${error.message}`);
      await page.screenshot({ path: path.join(screenshotsDir, 'error-fatal.png') }).catch(() => {});
    } finally {
      await page.close();
    }

    return extractedLeads;
  }

  async scrapeGoogleDork(query: string): Promise<Array<{ title: string; url: string; snippet: string }>> {
    if (!this.browser) {
      throw new Error("Browser not initialized. Call init() first.");
    }

    const page = await this.browser.newPage();
    const results: Array<{ title: string; url: string; snippet: string }> = [];

    try {
      this.log(`Navigating to Google Search for query: "${query}"`);
      await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);

      const hasCaptcha = await page.evaluate(() => {
        return document.body.innerHTML.includes('captcha') || document.body.innerHTML.includes('recaptcha') || document.body.innerHTML.includes('detecting unusual traffic');
      });

      if (hasCaptcha) {
        this.log(`Google CAPTCHA challenge detected. Falling back to DuckDuckGo HTML...`);
        await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1000);
        
        const ddgResults = await page.evaluate(() => {
          const items: any[] = [];
          document.querySelectorAll('.result').forEach(el => {
            const titleEl = el.querySelector('.result__title a');
            const snippetEl = el.querySelector('.result__snippet');
            if (titleEl && snippetEl) {
              items.push({
                title: titleEl.textContent?.trim() || "",
                url: titleEl.getAttribute('href') || "",
                snippet: snippetEl.textContent?.trim() || ""
              });
            }
          });
          return items;
        });
        return ddgResults;
      }

      const googleResults = await page.evaluate(() => {
        const items: any[] = [];
        document.querySelectorAll('div.g').forEach(el => {
          const titleEl = el.querySelector('h3');
          const linkEl = el.querySelector('a');
          const snippetEl = el.querySelector('div[style*="-webkit-line-clamp"], .VwiC3b, .s3v9rd');
          
          if (titleEl && linkEl) {
            items.push({
              title: titleEl.textContent?.trim() || "",
              url: linkEl.getAttribute('href') || "",
              snippet: snippetEl ? snippetEl.textContent?.trim() || "" : ""
            });
          }
        });
        return items;
      });

      results.push(...googleResults);
      this.log(`Extracted ${results.length} results from Google search.`);
    } catch (e: any) {
      this.log(`Error during Google Dorking: ${e.message}`);
    } finally {
      await page.close();
    }

    return results;
  }
}
