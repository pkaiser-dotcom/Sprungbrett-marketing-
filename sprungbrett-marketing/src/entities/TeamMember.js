const KEY = 'sprungbrett_team_members';
function read(){ return JSON.parse(localStorage.getItem(KEY) || '[]') }
function write(v){ localStorage.setItem(KEY, JSON.stringify(v)) }

export const TeamMember = {
  async list(order=''){ 
    const data = read();
    if(order === '-created_date') return data.slice().reverse();
    return data;
  },
  async create(payload){
    const data = read();
    const id = crypto.randomUUID();
    data.push({ id, created_date: new Date().toISOString(), ...payload });
    write(data);
    return { id };
  },
  async update(id, payload){
    const data = read();
    const idx = data.findIndex(x=>x.id===id);
    if(idx>=0){ data[idx] = { ...data[idx], ...payload, updated_date: new Date().toISOString() }; write(data); }
  }
}