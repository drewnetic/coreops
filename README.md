# CoreOps API

CoreOps is a backend API designed to manage organizations, users, units, and operational workflows with secure authentication, role-based access control (RBAC), and full audit logging.

The project follows a modular architecture focused on scalability, maintainability, and real-world production practices.

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
│   ├── redis/
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
 - ✔️ API documentation (Swagger)
 - ✔️ Refresh token rotation
 - ✔️ Rate limiting
 - ✔️ Background jobs
 - ✔️ Observability (logs & metrics)

---

## 📄 License

[MIT](https://github.com/drewnetic/coreops/blob/main/LICENSE)
