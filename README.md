# 🥗 Weekly Vegetarian Menu Design

> A professional, full-stack vegetarian restaurant menu and ordering system built with modern web technologies.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF)](https://vitejs.dev/)

## ✨ Features

### Customer Features

- 📅 **Weekly Menu Display** - Browse vegetarian menu by day
- 🛒 **Shopping Cart** - Add/remove items with size options
- 📝 **Order Placement** - Complete ordering with delivery details
- 🎯 **Category Filtering** - Filter menu by food categories
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🌙 **Dark Mode Support** - Comfortable viewing experience

### Admin Features

- 📋 **Menu Management** - CRUD operations for menu items
- 📦 **Order Tracking** - Real-time order status updates
- 🍽️ **Dish Library** - Manage reusable dish database
- 🏷️ **Category Management** - Organize dishes by category
- 📊 **Week-based System** - Separate menus per week

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** (or npm/yarn)
- **Supabase Account** for backend services

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RkDinhChien/Weekly-Vegetarian-Menu-Design.git
   cd Weekly-Vegetarian-Menu-Design
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   Get your credentials from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API

4. **Start development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   pnpm build
   pnpm preview  # Preview production build
   ```

## 📁 Project Structure

```
Weekly-Vegetarian-Menu-Design/
├── src/
│   ├── app/                    # Application entry point
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # React DOM render
│   │
│   ├── features/              # Feature-based modules
│   │   ├── customer/          # Customer-facing features
│   │   │   └── components/    # Customer UI components
│   │   ├── admin/             # Admin panel features
│   │   │   └── components/    # Admin UI components
│   │   └── ordering/          # Order processing
│   │       └── components/    # Order-related components
│   │
│   ├── components/            # Shared components
│   │   ├── ui/               # shadcn/ui components
│   │   └── common/           # Common components
│   │
│   ├── lib/                   # Libraries & utilities
│   │   ├── api/              # API service layer
│   │   ├── supabase/         # Supabase client config
│   │   ├── utils/            # Utility functions
│   │   └── hooks/            # Custom React hooks
│   │
│   ├── types/                 # TypeScript type definitions
│   ├── styles/                # Global styles
│   └── assets/                # Static assets
│
├── docs/                      # Documentation
│   ├── architecture/          # Architecture docs
│   ├── deployment/            # Deployment guides
│   ├── guides/                # User guides
│   └── changelogs/            # Change logs
│
├── .env.example               # Environment variables template
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies
```

## 🛠️ Tech Stack

### Frontend

- **React 18.3** - UI library with hooks
- **TypeScript 5.7** - Type-safe JavaScript
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Vite 6.3** - Lightning-fast build tool
- **Motion (Framer Motion)** - Smooth animations
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - High-quality UI components

### Backend

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (future)
  - File storage

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **SWC** - Fast TypeScript compiler

## 📚 Key Concepts

### Feature-Based Architecture

Components are organized by feature (customer, admin, ordering) for better scalability and maintainability.

### API Service Layer

Centralized API calls in `src/lib/api/` prevent code duplication and improve error handling.

### Type Safety

Shared TypeScript types in `src/types/` ensure consistency across the application.

### Path Aliases

Clean imports using `@/` prefix:

```typescript
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { MenuItem } from "@/types";
```

## 🔒 Security Best Practices

✅ **Environment Variables** - API keys stored securely in `.env`  
✅ **No Hardcoded Secrets** - All sensitive data uses env vars  
✅ **Git Ignored** - `.env` files never committed  
✅ **Type Validation** - TypeScript catches errors at compile-time  
✅ **Error Handling** - Proper try-catch and error messages

## 📝 Available Scripts

```bash
pnpm dev          # Start development server (port 3000)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler
```

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
pnpm build
# Upload the 'build' folder to Netlify
```

### Environment Variables for Production

Set these in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📖 Documentation

- [Architecture Guide](docs/architecture/ARCHITECTURE.md)
- [Deployment Instructions](docs/deployment/DEPLOY_INSTRUCTIONS.md)
- [Tailwind CSS Guide](docs/guides/TAILWIND_GUIDE.md)
- [Quick Start Guide](docs/guides/QUICKSTART.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/RkDinhChien/Weekly-Vegetarian-Menu-Design)
- **Supabase**: [https://supabase.com](https://supabase.com)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)

---

**Made with ❤️ using React, TypeScript, Tailwind CSS, and Supabase**
