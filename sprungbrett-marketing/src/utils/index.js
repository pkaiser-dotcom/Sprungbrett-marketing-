export function createPageUrl(name){
  const map = {
    Dashboard: '/dashboard',
    Team: '/team',
    Tasks: '/tasks',
    AIAllocation: '/aiallocation',
  }
  return map[name] || '/'
}