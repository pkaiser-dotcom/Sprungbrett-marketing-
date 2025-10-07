import React from 'react'
export function Label({children, className='', htmlFor}){ return <label htmlFor={htmlFor} className={`block mb-1 ${className}`}>{children}</label>}