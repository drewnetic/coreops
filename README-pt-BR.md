# CoreOps API

🌎 **Leia em:** [English](README.md) | [Português](README-pt-BR.md)

O CoreOps é uma API backend projetada para gerenciar organizações, usuários, unidades e fluxos operacionais, com autenticação segura, controle de acesso baseado em papéis (RBAC) e auditoria completa de ações.

O projeto segue uma arquitetura modular focada em escalabilidade, manutenibilidade e boas práticas de produção do mundo real.

---

## 🎯 Objetivo do Projeto

O CoreOps foi construído para simular uma plataforma real de operações multi-tenant, com foco em:

- Arquitetura limpa
- Autenticação segura
- Dados isolados por organização
- Deploy em nível de produção

Este projeto foi desenvolvido como peça de portfólio, com o objetivo de demonstrar habilidades de engenharia backend além de simples APIs CRUD

---

## 🌐 Demo Online & Documentação da API

A API está publicada e disponível para testes.

- **Base URL:** https://coreops-production.up.railway.app
- **Documentação da API (Scalar):** https://coreops-production.up.railway.app/docs/

> Nenhuma instalação é necessária — teste diretamente pelo navegador.

## 🔑 Credenciais de Demonstração

Use as credenciais abaixo para explorar a API:

**Usuário Admin**

- Email: `demo@coreops.dev`
- Password: `demo123`

Este usuário pertence a uma organização de demonstração e possui acesso total.

---

## 🚀 Stack Tecnológica

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

## 🧱 Arquitetura

A API é estruturada utilizando uma **arquitetura modular**, onde cada domínio é isolado em seu próprio módulo, contendo:

- Controllers
- Services
- Schemas (DTOs)
- Routes

Lógicas compartilhadas (autenticação, erros, auditoria, variáveis de ambiente e redis) ficam em camadas shared ou infra.

---

## 🔐 Autenticação & Autorização

### Autenticação

- Autenticação baseada em JWT
- Estratégia com Access Token e Refresh Token
- Tokens incluem:
  - `sub` (ID do usuário)
  - `role`
  - `organizationId`

### Autorização (RBAC)

- Controle de acesso baseado em papéis usando:
  - `ensureAuth`
  - `ensureRole`
- Papéis suportados:
  - `ADMIN`
  - `MANAGER`
  - `USER`

---

## 📦 Módulos

### Auth

- Registro de organização e usuário administrador
- Login
- Geração de tokens

### Users

- Criação de usuários (somente ADMIN)
- Acesso restrito por organização

### Units

- Criação e listagem de unidades organizacionais
- Acesso restrito por organização

### Operations

- Criação de operações vinculadas a unidades
- Listagem com paginação e filtros
- Atualização de status de operações

---

## 🔌 Visão Geral dos Endpoints

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

O projeto inclui **testes de integração** utilizando Vitest e Supertest.

### Cenários cobertos

- Fluxo de autenticação
- Validação de RBAC
- Ciclo de vida de operações
- Isolamento por organização

### Executar testes

```bash
npm run test
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` com base no `.env.example`:

```
NODE_ENV=development
PORT=3333

DATABASE_URL=postgresql://user:password@localhost:5432/coreops
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-secret-key
```

---

## ▶️ Executando o Projeto

### Instalar dependências

```bash
cd coreops-api
npm install
```

### Executar migrations do banco

```
npx prisma migrate deploy
```

### Iniciar o servidor em desenvolvimento

```
npm run dev
```

---

## 🚀 Deploy & Infraestrutura

- Deploy realizado com **Docker**
- Hospedado na **Railway**
- PostgreSQL hospedado no Supabase **Supabase**
- Redis hospedado no **Upstash (TLS enabled)**
- Migrations do Prisma aplicadas automaticamente no deploy

A aplicação está pronta para produção e segue os princípios do 12-factor app.

---

## 🔒 Considerações de Segurança

- Senhas criptografadas com bcrypt
- Tokens JWT assinados com segredos baseados em ambiente
- Refresh tokens armazenados de forma segura e rotacionados
- Isolamento de dados por organização garantido na camada de serviço
- RBAC aplicado via middleware

---

## 📁 Estrutura do Projeto

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

## 📝 Auditoria

Toda ação crítica é registrada pelo sistema de auditoria, incluindo:

- Criação de usuários
- Criação de operações
- Atualizações de status

Audit logs store:

- Ação
- Entidade
- ID da entidade
- ID do usuário
- IP (quando disponível)

---

## ❗ Tratamento de Erros

Tratamento centralizado de erros usando um handler global do Fastify.

Erros tratados:

- Erros de validação
- Erros de autenticação
- Erros de autorização
- Erros de recurso não encontrado
- Erros de conflito

---

## 🛣️ Roadmap

- ✔️ Suporte a Docker
- ✔️ Documentação da API (Swagger / Scalar)
- ✔️ Rotação de refresh tokens
- ✔️ Jobs em background
- ✔️ Observabilidade (logs & métricas)
- ✔️ Rate limiting
- ✔️ CORS & reforço de segurança

---

## 👤 Author

**Andrew Gouvêa**

- GitHub: https://github.com/drewnetic
- LinkedIn: https://linkedin.com/in/andrew-gouvêa-551b052a6

---

## 📄 Licença

[MIT](https://github.com/drewnetic/coreops/blob/main/LICENSE)
