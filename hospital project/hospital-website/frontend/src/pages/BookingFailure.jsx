import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function BookingFailure() {
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
    const error = searchParams.get('error')

    const data = {
      status,
      txnid: txnId,
      amount,
      firstname: firstName,
      email,
      error: error || 'Payment was declined or cancelled.',
    }

    setPaymentData(data)
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-slate-600">Processing payment result...</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">❌</div>
        
        <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
        
        <p className="text-slate-600 mb-6">
          {paymentData?.error}
        </p>

        {paymentData && (
          <div className="bg-red-50 rounded p-4 mb-6 text-left">
            <div className="mb-3">
              <span className="font-semibold text-slate-700">Transaction ID:</span>
              <div className="text-slate-600 font-mono text-sm">{paymentData.txnid || 'N/A'}</div>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-slate-700">Amount:</span>
              <div className="text-slate-600">₹{paymentData.amount || 'N/A'}</div>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-slate-700">Patient Name:</span>
              <div className="text-slate-600">{paymentData.firstname || 'N/A'}</div>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Email:</span>
              <div className="text-slate-600">{paymentData.email || 'N/A'}</div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> You can try booking again with a different payment method, or contact support if you need help.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/hospitals')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded"
          >
            Try Booking Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded"
          >
            Back to Home
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          If you have concerns, please contact us at support@hospital.com
        </p>
      </div>
    </div>
  )
}
