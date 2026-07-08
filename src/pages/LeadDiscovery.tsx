import React, { useState } from "react";
import { Search, MapPin, Building2, Star, Link2, Phone, Mail, ArrowRight, Github, Settings, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveLeadToSheet } from "../lib/sheets";
import { cn } from "@/lib/utils";

export function LeadDiscovery() {
  const [searchSource, setSearchSource] = useState<"maps" | "github">("maps");
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [showTokenSettings, setShowTokenSettings] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);

  const checkGithubConnection = async () => {
    setIsTestingToken(true);
    setConnectionStatus(null);
    try {
      const response = await fetch('/api/leads/discover/github/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken })
      });
      if (!response.ok) {
        setConnectionStatus({
          success: false,
          message: `❌ Server error: ${response.status} ${response.statusText}`
        });
        return;
      }
      const data = await response.json();
      if (data.success) {
        setConnectionStatus({
          success: true,
          message: `✅ Connected as @${data.username} (API rate limit: ${data.rateLimitRemaining}/${data.rateLimitLimit})`
        });
      } else {
        setConnectionStatus({
          success: false,
          message: `❌ ${data.error || "Connection failed. Please check token."}`
        });
      }
    } catch (err) {
      console.error(err);
      setConnectionStatus({
        success: false,
        message: "❌ Error connecting to test server."
      });
    } finally {
      setIsTestingToken(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSource === "maps" && (!niche || !city)) return;
    if (searchSource === "github" && !niche) return;
    
    setIsSearching(true);
    
    try {
      if (searchSource === "maps") {
        const response = await fetch('/api/leads/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: niche, location: city })
        });
        const data = await response.json();
        if (data.results) {
          setLeads(data.results);
        }
      } else {
        const response = await fetch('/api/leads/discover/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: niche, token: githubToken, limit: 20 })
        });
        const data = await response.json();
        if (data.results) {
          setLeads(data.results);
        }
      }
    } catch (err) {
      console.error(err);
      // fallback mock for UI preview
      if (searchSource === "maps") {
        setLeads([
          { id: 1, name: "Premium Dental Care", rating: 4.8, address: `123 Main St, ${city}`, website: "premiumdental.com", phone: "+1 234-567-8900", email: "hello@premiumdental.com", reviewsCount: 124 },
          { id: 2, name: `${niche} Experts`, rating: 4.2, address: `456 Oak Ave, ${city}`, website: "", phone: "+1 987-654-3210", email: "", reviewsCount: 38 },
        ]);
      } else {
        setLeads([
          { id: 1, name: "Artypoul | Repo: Gigma_skiils", title: "Add support-assets and website design help", rating: "⭐ 24", address: "https://github.com/Artypoul/Gigma_skiils/pull/27", website: "artypoul.github.io", phone: "GitHub Gigs", email: "contact@artypoul.dev", reviewsCount: 3, description: "Looking for a website designer to help clean up the frontend code and design a premium responsive dashboard for our client..." },
          { id: 2, name: "PitchPineMedia25 | Repo: Real-Estate-Digital-Marketing-Agency", title: "Real Estate Website Development - Looking for a developer", rating: "⭐ 12", address: "https://github.com/PitchPineMedia25/Real-Estate-Digital-Marketing-Agency/issues/28", website: "pitchpinemedia.com", phone: "GitHub Gigs", email: "No public email", reviewsCount: 8, description: "We need a skilled developer to build a modern property portal with listings filter, Maps integration, and lead generation forms." }
        ]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveToCRM = async (lead: any) => {
    const sheetId = localStorage.getItem('crm_sheet_id');
    if (!sheetId) {
      alert("No Google Sheet ID found! Go to the Dashboard and create/connect a CRM Sheet first.");
      return;
    }
    try {
      await saveLeadToSheet(sheetId, { ...lead, niche });
      alert(`Lead added to CRM successfully!`);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save to Google Sheets.");
    }
  };

  const handleSaveAll = async () => {
    if (leads.length === 0) return;
    for (const lead of leads) {
       await handleSaveToCRM(lead);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      <div className="p-8 border-b border-border bg-card/30 backdrop-blur-sm z-10 shrink-0">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Lead Discovery Engine</h1>
              <p className="text-muted-foreground mt-2">Find and extract high-value clients across Google Maps and GitHub Gigs.</p>
            </div>
            {searchSource === "github" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTokenSettings(!showTokenSettings)}
                className="gap-1.5"
              >
                <Settings className="w-4 h-4" />
                API Token Settings
              </Button>
            )}
          </div>

          <div className="flex gap-2 p-1 bg-muted/50 rounded-lg self-start border border-border/40 max-w-sm">
            <button
              type="button"
              onClick={() => { setSearchSource("maps"); setLeads([]); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                searchSource === "maps"
                  ? "bg-card text-foreground shadow-sm border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Building2 className="w-3.5 h-3.5" />
              Google Maps (Local)
            </button>
            <button
              type="button"
              onClick={() => { setSearchSource("github"); setLeads([]); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                searchSource === "github"
                  ? "bg-card text-foreground shadow-sm border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub Gigs & Jobs
            </button>
          </div>

          {showTokenSettings && searchSource === "github" && (
            <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-3 max-w-lg">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-primary" />
                GitHub Personal Access Token (Optional)
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Adding your token prevents API rate-limiting (403 errors) and allows the engine to pull richer user profile data such as public email addresses.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="github_pat_... (Leave blank to use pre-saved token)"
                  value={githubToken}
                  onChange={e => setGithubToken(e.target.value)}
                  className="bg-card text-xs flex-1"
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isTestingToken}
                  onClick={checkGithubConnection}
                  className="shrink-0 h-9"
                >
                  {isTestingToken ? "Testing..." : "Test Connection"}
                </Button>
              </div>
              {connectionStatus && (
                <p className={cn(
                  "text-[11px] font-medium leading-normal",
                  connectionStatus.success ? "text-emerald-500" : "text-destructive"
                )}>
                  {connectionStatus.message}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSearch} className="flex gap-4">
            {searchSource === "maps" ? (
              <>
                <div className="flex-1 relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    placeholder="e.g. Dentists, Roofer, Plumber" 
                    className="pl-9 bg-card"
                    required
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Austin, TX" 
                    className="pl-9 bg-card"
                    required
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                  placeholder='e.g. "need a website", "looking for developer", "website developer needed"' 
                  className="pl-9 bg-card"
                  required
                />
              </div>
            )}
            <Button type="submit" disabled={isSearching} className="w-32 bg-primary text-primary-foreground hover:opacity-90">
              {isSearching ? "Searching..." : "Find Leads"}
              {!isSearching && <Search className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </div>
      </div>

      <ScrollArea className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {leads.length > 0 ? (
             <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Found {leads.length} leads matching your search criteria</span>
                <Button variant="outline" size="sm" onClick={handleSaveAll}>Save All to CRM</Button>
               </div>
               {leads.map((lead, i) => (
                 <Card key={i} className="hover:border-primary/50 transition-colors bg-card/60 backdrop-blur-sm">
                   <CardContent className="p-6">
                     <div className="flex items-start justify-between">
                       <div className="space-y-3 flex-1 mr-4">
                         <div>
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 flex-wrap">
                              {searchSource === "github" ? (
                                <>
                                  <Github className="w-4 h-4 text-muted-foreground" />
                                  <span>{lead.title}</span>
                                </>
                              ) : (
                                <span>{lead.name}</span>
                              )}
                              {searchSource === "maps" && !lead.website && <Badge variant="destructive" className="py-0 h-5">No Website</Badge>}
                              {searchSource === "github" && lead.email !== "No public email" && (
                                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 py-0 h-5 text-white">Email Found</Badge>
                              )}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground flex-wrap">
                              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                              <span className="font-medium text-foreground">{lead.rating}</span>
                              {searchSource === "maps" && (
                                <>
                                  <span>({lead.reviewsCount || 0} reviews)</span>
                                  <span className="px-1.5">•</span>
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {lead.address}</span>
                                </>
                              )}
                              {searchSource === "github" && (
                                <>
                                  <span>({lead.reviewsCount || 0} comments)</span>
                                  <span className="px-1.5">•</span>
                                  <span className="font-semibold text-muted-foreground">{lead.name.split(" | ")[0]}</span>
                                </>
                              )}
                            </div>
                         </div>
                         
                         {searchSource === "github" && lead.description && (
                           <p className="text-xs text-muted-foreground bg-secondary/35 p-3 rounded-lg border border-border/40 mt-3 font-sans line-clamp-3 leading-relaxed">
                             {lead.description}
                           </p>
                         )}
                         
                         <div className="flex gap-4 text-xs pt-1.5 flex-wrap">
                           {lead.website ? (
                             <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                               <Link2 className="w-3.5 h-3.5" /> {lead.website}
                             </a>
                           ) : (
                             <span className="flex items-center gap-1.5 text-muted-foreground line-through">
                               <Link2 className="w-3.5 h-3.5" /> No website
                             </span>
                           )}
                           
                           {lead.phone && lead.phone !== "GitHub Gigs" && (
                             <span className="flex items-center gap-1.5 text-muted-foreground">
                               <Phone className="w-3.5 h-3.5" /> {lead.phone}
                             </span>
                           )}
                           
                           {lead.email && (
                             <span className={cn(
                               "flex items-center gap-1.5",
                               lead.email === "No public email" ? "text-muted-foreground" : "text-emerald-400 font-medium"
                             )}>
                               <Mail className="w-3.5 h-3.5" /> {lead.email}
                             </span>
                           )}
                           
                           {searchSource === "github" && lead.address && (
                             <a href={lead.address} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                               <Github className="w-3.5 h-3.5" /> Open Issue / Thread
                             </a>
                           )}
                         </div>
                       </div>
                       
                       <Button size="sm" className="shrink-0 gap-1.5 mt-1" onClick={() => handleSaveToCRM(lead)}>
                         Add to CRM <ArrowRight className="w-4 h-4" />
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          ) : (
            !isSearching && (
              <div className="text-center py-20 bg-card/20 border border-dashed border-border rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center mb-4">
                  {searchSource === "maps" ? <Building2 className="w-8 h-8 text-muted-foreground" /> : <Github className="w-8 h-8 text-muted-foreground" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">No leads found yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchSource === "maps" 
                    ? "Enter a niche and city above to start discovering high-value local businesses."
                    : 'Search GitHub Gigs (e.g. "need a website" or "looking for developer") to find active leads.'}
                </p>
              </div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
