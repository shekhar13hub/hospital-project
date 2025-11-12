import React from 'react'
import { Link } from 'react-router-dom'

export default function HospitalCard({ hospital }) {
  return (
    <div className="bg-white rounded shadow p-4 flex gap-4">
      <div className="w-28 h-20 bg-slate-100 rounded flex items-center justify-center text-slate-400">Img</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{hospital.name}</h3>
          <div className="text-sm text-slate-500">{hospital.city}</div>
        </div>
        <div className="text-sm text-slate-600 mt-2">{(hospital.specialties || []).slice(0,3).join(', ')}</div>
        <div className="mt-3">
          <Link to={`/hospitals/${hospital.id}`} className="inline-block bg-teal-600 text-white px-3 py-1 rounded">View</Link>
        </div>
      </div>
    </div>
  )
}
