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
  <img src="https://img.shields.io/badge/Neon-00E699?style=for-the-badge&logo=neon&logoColor=black" />
</p>

---

## Project Structure

```
vendo/
├── app/
│   ├── (app)/                        # Customer-facing storefront
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx              # Product listing
│   │   │   └── [slug]/page.tsx       # Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── account/page.tsx          # Protected route
│   ├── (payload)/                    # Payload CMS internal routes
│   │   ├── admin/[[...segments]]/    # Admin dashboard at /admin
│   │   │   ├── page.tsx
│   │   │   └── not-found.tsx
│   │   ├── api/[...slug]/route.ts    # Payload REST API
│   │   └── importMap.ts
│   ├── api/
│   │   ├── checkout/route.ts         # Stripe checkout session
│   │   └── webhooks/stripe/route.ts  # Stripe webhook handler
│   ├── globals.css
│   └── layout.tsx                    # Root layout
├── collections/
│   ├── Users.ts                      # Auth + RBAC (admin / customer)
│   ├── Products.ts                   # Admin-only CRUD
│   ├── Categories.ts
│   ├── Orders.ts                     # Scoped by user role
│   └── Media.ts                      # File uploads
├── components/
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── CartDrawer.tsx
│   └── ThemeToggle.tsx
├── store/
│   └── cartStore.ts                  # Zustand cart (SSR-safe)
├── lib/
│   ├── payload.ts                    # Payload client helper
│   └── stripe.ts
├── middleware.ts                     # Protects /account, /orders, /checkout
├── payload.config.ts
├── next.config.ts                    # withPayload wrapper
├── .env
└── .env.example
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Node.js](https://nodejs.org) >= 18
- PostgreSQL database — [Neon](https://neon.tech) recommended (free tier)
- Stripe account

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/vendo.git
cd vendo
bun install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@host/vendo

# Payload
PAYLOAD_SECRET=your-long-random-secret-here

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

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

## Roadmap

- [x] Project setup — Next.js 15 + Payload CMS 3 + PostgreSQL
- [x] Shadcn UI + Tailwind CSS 4 + Neobrutalism design system
- [x] Dark mode with next-themes
- [ ] Collections — Users, Products, Categories, Orders, Media
- [ ] RBAC — admin and customer roles
- [ ] Storefront — product listing and detail pages
- [ ] Cart — Zustand with SSR-safe persistence
- [ ] Stripe checkout + webhook order creation
- [ ] Protected routes via middleware
- [ ] Deploy to Vercel

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit using conventional commits — `git commit -m "feat: add wishlist"`
4. Push and open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.