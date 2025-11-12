import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'

describe('Header', () => {
  it('renders logo and login when not authenticated', () => {
    localStorage.removeItem('token')
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByText(/CityHealth/i)).toBeInTheDocument()
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
  })

  it('shows profile when authenticated', () => {
    localStorage.setItem('token', 'demo')
    localStorage.setItem('user', JSON.stringify({ name: 'Test User' }))
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByText(/Test User/)).toBeInTheDocument()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  })
})
