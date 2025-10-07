import React from 'react'
export function Card({className='', children}){ return <div className={`border border-slate-700 rounded-xl bg-slate-900/60 ${className}`}>{children}</div>}
export function CardHeader({className='', children}){ return <div className={`p-4 border-b border-slate-800 ${className}`}>{children}</div>}
export function CardTitle({className='', children}){ return <div className={`text-lg font-semibold ${className}`}>{children}</div>}
export function CardContent({className='', children}){ return <div className={`p-4 ${className}`}>{children}</div>}