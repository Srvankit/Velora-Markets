# Velora Markets

Modern paper-trading investment platform — React frontend + Spring Boot API.

## Quick start

### Backend

Requires **Java 21** and **Maven**.

```bash
cd backend
set SPRING_PROFILES_ACTIVE=local
set JWT_SECRET=local-development-secret-key-at-least-32-bytes
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

### Local backend profile

The production profile requires PostgreSQL environment variables. For local
development, activate the `local` profile, which uses H2 and provides safe
defaults for JWT, CORS, and FMP configuration:

```bash
cd backend
set SPRING_PROFILES_ACTIVE=local
set JWT_SECRET=local-development-secret-key-at-least-32-bytes
mvn spring-boot:run
```

The `local` profile does not weaken production security; the production profile
still requires `JWT_SECRET` and Supabase PostgreSQL environment variables.

## Features

- JWT auth (register / login / profile / change password)
- Paper portfolio with ₹100,000 starting cash
- Market orders (buy / sell) with holdings & P&amp;L
- Watchlist, dashboard, and market catalog (23 seeded stocks)
- Orders & transaction history (paginated)

See [`backend/README.md`](backend/README.md) for the full API surface.
