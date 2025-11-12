import React, { useState } from 'react'
import { sendOtp, verifyOtp } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [phone, setPhone] = useState('9999999999')
  const [otpSent, setOtpSent] = useState(false)
  const [devOtp, setDevOtp] = useState(null)
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  async function onSend() {
    const res = await sendOtp(phone)
    if (res.dev_otp) setDevOtp(res.dev_otp)
    setOtpSent(true)
    alert('OTP sent (dev_otp shown in response if available)')
  }

  async function onVerify() {
    const data = await verifyOtp(phone, otp || devOtp || '123456')
    if (data.token) {
      navigate('/')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="font-semibold text-xl">Login with OTP</h2>
      <div className="mt-4">
        <input className="w-full p-2 border rounded" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <div className="mt-2">
          {!otpSent ? (
            <button onClick={onSend} className="bg-teal-600 text-white px-3 py-1 rounded">Send OTP</button>
          ) : (
            <div>
              <div className="text-sm text-slate-500">Dev OTP: {devOtp || '123456'}</div>
              <input className="w-full mt-2 p-2 border rounded" value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="Enter OTP" />
              <div className="mt-2 flex gap-2">
                <button onClick={onVerify} className="bg-teal-600 text-white px-3 py-1 rounded">Verify</button>
                <button onClick={()=>setOtpSent(false)} className="px-3 py-1">Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500">For demo, backend may return dev_otp which you can use. In production, use httpOnly cookies.</div>
    </div>
  )
}
