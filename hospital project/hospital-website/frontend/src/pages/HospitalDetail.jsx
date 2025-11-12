import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getHospital, getDoctorsInHospital } from '../services/booking'
import DoctorCard from '../components/DoctorCard'

export default function HospitalDetail(){
  const { id } = useParams()
  const [hospital, setHospital] = useState(null)
  const [doctors, setDoctors] = useState([])

  useEffect(()=>{ getHospital(id).then(setHospital); getDoctorsInHospital(id).then(setDoctors) },[id])

  if(!hospital) return <div>Loading hospital...</div>

  return (
    <div>
      <div className="bg-white rounded p-4 shadow">
        <h2 className="font-semibold text-lg">{hospital.name}</h2>
        <div className="text-sm text-slate-500">{hospital.city}</div>
        <div className="mt-2">Specialties: {(hospital.specialties||[]).join(', ')}</div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Doctors</h3>
        <div className="mt-2 grid gap-3">
          {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      </div>
    </div>
  )
}
