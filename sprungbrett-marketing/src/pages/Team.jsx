import React, { useState, useEffect } from "react";
import { TeamMember } from "@/entities/TeamMember";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import MemberCard from "../pages/components/team/MemberCard";
import AddMemberForm from "../pages/components/team/AddMemberForm";
import EditTeamMemberForm from "../pages/components/team/EditTeamMemberForm";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => { loadTeamMembers(); }, []);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const members = await TeamMember.list("-created_date");
      setTeamMembers(members);
    } catch (e) {
      console.error("Fehler beim Laden der Teammitglieder:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberAdded = () => loadTeamMembers();
  const handleMemberUpdated = () => loadTeamMembers();

  const handleEditMember = (member) => { setEditingMember(member); setShowEditForm(true); };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (<div key={i} className="h-96 bg-slate-700 rounded-lg"></div>))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Team-Verwaltung</h1>
            <p className="text-slate-400">Verwalten Sie Ihr Marketing-Team und verfolgen Sie Fähigkeiten</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Mitglied hinzufügen
          </Button>
        </div>

        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <MemberCard key={member.id} member={member} onEdit={() => handleEditMember(member)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Noch keine Teammitglieder</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Beginnen Sie mit dem Aufbau Ihres Marketing-Teams, indem Sie Teammitglieder mit ihren Fähigkeitsbewertungen hinzufügen.
            </p>
            <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Erstes Mitglied hinzufügen
            </Button>
          </div>
        )}

        <AddMemberForm open={showAddForm} onOpenChange={setShowAddForm} onMemberAdded={handleMemberAdded} />
        {editingMember && (
          <EditTeamMemberForm open={showEditForm} onOpenChange={setShowEditForm} member={editingMember} onMemberUpdated={handleMemberUpdated} />
        )}
      </div>
    </div>
  );
}
<USER_TEAM>
