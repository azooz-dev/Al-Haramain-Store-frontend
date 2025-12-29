<div align="center">

# Al-Haramain Store

### Premium E-Commerce Experience for Islamic Products

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

**A modern, blazing-fast e-commerce frontend with full bilingual support**

[Features](#features) · [Quick Start](#quick-start) · [Architecture](#architecture) · [Documentation](#documentation)

</div>

---

## Why Al-Haramain Store?

| | Feature | What it means for you |
|:---:|---|---|
| 🌐 | **Bilingual by Design** | Seamless English ↔ Arabic switching with true RTL layouts |
| 🎨 | **Stunning UI** | 48+ accessible components built on Radix UI primitives |
| ⚡ | **Blazing Fast** | Route-level code splitting, 5-10 min API caching |
| 🔒 | **Enterprise Security** | Cookie-based auth, CSRF protection, no localStorage tokens |
| 🌙 | **Dark Mode** | System-aware theming that your users will love |
| 📱 | **Mobile First** | Responsive design that works everywhere |

---

## Features

<table>
<tr>
<td width="50%">

### 🛒 Shopping Experience
- Product catalog with smart filters
- Real-time cart management
- Wishlist/Favorites
- Stripe checkout integration
- Order history & tracking

</td>
<td width="50%">

### 👤 User Management
- Secure authentication flow
- OTP email verification
- Password reset
- Address book
- Profile management

</td>
</tr>
<tr>
<td width="50%">

### 🎯 Performance
- React.lazy code splitting (18 routes)
- RTK Query caching
- Optimized Vite builds
- Tree-shaken bundles

</td>
<td width="50%">

### 🛡️ Developer Experience
- TypeScript strict mode
- ESLint + Prettier
- Jest + Playwright testing
- 70% coverage threshold

</td>
</tr>
</table>

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
├─────────────────────────────────────────────────────────────┤
│  Framework    │  React 19  ·  TypeScript 5.9  ·  Vite 7    │
│  State        │  Redux Toolkit  ·  RTK Query  ·  Persist   │
│  Styling      │  Tailwind CSS  ·  Radix UI  ·  CVA         │
│  Forms        │  React Hook Form  ·  Zod validation        │
│  Routing      │  React Router DOM 7.9                      │
│  Payments     │  Stripe Elements                           │
│  Testing      │  Jest  ·  RTL  ·  Playwright               │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

```bash
node -v  # v18.0.0 or higher
npm -v   # v9.0.0 or higher
```

### Installation

```bash
# Clone & enter
git clone https://github.com/your-org/al-haramain-store-frontend.git
cd al-haramain-store-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Environment Setup

```env
# Required
VITE_API_BASE_URL=http://localhost:8000
VITE_SESSION_DOMAIN=localhost

# Optional
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Run Development Server

```bash
npm run dev

# ✨ App running at http://localhost:5174
```

---

## Scripts Reference

| Command | Description |
|:--------|:------------|
| `npm run dev` | 🚀 Start development server with HMR |
| `npm run build` | 📦 Build production bundle |
| `npm run preview` | 👁️ Preview production build locally |
| `npm run lint` | 🔍 Lint codebase with ESLint |
| `npm run test` | 🧪 Run Jest unit tests |
| `npm run test:watch` | 👀 Run tests in watch mode |
| `npm run test:coverage` | 📊 Generate coverage report |

---

## Architecture

```
src/
│
├── 📁 features/              # Domain-driven modules
│   ├── 🔐 auth/              # Login, Register, OTP, Reset
│   ├── 🛍️ products/          # Catalog, Details, Filters
│   ├── 🛒 cart/              # Cart management
│   ├── ❤️ favorites/         # Wishlist functionality
│   ├── 📦 orders/            # Checkout, Order history
│   ├── 💳 payments/          # Stripe integration
│   ├── 📂 categories/        # Category browsing
│   └── 👤 user/              # Dashboard, Profile
│
├── 📁 shared/                # Cross-cutting concerns
│   ├── 🧱 components/        # 48 UI primitives + layouts
│   ├── 🪝 hooks/             # Custom React hooks
│   ├── ⚙️ config/            # App configuration
│   ├── 🛣️ routing/           # Router setup
│   └── 🔧 utils/             # Helper functions
│
├── 📁 store/                 # Redux state management
│   └── 📊 slices/            # 8 state slices
│
└── 📁 test/                  # Test infrastructure
```

---

## Internationalization

<table>
<tr>
<td align="center" width="50%">

### 🇺🇸 English (LTR)

Left-to-right layout with<br>English translations

</td>
<td align="center" width="50%">

### 🇸🇦 العربية (RTL)

Right-to-left layout with<br>Arabic translations

</td>
</tr>
</table>

Full RTL support including:
- Mirrored layouts
- Directional animations
- Arabic number formatting
- Locale-aware API headers

---

## Testing

### Unit & Integration Tests

```bash
npm run test

# Coverage enforcement: 70% threshold
npm run test:coverage
```

### End-to-End Tests

```bash
# Run Playwright tests
npx playwright test

# With UI mode
npx playwright test --ui
```

**E2E Coverage:**
- ✅ Authentication flows
- ✅ Product browsing
- ✅ Cart operations
- ✅ Navigation
- ✅ Homepage verification

---

## Documentation

| Document | Description |
|:---------|:------------|
| [Technical Documentation](./docs/TECHNICAL_DOCUMENTATION.txt) | Complete architecture deep-dive |
| [.env.example](./.env.example) | Environment configuration |

---

## Contributing

```bash
# 1. Create feature branch
git checkout -b feature/amazing-feature

# 2. Make changes & test
npm run lint && npm run test

# 3. Commit with conventional commits
git commit -m "feat: add amazing feature"

# 4. Push and create PR
git push origin feature/amazing-feature
```

---

## Performance Highlights

| Metric | Value |
|:-------|:------|
| First Contentful Paint | < 1.5s |
| Route Code Splitting | 18 chunks |
| API Cache Duration | 5-10 minutes |
| Bundle Optimization | Tree-shaken |

---

<div align="center">

## Built with modern web technologies

**React** · **TypeScript** · **Redux Toolkit** · **Tailwind CSS** · **Vite**

---

Made with dedication for the Al-Haramain Store

</div>
