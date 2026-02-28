```
██╗   ██╗███████╗███╗   ██╗██████╗  ██████╗
██║   ██║██╔════╝████╗  ██║██╔══██╗██╔═══██╗
██║   ██║█████╗  ██╔██╗ ██║██║  ██║██║   ██║
╚██╗ ██╔╝██╔══╝  ██║╚██╗██║██║  ██║██║   ██║
 ╚████╔╝ ███████╗██║ ╚████║██████╔╝╚██████╔╝
  ╚═══╝  ╚══════╝╚═╝  ╚═══╝╚═════╝  ╚═════╝
```

> A modern, full-stack ecommerce platform. Neobrutalism design. Built different.

---

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Payload_CMS-000000?style=for-the-badge&logo=payloadcms&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Neon-00E699?style=for-the-badge&logo=neon&logoColor=black" />
  <img src="https://img.shields.io/badge/Cloudinary-000000?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" />
  <img src="https://img.shields.io/badge/Grafana-F05A28?style=for-the-badge&logo=grafana&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382C?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" />
  <img src="https://img.shields.io/badge/Vitest-64B939?style=for-the-badge&logo=vitest&logoColor=white" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-000000?style=for-the-badge&logo=drizzleorm&logoColor=white" />
  <img src="https://img.shields.io/badge/Playwright-000000?style=for-the-badge&logo=playwright&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" />
</p>
---

## ⚠️ Known Issues & Warnings

`payload generate:types` requires `"type": "module"`
The Payload CLI uses Node.js ESM resolution via `tsx`. Without `"type": "module"` in `package.json`, the CLI cannot resolve collection imports and throws `ERR_MODULE_NOT_FOUND`.

```json
// package.json — this is required
{
  "type": "module"
}
```

Without this, `bunx payload generate:types` will fail even if all files exist.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Node.js](https://nodejs.org) >= 20.9
- [Docker](https://www.docker.com) + Docker Compose
- Stripe account

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/vendo.git
cd vendo
bun install
```

### 2. Start Docker

Vendo uses **PostgreSQL 17** via Docker. Adminer is included for database inspection.

```bash
docker compose up -d
```

| Service | URL | Description |
|---|---|---|
| PostgreSQL | `localhost:5432` | Main database |
| Adminer | [http://localhost:8080](http://localhost:8080) | DB GUI |

**Adminer login credentials:**

```
System:   PostgreSQL
Server:   db
Username: postgres
Password: vendo
Database: vendo
```

To stop the database:

```bash
docker compose down
```

To stop and wipe all data:

```bash
docker compose down -v
```

### 3. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@host/vendo

# Payload
PAYLOAD_SECRET=your-long-random-secret-here

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_ADDRESS=your-email@example.com

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

> **Never commit `.env` to version control.** Use `.env.example` as a reference template.

### 3. Run Development Server

```bash
bun dev
```

- Storefront → [http://localhost:3000](http://localhost:3000)
- Admin dashboard → [http://localhost:3000/admin](http://localhost:3000/admin)
- Database GUI → [http://localhost:8080](http://localhost:8080)

On first run, Payload will auto-sync the database schema and prompt you to create your first admin user.

---

## Database Migrations

Payload manages migrations internally via Drizzle. You do not need to configure Drizzle directly.

```bash
# Generate a migration after modifying collections
bunx payload migrate:create

# Run pending migrations
bunx payload migrate

# Reset database — destructive, dev only
bunx payload migrate:fresh
```

---

## Role-Based Access Control

Two user roles enforced at the Payload collection level:

| Role | Permissions |
|---|---|
| `admin` | Full access to all collections and admin dashboard |
| `customer` | Read products, manage own orders and profile |

New users are assigned `customer` by default. Only an `admin` can promote users via the Payload dashboard at `/admin`.

### Access Matrix

| Collection | Public | Customer | Admin |
|---|---|---|---|
| Products | Read | Read | Full CRUD |
| Orders | — | Own orders only | All orders |
| Users | — | Own profile only | All users |
| Media | Read | — | Full CRUD |

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/checkout` | Creates a Stripe checkout session |
| `POST` | `/api/webhooks/stripe` | Handles Stripe payment webhook events |
| `POST` | `/api/users/login` | Payload auth — login |
| `POST` | `/api/users/logout` | Payload auth — logout |
| `GET` | `/api/users/me` | Payload auth — current user |

All other `/api/*` routes are handled automatically by Payload's REST API.

---

## Scripts

```bash
bun dev            # Start development server
bun build          # Production build
bun start          # Start production server
bun lint           # Run ESLint
bun format:check   # Check formatting with Prettier
bun format:fix     # Auto-fix formatting with Prettier
```

---

## Deployment

### Local vs Production Database

| Environment | Database |
|---|---|
| Development | Docker (PostgreSQL 17) |
| Production | [Neon](https://neon.tech) (serverless Postgres, free tier) |

Switch your `DATABASE_URL` in production to your Neon connection string:

```env
DATABASE_URL=postgresql://user:password@host/vendo?sslmode=require
```

### Vercel + Neon (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Provision a production database on [Neon](https://neon.tech)
5. Register your Vercel deployment URL as a Stripe webhook endpoint

```bash
# Verify production build locally before deploying
bun run build
```

---
## Documentation

- [Webhook Architecture](docs/webhook-architecture.md)
- [Cart Architecture](docs/cart-architecture.md)

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit using conventional commits — `git commit -m "feat: add wishlist"`
4. Push and open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.