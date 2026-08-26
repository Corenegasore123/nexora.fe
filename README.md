# Nexora Web

Next.js frontend for the restaurant operating system - command center, floor, reservations, POS, kitchen, inventory, staff, and analytics.

Backend: [nexora.be](https://github.com/Corenegasore123/nexora.be)

## Setup

Create a `.env` in this folder:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then:

```bash
npm install
npm run dev
```

App: http://localhost:3000

The API must be running (default `http://localhost:4000`). Session cookies are proxied through `/api/*`.

## Demo

Password: `Nexora#2026`

- manager@nexora.rw
- waiter@nexora.rw
- chef@nexora.rw
- cashier@nexora.rw
