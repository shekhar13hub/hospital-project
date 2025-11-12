import api from './api'

// In-memory mock data used when backend unavailable
const MockDB = (() => {
  const hospitals = [
    { id: 'h1', name: 'City Health Center', city: 'Metroville', specialties: ['Cardiology','Dermatology'] },
    { id: 'h2', name: 'Green Valley Hospital', city: 'Metroville', specialties: ['Pediatrics','Orthopedics'] },
  ]
  const doctors = [
    { id: 'd1', name: 'Dr. Asha Kumar', specialty: 'Cardiology', fee: 500, hospital_id: 'h1' },
    { id: 'd2', name: 'Dr. Rajesh Verma', specialty: 'Dermatology', fee: 400, hospital_id: 'h1' },
    { id: 'd3', name: 'Dr. Meera Singh', specialty: 'Pediatrics', fee: 350, hospital_id: 'h2' },
  ]

  function getSlotsForDoctor(doctorId, date) {
    // deterministic mock: 9am..5pm slots every hour, random availability
    const times = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00']
    return times.map((t, i) => ({ id: `${doctorId}-${date}-${i}`, time: t, available: Math.random() > 0.2 }))
  }

  return { hospitals, doctors, getSlotsForDoctor }
})()

export async function getHospitals(params) {
  try {
    const res = await api.get('/api/hospitals', { params })
    return res.data
  } catch (err) {
    return MockDB.hospitals
  }
}

export async function getHospital(id) {
  try {
    const res = await api.get(`/api/hospitals/${id}`)
    return res.data
  } catch (err) {
    return MockDB.hospitals.find((h) => h.id === id)
  }
}

export async function getDoctorsInHospital(id) {
  try {
    const res = await api.get(`/api/hospitals/${id}/doctors`)
    return res.data
  } catch (err) {
    return MockDB.doctors.filter((d) => d.hospital_id === id)
  }
}

export async function getDoctor(id) {
  try {
    const res = await api.get(`/api/doctors/${id}`)
    return res.data
  } catch (err) {
    return MockDB.doctors.find((d) => d.id === id)
  }
}

export async function getSlots(doctorId, date) {
  try {
    const res = await api.get(`/api/doctors/${doctorId}/slots`, { params: { date } })
    return res.data
  } catch (err) {
    return MockDB.getSlotsForDoctor(doctorId, date)
  }
}

export async function createAppointment(payload) {
  try {
    const res = await api.post('/api/appointments', payload)
    return res.data
  } catch (err) {
    // mock create: return appointment object with id and status
    const appointment = {
      appointment_id: `appt-${Date.now()}`,
      status: payload.payment_method === 'online' ? 'payment_pending' : 'confirmed',
      amount: 500,
      razorpay_order_id: null,
    }
    // If online payment requested, simulate backend creating a razorpay order id
    if (payload.payment_method === 'online') {
      appointment.razorpay_order_id = `order_${Date.now()}`
    }
    return appointment
  }
}

export async function getUserAppointments(userId) {
  try {
    const res = await api.get(`/api/users/${userId}/appointments`)
    return res.data
  } catch (err) {
    return []
  }
}

export async function cancelAppointment(id) {
  try {
    const res = await api.patch(`/api/appointments/${id}/cancel`)
    return res.data
  } catch (err) {
    return { ok: true }
  }
}
