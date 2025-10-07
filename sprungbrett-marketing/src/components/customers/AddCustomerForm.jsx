import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Customer } from "@/entities/Customer";
import { Loader2 } from "lucide-react";

const SERVICES = ["Marketing","Instagram","Facebook","Sportstättenmanagement","Eventmanagement","Grafiken"];

export default function AddCustomerForm({ open, onOpenChange, onAdded }) {
  const [form, setForm] = useState({
    company: "", first_name: "", last_name: "",
    phone: "", email: "", mobile: "",
    services: [], notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (s) =>
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(s) ? prev.services.filter(x => x !== s) : [...prev.services, s]
    }));

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setIsSubmitting(true);
    try {
      await Customer.create(form);
      onAdded?.();
      onOpenChange(false);
      setForm({ company:"", first_name:"", last_name:"", phone:"", email:"", mobile:"", services:[], notes:"" });
    } catch (err) {
      console.error("Kunde anlegen fehlgeschlagen:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kunde hinzufügen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Firma</Label>
            <Input value={form.company} onChange={e=>setForm(f=>({...f, company:e.target.value}))} className="bg-slate-700 border-slate-600 text-white" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vorname</Label>
              <Input value={form.first_name} onChange={e=>setForm(f=>({...f, first_name:e.target.value}))} className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <Label>Nachname</Label>
              <Input value={form.last_name} onChange={e=>setForm(f=>({...f, last_name:e.target.value}))} className="bg-slate-700 border-slate-600 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>E-Mail</Label>
              <Input type="email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} className="bg-slate-700 border-slate-600 text-white" required />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} className="bg-slate-700 border-slate-600 text-white" />
            </div>
          </div>

          <div>
            <Label>Handy (optional)</Label>
            <Input value={form.mobile} onChange={e=>setForm(f=>({...f, mobile:e.target.value}))} className="bg-slate-700 border-slate-600 text-white" />
          </div>

          <div>
            <Label>Leistungen</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {SERVICES.map(s => (
                <label key={s} className="flex items-center gap-2 text-sm text-slate-200">
                  <Checkbox checked={form.services.includes(s)} onCheckedChange={()=>toggleService(s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Notizen</Label>
            <Textarea value={form.notes} onChange={e=>setForm(f=>({...f, notes:e.target.value}))} className="bg-slate-700 border-slate-600 text-white" />
          </div>
        </form>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">Abbrechen</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird gespeichert…</> : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
