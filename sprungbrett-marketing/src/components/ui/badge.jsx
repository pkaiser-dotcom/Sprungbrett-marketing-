import React from 'react'
export function Badge({className='', children}){
  return <span className={`inline-flex items-center rounded-md border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs ${className}`}>{children}</span>
}