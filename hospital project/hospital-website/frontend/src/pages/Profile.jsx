import React, { useEffect, useState } from 'react'
import { getUserAppointments, cancelAppointment } from '../services/booking'

export default function Profile(){
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [appointments, setAppointments] = useState([])

  useEffect(()=>{
    if (user) getUserAppointments(user.id).then(setAppointments)
  },[user])

  async function onCancel(id){
    await cancelAppointment(id)
    setAppointments(a=>a.filter(x=>x.id!==id))
  }

  if(!user) return <div>Please login</div>

  return (
    <div>
      <h2 className="font-semibold text-lg">{user.name}'s Bookings</h2>
      <div className="mt-4 space-y-3">
        {appointments.length===0 && <div className="bg-white p-4 rounded shadow">No bookings yet</div>}
        {appointments.map(ap => (
          <div key={ap.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{ap.doctor_name || 'Doctor'}</div>
              <div className="text-sm text-slate-500">{ap.date} {ap.time}</div>
            </div>
            <div>
              <div className="text-sm">{ap.status}</div>
              <button onClick={()=>onCancel(ap.id)} className="mt-2 text-sm text-red-600">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
