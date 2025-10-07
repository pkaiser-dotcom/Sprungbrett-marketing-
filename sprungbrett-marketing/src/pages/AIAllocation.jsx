import React, { useState, useEffect } from "react";
import { Task } from "@/entities/Task";
import { TeamMember } from "@/entities/TeamMember";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, CheckSquare, Loader2, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from 'date-fns';

export default function AIAllocation() {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [taskList, members] = await Promise.all([
        Task.filter({ status: "Backlog" }),
        TeamMember.list()
      ]);
      setTasks(taskList);
      setTeamMembers(members);
    } catch (e) {
      setError("Fehler beim Laden der Daten.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIAllocations = async () => {
    if (tasks.length === 0 || teamMembers.length === 0) {
      setError("Es werden Backlog-Aufgaben und Teammitglieder benötigt.");
      return;
    }
    setIsAllocating(true);
    setError(null);
    try {
      const result = await InvokeLLM({ prompt: "allocate", response_json_schema: {} });
      setAllocations(result?.allocations || []);
    } catch (e) {
      setError("Fehler beim Generieren der KI-Zuweisungen.");
    } finally {
      setIsAllocating(false);
    }
  };

  const applyAllocations = async () => {
    setIsAllocating(true);
    try {
      for (const a of allocations) {
        await Task.update(a.task_id, { assigned_to: a.member_id, status: "In Bearbeitung" });
      }
      await loadData();
      setAllocations([]);
    } catch {
      setError("Fehler beim Anwenden der Zuweisungen.");
    }
    setIsAllocating(false);
  };

  const getTaskById = (id) => tasks.find(t => t.id === id);
  const getMemberById = (id) => teamMembers.find(m => m.id === id);

  const priorityColors = {
    "Niedrig": "bg-blue-500/20 text-blue-300 border-blue-500/40",
    "Mittel": "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    "Hoch": "bg-orange-500/20 text-orange-300 border-orange-500/40",
    "Kritisch": "bg-red-500/20 text-red-300 border-red-500/40"
  };

  if (isLoading) return <div className="p-6">Lade…</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-400" />
              KI-Aufgabenzuweisungs-Engine
            </h1>
            <p className="text-slate-400">Zuweisung basierend auf Fähigkeiten & Auslastung.</p>
          </div>
          <Button onClick={generateAIAllocations} disabled={isAllocating || tasks.length === 0 || teamMembers.length === 0}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {isAllocating ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analysiere…</>) : (<><Sparkles className="w-5 h-5 mr-2" /> Intelligente Zuweisungen generieren</>)}
          </Button>
        </div>

        {error && (
          <Alert className="bg-red-900/70 border-red-700 text-red-200">
            <AlertDescription className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" /> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-effect-enhanced border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-300">Aufgaben im Backlog</CardTitle>
              <CheckSquare className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-white">{tasks.length}</div></CardContent>
          </Card>

          <Card className="glass-effect-enhanced border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-300">Verfügbare Teammitglieder</CardTitle>
              <Users className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-white">{teamMembers.length}</div></CardContent>
          </Card>

          <Card className="glass-effect-enhanced border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-300">KI-Empfehlungen</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-white">{allocations.length}</div></CardContent>
          </Card>
        </div>

        {allocations.length > 0 && (
          <Card className="glass-effect-enhanced">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-300" />
                KI-Zuweisungsempfehlungen
              </CardTitle>
              <Button onClick={applyAllocations} disabled={isAllocating}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                {isAllocating ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wird angewendet…</>) : (<>Alle anwenden & Aufgaben aktualisieren</>)}
              </Button>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                {allocations.map((a, i) => {
                  const task = getTaskById(a.task_id);
                  const member = getMemberById(a.member_id);
                  if (!task || !member) return null;
                  return (
                    <div key={i} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/50">
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-base">{task.title}</h4>
                          <p className="text-slate-400 text-xs mt-1">{task.description}</p>
                        </div>
                        <Badge className={`${priorityColors[task.priority] || ""} border px-2 py-0.5 text-xs`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium bg-gradient-to-br from-purple-600 to-pink-500">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{member.name}</div>
                            <div className="text-slate-400 text-xs">{member.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-300 text-sm">
                            Geschätzt {a.estimated_completion_time_in_days} Tage
                          </div>
                          <div className="text-xs text-slate-500">Zuversicht: {Math.round((a.confidence_score || 0) * 100)}%</div>
                        </div>
                      </div>
                      {a.reasoning && (
                        <div className="mt-3 p-3 bg-slate-700/60 rounded border border-slate-600/50 text-xs">
                          <strong className="text-slate-300">KI-Begründung:</strong>{" "}
                          <span className="text-slate-400">{a.reasoning}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {(tasks.length === 0 || teamMembers.length === 0) && !isAllocating && allocations.length === 0 && (
          <div className="text-center py-16 glass-effect-enhanced rounded-lg">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
              <Brain className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Bereit für KI-Magie?</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Füge Backlog-Aufgaben und Teammitglieder hinzu, dann generiere Zuweisungen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
