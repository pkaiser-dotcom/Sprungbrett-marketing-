import React, { useState, useEffect } from "react";
import { Task } from "@/entities/Task";
import { TeamMember } from "@/entities/TeamMember";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckSquare, Edit3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import EditTaskForm from "../components/tasks/EditTaskForm";
import AddTaskForm from "../components/tasks/AddTaskForm";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [taskList, members] = await Promise.all([
        Task.list("-created_date"),
        TeamMember.list(),
      ]);
      setTasks(taskList);
      setTeamMembers(members);
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

  const getTasksByStatus = (status) => {
    if (status === "all") return tasks;
    // mapping falls Aufgabenstatus intern englisch gespeichert ist
    const map = {
      "In Bearbeitung": "In Progress",
      "Überprüfung": "Review",
      "Abgeschlossen": "Completed",
      "Backlog": "Backlog",
    };
    return tasks.filter((t) => {
      const taskStatus = map[t.status] || t.status;
      const filterStatus = map[status] || status;
      return taskStatus === filterStatus;
    });
  };

  const getMemberName = (memberId) => {
    const m = teamMembers.find((x) => x.id === memberId);
    return m ? m.name : "Nicht zugewiesen";
  };

  const priorityColors = {
    Niedrig: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    Mittel: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    Hoch: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    Kritisch: "bg-red-500/20 text-red-300 border-red-500/40",
  };

  const statusColors = {
    Backlog: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    "In Bearbeitung": "bg-blue-500/20 text-blue-300 border-blue-500/40",
    "Überprüfung": "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    Abgeschlossen: "bg-green-500/20 text-green-300 border-green-500/40",
  };

  const TaskCard = ({ task, onEdit }) => {
    const displayPriority =
      {
        Low: "Niedrig",
        Medium: "Mittel",
        High: "Hoch",
        Critical: "Kritisch",
      }[task.priority] || task.priority;

    const displayStatus =
      {
        "In Progress": "In Bearbeitung",
        Review: "Überprüfung",
        Completed: "Abgeschlossen",
        Backlog: "Backlog",
      }[task.status] || task.status;

    return (
      <Card className="glass-effect-enhanced hover:border-blue-500/50 transition-all duration-300 group relative">
        <button
          onClick={() => onEdit(task)}
          className="absolute top-3 right-3 p-1.5 bg-slate-700/50 hover:bg-slate-600/70 rounded-md text-slate-400 hover:tex
