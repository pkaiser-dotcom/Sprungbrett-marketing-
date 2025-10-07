import React, {useState} from 'react'
export function DropdownMenu({children}){ return <div className="relative inline-block">{children}</div>}
export function DropdownMenuTrigger({children, asChild}){ return asChild? children: <button>{children}</button>}
export function DropdownMenuContent({children, className=''}){ return <div className={`absolute right-0 mt-2 min-w-[10rem] rounded-md border border-slate-700 bg-slate-800 p-1 ${className}`}>{children}</div>}
export function DropdownMenuItem({children, onClick, className=''}){ return <button onClick={onClick} className={`w-full text-left px-3 py-2 rounded hover:bg-slate-700 ${className}`}>{children}</button>}