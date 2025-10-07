import React from 'react'
export function Alert({className='', children}){ return <div className={`rounded-md border p-3 ${className}`}>{children}</div>}
export function AlertDescription({className='', children}){ return <div className={`${className}`}>{children}</div>}