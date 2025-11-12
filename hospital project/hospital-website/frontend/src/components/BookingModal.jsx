import React, { useState } from 'react'
import { createAppointment } from '../services/booking'
import { initiatePayUCheckout } from '../services/paymentPayU'

// BookingModal handles confirm flow and calls backend to create appointment.
// Payment flow:
// 1. Call createAppointment -> backend or mock returns { appointment_id, status, amount, razorpay_order_id }
// 2. If payment_method === 'online' and razorpay_order_id is present, attempt to load Razorpay checkout.
// 3. If payment_method === 'payu' and PayU is enabled, initiate PayU checkout.
// 4. If checkout fails or isn't available, show a "Simulate Payment" fallback that marks appointment confirmed client-side.
export default function BookingModal({ doctor, slot, onClose, onBooked }) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [error, setError] = useState(null)

  async function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const s = document.createElement('script')
      s.src = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload = () => resolve(true)
      s.onerror = () => resolve(false)
      document.body.appendChild(s)
    })
  }

  async function openRazorpayCheckout(order, amount) {
    // env key (Vite supports VITE_ prefix; code checks both)
    const key = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID || import.meta.env.REACT_APP_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID
    if (!key) throw new Error('Razorpay key not configured')

    const options = {
      key,
      amount: amount * 100, // rupees -> paise
      currency: 'INR',
      name: 'CityHealth',
      description: 'Appointment payment',
      order_id: order,
      handler: function (response) {
        // In production, verify payment on server via webhook/signature.
        // For demo, we call onBooked with payment success info.
        onBooked({ appointment_id: order, status: 'confirmed' })
      },
      modal: { ondismiss: function(){ setError('Payment dismissed') } }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  async function confirm() {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        doctor_id: doctor.id,
        slot_id: slot.id,
        payment_method: paymentMethod,
      }
      // createAppointment will use backend or fallback mock
      const res = await createAppointment(payload)

      // Handle different payment methods
      if (paymentMethod === 'payu') {
        // PayU payment
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          const paymentDetails = {
            txnId: `${res.appointment_id}-${Date.now()}`,
            amount: res.amount || 500,
            productInfo: `Doctor Consultation - ${doctor.name}`,
            firstName: user.name || 'Patient',
            email: user.email || 'patient@cityhealth.com',
            phone: user.phone || '9999999999',
            address: 'Clinic Address',
            city: doctor.hospital_city || 'City',
            state: 'State',
            zipcode: '000000',
          }
          // Initiate PayU checkout (will redirect to PayU payment page)
          initiatePayUCheckout(paymentDetails)
          // Note: onBooked will be called after PayU redirects back (surl/furl)
          // For now, we'll confirm the booking immediately as a fallback
          setTimeout(() => {
            onBooked(res)
            onClose()
          }, 2000)
        } catch (payuErr) {
          console.error('PayU error:', payuErr)
          const simulate = window.confirm('PayU checkout failed. Click OK to simulate payment and confirm booking.')
          if (simulate) {
            onBooked({ ...res, status: 'confirmed' })
          } else {
            setError('Payment not completed')
          }
        }
      } else if (paymentMethod === 'online' && res.razorpay_order_id) {
        // Razorpay payment
        const loaded = await loadRazorpayScript()
        if (loaded && window.Razorpay) {
          // open checkout; handler will call onBooked
          await openRazorpayCheckout(res.razorpay_order_id, res.amount || 500)
          // Do not call onBooked here; handler handles it
        } else {
          // fallback: show simulate payment option
          const simulate = window.confirm('Razorpay checkout failed to load. Click OK to simulate payment and confirm booking.')
          if (simulate) {
            // simulate confirmation
            onBooked({ appointment_id: res.appointment_id, status: 'confirmed' })
          } else {
            setError('Payment not completed')
          }
        }
      } else {
        // pay_at_hospital or no razorpay_order_id -> treat as confirmed
        onBooked(res)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Booking failed')
    } finally {
      setLoading(false)
      if (paymentMethod !== 'payu') onClose() // Don't close for PayU (it redirects)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-96">
        <h3 className="font-semibold">Confirm Booking</h3>
        <div className="mt-3 text-sm">
          <div>Doctor: {doctor.name}</div>
          <div>Slot: {slot.time}</div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2"><input type="radio" checked={paymentMethod==='online'} onChange={()=>setPaymentMethod('online')} /> Pay with Razorpay</label>
          <label className="flex items-center gap-2 mt-2"><input type="radio" checked={paymentMethod==='payu'} onChange={()=>setPaymentMethod('payu')} /> Pay with PayU</label>
          <label className="flex items-center gap-2 mt-2"><input type="radio" checked={paymentMethod==='pay_at_hospital'} onChange={()=>setPaymentMethod('pay_at_hospital')} /> Pay at hospital</label>
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button onClick={confirm} disabled={loading} className="px-3 py-1 bg-teal-600 text-white rounded">{loading?'Please wait':'Confirm & Pay'}</button>
        </div>
      </div>
    </div>
  )
}
