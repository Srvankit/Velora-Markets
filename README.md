# Velora Markets

Modern paper-trading investment platform — React frontend + Spring Boot API.

## Quick start

### Backend

Requires **Java 21** and **Maven**.

```bash
cd backend
$env:SPRING_PROFILES_ACTIVE="local"
$env:JWT_SECRET="replace-with-a-local-secret-at-least-256-bits"
mvn spring-boot:run
```

API: `http://localhost:8080/api/v1`

### Frontend

```bash
npm install
cp .env.example .env   # optional — Vite also proxies /api → :8080
npm run dev
```

App: `http://localhost:5173`

## Features

- JWT auth (register / login / profile / change password)
- Paper portfolio with ₹100,000 starting cash
- Market orders (buy / sell) with holdings & P&amp;L
- Watchlist, dashboard, and market catalog (23 seeded stocks)
- Orders & transaction history (paginated)

See [`backend/README.md`](backend/README.md) for the full API surface.
