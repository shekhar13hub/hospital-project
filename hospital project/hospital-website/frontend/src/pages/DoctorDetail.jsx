import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDoctor, getSlots } from '../services/booking'
import SlotGrid from '../components/SlotGrid'
import BookingModal from '../components/BookingModal'
import dayjs from 'dayjs'

export default function DoctorDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)

  useEffect(()=>{ getDoctor(id).then(setDoctor) },[id])
  useEffect(()=>{ fetchSlots(selectedDate) },[selectedDate])

  async function fetchSlots(date){
    const s = await getSlots(id, date)
    setSlots(s)
  }

  const days = Array.from({length:7}).map((_,i)=>dayjs().add(i,'day'))

  function onBooked(res){
    // After booking, navigate to a result page showing appointment
    navigate(`/book/${res.appointment_id}`)
  }

  if(!doctor) return <div>Loading doctor...</div>

  return (
    <div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{doctor.name}</h2>
            <div className="text-sm text-slate-500">{doctor.specialty}</div>
          </div>
          <div className="text-teal-700">Fee: ₹{doctor.fee}</div>
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Select Date</h3>
        <div className="mt-2 flex gap-2">
          {days.map(d=>{
            const val = d.format('YYYY-MM-DD')
            return (
              <button key={val} onClick={()=>setSelectedDate(val)} className={`p-2 rounded ${selectedDate===val?'bg-teal-600 text-white':'bg-slate-100'}`}>
                <div className="text-sm">{d.format('ddd')}</div>
                <div className="text-sm font-medium">{d.format('DD MMM')}</div>
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Available Slots</h4>
          <div className="mt-2">
            <SlotGrid slots={slots} onSelect={(s)=>setSelectedSlot(s)} />
          </div>
        </div>
      </div>

      {selectedSlot && <BookingModal doctor={doctor} slot={selectedSlot} onClose={()=>setSelectedSlot(null)} onBooked={onBooked} />}
    </div>
  )
}
