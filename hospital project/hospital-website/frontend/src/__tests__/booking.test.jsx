import { describe, it, expect, vi } from 'vitest'

// Mock the api module used by booking.js to force fallback path
vi.mock('../services/api', () => ({
  default: {
    get: () => { throw new Error('network') },
    post: () => { throw new Error('network') }
  }
}))

import { getHospitals, getDoctor, getSlots, createAppointment } from '../services/booking'

describe('booking service (fallbacks)', () => {
  it('returns hospitals from mock when api fails', async () => {
    const list = await getHospitals()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
    expect(list[0]).toHaveProperty('id')
  })

  it('returns a doctor from mock when api fails', async () => {
    const d = await getDoctor('d1')
    expect(d).toBeTruthy()
    expect(d.id).toBe('d1')
  })

  it('returns slots array from mock when api fails', async () => {
    const slots = await getSlots('d1', '2025-11-10')
    expect(Array.isArray(slots)).toBe(true)
    expect(slots[0]).toHaveProperty('time')
  })

  it('createAppointment returns appointment object from mock when api fails', async () => {
    const appt = await createAppointment({ doctor_id: 'd1', slot_id: 's1', payment_method: 'pay_at_hospital' })
    expect(appt).toHaveProperty('appointment_id')
    expect(appt).toHaveProperty('status')
  })
})
