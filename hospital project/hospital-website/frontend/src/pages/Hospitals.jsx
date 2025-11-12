import React, { useEffect, useState } from 'react'
import { getHospitals } from '../services/booking'
import HospitalCard from '../components/HospitalCard'

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    getHospitals().then((r)=>{ setHospitals(r); setLoading(false) })
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold">Hospitals</h2>
      {loading ? <div>Loading...</div> : (
        <div className="mt-4 grid gap-4">
          {hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
        </div>
      )}
    </div>
  )
}
