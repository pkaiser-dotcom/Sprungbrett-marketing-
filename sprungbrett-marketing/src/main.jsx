import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Layout from '@/pages/Layout.jsx'
import Dashboard from '@/pages/Dashboard.jsx'
import Team from '@/pages/Team.jsx'
import Tasks from '@/pages/Tasks.jsx'
import AIAllocation from '@/pages/AIAllocation.jsx'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/aiallocation" element={<AIAllocation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)