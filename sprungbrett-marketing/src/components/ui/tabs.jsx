import React, {useState} from 'react'
export function Tabs({defaultValue, children}){
  const [value,setValue]=useState(defaultValue)
  return React.Children.map(children, child => React.cloneElement(child, {value, setValue}))
}
export function TabsList({children, className=''}){ return <div className={`inline-flex gap-2 rounded-xl ${className}`}>{children}</div>}
export function TabsTrigger({children, value:tabValue, className='', value, setValue}){
  const active = (tabValue===value)
  return <button onClick={()=>setValue(tabValue)} className={`px-3 py-1.5 rounded-lg border ${active?'bg-blue-600 text-white border-blue-500':'text-slate-300 border-slate-700'} ${className}`}>{children}</button>
}
export function TabsContent({children, value:tabValue, value}){ return value===tabValue ? <div>{children}</div>: null }