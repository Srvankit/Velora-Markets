# Velora Markets — Backend

Spring Boot 3 paper-trading API that powers the Velora Markets frontend.

## Stack

- Java 21
- Spring Boot 3.3 (Web, Security, Data JPA, Validation)
- PostgreSQL/Supabase in production; H2 file database for local development
- JWT Bearer authentication

## Quick start

```bash
cd backend
$env:SPRING_PROFILES_ACTIVE="local"
$env:JWT_SECRET="replace-with-a-local-secret-at-least-256-bits"
mvn spring-boot:run
```

API base: `http://localhost:8080/api/v1`  
H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/velora`)

The default `application.yml` is production-oriented and requires PostgreSQL
environment variables. The `local` profile is the only profile that enables
H2. Set `SPRING_PROFILES_ACTIVE=local` for local development; never enable it
in production.

For production, configure these environment variables:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<database>?sslmode=require
SPRING_DATASOURCE_USERNAME=<database-user>
SPRING_DATASOURCE_PASSWORD=<database-password>
JWT_SECRET=<secret-at-least-256-bits>
CORS_ALLOWED_ORIGINS=https://your-frontend.example
DHAN_CLIENT_ID=<your-10-digit-dhan-client-id>
DHAN_ACCESS_TOKEN=<your-dhan-access-token>
```

## Frontend wiring

Set in the project root `.env`:

```env
VITE_API_BASE_URL=/api
```

The Vite dev server proxies `/api` to `http://localhost:8080/api`. Start the
backend before submitting registration or login forms.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET/PUT | `/users/me` | JWT |
| POST | `/users/change-password` | JWT |
| GET | `/portfolio` | JWT |
| GET | `/dashboard` | JWT |
| GET/POST | `/trading/orders` | JWT |
| GET | `/trading/transactions` | JWT |
| GET/POST/DELETE | `/watchlist`, `/watchlist/{symbol}` | JWT |
| GET | `/market/stocks`, `/market/stocks/{symbol}`, `/market/search`, `/market/gainers`, `/market/losers`, `/market/active` | Public |

New users receive **₹100,000** starting cash for paper trading. Only **MARKET** buy/sell orders are supported.
