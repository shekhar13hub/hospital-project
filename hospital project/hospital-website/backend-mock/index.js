const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = 5000

// In-memory DB
const db = {
  users: {},
  hospitals: [
    { id: 'h1', name: 'City Health Center', city: 'Metroville', specialties: ['Cardiology', 'Dermatology'] },
    { id: 'h2', name: 'Green Valley Hospital', city: 'Lakeview', specialties: ['Pediatrics', 'Orthopedics'] },
  ],
  doctors: [
    { id: 'd1', name: 'Dr. Asha Kumar', specialty: 'Cardiology', fee: 500, hospital_id: 'h1' },
    { id: 'd2', name: 'Dr. Rajesh Verma', specialty: 'Dermatology', fee: 400, hospital_id: 'h1' },
    { id: 'd3', name: 'Dr. Meera Singh', specialty: 'Pediatrics', fee: 350, hospital_id: 'h2' },
  ],
  appointments: {},
}

function generateSlots(doctorId, date) {
  const times = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00']
  return times.map((t, i) => ({ id: `${doctorId}-${date}-${i}`, time: t, available: true }))
}

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// Auth: send-otp
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body || {}
  // For demo return dev_otp
  const dev_otp = '123456'
  res.json({ ok: true, dev_otp })
})

// Auth: verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body || {}
  // Create or return demo user + token
  const userId = `user-${phone}`
  const user = { id: userId, name: 'Demo User', phone }
  db.users[userId] = user
  const token = `mock-token-${Date.now()}`
  res.json({ token, user })
})

// Hospitals list
app.get('/api/hospitals', (req, res) => {
  res.json(db.hospitals)
})

app.get('/api/hospitals/:id', (req, res) => {
  const h = db.hospitals.find(x => x.id === req.params.id)
  if (!h) return res.status(404).json({ error: 'Not found' })
  res.json(h)
})

app.get('/api/hospitals/:id/doctors', (req, res) => {
  const list = db.doctors.filter(d => d.hospital_id === req.params.id)
  res.json(list)
})

app.get('/api/doctors/:id', (req, res) => {
  const d = db.doctors.find(x => x.id === req.params.id)
  if (!d) return res.status(404).json({ error: 'Not found' })
  res.json(d)
})

app.get('/api/doctors/:id/slots', (req, res) => {
  const { date } = req.query
  const slots = generateSlots(req.params.id, date || new Date().toISOString().slice(0,10))
  res.json(slots)
})

// Create appointment
app.post('/api/appointments', (req, res) => {
  const { doctor_id, slot_id, payment_method } = req.body || {}
  // simulate conflict randomly
  if (Math.random() < 0.05) {
    return res.status(409).json({ error: 'slot-not-available' })
  }
  const apptId = `appt-${Date.now()}`
  const status = payment_method === 'online' ? 'payment_pending' : 'confirmed'
  const amount = 500
  const razorpay_order_id = payment_method === 'online' ? `order_${Date.now()}` : null
  const record = { id: apptId, doctor_id, slot_id, payment_method, status, amount, razorpay_order_id, created_at: new Date().toISOString() }
  db.appointments[apptId] = record
  res.json({ appointment_id: apptId, status, amount, razorpay_order_id })
})

app.get('/api/users/:id/appointments', (req, res) => {
  const userId = req.params.id
  // Return appointments as list (we don't track user ownership in this simple mock)
  const list = Object.values(db.appointments).map(a => ({ id: a.id, doctor_id: a.doctor_id, date: new Date().toISOString().slice(0,10), time: '09:00', status: a.status, doctor_name: (db.doctors.find(d=>d.id===a.doctor_id)||{}).name }))
  res.json(list)
})

app.patch('/api/appointments/:id/cancel', (req, res) => {
  const id = req.params.id
  const appt = db.appointments[id]
  if (!appt) return res.status(404).json({ error: 'not_found' })
  appt.status = 'cancelled'
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Backend mock listening on http://localhost:${PORT}`)
})
