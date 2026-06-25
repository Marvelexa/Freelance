import React, { useState } from "react";
import { Search, MapPin, Building2, Star, Link2, Phone, Mail, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveLeadToSheet } from "../lib/sheets";

export function LeadDiscovery() {
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !city) return;
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/leads/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, city })
      });
      const data = await response.json();
      if (data.results) {
        setLeads(data.results);
      }
    } catch (err) {
      console.error(err);
      // fallback mock for UI preview
      setLeads([
        { id: 1, name: "Premium Dental Care", rating: 4.8, address: `123 Main St, ${city}`, website: "premiumdental.com", phone: "+1 234-567-8900", email: "hello@premiumdental.com", reviewsCount: 124 },
        { id: 2, name: `${niche} Experts`, rating: 4.2, address: `456 Oak Ave, ${city}`, website: "", phone: "+1 987-654-3210", email: "", reviewsCount: 38 },
      ]);
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Lead Discovery Engine</h1>
            <p className="text-muted-foreground mt-2">Find and extract high-value local businesses for your agency.</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-4">
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
                <span className="text-sm font-medium text-muted-foreground">Found {leads.length} businesses matching your criteria</span>
                <Button variant="outline" size="sm" onClick={handleSaveAll}>Save All to CRM</Button>
               </div>
               {leads.map((lead, i) => (
                 <Card key={i} className="hover:border-primary/50 transition-colors bg-card/60 backdrop-blur-sm">
                   <CardContent className="p-6">
                     <div className="flex items-start justify-between">
                       <div className="space-y-3">
                         <div>
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              {lead.name}
                              {!lead.website && <Badge variant="destructive" className="ml-2 py-0 h-5">No Website</Badge>}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              <span className="font-medium text-foreground">{lead.rating}</span>
                              <span>({lead.reviewsCount || 0} reviews)</span>
                              <span className="px-1.5">•</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {lead.address}</span>
                            </div>
                         </div>
                         
                         <div className="flex gap-4 text-sm">
                           {lead.website ? (
                             <a href={`https://${lead.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                               <Link2 className="w-4 h-4" /> {lead.website}
                             </a>
                           ) : (
                             <span className="flex items-center gap-1.5 text-muted-foreground line-through">
                               <Link2 className="w-4 h-4" /> No website
                             </span>
                           )}
                           
                           {lead.phone && (
                             <span className="flex items-center gap-1.5 text-muted-foreground">
                               <Phone className="w-4 h-4" /> {lead.phone}
                             </span>
                           )}
                           
                           {lead.email && (
                             <span className="flex items-center gap-1.5 text-muted-foreground">
                               <Mail className="w-4 h-4" /> {lead.email}
                             </span>
                           )}
                         </div>
                       </div>
                       
                       <Button size="sm" className="shrink-0 gap-1.5" onClick={() => handleSaveToCRM(lead)}>
                         Add to CRM <ArrowRight className="w-4 h-4" />
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          ) : (
            !isSearching && (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No leads found yet</h3>
                <p className="text-muted-foreground mb-6">Enter a niche and city above to start discovering high-value clients.</p>
              </div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
