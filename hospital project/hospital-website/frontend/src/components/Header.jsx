import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-teal-500 text-white rounded p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927C9.469 1.95 10.53 1.95 10.951 2.927l.94 2.325a1 1 0 00.95.69h2.462c1.02 0 1.447 1.234.66 1.81l-1.99 1.45a1 1 0 00-.364 1.118l.76 2.49c.32 1.05-.864 1.91-1.74 1.29L10 13.011l-2.228 1.09c-.876.62-2.06-.24-1.74-1.29l.76-2.49a1 1 0 00-.364-1.118L4.398 7.742c-.787-.576-.36-1.81.66-1.81h2.462a1 1 0 00.95-.69l.94-2.325z" /></svg>
          </div>
          <div>
            <div className="font-bold text-lg">CityHealth</div>
            <div className="text-xs text-slate-500">Book appointments in 3 steps</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/hospitals" className="text-slate-700">Hospitals</Link>
          {token ? (
            <>
              <Link to="/profile" className="text-slate-700">{user?.name || 'Profile'}</Link>
              <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-sm bg-teal-600 text-white px-3 py-1 rounded">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
