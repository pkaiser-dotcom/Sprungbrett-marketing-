import React, { useEffect, useState } from "react";
import { Customer } from "@/entities/Customer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Trash2, PencilLine, CheckSquare, Instagram, Facebook, CalendarCheck2, Palette, Dumbbell } from "lucide-react";
import AddCustomerForm from "@/components/customers/AddCustomerForm";
import EditCustomerForm from "@/components/customers/EditCustomerForm";

const serviceIcon = {
  "Marketing": CheckSquare,
  "Instagram": Instagram,
  "Facebook": Facebook,
  "Sportstättenmanagement": Dumbbell,
  "Eventmanagement": CalendarCheck2,
  "Grafiken": Palette,
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const list = await Customer.list("-created_date");
      setCustomers(list);
    } catch (e) {
      console.error("Kunden laden fehlgeschlagen:", e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const onAdded = () => load();
  const onUpdated = () => load();
  const onEditClick = (c) => { setEditing(c); setShowEdit(true); };
  const onDelete = async (id) => {
    if (!confirm("Kunden wirklich löschen?")) return;
    try {
      await Customer.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error("Löschen fehlgeschlagen:", e);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-300">Lade Kunden…</div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-3xl font-bold">Kunden</h1>
          </div>
          <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Kunde hinzufügen
          </Button>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-16 glass-effect-enhanced rounded-lg">
            <p className="text-slate-400">Noch keine Kunden angelegt.</p>
            <Button onClick={() => setShowAdd(true)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Ersten Kunden hinzufügen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map(c => {
              const contact = [c.first_name, c.last_name].filter(Boolean).join(" ");
              return (
                <Card key={c.id} className="glass-effect-enhanced">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{c.company}</span>
                      <div className="flex gap-2">
                        <button onClick={() => onEditClick(c)} className="p-1.5 bg-slate-700/50 hover:bg-slate-600/70 rounded-md text-slate-300 hover:text-white">
                          <PencilLine className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(c.id)} className="p-1.5 bg-slate-700/50 hover:bg-red-600/70 rounded-md text-slate-300 hover:text-white">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-slate-300">
                    <div className="text-sm">{contact || "—"}</div>
                    <div className="text-sm">{c.email || "—"}</div>
                    <div className="text-sm">
                      {c.phone || "—"} {c.mobile ? ` / ${c.mobile}` : ""}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(c.services || []).map(s => {
                        const Icon = serviceIcon[s] || CheckSquare;
                        return (
                          <span key={s} className="inline-flex items-center gap-1 text-xs bg-slate-700/60 border border-slate-600 rounded px-2 py-0.5">
                            <Icon className="w-3.5 h-3.5 text-emerald-400" /> {s}
                          </span>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AddCustomerForm open={showAdd} onOpenChange={setShowAdd} onAdded={onAdded} />
      {editing && (
        <EditCustomerForm open={showEdit} onOpenChange={setShowEdit} customer={editing} onUpdated={onUpdated} />
      )}
    </div>
  );
}
