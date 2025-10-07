import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TeamMember } from "@/entities/TeamMember";

const roles = ["Marketing Manager","Content Creator","Social Media Spezialist","SEO Spezialist","PPC Spezialist","Designer","Texter","Datenanalyst"];
const skillLabels = {
  content_creation: "Content-Erstellung", social_media: "Social Media", seo: "SEO",
  ppc_advertising: "PPC-Werbung", design: "Design", copywriting: "Texten",
  analytics: "Analytics", strategy: "Strategie"
};

export default function AddMemberForm({ open, onOpenChange, onMemberAdded }) {
  const [formData, setFormData] = useState({
    name: "", email: "", role: "",
    skills: { content_creation:5, social_media:5, seo:5, ppc_advertising:5, design:5, copywriting:5, analytics:5, strategy:5 },
    availability: 100, current_workload: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      await TeamMember.create(formData);
      onMemberAdded?.(); onOpenChange(false);
      setFormData({ name:"", email:"", role:"", skills:{content_creation:5,social_media:5,seo:5,ppc_advertising:5,design:5,copywriting:5,analytics:5,strategy:5}, availability:100, current_workload:0 });
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };
  const handleSkillChange = (skill, value) => setFormData(p => ({...p, skills:{...p.skills,[skill]:value[0]}}));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
        <DialogHeader><DialogTitle>Teammitglied hinzufügen</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Vollständiger Name</Label><Input value={formData.name} onChange={e=>setFormData(p=>({...p,name:e.target.value}))} required /></div>
            <div><Label>E-Mail</Label><Input type="email" value={formData.email} onChange={e=>setFormData(p=>({...p,email:e.target.value}))} required /></div>
          </div>
          <div>
            <Label>Rolle</Label>
            <select className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2" value={formData.role} onChange={e=>setFormData(p=>({...p,role:e.target.value}))}>
              <option value="">Rolle auswählen</option>
              {roles.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-lg font-medium">Fähigkeitsbewertung</Label>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Object.entries(skillLabels).map(([key,label])=>(
                <div key={key} className="space-y-2">
                  <div className="flex justify-between"><Label className="text-slate-400 text-sm">{label}</Label><span className="text-blue-400 font-medium">{formData.skills[key]}/10</span></div>
                  <Slider value={[formData.skills[key]]} onValueChange={v=>handleSkillChange(key,v)} max={10} min={1} step={1} />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-2"><Label>Verfügbarkeit</Label><span className="text-green-400 font-medium">{formData.availability}%</span></div>
              <Slider value={[formData.availability]} onValueChange={v=>setFormData(p=>({...p,availability:v[0]}))} max={100} min={0} step={5} />
            </div>
            <div>
              <div className="flex justify-between mb-2"><Label>Aktuelle Auslastung</Label><span className="text-yellow-400 font-medium">{formData.current_workload}%</span></div>
              <Slider value={[formData.current_workload]} onValueChange={v=>setFormData(p=>({...p,current_workload:v[0]}))} max={100} min={0} step={5} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={()=>onOpenChange(false)} className="border-slate-600">Abbrechen</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? "Wird hinzugefügt..." : "Mitglied hinzufügen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
