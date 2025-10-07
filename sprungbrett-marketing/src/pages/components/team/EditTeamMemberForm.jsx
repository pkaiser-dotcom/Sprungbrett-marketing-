import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TeamMember } from "@/entities/TeamMember";
import { Loader2 } from 'lucide-react';

const roles = ["Marketing Manager","Content Creator","Social Media Spezialist","SEO Spezialist","PPC Spezialist","Designer","Texter","Datenanalyst"];
const skillLabels = {
  content_creation: "Content-Erstellung", social_media: "Social Media", seo: "SEO",
  ppc_advertising: "PPC-Werbung", design: "Design", copywriting: "Texten",
  analytics: "Analytics", strategy: "Strategie"
};

export default function EditTeamMemberForm({ open, onOpenChange, member, onMemberUpdated }) {
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        email: member.email || "",
        role: member.role || "",
        skills: {
          content_creation: member.skills?.content_creation || 5,
          social_media: member.skills?.social_media || 5,
          seo: member.skills?.seo || 5,
          ppc_advertising: member.skills?.ppc_advertising || 5,
          design: member.skills?.design || 5,
          copywriting: member.skills?.copywriting || 5,
          analytics: member.skills?.analytics || 5,
          strategy: member.skills?.strategy || 5
        },
        availability: member.availability || 100,
        current_workload: member.current_workload || 0
      });
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member || !formData) return;
    setIsSubmitting(true);
    try {
      await TeamMember.update(member.id, formData);
      onMemberUpdated?.();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillChange = (k, v) => setFormData(p => ({...p, skills:{...p.skills,[k]:v[0]}}));
  const handleChange = (f, v) => setFormData(p => ({...p, [f]: v}));

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl p-0">
        <DialogHeader className="p-6 pb-4"><DialogTitle>Teammitglied bearbeiten</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Vollständiger Name</Label><Input value={formData.name} onChange={e=>handleChange('name', e.target.value)} required /></div>
            <div><Label>E-Mail</Label><Input type="email" value={formData.email} onChange={e=>handleChange('email', e.target.value)} required /></div>
          </div>
          <div>
            <Label>Rolle</Label>
            <select className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2" value={formData.role} onChange={e=>handleChange('role', e.target.value)}>
              {roles.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-lg font-medium">Fähigkeitsbewertung</Label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {Object.entries(skillLabels).map(([k,lab])=>(
                <div key={k} className="space-y-2">
                  <div className="flex justify-between items-center"><Label className="text-slate-400 text-sm">{lab}</Label><span className="text-blue-400 font-medium text-sm">{formData.skills[k]}/10</span></div>
                  <Slider value={[formData.skills[k]]} onValueChange={v=>handleSkillChange(k,v)} max={10} min={1} step={1}/>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><div className="flex justify-between mb-2"><Label>Verfügbarkeit</Label><span className="text-green-400 font-medium">{formData.availability}%</span></div><Slider value={[formData.availability]} onValueChange={v=>handleChange('availability', v[0])} max={100} min={0} step={5}/></div>
            <div><div className="flex justify-between mb-2"><Label>Aktuelle Auslastung</Label><span className="text-yellow-400 font-medium">{formData.current_workload}%</span></div><Slider value={[formData.current_workload]} onValueChange={v=>handleChange('current_workload', v[0])} max={100} min={0} step={5}/></div>
          </div>
        </form>
        <DialogFooter className="p-6 pt-4 bg-slate-800/50 border-t border-slate-700">
          <DialogClose asChild><Button type="button" className="border-slate-600">Abbrechen</Button></DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird gespeichert...</>) : "Änderungen speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
