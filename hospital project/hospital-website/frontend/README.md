# Frontend (Patient Site)

This is the React + Vite + Tailwind frontend for the Hospital Booking MVP.

Quick start:

1. cd frontend
2. npm install
3. copy `.env.example` to `.env` and edit `REACT_APP_API_URL` and `REACT_APP_RAZORPAY_KEY_ID` if needed
4. npm run dev

Run tests:

- From `frontend/` run `npm test` to execute unit tests (Vitest). Use `npm run test:watch` for watch mode.

Smoke test:

- From repo root: `./smoke-test.sh`

Razorpay:

- The app will attempt to use Razorpay if backend returns a `razorpay_order_id` when creating an appointment.
- Set `REACT_APP_RAZORPAY_KEY_ID` in `.env` for the checkout to initialize. Demo uses test mode keys.
- If Razorpay script fails to load or backend does not create an order, the UI shows a "Simulate Payment" flow to complete the booking locally.

Notes:

- This app uses client-side mocks when backend endpoints are unavailable. For production, implement server-side endpoints as specified in the project README and secure JWT storage via httpOnly cookies.
