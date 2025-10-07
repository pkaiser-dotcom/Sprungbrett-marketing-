import React from 'react'
export function Dialog({open, onOpenChange, children}){ return open? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">{children}</div> : null }
export function DialogContent({className='', children}){ return <div className={`w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 ${className}`}>{children}</div>}
export function DialogHeader({className='', children}){ return <div className={`p-4 border-b border-slate-800 ${className}`}>{children}</div>}
export function DialogTitle({className='', children}){ return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>}
export function DialogFooter({className='', children}){ return <div className={`p-4 border-t border-slate-800 flex justify-end gap-2 ${className}`}>{children}</div>}
export function DialogClose({asChild, children}){ return children }