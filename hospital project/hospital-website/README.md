# Hospital Appointment Booking — MVP

This repository contains a production-ready prototype (MVP) for a Hospital Appointment Booking system. It includes a patient-facing frontend, an admin dashboard scaffold, API adapters with mock fallbacks, Razorpay test integration, and a smoke-test script.

Status: Frontend prototype complete (mock fallback enabled). Backend expected at http://localhost:5000 but is optional — client-side mocks will allow a full demo offline.

Folders:

- `frontend/` — Patient-facing React + Vite + Tailwind app (primary deliverable).
- `admin/` — Admin dashboard scaffold (React + Vite + Tailwind).

Quick start (patient site):

1. cd frontend
2. npm install
3. copy `.env.example` to `.env` and edit if needed
4. npm run dev

Open http://localhost:5173

Smoke test (basic checks):

1. From repo root run `./smoke-test.sh` (bash) or `./smoke-test.ps1` (PowerShell on Windows)

Notes:
- Backend: assumed at `http://localhost:5000`. If not available, frontend runs in mock demo mode.
 - Backend: assumed at `http://localhost:5000`. A lightweight Node mock server is included at `backend-mock/server-simple.js` and can be started with:

	```powershell
	node backend-mock/server-simple.js
	```

	The Express mock (`backend-mock/index.js`) is also present if you prefer a more featureful mock (requires `npm install` in `backend-mock`).
- Razorpay: test mode integration present. Set `REACT_APP_RAZORPAY_KEY_ID` in `.env`.
- Security: Demo stores JWT in localStorage. For production use httpOnly cookies and server-side session verification.

See `frontend/README.md` for frontend-specific instructions and demo steps for the HOD.
