import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMember } from '@/entities/TeamMember';
import { Task } from '@/entities/Task';

const priorities = ["Niedrig", "Mittel", "Hoch", "Kritisch"];
const statuses = ["Backlog", "In Bearbeitung", "Überprüfung", "Abgeschlossen"];
const skillOptions = ["content_creation","social_media","seo","ppc_advertising","design","copywriting","analytics","strategy"];

export default function AddTaskForm({ open, onOpenChange, onTaskCreated }){
  const [teamMembers,setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: "", description: "", priority: "Mittel", status: "Backlog",
    assigned_to: "", due_date: "", estimated_hours: 4, required_skills: [], campaign: "", tags: []
  });
  const [currentTag,setCurrentTag] = useState("");

  useEffect(()=>{ (async()=>{ setTeamMembers(await TeamMember.list()); })(); },[]);

  const handleMulti = (field, value)=>{
    setFormData(prev=>{
      const curr = prev[field]||[];
      return { ...prev, [field]: curr.includes(value) ? curr.filter(x=>x!==value) : [...curr, value] }
    })
  }
  const addTag = ()=>{ if(currentTag && !formData.tags.includes(currentTag)){ setFormData(prev=>({...prev, tags:[...prev.tags, currentTag]})); setCurrentTag(''); } }

  const submit = async (e)=>{
    e.preventDefault();
    const payload = { ...formData };
    await Task.create(payload);
    onTaskCreated && onTaskCreated();
    onOpenChange(false);
    setFormData({ title:"", description:"", priority:"Mittel", status:"Backlog", assigned_to:"", due_date:"", estimated_hours:4, required_skills:[], campaign:"", tags:[] });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
        <DialogHeader><DialogTitle>Neue Aufgabe erstellen</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Titel</Label>
            <Input value={formData.title} onChange={e=>setFormData(v=>({...v,title:e.target.value}))} required />
          </div>
          <div>
            <Label>Beschreibung</Label>
            <Textarea value={formData.description} onChange={e=>setFormData(v=>({...v,description:e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priorität</Label>
              <select className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2" value={formData.priority} onChange={e=>setFormData(v=>({...v,priority:e.target.value}))}>
                {priorities.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2" value={formData.status} onChange={e=>setFormData(v=>({...v,status:e.target.value}))}>
                {statuses.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Zugewiesen an</Label>
              <select className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2" value={formData.assigned_to} onChange={e=>setFormData(v=>({...v,assigned_to:e.target.value}))}>
                <option value="">Nicht zugewiesen</option>
                {teamMembers.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Fälligkeitsdatum</Label>
              <Input type="date" value={formData.due_date} onChange={e=>setFormData(v=>({...v, due_date:e.target.value}))} />
            </div>
          </div>
          <div>
            <Label>Geschätzte Stunden</Label>
            <Input type="number" min="0.5" step="0.5" value={formData.estimated_hours} onChange={e=>setFormData(v=>({...v, estimated_hours:parseFloat(e.target.value)}))} />
          </div>
          <div>
            <Label>Erforderliche Fähigkeiten</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillOptions.map(s=>
                <button type="button" key={s} onClick={()=>handleMulti('required_skills',s)} className={`px-2 py-1 rounded border ${formData.required_skills.includes(s)?'bg-blue-600 border-blue-500':'bg-slate-800 border-slate-700'}`}>
                  {s.replace('_',' ')}
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kampagne</Label>
              <Input value={formData.campaign} onChange={e=>setFormData(v=>({...v,campaign:e.target.value}))} />
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input value={currentTag} onChange={e=>setCurrentTag(e.target.value)} placeholder="Tag hinzufügen" onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault(); addTag();}}} />
                <Button type="button" onClick={addTag}>Hinzufügen</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map(tag=><span key={tag} className="px-2 py-0.5 rounded border border-purple-500/40 bg-purple-600/20">{tag}</span>)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button">Abbrechen</Button></DialogClose>
            <Button type="submit" className="bg-blue-600 border-blue-500">Erstellen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}