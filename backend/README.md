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
set SPRING_PROFILES_ACTIVE=local
set JWT_SECRET=local-development-secret-key-at-least-32-bytes
mvn spring-boot:run
```

API base: `http://localhost:8080/api/v1`  
H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/velora`)

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
## Database configuration

The default profile is production-oriented and uses PostgreSQL. Render must provide
the Supabase **Session Pooler** URL on port `5432` without credentials embedded in
the URL, for example:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://<session-pooler-host>:5432/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=<supabase-session-pooler-user>
SPRING_DATASOURCE_PASSWORD=<supabase-session-pooler-password>
JWT_SECRET=<at-least-32-byte-secret>
CORS_ALLOWED_ORIGINS=https://<frontend-host>
```

The production profile uses a small Hikari pool with bounded connection lifetime
and keepalive settings suitable for a managed pooler. Do not use the transaction
pooler port `6543` for this deployment.

`SPRING_DATASOURCE_URL` must be a JDBC URL beginning with
`jdbc:postgresql://`, must target the Session Pooler host on port `5432`, and must
not contain `user`, `password`, or URL user-info. Spring supplies credentials once
through `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`. The
PostgreSQL driver uses SSL and TCP keepalive; `prepareThreshold=0` is intentionally
not enabled because this deployment uses Session Pooler mode, not transaction
pooling.

For local development, activate the `local` profile:

```text
SPRING_PROFILES_ACTIVE=local
JWT_SECRET=local-development-secret-key-at-least-32-bytes
```

The local profile uses H2 only for development. Production does not configure H2.
The Render health endpoint is `/actuator/health`.

### Local development variables

When `SPRING_PROFILES_ACTIVE=local` is set, the following variables have safe
defaults and can be left unset:

```text
JWT_SECRET=local-development-secret-key-at-least-32-bytes   # required
FMP_API_KEY=                                                # optional
FMP_WEBSOCKET_ENDPOINT=wss://websockets.financialmodelingprep.com/ws
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173
```

`JWT_SECRET` must always be provided. No production secret is committed.
