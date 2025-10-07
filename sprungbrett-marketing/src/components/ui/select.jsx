import React from 'react'
export function Select({value, onValueChange, children}){ return <div data-value={value}>{children}</div>}
export function SelectTrigger({className='', children}){ return <div className={`rounded-md border border-slate-700 bg-slate-800 px-3 py-2 ${className}`}>{children}</div>}
export function SelectValue({placeholder}){ return <span>{placeholder}</span>}
export function SelectContent({className='', children}){ return <div className={`mt-2 rounded-md border border-slate-700 bg-slate-800 p-1 ${className}`}>{children}</div>}
export function SelectItem({value, className='', children, onClick}){ return <div onClick={()=>onClick&&onClick(value)} className={`px-3 py-2 rounded hover:bg-slate-700 ${className}`}>{children}</div>}