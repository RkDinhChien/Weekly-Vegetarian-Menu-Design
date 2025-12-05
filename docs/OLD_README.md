<<<<<<< HEAD
NEdx# 🥗 Weekly Vegetarian Menu Design

A modern, full-stack vegetarian restaurant menu and ordering system built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Tech Stack

### Frontend

- **React 18.3** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **NextJS** - Next-generation frontend build tool
- **Motion (Framer Motion)** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **React Hook Form** - Performant form management

### Backend & Database

- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **Node.js** - JavaScript runtime

### Development Tools

- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **SWC** - Super-fast TypeScript/JavaScript compiler
- **ESLint** - Code linting
- **TypeScript 5.7** - Static type checking

## 📁 Project Structure

```
Weekly Vegetarian Menu Design/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── figma/          # Figma-imported components
│   │   ├── AdminMenu.tsx   # Admin menu management
│   │   ├── AdminPortal.tsx # Admin dashboard
│   │   ├── CustomerMenu.tsx # Customer menu view
│   │   ├── CustomerView.tsx # Customer interface
│   │   ├── OrderingSystem.tsx # Order placement
│   │   ├── OrderManagement.tsx # Order tracking
│   │   └── WeeklyMenu.tsx  # Weekly menu display
│   ├── utils/              # Utility functions
│   │   └── supabase/       # Supabase configuration
│   ├── styles/             # Global styles
│   │   └── globals.css     # Tailwind base styles
│   ├── assets/             # Static assets (images, fonts)
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Main stylesheet
├── public/                 # Public static files
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Project dependencies
```

## 🛠️ Setup & Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Supabase Account** (for backend services)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd "Weekly Vegetarian Menu Design"
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Features

### Customer Features

- 📅 Weekly vegetarian menu display
- 🛒 Shopping cart functionality
- 📝 Order placement with delivery details
- 🎯 Category-based menu filtering
- 📱 Responsive mobile-first design
- 🎭 Smooth animations and transitions

### Admin Features (Access with `Ctrl+Shift+A`)

- 📋 Menu management (CRUD operations)
- 📦 Order management and tracking
- 🎨 Real-time updates with Supabase
- 📊 Order status management

## 🎨 Tailwind CSS Usage

This project uses Tailwind CSS for styling with a custom configuration:

- **Custom Colors**: Theme colors defined in `globals.css` using CSS variables
- **Dark Mode**: Support for dark mode using class strategy
- **Custom Animations**: Accordion, fade, and slide animations
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Component Library**: shadcn/ui components styled with Tailwind

### Example Tailwind Usage

```tsx
<div className="flex items-center justify-between rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-md transition-shadow hover:shadow-lg">
  <h2 className="text-2xl font-bold text-slate-900">Title</h2>
  <Button className="bg-primary hover:bg-primary/90">Click Me</Button>
</div>
```

## 🔧 Configuration Files

### `tailwind.config.js`

- Custom theme extensions
- Color system with CSS variables
- Custom animations and keyframes
- Component-specific utilities

### `vite.config.ts`

- React plugin with SWC
- Path aliases for cleaner imports
- Asset handling for Figma imports

### `tsconfig.json`

- Strict TypeScript configuration
- Path aliases (@/ prefix)
- ES2020 target with modern features

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **2XL**: > 1400px

## 🎯 Key Technologies Explained

### Why Tailwind CSS?

- **Utility-first**: Rapid UI development with utility classes
- **Consistent Design**: Design system built into the framework
- **Responsive**: Mobile-first responsive design made easy
- **Performance**: Optimized bundle size with PurgeCSS
- **Customization**: Fully customizable through configuration

### Why React + TypeScript?

- **Type Safety**: Catch errors at compile-time
- **Better DX**: IntelliSense and autocompletion
- **Scalability**: Easy to maintain and scale
- **Modern Patterns**: Hooks, Context, and composition

### Why Vite?

- **Fast**: Lightning-fast HMR (Hot Module Replacement)
- **Modern**: ESM-based with optimized builds
- **Simple**: Minimal configuration required
- **Optimized**: Automatic code splitting and tree shaking

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### Environment Variables for Production

Make sure to set these in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📚 Scripts

```json
{
  "dev": "vite", // Start development server
  "build": "vite build", // Build for production
  "preview": "vite preview", // Preview production build locally
  "lint": "eslint src" // Lint code
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Figma Design**: [Weekly Vegetarian Menu Design](https://www.figma.com/design/W98fjLnkU0XySlDDs9XHEB/Weekly-Vegetarian-Menu-Design)
- **Supabase**: [https://supabase.com](https://supabase.com)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- **React**: [https://react.dev](https://react.dev)

## 💡 Tips

- Use `Ctrl+Shift+A` to access the admin portal
- Check browser console for any API errors
- Make sure Supabase credentials are correctly set in `.env`
- Run `npm install` if you encounter dependency issues

---

Made with ❤️ using React, TypeScript, Tailwind CSS, and Supabase
=======
# Weekly-Vegetarian-Menu-Design-main
>>>>>>> 30cedc3d26e80a8482ca1bdfb4b3cea0243e536f
