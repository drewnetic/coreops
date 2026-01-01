# CoreOps API

🌎 **Read this in:** [English](README.md) | [Português](README-pt-BR.md)

CoreOps is a backend API designed to manage organizations, users, units, and operational workflows with secure authentication, role-based access control (RBAC), and full audit logging.

The project follows a modular architecture focused on scalability, maintainability, and real-world production practices.

---

## 🎯 Project Goal

CoreOps was built to simulate a real-world multi-tenant operations platform,
focusing on:

- Clean architecture
- Secure authentication
- Organization-scoped data
- Production-grade deployment

This project was designed as a portfolio piece to demonstrate backend
engineering skills beyond CRUD APIs.

---

## 🌐 Live Demo & API Docs

The API is live and available for testing.

- **Base URL:** https://coreops-production.up.railway.app
- **API Docs (Scalar):** https://coreops-production.up.railway.app/docs/

> No installation required — test directly from the browser.

## 🔑 Demo Credentials

Use the following credentials to explore the API:

**Admin User**

- Email: `demo@coreops.dev`
- Password: `demo123`

This user belongs to a demo organization and has full access.

---

## 🚀 Tech Stack

- **Node.js**
- **TypeScript**
- **Fastify**
- **Prisma ORM**
- **PostgreSQL**
- **Redis**
- **JWT Authentication**
- **Vitest**
- **Supertest**
- **Zod**

---

## 🧱 Architecture

The API is structured using a **modular architecture**, where each domain is isolated into its own module with:

- Controllers
- Services
- Schemas (DTOs)
- Routes

Shared logic (authentication, errors, audit logs, environment, redis) lives in dedicated shared or infra layers.

---

## 🔐 Authentication & Authorization

### Authentication

- JWT-based authentication
- Access Token & Refresh Token strategy
- Tokens include:
  - `sub` (user id)
  - `role`
  - `organizationId`

### Authorization (RBAC)

- Role-based access control using:
  - `ensureAuth`
  - `ensureRole`
- Supported roles:
  - `ADMIN`
  - `MANAGER`
  - `USER`

---

## 📦 Modules

### Auth

- Register organization and admin user
- Login
- Token generation

### Users

- Create users (ADMIN only)
- Organization scoped access

### Units

- Create and list organizational units
- Organization scoped access

### Operations

- Create operations linked to units
- List operations with pagination and filters
- Update operation status

---

## 🔌 API Endpoints Overview

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Users

- `POST /api/users`
- `GET /api/users`

### Units

- `POST /api/units`
- `GET /api/units`

### Operations

- `POST /api/operations`
- `GET /api/operations`
- `PATCH /api/operations/:id/status`

---

## 🧪 Tests

The project includes **integration tests** using Vitest and Supertest.

### Covered scenarios

- Authentication flow
- RBAC enforcement
- Operations lifecycle
- Organization scoping

### Run tests

```bash
npm run test
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```
NODE_ENV=development
PORT=3333

DATABASE_URL=postgresql://user:password@localhost:5432/coreops
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-secret-key
```

---

## ▶️ Running the Project

### Install dependencies

```bash
cd coreops-api
npm install
```

### Run database migrations

```
npx prisma migrate deploy
```

### Start development server

```
npm run dev
```

---

## 🚀 Deployment & Infrastructure

- Deployed using **Docker**
- Hosted on **Railway**
- PostgreSQL hosted on **Supabase**
- Redis hosted on **Upstash (TLS enabled)**
- Prisma migrations applied automatically on deploy

The application is production-ready and follows 12-factor app principles.

---

## 🔒 Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are signed with environment-based secrets
- Refresh tokens are stored securely and rotated
- Organization-level data isolation enforced at service layer
- RBAC enforced via middleware
- HTTP security headers via Helmet
- CORS with allowlist
- Global rate limiting
- Stricter rate limiting on auth route

---

## 📁 Project Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   ├── operations/
│   │   ├── units/
│   │   └── user/
│   └── shared/
│       ├── audit/
│       ├── auth/
│       ├── errors/
│       └── middlewares/
|
├── infra/
│   ├── database/
│   ├── env/
│   ├── logger/
│   └── redis/
|
├── tests/
│   ├── helpers/
│   ├── auth.spec.ts
│   ├── operations.spec.ts
│   ├── rbac.spec.ts
│   └── setup.ts
|
├── index.ts
└── server.ts

```

---

## 📝 Audit Logs

Every critical action is logged using the audit system, including:

- User creation
- Operation creation
- Operation status updates

Audit logs store:

- Action
- Entity
- Entity ID
- User ID
- IP (when available)

---

## ❗ Error Handling

Centralized error handling using a global Fastify error handler.

Handled errors:

- Validation errors
- Authentication errors
- Authorization errors
- Not Found errors
- Conflict errors

---

## 🛣️ Roadmap

- ✔️ Docker support
- ✔️ API documentation (Swagger / Scalar)
- ✔️ Refresh token rotation
- ✔️ Background jobs
- ✔️ Observability (logs & metrics)
- ✔️ Rate limiting
- ✔️ CORS & security hardening

---

## 👤 Author

**Andrew Gouvêa**

- GitHub: https://github.com/drewnetic
- LinkedIn: https://linkedin.com/in/andrew-gouvêa-551b052a6

---

## 📄 License

[MIT](https://github.com/drewnetic/coreops/blob/main/LICENSE)
