import React from 'react'
export function Progress({value=0, className='', indicatorClassName=''}){
  return <div className={`w-full h-2 rounded bg-slate-800 ${className}`}>
    <div className={`h-2 rounded bg-blue-500`} style={{width: `${Math.max(0, Math.min(100, value))}%`}} />
  </div>
}