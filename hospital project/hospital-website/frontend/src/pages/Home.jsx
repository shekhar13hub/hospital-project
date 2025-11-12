import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { createAppointment } from '../services/booking'

export default function Home() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function quickDemo() {
    // Quick programmatic booking to demonstrate end-to-end flow without clicking through UI.
    // Uses the booking service which will fallback to mock if backend not available.
    try {
      setBusy(true)
      setMessage('Creating demo appointment...')
      const date = dayjs().format('YYYY-MM-DD')
      // choose doctor d1 (present in mock data)
      const payload = { doctor_id: 'd1', slot_id: `d1-${date}-0`, payment_method: 'pay_at_hospital' }
      const res = await createAppointment(payload)
      setMessage('Appointment created — opening confirmation')
      // navigate to booking result which shows confirmation
      navigate(`/book/${res.appointment_id}`)
    } catch (err) {
      console.error(err)
      setMessage('Demo booking failed — see console')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg p-8 shadow text-center">
        <h1 className="text-3xl font-bold text-teal-700">CityHealth</h1>
        <p className="mt-2 text-slate-600">Find doctors, book slots and pay online in 3 simple steps.</p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="/hospitals" className="inline-block bg-teal-600 text-white px-4 py-2 rounded">Find Doctors</a>
          <button onClick={quickDemo} disabled={busy} className="inline-block bg-sky-600 text-white px-4 py-2 rounded">{busy ? 'Running demo...' : 'Quick Demo Booking'}</button>
        </div>
        <div className="mt-6 text-left">
          <h3 className="font-semibold">Guided Demo Script</h3>
          <ol className="list-decimal ml-6 mt-2 text-sm text-slate-700">
            <li>Click <strong>Find Doctors</strong> to browse hospitals and doctors.</li>
            <li>Open a hospital, view doctors and select a doctor.</li>
            <li>Choose a date (next 7 days) and pick an available slot.</li>
            <li>Confirm booking and choose <em>Pay at hospital</em> or <em>Pay online</em>.</li>
            <li>Visit <strong>Profile</strong> to see your bookings and cancel if needed.</li>
          </ol>
          <div className="mt-3 text-xs text-slate-500">Tip: use the <strong>Quick Demo Booking</strong> button to create a sample appointment instantly for demo purposes.</div>
          {message && <div className="mt-3 bg-slate-100 p-2 rounded text-sm">{message}</div>}
        </div>
      </div>
    </div>
  )
}
