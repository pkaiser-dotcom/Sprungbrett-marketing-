import React, { useState, useEffect } from "react";
import { Task } from "@/entities/Task";
import { TeamMember } from "@/entities/TeamMember";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckSquare, Edit3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import EditTaskForm from "../pages/components/tasks/EditTaskForm";
import AddTaskForm from "../pages/components/tasks/AddTaskForm";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [taskList, members] = await Promise.all([ Task.list("-created_date"), TeamMember.list() ]);
      setTasks(taskList);
      setTeamMembers(members);
    } catch (e) {
      console.error("Fehler beim Laden der Aufgaben:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdated = () => loadData();
  const handleTaskCreated = () => loadData();
  const handleEditTask = (task) => { setEditingTask(task); setShowEditTaskForm(true); };

  const getTasksByStatus = (status) => status === "all" ? tasks : tasks.filter(t => {
    const map = { "In Bearbeitung": "In Progress", "Überprüfung": "Review", "Abgeschlossen": "Completed", "Backlog": "Backlog" };
    const taskStatus = map[t.status] || t.status;
    const filterStatus = map[status] || status;
    return taskStatus === filterStatus;
  });

  const getMemberName = (id) => (teamMembers.find(m => m.id === id)?.name) || "Nicht zugewiesen";

  const priorityColors = {
    "Niedrig": "bg-blue-500/20 text-blue-300 border-blue-500/40",
    "Mittel": "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    "Hoch": "bg-orange-500/20 text-orange-300 border-orange-500/40",
    "Kritisch": "bg-red-500/20 text-red-300 border-red-500/40"
  };
  const statusColors = {
    "Backlog": "bg-slate-500/20 text-slate-300 border-slate-500/40",
    "In Bearbeitung": "bg-blue-500/20 text-blue-300 border-blue-500/40",
    "Überprüfung": "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    "Abgeschlossen": "bg-green-500/20 text-green-300 border-green-500/40"
  };

  const TaskCard = ({ task, onEdit }) => {
    const displayPriority = { "Low": "Niedrig","Medium":"Mittel","High":"Hoch","Critical":"Kritisch" }[task.priority] || task.priority;
    const displayStatus   = { "In Progress":"In Bearbeitung","Review":"Überprüfung","Completed":"Abgeschlossen","Backlog":"Backlog" }[task.status] || task.status;

    return (
      <Card className="glass-effect-enhanced group relative">
        <button onClick={() => onEdit(task)} className="absolute top-3 right-3 p-1.5 bg-slate-700/50 rounded-md text-slate-400">
          <Edit3 className="w-4 h-4" />
        </button>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <CardTitle className="text-white text-base font-semibold mb-1.5">{task.title}</CardTitle>
              <p className="text-slate-400 text-xs leading-relaxed">{task.description}</p>
            </div>
            <Badge className={`${priorityColors[displayPriority]} border ml-2 px-2 py-0.5 text-xs`}>{displayPriority}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Badge className={`${statusColors[displayStatus]} border px-2 py-0.5 text-xs`}>{displayStatus}</Badge>
            <span className="text-slate-400 text-xs">{getMemberName(task.assigned_to)}</span>
          </div>
          {task.required_skills?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.required_skills.map((s, i) => (<Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-400 px-1.5 py-0.5">{s.replace(/_/g,' ')}</Badge>))}
            </div>
          )}
          {task.due_date && (
            <div className="text-xs text-slate-500">Fällig: {format(new Date(task.due_date), "MMM d, yyyy")}</div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) return (<div className="p-6">Lade…</div>);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Aufgabenverwaltung</h1>
            <p className="text-slate-400">Organisieren, verfolgen und verwalten Sie Ihre Marketing-Aufgaben effizient.</p>
          </div>
