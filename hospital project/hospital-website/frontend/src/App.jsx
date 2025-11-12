import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Hospitals from './pages/Hospitals'
import HospitalDetail from './pages/HospitalDetail'
import DoctorDetail from './pages/DoctorDetail'
import Profile from './pages/Profile'
import BookingResult from './pages/BookingResult'
import BookingSuccess from './pages/BookingSuccess'
import BookingFailure from './pages/BookingFailure'
import Header from './components/Header'

function requireAuth() {
  return localStorage.getItem('token')
}

export default function App() {
  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/hospitals/:id" element={<HospitalDetail />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route
            path="/profile"
            element={requireAuth() ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/book/:id" element={<BookingResult />} />
          <Route path="/book-success" element={<BookingSuccess />} />
          <Route path="/book-failed" element={<BookingFailure />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}
