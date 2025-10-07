import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Activity, Clock, Edit3 } from "lucide-react";
import SkillRadarChart from './SkillRadarChart';
import { Progress } from "@/components/ui/progress";

const roleColors = {
  "Marketing Manager": "bg-purple-500/20 text-purple-300 border-purple-500/40",
  "Content Creator": "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "Social Media Spezialist": "bg-pink-500/20 text-pink-300 border-pink-500/40",
  "SEO Spezialist": "bg-green-500/20 text-green-300 border-green-500/40",
  "PPC Spezialist": "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  "Designer": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  "Texter": "bg-orange-500/20 text-orange-300 border-orange-500/40",
  "Datenanalyst": "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
};

export default function MemberCard({ member, onEdit }) {
  const getWorkloadColor = (w) => w>=80 ? "text-red-300" : w>=60 ? "text-yellow-300" : "text-green-300";

  return (
    <Card className="glass-effect-enhanced group relative">
      <button onClick={onEdit} className="absolute top-3 right-3 p-1.5 bg-slate-700/50 rounded-md text-slate-400">
        <Edit3 className="w-4 h-4" />
      </button>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{member.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm text-slate-300">{member.email}</span>
            </div>
          </div>
          <Badge className={`${roleColors[member.role] || 'bg-gray-500/20 text-gray-300 border-gray-500/40'} border px-2 py-0.5 text-xs`}>
            {member.role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 mb-1"><Activity className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs text-slate-400">Verfügbarkeit</span></div>
            <div className={`text-xl font-semibold ${member.availability>=80?'text-green-300':member.availability>=50?'text-yellow-300':'text-red-300'}`}>{member.availability || 100}%</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 mb-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs text-slate-400">Auslastung</span></div>
            <div className="flex items-center gap-2">
              <Progress value={member.current_workload || 0} className="h-1.5 flex-1" />
              <span className={`text-sm font-semibold ${getWorkloadColor(member.current_workload || 0)}`}>{member.current_workload || 0}%</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/40">
          <h4 className="text-sm font-medium text-slate-300 mb-2 text-center">Fähigkeitskarte</h4>
          <SkillRadarChart skills={member.skills} memberName={member.name} />
        </div>
      </CardContent>
    </Card>
  );
}
