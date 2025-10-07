import React from 'react'
export function Popover({children}){ return <div className="relative">{children}</div>}
export function PopoverTrigger({asChild, children}){ return asChild? children: <button>{children}</button>}
export function PopoverContent({className='', children}){ return <div className={`absolute z-50 mt-2 rounded-md border border-slate-700 bg-slate-800 p-2 ${className}`}>{children}</div>}