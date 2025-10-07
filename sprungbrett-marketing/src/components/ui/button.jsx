import React from 'react'
export function Button({className='', variant='default', size='md', children, ...props}){
  return <button className={`inline-flex items-center gap-2 rounded-md px-3 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 ${className}`} {...props}>{children}</button>
}