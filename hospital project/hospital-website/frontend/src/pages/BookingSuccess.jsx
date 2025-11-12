import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { verifyPayUResponse } from '../services/paymentPayU'

export default function BookingSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)

  useEffect(() => {
    // Extract payment details from URL parameters
    const status = searchParams.get('status')
    const txnId = searchParams.get('txnid')
    const amount = searchParams.get('amount')
    const firstName = searchParams.get('firstname')
    const email = searchParams.get('email')

    const data = {
      status,
      txnid: txnId,
      amount,
      firstname: firstName,
      email,
    }

    setPaymentData(data)
    setLoading(false)

    // Save booking confirmation to localStorage
    if (data.txnid) {
      const booking = {
        id: data.txnid,
        amount: data.amount,
        patientName: data.firstname,
        email: data.email,
        paymentStatus: 'completed',
        paymentMethod: 'payu',
        timestamp: new Date().toISOString(),
      }
      
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      bookings.push(booking)
      localStorage.setItem('bookings', JSON.stringify(bookings))
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-slate-600">Processing payment confirmation...</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        
        <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        
        <p className="text-slate-600 mb-6">
          Your appointment has been confirmed. Payment received.
        </p>

        {paymentData && (
          <div className="bg-slate-50 rounded p-4 mb-6 text-left">
            <div className="mb-3">
              <span className="font-semibold text-slate-700">Transaction ID:</span>
              <div className="text-slate-600 font-mono text-sm">{paymentData.txnid}</div>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-slate-700">Amount Paid:</span>
              <div className="text-slate-600">₹{paymentData.amount}</div>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-slate-700">Patient Name:</span>
              <div className="text-slate-600">{paymentData.firstname}</div>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Email:</span>
              <div className="text-slate-600">{paymentData.email}</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded"
          >
            Back to Home
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          A confirmation email has been sent to {paymentData?.email}
        </p>
      </div>
    </div>
  )
}
