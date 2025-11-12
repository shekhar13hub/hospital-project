import api from './api'

// Auth wrapper with fallback mock
export async function sendOtp(phone) {
  try {
    const res = await api.post('/api/auth/send-otp', { phone })
    return res.data
  } catch (err) {
    // fallback mock
    return { ok: true, dev_otp: '123456' }
  }
}

export async function verifyOtp(phone, otp) {
  try {
    const res = await api.post('/api/auth/verify-otp', { phone, otp })
    // expect { token, user }
    const data = res.data
    if (data.token) localStorage.setItem('token', data.token)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
    return data
  } catch (err) {
    // mock: return demo token
    const mock = { token: 'demo-token', user: { id: 'user-demo', name: 'Demo User', phone } }
    localStorage.setItem('token', mock.token)
    localStorage.setItem('user', JSON.stringify(mock.user))
    return mock
  }
}
