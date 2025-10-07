import React, { useState, useEffect } from "react";
import { TeamMember } from "@/entities/TeamMember";
import { Task } from "@/entities/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckSquare, Clock, TrendingUp, AlertCircle, BarChart3, PieChart as PieIcon, Activity, ChevronsUpDown, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from "recharts";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import EditTaskForm from "../components/tasks/EditTaskForm";

const GRAPH_PALETTE = {
  blue: "#3b82f6",
  purple: "#8b5cf6",
  green: "#10b981",
  pink: "#ec4899",
  amber: "#f59e0b",
  slate: "#64748b",
  cyan: "#06b6d4",
  red: "#ef4444",
};

export default function Dashboard() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [membersData, taskList] = await Promise.all([
        TeamMember.list(),
        Task.list("-created_date"),
      ]);
      setTeamMembers(membersData);
      setTasks(taskList);
    } catch (error) {
      console.error("Fehler beim Laden der Dashboard-Daten:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdated = () => loadData();

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditTaskForm(true);
  };

  const getEnglishStatus = (germanStatus) => {
    switch (germanStatus) {
      case "Backlog": return "Backlog";
      case "In Bearbeitung": return "In Progress";
      case "Überprüfung": return "Review";
      case "Abgeschlossen": return "Completed";
      default: return germanStatus;
    }
  };

  const updateTaskStatus = async (taskId, newStatusGerman) => {
    try {
      const newStatusEnglish = getEnglishStatus(newStatusGerman);
      await Task.update(taskId, { status: newStatusEnglish });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatusEnglish } : t));
    } catch (e) {
      console.error("Fehler beim Aktualisieren des Aufgabenstatus:", e);
    }
  };

  const getTasksByStatus = (status) => tasks.filter(task => task.status === status).length;
  const getHighPriorityTasks = () => tasks.filter(t => t.priority === "High" || t.priority === "Hoch" || t.priority === "Critical" || t.priority === "Kritisch").length;

  const getAverageWorkload = () => {
    if (teamMembers.length === 0) return 0;
    return Math.round(teamMembers.reduce((sum, m) => sum + (m.current_workload || 0), 0) / teamMembers.length);
  };

  const getRecentTasks = (count = 15) => {
    return [...tasks]
      .sort((a, b) => {
        const dateA = new Date(a.updated_date || a.created_date);
        const dateB = new Date(b.updated_date || b.created_date);
        return dateB - dateA;
      })
      .slice(0, count);
  };

  const getTranslatedPriority = (p) => ({ Low:"Niedrig", Medium:"Mittel", High:"Hoch", Critical:"Kritisch" }[p] || p);
  const getTranslatedStatus = (s) => ({ "In Progress":"In Bearbeitung", Review:"Überprüfung", Completed:"Abgeschlossen", Backlog:"Backlog" }[s] || s);

  const taskStatusData = [
    { name: "Backlog", value: getTasksByStatus("Backlog"), fill: GRAPH_PALETTE.slate },
    { name: "In Bearbeitung", value: getTasksByStatus("In Progress"), fill: GRAPH_PALETTE.blue },
    { name: "Überprüfung", value: getTasksByStatus("Review"), fill: GRAPH_PALETTE.purple },
    { name: "Abgeschlossen", value: getTasksByStatus("Completed"), fill: GRAPH_PALETTE.green },
  ];

  const taskPriorityData = [
    { name: "Niedrig",  value: tasks.filter(t => ["Low","Niedrig"].includes(t.priority)).length,  fill: GRAPH_PALETTE.cyan },
    { name: "Mittel",   value: tasks.filter(t => ["Medium","Mittel"].includes(t.priority)).length, fill: GRAPH_PALETTE.blue },
    { name: "Hoch",     value: tasks.filter(t => ["High","Hoch"].includes(t.priority)).length,     fill: GRAPH_PALETTE.amber },
    { name: "Kritisch", value: tasks.filter(t => ["Critical","Kritisch"].includes(t.priority)).length, fill: GRAPH_PALETTE.red },
  ];

  const priorityColors = {
    Niedrig: "bg-cyan-700/30 text-cyan-300 border-cyan-600/50",
    Mittel: "bg-blue-700/30 text-blue-300 border-blue-600/50",
    Hoch: "bg-amber-700/30 text-amber-300 border-amber-600/50",
    Kritisch: "bg-red-700/30 text-red-300 border-red-600/50",
  };

  const statusColors = {
    Backlog: "bg-slate-700/40 text-slate-300 border-slate-600/50",
    "In Bearbeitung": "bg-blue-700/30 text-blue-300 border-blue-600/50",
    Überprüfung: "bg-purple-700/30 text-purple-300 border-purple-600/50",
    Abgeschlossen: "bg-green-700/30 text-green-300 border-green-600/50",
  };

  const availableStatuses = ["Backlog", "In Bearbeitung", "Überprüfung", "Abgeschlossen"];

  const CustomTooltip = ({ active, payload, label }) =>
    active && payload && payload.length ? (
      <div className="glass-effect-enhanced p-3 rounded-md shadow-lg">
        <p className="label text-sm font-semibold text-white">{`${label} : ${payload[0].value}`}</p>
      </div>
    ) : null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
    }),
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-slate-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="h-36 glass-effect-enhanced rounded-lg"></div>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80 glass-effect-enhanced rounded-lg"></div>
              <div className="h-80 glass-effect-enhanced rounded-lg"></div>
            </div>
            <div className="h-96 glass-effect-enhanced rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Marketing-Dashboard</h1>
          <p className="text-slate-400 text-lg">Willkommen zurück! Hier ist eine Übersicht über die Leistung Ihres Teams.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
            <Card className="glass-effect-enhanced border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Teammitglieder</CardTitle>
                <Users className="h-5 w-5 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{teamMembers.length}</div>
                <p className="text-xs text-slate-400 mt-1">Aktive Mitglieder</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
            <Card className="glass-effect-enhanced border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Aktive Aufgaben</CardTitle>
                <Activity className="h-5 w-5 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{getTasksByStatus("In Progress")}</div>
                <p className="text-xs text-slate-400 mt-1">Derzeit in Bearbeitung</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
            <Card className="glass-effect-enhanced border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Durchschn. Auslastung</CardTitle>
                <TrendingUp className="h-5 w-5 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{getAverageWorkload()}%</div>
                <p className="text-xs text-slate-400 mt-1">Team-Kapazitätsauslastung</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
            <Card className="glass-effect-enhanced border-red-500/40 hover:border-red-400 hover:shadow-red-500/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Hohe Priorität</CardTitle>
                <AlertCircle className="h-5 w-5 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{getHighPriorityTasks()}</div>
                <p className="text-xs text-slate-400 mt-1">Kritische & Hohe Priorität</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Recent activity */}
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="lg:col-span-3">
            <Card className="glass-effect-enhanced h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Letzte Aktivitäten
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[calc(3*14rem)] overflow-y-auto pr-2 styled-scrollbar">
                <div className="space-y-3">
                  {getRecentTasks(15).map((task) => {
                    const priority = getTranslatedPriority(task.priority);
                    const status = getTranslatedStatus(task.status);
                    return (
                      <div key={task.id} className="flex items-start sm:items-center justify-between p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 hover:border-blue-500/60 transition-all group">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors truncate">{task.title}</h4>
                          <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0 mt-2 sm:mt-0">
                          <Badge className={`${priorityColors[priority]} border text-xs px-2 py-0.5`}>{priority}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className={`text-xs px-2 py-0.5 h-auto ${statusColors[status]} border hover:bg-slate-700 hover:text-white`}>
                                {status}
                                <ChevronsUpDown className="ml-1.5 h-3 w-3 opacity-70" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-600 text-white">
                              {availableStatuses.filter(s => s !== status).map(newStatus => (
                                <DropdownMenuItem key={newStatus} onClick={() => updateTaskStatus(task.id, newStatus)} className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white text-slate-300">
                                  Verschieben nach {newStatus}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-400 hover:text-white hover:bg-slate-700" onClick={() => handleEditTask(task)} aria-label={`${task.title} bearbeiten`}>
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {tasks.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Noch keine Aufgaben erstellt. Beginnen Sie mit dem Hinzufügen neuer Aufgaben!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
              <Card className="glass-effect-enhanced">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieIcon className="w-5 h-5 text-purple-400" />
                    Aufgabenstatus-Verteilung
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="85%" labelLine={false} label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}>
                        {taskStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} className="focus:outline-none hover:opacity-80 transition-opacity" />))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: "12px", paddingTop: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
              <Card className="glass-effect-enhanced">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-pink-400" />
                    Aufgabenpriorität Übersicht
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskPriorityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis type="number" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} width={80} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                      <Bar dataKey="value" barSize={20} radius={[0, 5, 5, 0]} legendType="none">
                        {taskPriorityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} className="focus:outline-none hover:opacity-80 transition-opacity" />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
              <Card className="glass-effect-enhanced">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Team-Auslastung
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto pr-2 styled-scrollbar">
                  <div className="space-y-5">
                    {teamMembers.slice(0, 7).map((member) => (
                      <div key={member.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              (member.current_workload || 0) >= 80 ? "bg-red-400" :
                              (member.current_workload || 0) >= 60 ? "bg-yellow-400" : "bg-green-400"
                            } shadow-md`} />
                            <h4 className="font-medium text-white text-sm">{member.name}</h4>
                          </div>
                          <p className={`text-sm font-semibold ${
                            (member.current_workload || 0) >= 80 ? "text-red-300" :
                            (member.current_workload || 0) >= 60 ? "text-yellow-300" : "text-green-300"
                          }`}>
                            {member.current_workload || 0}%
                          </p>
                        </div>
                        <Progress value={member.current_workload || 0} className="h-2 [&>*]:bg-gradient-to-r [&>*]:from-blue-500 [&>*]:to-purple-500" />
                        <p className="text-xs text-slate-400">{member.role}</p>
                      </div>
                    ))}
                    {teamMembers.length === 0 && (
                      <div className="text-center py-12 text-slate-400">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Noch keine Teammitglieder hinzugefügt. Fügen Sie Mitglieder hinzu, um die Auslastung zu sehen.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {editingTask && (
        <EditTaskForm
          open={showEditTaskForm}
          onOpenChange={setShowEditTaskForm}
          task={editingTask}
          onTaskUpdated={handleTaskUpdated}
          teamMembers={teamMembers}
        />
      )}

      <style jsx global>{`
        .styled-scrollbar::-webkit-scrollbar { width: 6px; }
        .styled-scrollbar::-webkit-scrollbar-track { background: rgba(51,65,85,.3); border-radius: 10px; }
        .styled-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,116,139,.5); border-radius: 10px; }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,.8); }
      `}</style>
    </div>
  );
}
