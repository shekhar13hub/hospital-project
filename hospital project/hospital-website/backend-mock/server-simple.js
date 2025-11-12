// Lightweight backend mock using only Node core modules so it can run without npm install.
const http = require('http')
const url = require('url')

const PORT = 5000

const db = {
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

function sendJson(res, code, obj) {
  const s = JSON.stringify(obj)
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(s)
}

function parseBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch (e) { resolve({}) }
    })
  })
}

function generateSlots(doctorId, date) {
  const times = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00']
  return times.map((t, i) => ({ id: `${doctorId}-${date}-${i}`, time: t, available: true }))
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true)
  const method = req.method
  const pathname = parsed.pathname

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' })
    return res.end()
  }

  // Routes
  if (pathname === '/api/health' && method === 'GET') return sendJson(res, 200, { ok: true })

  if (pathname === '/api/auth/send-otp' && method === 'POST') {
    const body = await parseBody(req)
    const dev_otp = '123456'
    return sendJson(res, 200, { ok: true, dev_otp })
  }

  if (pathname === '/api/auth/verify-otp' && method === 'POST') {
    const body = await parseBody(req)
    const phone = body.phone || 'unknown'
    const userId = `user-${phone}`
    const user = { id: userId, name: 'Demo User', phone }
    const token = `mock-token-${Date.now()}`
    return sendJson(res, 200, { token, user })
  }

  // hospitals
  if (pathname === '/api/hospitals' && method === 'GET') return sendJson(res, 200, db.hospitals)

  const hospMatch = pathname.match(/^\/api\/hospitals\/([^/]+)$/)
  if (hospMatch && method === 'GET') {
    const id = hospMatch[1]
    const h = db.hospitals.find(x => x.id === id)
    if (!h) return sendJson(res, 404, { error: 'Not found' })
    return sendJson(res, 200, h)
  }

  const hospDocsMatch = pathname.match(/^\/api\/hospitals\/([^/]+)\/doctors$/)
  if (hospDocsMatch && method === 'GET') {
    const id = hospDocsMatch[1]
    const list = db.doctors.filter(d => d.hospital_id === id)
    return sendJson(res, 200, list)
  }

  const docMatch = pathname.match(/^\/api\/doctors\/([^/]+)$/)
  if (docMatch && method === 'GET') {
    const id = docMatch[1]
    const d = db.doctors.find(x => x.id === id)
    if (!d) return sendJson(res, 404, { error: 'Not found' })
    return sendJson(res, 200, d)
  }

  const docSlotsMatch = pathname.match(/^\/api\/doctors\/([^/]+)\/slots$/)
  if (docSlotsMatch && method === 'GET') {
    const id = docSlotsMatch[1]
    const date = parsed.query.date || new Date().toISOString().slice(0,10)
    const slots = generateSlots(id, date)
    return sendJson(res, 200, slots)
  }

  if (pathname === '/api/appointments' && method === 'POST') {
    const body = await parseBody(req)
    const { doctor_id, slot_id, payment_method } = body || {}
    if (Math.random() < 0.05) return sendJson(res, 409, { error: 'slot-not-available' })
    const apptId = `appt-${Date.now()}`
    const status = payment_method === 'online' ? 'payment_pending' : 'confirmed'
    const amount = 500
    const razorpay_order_id = payment_method === 'online' ? `order_${Date.now()}` : null
    db.appointments[apptId] = { id: apptId, doctor_id, slot_id, payment_method, status, amount, razorpay_order_id, created_at: new Date().toISOString() }
    return sendJson(res, 200, { appointment_id: apptId, status, amount, razorpay_order_id })
  }

  const userApptsMatch = pathname.match(/^\/api\/users\/([^/]+)\/appointments$/)
  if (userApptsMatch && method === 'GET') {
    const list = Object.values(db.appointments).map(a => ({ id: a.id, doctor_id: a.doctor_id, date: new Date().toISOString().slice(0,10), time: '09:00', status: a.status, doctor_name: (db.doctors.find(d=>d.id===a.doctor_id)||{}).name }))
    return sendJson(res, 200, list)
  }

  const cancelMatch = pathname.match(/^\/api\/appointments\/([^/]+)\/cancel$/)
  if (cancelMatch && method === 'PATCH') {
    const id = cancelMatch[1]
    if (!db.appointments[id]) return sendJson(res, 404, { error: 'not_found' })
    db.appointments[id].status = 'cancelled'
    return sendJson(res, 200, { ok: true })
  }

  // not found
  sendJson(res, 404, { error: 'not_found' })
})

server.listen(PORT, () => console.log(`Simple backend mock listening on http://localhost:${PORT}`))
