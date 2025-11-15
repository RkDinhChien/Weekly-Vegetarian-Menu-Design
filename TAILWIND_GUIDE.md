# 🎨 Tailwind CSS Setup & Usage Guide

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Basic Usage](#basic-usage)
4. [Custom Classes](#custom-classes)
5. [Responsive Design](#responsive-design)
6. [Dark Mode](#dark-mode)
7. [Component Patterns](#component-patterns)
8. [Best Practices](#best-practices)

---

## Installation

Already done! Your project has Tailwind CSS fully configured with:

```json
// package.json
{
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

---

## Configuration

### 1. Tailwind Config (`tailwind.config.js`)

```javascript
export default {
  darkMode: ["class"], // Enable dark mode with class strategy
  content: [
    "./src/**/*.{ts,tsx}", // Scan all TypeScript files
    "./index.html", // Include HTML file
  ],
  theme: {
    extend: {
      colors: {
        // Custom color system using CSS variables
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ... more colors
      },
      borderRadius: {
        // Dynamic border radius
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        // Custom animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-in",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Animation utilities
  ],
};
```

### 2. PostCSS Config (`postcss.config.js`)

```javascript
export default {
  plugins: {
    tailwindcss: {}, // Process Tailwind
    autoprefixer: {}, // Add vendor prefixes
  },
};
```

### 3. Global Styles (`src/styles/globals.css`)

```css
@tailwind base; /* Reset styles + base utilities */
@tailwind components; /* Component classes */
@tailwind utilities; /* Utility classes */

@layer base {
  :root {
    /* Define CSS variables for colors */
    --primary: 170 100% 15%; /* HSL format */
    --secondary: 210 40% 96.1%;
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... more variables */
  }

  .dark {
    /* Dark mode colors */
    --primary: 210 40% 98%;
    --background: 222.2 84% 4.9%;
    /* ... more variables */
  }
}
```

---

## Basic Usage

### Layout

```tsx
{
  /* Flexbox */
}
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>;

{
  /* Grid */
}
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>;

{
  /* Container */
}
<div className="container mx-auto px-4">{/* Centered container with padding */}</div>;
```

### Spacing

```tsx
{/* Padding */}
<div className="p-4">       {/* All sides: 1rem (16px) */}
<div className="px-6 py-3"> {/* Horizontal: 1.5rem, Vertical: 0.75rem */}
<div className="pt-2 pb-4"> {/* Top: 0.5rem, Bottom: 1rem */}

{/* Margin */}
<div className="m-4">       {/* All sides: 1rem */}
<div className="mx-auto">   {/* Center horizontally */}
<div className="mt-8 mb-4"> {/* Top: 2rem, Bottom: 1rem */}

{/* Space between children */}
<div className="space-y-4"> {/* Vertical space: 1rem */}
<div className="space-x-2"> {/* Horizontal space: 0.5rem */}
```

### Typography

```tsx
{/* Font Size */}
<h1 className="text-4xl">     {/* 2.25rem / 36px */}
<h2 className="text-2xl">     {/* 1.5rem / 24px */}
<p className="text-base">     {/* 1rem / 16px */}
<span className="text-sm">    {/* 0.875rem / 14px */}

{/* Font Weight */}
<span className="font-light">   {/* 300 */}
<span className="font-normal">  {/* 400 */}
<span className="font-medium">  {/* 500 */}
<span className="font-bold">    {/* 700 */}

{/* Text Color */}
<p className="text-gray-900">   {/* Almost black */}
<p className="text-blue-500">   {/* Blue */}
<p className="text-red-600">    {/* Red */}

{/* Text Alignment */}
<p className="text-left">
<p className="text-center">
<p className="text-right">
```

### Colors

```tsx
{/* Background */}
<div className="bg-white">         {/* White background */}
<div className="bg-gray-100">      {/* Light gray */}
<div className="bg-blue-500">      {/* Blue */}
<div className="bg-gradient-to-r from-blue-500 to-purple-600"> {/* Gradient */}

{/* Text Color */}
<span className="text-gray-900">   {/* Dark text */}
<span className="text-white">      {/* White text */}
<span className="text-primary">    {/* Custom primary color */}

{/* Border Color */}
<div className="border border-gray-300">  {/* Gray border */}
<div className="border-2 border-blue-500"> {/* Thick blue border */}
```

### Effects

```tsx
{/* Shadow */}
<div className="shadow-sm">   {/* Small shadow */}
<div className="shadow-md">   {/* Medium shadow */}
<div className="shadow-lg">   {/* Large shadow */}
<div className="shadow-xl">   {/* Extra large shadow */}

{/* Rounded Corners */}
<div className="rounded">       {/* 0.25rem */}
<div className="rounded-md">    {/* 0.375rem */}
<div className="rounded-lg">    {/* 0.5rem */}
<div className="rounded-full">  {/* Fully rounded (circles) */}

{/* Opacity */}
<div className="opacity-50">    {/* 50% opacity */}
<div className="opacity-75">    {/* 75% opacity */}
```

---

## Custom Classes

### Using the `cn()` Utility

Located in `src/components/ui/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Purpose:** Merge Tailwind classes intelligently, handling conflicts

**Example:**

```tsx
import { cn } from "@/components/ui/utils";

// Basic usage
<div className={cn("bg-blue-500", "hover:bg-blue-700")}>

// Conditional classes
<div className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

// Merge with props
interface CardProps {
  className?: string;
}

function Card({ className }: CardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md p-4", // Default classes
      className // User-provided classes (can override)
    )}>
  );
}

// Usage
<Card className="bg-red-500" /> {/* bg-red-500 overrides bg-white */}
```

---

## Responsive Design

### Breakpoints

```typescript
// Tailwind default breakpoints
sm: '640px'   // Small devices (tablets)
md: '768px'   // Medium devices (small laptops)
lg: '1024px'  // Large devices (desktops)
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X large devices
```

### Mobile-First Approach

```tsx
{
  /* Stack on mobile, side-by-side on desktop */
}
<div className="flex flex-col gap-4 md:flex-row">
  <div>Item 1</div>
  <div>Item 2</div>
</div>;

{
  /* 1 column on mobile, 2 on tablet, 3 on desktop */
}
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>;

{
  /* Different text sizes */
}
<h1 className="text-2xl md:text-4xl lg:text-5xl">Responsive Heading</h1>;

{
  /* Hide on mobile, show on desktop */
}
<div className="hidden md:block">Desktop only content</div>;

{
  /* Show on mobile, hide on desktop */
}
<div className="block md:hidden">Mobile only content</div>;
```

---

## Dark Mode

### Setup

Already configured in `tailwind.config.js`:

```javascript
darkMode: ["class"], // Use class strategy
```

### Usage

```tsx
{/* Light mode: white bg, dark text */}
{/* Dark mode: dark bg, light text */}
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  This adapts to dark mode
</div>

{/* More examples */}
<button className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800">
  Button
</button>

<div className="border border-gray-200 dark:border-gray-700">
  Card with border
</div>
```

### Toggle Dark Mode

```tsx
import { useState, useEffect } from "react";

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return <button onClick={() => setIsDark(!isDark)}>{isDark ? "🌞" : "🌙"}</button>;
}
```

---

## Component Patterns

### Button Component

```tsx
import { cn } from "@/components/ui/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "default",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "disabled:pointer-events-none disabled:opacity-50",

        // Variants
        variant === "default" && "bg-primary text-white hover:bg-primary/90",
        variant === "outline" && "border border-gray-300 hover:bg-gray-100",
        variant === "ghost" && "hover:bg-gray-100",

        // Sizes
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4",
        size === "lg" && "h-11 px-8 text-lg",

        className
      )}
      {...props}
    />
  );
}

// Usage
<Button variant="default" size="lg">Primary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost" size="sm">Ghost Button</Button>
```

### Card Component

```tsx
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white shadow-sm",
        "transition-shadow hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>;
```

---

## Best Practices

### 1. Component Organization

```tsx
// ✅ Good: Logical grouping of classes
<button className={cn(
  // Layout
  "flex items-center gap-2",
  // Spacing
  "px-4 py-2",
  // Appearance
  "bg-blue-500 text-white rounded-lg shadow-md",
  // Interactions
  "hover:bg-blue-600 active:scale-95",
  // Transitions
  "transition-all duration-200"
)}>

// ❌ Bad: Random order
<button className="transition-all px-4 text-white hover:bg-blue-600 bg-blue-500 rounded-lg py-2 shadow-md duration-200">
```

### 2. Extract Repeated Patterns

```tsx
// ❌ Bad: Repetition
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg">Card 1</div>
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg">Card 2</div>
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg">Card 3</div>

// ✅ Good: Reusable component
const cardClasses = "bg-white rounded-lg shadow-md p-4 hover:shadow-lg";

<div className={cardClasses}>Card 1</div>
<div className={cardClasses}>Card 2</div>
<div className={cardClasses}>Card 3</div>

// ✅ Better: Component
function Card({ children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg">
      {children}
    </div>
  );
}
```

### 3. Use Semantic Color Names

```tsx
// ❌ Bad: Hard-coded colors
<button className="bg-blue-500 text-white">

// ✅ Good: Semantic names (via CSS variables)
<button className="bg-primary text-primary-foreground">
```

### 4. Responsive Design Tips

```tsx
// ✅ Good: Mobile-first
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ Bad: Desktop-first
<div className="w-1/3 lg:w-1/2 md:w-full">
```

### 5. Accessibility

```tsx
// ✅ Good: Focus visible
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500">

// ✅ Good: Sufficient contrast
<p className="text-gray-900"> {/* vs text-gray-400 */}

// ✅ Good: Large click targets
<button className="min-h-[44px] min-w-[44px]">
```

---

## Common Patterns in This Project

### Menu Card

```tsx
<motion.div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
  <img className="h-48 w-full object-cover" src={imageUrl} alt={name} />
  <div className="p-4">
    <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
    <p className="mt-1 text-sm text-gray-600">{description}</p>
    <div className="mt-4 flex items-center justify-between">
      <span className="text-xl font-bold text-[#00554d]">{price}đ</span>
      <button className="rounded-md bg-[#00554d] px-4 py-2 text-white hover:bg-[#004439]">
        Thêm
      </button>
    </div>
  </div>
</motion.div>
```

### Badge

```tsx
<span className="inline-flex items-center rounded-full border border-green-300 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
  Available
</span>
```

### Input Field

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">Name</label>
  <input
    type="text"
    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter your name"
  />
</div>
```

---

## Tailwind CSS Cheat Sheet

```tsx
// Layout
flex, inline-flex, grid, inline-grid, block, inline-block, hidden

// Flexbox
flex-row, flex-col, items-center, items-start, items-end
justify-center, justify-between, justify-around, gap-4

// Grid
grid-cols-3, grid-rows-2, gap-4, col-span-2

// Spacing (0-96, or arbitrary values)
p-4, px-6, py-3, m-4, mx-auto, mt-8, space-y-4
p-[17px] // Arbitrary value

// Sizing
w-full, w-1/2, w-64, h-screen, h-auto, min-h-screen, max-w-md

// Typography
text-sm, text-base, text-lg, text-2xl, font-bold, font-medium
text-left, text-center, text-right, uppercase, lowercase

// Colors
bg-white, bg-blue-500, text-gray-900, border-gray-300
hover:bg-blue-700, focus:ring-blue-500

// Borders
border, border-2, border-t, rounded, rounded-lg, rounded-full

// Effects
shadow-sm, shadow-md, shadow-lg, opacity-50, blur-sm

// Transitions
transition, transition-all, duration-200, ease-in-out
hover:scale-105, hover:rotate-3

// Positioning
relative, absolute, fixed, sticky, top-0, left-0, z-10

// Display
block, inline, inline-block, flex, grid, hidden

// Overflow
overflow-hidden, overflow-auto, overflow-scroll, truncate
```

---

## Need Help?

- 📖 [Tailwind CSS Docs](https://tailwindcss.com/docs)
- 🎨 [Tailwind CSS Color Reference](https://tailwindcss.com/docs/customizing-colors)
- 🎓 [Tailwind CSS Tutorial](https://www.youtube.com/watch?v=pfaSUYaSgRo)
- 💡 [Component Examples](https://ui.shadcn.com/)

---

Made with ❤️ for the Weekly Vegetarian Menu Project
