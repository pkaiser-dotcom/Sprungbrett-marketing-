export async function InvokeLLM({prompt, response_json_schema}){
  try{
    const tasks = JSON.parse((prompt.match(/BACKLOG-AUFGABEN ZUM ZUWEISEN:(.*)VERFÜGBARE TEAMMITGLIEDER/s)||[])[1]?.replace(/- /g,'').replace(/\n\n/g,'\n').trim()||'[]');
  }catch(e){}
  // Fallback: read from localStorage and compute simple matching
  const tasks = JSON.parse(localStorage.getItem('sprungbrett_tasks')||'[]').filter(t=>t.status==='Backlog');
  const members = JSON.parse(localStorage.getItem('sprungbrett_team_members')||'[]');
  const allocations = [];
  for(const t of tasks){
    let best=null, bestScore=-1;
    for(const m of members){
      const skills = m.skills||{};
      const req = t.required_skills||[];
      let score = (m.availability||100) - (m.current_workload||0);
      for(const s of req){ score += (skills[s]||0)*5; }
      if(score>bestScore){ bestScore=score; best=m; }
    }
    if(best){
      allocations.push({
        task_id: t.id,
        member_id: best.id,
        confidence_score: Math.min(1, Math.max(0.4, bestScore/150)),
        reasoning: `Beste verfügbare Fähigkeitsübereinstimmung & Kapazität (${best.name}).`,
        estimated_completion_time_in_days: Math.max(1, Math.round((t.estimated_hours||8)/6))
      })
    }
  }
  return { allocations }
}