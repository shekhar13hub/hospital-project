import React from 'react'
import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded shadow p-4 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">Dr</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{doctor.name}</div>
            <div className="text-sm text-slate-500">{doctor.specialty}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-700">₹{doctor.fee}</div>
            <Link to={`/doctors/${doctor.id}`} className="mt-2 inline-block text-xs bg-teal-600 text-white px-3 py-1 rounded">Book</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
