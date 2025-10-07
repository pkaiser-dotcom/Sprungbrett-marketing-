import React, { useState, useEffect } from "react";
import { Task } from "@/entities/Task";
import { TeamMember } from "@/entities/TeamMember";
import { Customer } from "@/entities/Customer";           // NEU
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckSquare, Filter, Edit3, Trash2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import EditTaskForm from "@/components/tasks/EditTaskForm";
import AddTaskForm from "@/components/tasks/AddTaskForm";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [customers, setCustomers] = useState([]);          // NEU
  const [isLoading, setIsLoading] = useState(true);

  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [showAddTaskForm, setShowAddTaskForm] = useState(false); // NEU
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [taskList, members, customersList] = await Promise.all([
        Task.list("-created_date"),
        TeamMember.list(),
        Customer.list()                         // NEU
      ]);
      setTasks(taskList);
      setTeamMembers(members);
      setCustomers(customersList);
    } catch (error) {
      console.error("Fehler beim Laden der Aufgaben:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdated = () => loadData();
  const handleTaskCreated = () => loadData();

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Aufgabe wirklich löschen?")) return;
    try {
      await Task.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) {
      console.error("Aufgabe konnte nicht gelöscht werden:", e);
    }
  };

  const getTasksByStatus = (status) => {
    const map = { "In Bearbeitung": "In Bearbeitung", "Überprüfung": "Überprüfung", "Abgeschlossen": "Abgeschlossen", "Backlog": "Backlog" };
    const list = status === "all" ? tasks : tasks.filter(t => (t.status || "Backlog") === (map[status] || status));
    // Suche anwenden
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(t =>
      (t.title || "").toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      (t.campaign || "").toLowerCase().includes(q) ||
      (t.tags || []).some(tag => tag.toLowerCase().includes(q))
    );
  };

  const getMemberName = (memberId) => teamMembers.find(m => m.id === memberId)?.name || "Nicht zugewiesen";
  const getCustomerName = (id) => customers.find(c => c.id === id)?.company || "—";

  const priorityMap = { Low:"Niedrig", Medium:"Mittel", High:"Hoch", Critical:"Kritisch" };
  const statusColors = {
    "Backlog":"bg-slate-500/20 text-slate-300 border-slate-500/40",
    "In Bearbeitung":"bg-blue-500/20 text-blue-300 border-blue-500/40",
    "Überprüfung":"bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    "Abgeschlossen":"bg-green-500/20 text-green-300 border-green-500/40"
  };
  const priorityColors = {
    "Niedrig":"bg-blue-500/20 text-blue-300 border-blue-500/40",
    "Mittel":"bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    "Hoch":"bg-orange-500/20 text-orange-300 border-orange-500/40",
    "Kritisch":"bg-red-500/20 text-red-300 border-red-500/40"
  };

  const TaskCard = ({ task, onEdit }) => {
    const displayPriority = priorityMap[task.priority] || task.priority || "Mittel";
    const displayStatus = task.status || "Backlog";
    return (
      <Card className="glass-effect-enhanced hover:border-blue-500/50 transition-all duration-300 group relative">
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button onClick={() => onEdit(task)} className="p-1.5 bg-slate-700/50 hover:bg-slate-600/70 rounded-md text-slate-400 hover:text-white transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 bg-slate-700/50 hover:bg-red-600/70 rounded-md text-slate-400 hover:text-white transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between pr-12">
            <div className="flex-1">
              <CardTitle className="text-white text-base font-semibold mb-1.5 group-hover:text-blue-300 transition-colors">{task.title}</CardTitle>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{task.description}</p>
            </div>
            <Badge className={`${priorityColors[displayPriority]} border ml-2 px-2 py-0.5 text-xs flex-shrink-0`}>{displayPriority}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge className={`${statusColors[displayStatus]} border px-2 py-0.5 text-xs`}>{displayStatus}</Badge>
            <span className="text-slate-400 text-xs">Zuständig: {getMemberName(task.assigned_to)}</span>
            <span className="text-slate-400 text-xs">Kunde: {getCustomerName(task.customer_id)}</span>
          </div>
          {task.required_skills?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.required_skills.map((skill, i) => (
                <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-400 px-1.5 py-0.5">
                  {skill.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          )}
          {task.due_date && (
            <div className="text-xs text-slate-500">Fällig: {format(new Date(task.due_date), "MMM d, yyyy")}</div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div className="p-6 md:p-8 text-slate-300">Lade…</div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Aufgabenverwaltung</h1>
            <div className="flex items-center gap-2 ml-4">
              <Search className="w-4 h-4 text-slate-400" />
              <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Suchen…" className="h-8 w-64 bg-slate-800/70 border-slate-700 text-slate-200" />
            </div>
          </div>
          <Button onClick={() => setShowAddTaskForm(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 glow-effect">
            <Plus className="w-4 h-4 mr-2" /> Aufgabe erstellen
          </Button>
        </div>

        {/* Task Boards */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700/40 p-1 rounded-xl">
            {["all", "Backlog", "In Bearbeitung", "Überprüfung", "Abgeschlossen"].map(statusValue => (
              <TabsTrigger key={statusValue} value={statusValue} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-300 hover:text-white px-4 py-1.5 text-sm rounded-lg transition-all">
                {statusValue === "all" ? "Alle Aufgaben" : statusValue} ({getTasksByStatus(statusValue).length})
              </TabsTrigger>
            ))}
          </TabsList>

          {["all", "Backlog", "In Bearbeitung", "Überprüfung", "Abgeschlossen"].map(status => (
            <TabsContent key={status} value={status} className="mt-6">
              {getTasksByStatus(status).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getTasksByStatus(status).map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 glass-effect-enhanced rounded-lg">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
                    <CheckSquare className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Keine {status === "all" ? "Aufgaben" : status}-Aufgaben
                  </h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    {status === "all"
                      ? "Beginnen Sie mit der Organisation Ihres Marketing-Workflows durch das Erstellen von Aufgaben."
                      : `Es gibt derzeit keine Aufgaben mit dem Status ${status}.`
                    }
                  </p>
                  {status === "all" && (
                    <Button onClick={() => setShowAddTaskForm(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 glow-effect">
                      <Plus className="w-4 h-4 mr-2" /> Erste Aufgabe erstellen
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Dialoge */}
        {editingTask && (
          <EditTaskForm
            open={showEditTaskForm}
            onOpenChange={setShowEditTaskForm}
            task={editingTask}
            onTaskUpdated={handleTaskUpdated}
            teamMembers={teamMembers}
            customers={customers}
          />
        )}

        <AddTaskForm
          open={showAddTaskForm}
          onOpenChange={setShowAddTaskForm}
          onTaskCreated={handleTaskCreated}
          teamMembers={teamMembers}
          customers={customers}
        />
      </div>
    </div>
  );
}
