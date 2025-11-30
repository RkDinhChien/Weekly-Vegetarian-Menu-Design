# Project Architecture & Tech Stack

## Overview

This is a modern, full-stack vegetarian restaurant menu and ordering system built with cutting-edge web technologies.

---

## 🏗️ Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│           React Application             │
│  (TypeScript + Tailwind CSS + Vite)     │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │  Customer    │  │  Admin Portal   │ │
│  │  Interface   │  │  (Protected)    │ │
│  └──────────────┘  └─────────────────┘ │
│         │                   │           │
│         ├───────────────────┤           │
│         │                                │
│  ┌──────▼──────────────────────┐       │
│  │   Shared Components (UI)    │       │
│  │  - Cards, Buttons, Forms    │       │
│  │  - Modals, Alerts, Badges   │       │
│  └─────────────────────────────┘       │
│                                         │
└────────────┬────────────────────────────┘
             │
             │ API Calls
             │
┌────────────▼────────────────────────────┐
│         Supabase Backend               │
│  - PostgreSQL Database                 │
│  - Authentication & Authorization      │
│  - Real-time Subscriptions            │
│  - Storage for Images                  │
└────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Core Technologies

#### **1. React 18.3**

- **Purpose**: UI library for building component-based interfaces
- **Why React?**
  - Virtual DOM for efficient rendering
  - Hooks for state management (useState, useEffect, etc.)
  - Large ecosystem and community
  - Excellent TypeScript support

**Usage Example:**

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

#### **2. TypeScript 5.7**

- **Purpose**: Static type checking for JavaScript
- **Benefits:**
  - Catch errors at compile-time
  - Better IDE support (IntelliSense)
  - Self-documenting code
  - Refactoring confidence

**Usage Example:**

```tsx
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

function displayMenu(items: MenuItem[]): void {
  items.forEach((item) => console.log(item.name));
}
```

#### **3. Tailwind CSS 3.4**

- **Purpose**: Utility-first CSS framework
- **Why Tailwind?**
  - Rapid UI development
  - Consistent design system
  - No CSS file bloat (PurgeCSS)
  - Responsive design made easy
  - Dark mode support

**Usage Example:**

```tsx
<div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
  <h2 className="text-2xl font-bold text-gray-900">Menu Item</h2>
  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
    Available
  </span>
</div>
```

**Custom Configuration:**

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
    },
    animation: {
      "fade-in": "fade-in 0.2s ease-in",
    },
  },
}
```

#### **4. Vite 6.3**

- **Purpose**: Next-generation frontend build tool
- **Why Vite?**
  - Lightning-fast HMR (Hot Module Replacement)
  - Native ES modules in development
  - Optimized production builds
  - Out-of-the-box TypeScript support

**Configuration:**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

---

### UI Component Libraries

#### **5. Radix UI**

- **Purpose**: Unstyled, accessible component primitives
- **Components Used:**
  - Dialogs & Modals
  - Dropdowns & Popovers
  - Accordions
  - Tabs
  - Select menus
  - Radio groups
  - Checkboxes

**Why Radix UI?**

- WAI-ARIA compliant
- Full keyboard navigation
- Focus management
- Screen reader support
- Unstyled (style with Tailwind)

**Example:**

```tsx
import * as Dialog from "@radix-ui/react-dialog";

<Dialog.Root>
  <Dialog.Trigger className="rounded bg-blue-500 px-4 py-2 text-white">Open Dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6">
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>Dialog content here</Dialog.Description>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>;
```

#### **6. Motion (Framer Motion)**

- **Purpose**: Animation library for React
- **Features:**
  - Declarative animations
  - Gesture recognition
  - Layout animations
  - Page transitions

**Example:**

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content with animation
</motion.div>;
```

#### **7. Lucide React**

- **Purpose**: Beautiful, consistent icon library
- **Icons Used:**
  - ShoppingCart, Plus, Minus, Trash2
  - Phone, MapPin, Send
  - Menu, X, ClipboardList
  - Leaf, Clock, Flame

**Example:**

```tsx
import { ShoppingCart, Plus } from "lucide-react";

<button className="flex items-center gap-2">
  <ShoppingCart className="h-5 w-5" />
  Add to Cart
  <Plus className="h-4 w-4" />
</button>;
```

---

### Form Management

#### **8. React Hook Form**

- **Purpose**: Performant, flexible form library
- **Benefits:**
  - Minimal re-renders
  - Easy validation
  - TypeScript support
  - Small bundle size

**Example:**

```tsx
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
}

function OrderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: true })} />
      {errors.name && <span>Name is required</span>}

      <input {...register("email", { pattern: /^\S+@\S+$/i })} />
      {errors.email && <span>Invalid email</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Backend & Database

#### **9. Supabase**

- **Purpose**: Backend-as-a-Service (BaaS)
- **Features Used:**
  - **PostgreSQL Database**: Menu items, orders, customers
  - **Authentication**: User login/signup (future)
  - **Real-time Subscriptions**: Live order updates
  - **Storage**: Image hosting for menu items

**Setup:**

```typescript
// src/utils/supabase/info.tsx
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Database Schema Example:**

```sql
-- Menu Items Table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  day VARCHAR(20),
  is_special BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

**API Usage:**

```typescript
// Fetch menu items
const { data: menuItems, error } = await supabase
  .from("menu_items")
  .select("*")
  .eq("available", true)
  .order("day", { ascending: true });

// Create order
const { data: order, error } = await supabase
  .from("orders")
  .insert({
    customer_name: "John Doe",
    phone: "0123456789",
    address: "123 Main St",
    delivery_date: "2024-11-20",
    delivery_time: "12:00",
    total_amount: 150000,
  })
  .select()
  .single();

// Real-time subscription
supabase
  .channel("orders")
  .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
    console.log("Order update:", payload);
  })
  .subscribe();
```

---

### Development Tools

#### **10. PostCSS & Autoprefixer**

- **Purpose**: CSS processing and vendor prefixing
- **Configuration:**

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### **11. SWC (Speedy Web Compiler)**

- **Purpose**: Super-fast TypeScript/JavaScript compiler
- **Why SWC?**
  - 20x faster than Babel
  - Written in Rust
  - Used by Vite plugin

---

## 📦 Project Structure Explained

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (shadcn/ui style)
│   │   ├── button.tsx        # Button component with variants
│   │   ├── card.tsx          # Card component
│   │   ├── dialog.tsx        # Modal/Dialog component
│   │   ├── input.tsx         # Input field component
│   │   └── utils.ts          # cn() utility for class merging
│   │
│   ├── figma/                 # Figma-imported components
│   │   └── ImageWithFallback.tsx
│   │
│   ├── CustomerView.tsx       # Main customer interface
│   ├── WeeklyMenu.tsx         # Weekly menu display
│   ├── OrderingSystem.tsx     # Order placement flow
│   ├── AdminPortal.tsx        # Admin dashboard entry
│   ├── AdminMenu.tsx          # Menu CRUD operations
│   └── OrderManagement.tsx    # Order tracking & management
│
├── utils/
│   └── supabase/
│       └── info.tsx           # Supabase client configuration
│
├── styles/
│   └── globals.css            # Global styles + Tailwind imports
│
├── assets/                    # Static files (images, fonts)
│
├── App.tsx                    # Root component (routing logic)
├── main.tsx                   # Entry point (React.render)
└── index.css                  # Compiled Tailwind CSS
```

---

## 🎨 Styling Strategy

### CSS Architecture

1. **Tailwind Utilities**: Primary styling method
2. **CSS Variables**: Theme colors (in globals.css)
3. **Component Styles**: Scoped to components
4. **Global Styles**: Typography, resets

### Example Component Styling:

```tsx
// Using Tailwind + cn() utility
import { cn } from "@/components/ui/utils";

interface ButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({ variant = "default", size = "md", className }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",

        // Variant styles
        variant === "default" && "bg-primary hover:bg-primary/90 text-white",
        variant === "outline" && "border border-gray-300 hover:bg-gray-100",
        variant === "ghost" && "hover:bg-gray-100",

        // Size styles
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4",
        size === "lg" && "h-11 px-8 text-lg",

        // Custom className override
        className
      )}
    >
      Click Me
    </button>
  );
}
```

---

## 🔄 Data Flow

### Customer Order Flow

```
1. Customer browses menu (CustomerView.tsx)
   ↓
2. Adds items to cart (useState for cart state)
   ↓
3. Opens cart drawer (Sheet component from Radix UI)
   ↓
4. Fills order form (React Hook Form)
   ↓
5. Submits order → Supabase API
   ↓
6. Order saved to database
   ↓
7. Toast notification shown (Sonner)
```

### Admin Management Flow

```
1. Access admin portal (Ctrl+Shift+A)
   ↓
2. View menu items or orders
   ↓
3. CRUD operations → Supabase API
   ↓
4. Real-time updates to UI
   ↓
5. Changes reflected immediately
```

---

## 🚀 Performance Optimizations

1. **Code Splitting**: Vite automatically splits code
2. **Tree Shaking**: Unused code removed in production
3. **Image Optimization**: WebP format, lazy loading
4. **CSS Purging**: Tailwind removes unused styles
5. **Memoization**: React.memo for heavy components
6. **Lazy Loading**: Dynamic imports for routes

---

## 🔒 Security Considerations

1. **Environment Variables**: Sensitive data in `.env`
2. **Row Level Security**: Supabase RLS policies
3. **Input Validation**: React Hook Form + Zod (future)
4. **XSS Prevention**: React auto-escapes JSX
5. **CSRF Protection**: Supabase handles tokens

---

## 📱 Responsive Design Strategy

### Breakpoints (Tailwind)

```css
/* Mobile First */
.container {
  @apply w-full px-4;
}

/* sm: 640px */
@media (min-width: 640px) {
  .container {
    @apply max-w-screen-sm;
  }
}

/* md: 768px */
@media (min-width: 768px) {
  .container {
    @apply max-w-screen-md;
  }
}

/* lg: 1024px */
@media (min-width: 1024px) {
  .container {
    @apply max-w-screen-lg;
  }
}

/* xl: 1280px */
@media (min-width: 1280px) {
  .container {
    @apply max-w-screen-xl;
  }
}

/* 2xl: 1536px */
@media (min-width: 1536px) {
  .container {
    @apply max-w-screen-2xl;
  }
}
```

### Usage:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## 🧪 Testing Strategy (Future Implementation)

### Recommended Stack

- **Vitest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

---

## 📈 Future Enhancements

1. **Authentication**: User login/signup with Supabase Auth
2. **Payment Integration**: Stripe/PayPal
3. **Email Notifications**: Order confirmations
4. **Analytics**: Google Analytics 4
5. **PWA**: Service workers for offline support
6. **Internationalization**: i18n for multi-language
7. **Admin Dashboard**: Charts and analytics (Recharts)

---

## 🔗 Useful Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

Made with ❤️ for the Weekly Vegetarian Menu Project
