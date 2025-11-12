import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUserAppointments } from '../services/booking'

export default function BookingResult(){
  const { id } = useParams()
  const [ok, setOk] = useState(null)

  useEffect(()=>{
    // In a real app, fetch appointment details. Here we'll display a simple success message.
    setOk(true)
  },[id])

  return (
    <div className="bg-white rounded p-6 shadow">
      {ok ? (
        <div>
          <h3 className="font-semibold text-lg text-teal-700">Booking Confirmed</h3>
          <div className="mt-2">Appointment ID: {id}</div>
          <div className="mt-2">Check <a href="/profile" className="text-teal-600">Profile</a> to view bookings.</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}
