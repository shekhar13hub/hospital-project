import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

export default function App(){
  return (
    <div className="p-6">
      <header className="mb-6">
        <Link to="/">Admin Dashboard</Link>
      </header>
      <Routes>
        <Route path="/" element={<div>Welcome to Admin — scaffold. Add admin tools here.</div>} />
      </Routes>
    </div>
  )
}
