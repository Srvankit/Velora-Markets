# Velora Markets — Backend

Spring Boot 3 paper-trading API that powers the Velora Markets frontend.

## Stack

- Java 21
- Spring Boot 3.3 (Web, Security, Data JPA, Validation)
- H2 file database (auto-seeded stock catalog)
- JWT Bearer authentication

## Quick start

```bash
cd backend
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
