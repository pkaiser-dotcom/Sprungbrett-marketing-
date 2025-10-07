import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Loader2, Tag, Users, Layers, Building2 } from "lucide-react";
import { Task } from "@/entities/Task";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const priorities = ["Niedrig", "Mittel", "Hoch", "Kritisch"];
const statuses = ["Backlog", "In Bearbeitung", "Überprüfung", "Abgeschlossen"];
const skillOptions = [
  "content_creation",
  "social_media",
  "seo",
  "ppc_advertising",
  "design",
  "copywriting",
  "analytics",
  "strategy",
];
const skillLabels = {
  content_creation: "Content-Erstellung",
  social_media: "Social Media",
  seo: "SEO",
  ppc_advertising: "PPC-Werbung",
  design: "Design",
  copywriting: "Texten",
  analytics: "Analytics",
  strategy: "Strategie",
};

export default function AddTaskForm({
  open,
  onOpenChange,
  onTaskCreated,
  teamMembers = [],
  customers = [],
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Mittel",
    status: "Backlog",
    assigned_to: "",
    customer_id: "", // NEU
    due_date: null,
    estimated_hours: 1,
    required_skills: [],
    campaign: "",
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleMultiSelectChange = (field, value) => {
    setFormData((prev) => {
      const cur = prev[field] || [];
      return {
        ...prev,
        [field]: cur.includes(value) ? cur.filter((i) => i !== value) : [...cur, value],
      };
    });
  };

  const handleAddTag = () => {
    const t = currentTag.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, t] }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (t) =>
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Mittel",
      status: "Backlog",
      assigned_to: "",
      customer_id: "",
      due_date: null,
      estimated_hours: 1,
      required_skills: [],
      campaign: "",
      tags: [],
    });
    setErrors({});
    setCurrentTag("");
  };

  const closeDialog = () => {
    onOpenChange(false);
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = "Titel ist erforderlich.";
    if (!formData.description.trim()) e.description = "Beschreibung ist erforderlich.";
    if (!formData.priority) e.priority = "Priorität ist erforderlich.";
    if (!formData.status) e.status = "Status ist erforderlich.";
    // assigned_to & customer_id sind optional
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        due_date: formData.due_date ? format(formData.due_date, "yyyy-MM-dd") : null,
        assigned_to: formData.assigned_to || null,
        customer_id: formData.customer_id || null,
      };
      await Task.create(payload);
      onTaskCreated?.();
      closeDialog();
      resetForm();
    } catch (err) {
      console.error("Fehler beim Erstellen der Aufgabe:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { closeDialog(); } onOpenChange(v); }}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Neue Aufgabe erstellen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
          {/* Titel */}
          <div>
            <Label className="text-slate-300" htmlFor="task-title">Titel</Label>
            <Input
              id="task-title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Beschreibung */}
          <div>
            <Label className="text-slate-300" htmlFor="task-description">Beschreibung</Label>
            <Textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Priorität / Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Priorität</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) => handleInputChange("priority", v)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full">
                  <SelectValue placeholder="Priorität wählen" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p} className="hover:bg-slate-600">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-red-400 text-xs mt-1">{errors.priority}</p>
              )}
            </div>

            <div>
              <Label className="text-slate-300">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleInputChange("status", v)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full">
                  <SelectValue placeholder="Status wählen" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="hover:bg-slate-600">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-400 text-xs mt-1">{errors.status}</p>
              )}
            </div>
          </div>

          {/* Zugewiesen an / Kunde */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                Zugewiesen an
              </Label>
              <Select
                value={formData.assigned_to}
                onValueChange={(v) => handleInputChange("assigned_to", v)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full">
                  <SelectValue placeholder="Teammitglied auswählen (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value={""}>Nicht zugewiesen</SelectItem>
                  {teamMembers?.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="hover:bg-slate-600">
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                Kunde
              </Label>
              <Select
                value={formData.customer_id}
                onValueChange={(v) => handleInputChange("customer_id", v)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full">
                  <SelectValue placeholder="Kunden wählen (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value={""}>Kein Kunde</SelectItem>
                  {customers?.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="hover:bg-slate-600">
                      {c.company}
                      {c.first_name ? ` — ${c.first_name} ${c.last_name || ""}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fälligkeitsdatum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Fälligkeitsdatum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? (
                      format(formData.due_date, "PPP", { locale: de })
                    ) : (
                      <span>Datum auswählen</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-slate-700 border-slate-600 text-white"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(d) => handleInputChange("due_date", d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-slate-300" htmlFor="task-hours">
                Geschätzte Stunden
              </Label>
              <Input
                id="task-hours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) =>
                  handleInputChange("estimated_hours", parseFloat(e.target.value))
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label className="text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-400" />
              Erforderliche Fähigkeiten
            </Label>
            <div className="mt-2 flex flex-wrap gap-2 p-3 bg-slate-700/50 border border-slate-600 rounded-md">
              {skillOptions.map((skill) => {
                const active = formData.required_skills.includes(skill);
                return (
                  <Button
                    key={skill}
                    type="button"
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMultiSelectChange("required_skills", skill)}
                    className={
                      active
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "text-slate-300 border-slate-500 hover:bg-slate-600 hover:text-white"
                    }
                  >
                    {skillLabels[skill]}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Kampagne */}
          <div>
            <Label className="text-slate-300" htmlFor="task-campaign">
              Kampagne
            </Label>
            <Input
              id="task-campaign"
              value={formData.campaign}
              onChange={(e) => handleInputChange("campaign", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="z. B. Sommer-Launch"
            />
          </div>

          {/* Tags */}
          <div>
            <Label className="text-slate-300 flex items-center gap-1.5" htmlFor="task-tag-input">
              <Tag className="w-4 h-4 text-slate-400" />
              Tags
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="task-tag-input"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Tag hinzufügen"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                Hinzufügen
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-600/30 text-purple-200 border border-purple-500/50 hover:bg-purple-600/50"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 text-purple-300 hover:text-white"
                    aria-label={`${tag} entfernen`}
                  >
                    &times;
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </form>

        <DialogFooter className="p-6 pt-4 bg-slate-800/50 border-t border-slate-700">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                closeDialog();
                // (optional) Formular zurücksetzen, wenn du beim Schließen immer leeren willst:
                // resetForm();
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Abbrechen
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird erstellt…
              </>
            ) : (
              "Aufgabe erstellen"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
