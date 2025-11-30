# 🚀 Quick Start Guide

## Prerequisites Check

Before you begin, ensure you have:

- ✅ Node.js v18 or higher installed
- ✅ npm, yarn, or pnpm package manager
- ✅ A Supabase account (free tier is fine)
- ✅ Git installed (optional)

---

## 📦 Installation (5 minutes)

### Step 1: Install Dependencies

Open your terminal in the project directory:

```bash
npm install
```

**What this does:**

- Installs React, TypeScript, Tailwind CSS
- Installs UI components (Radix UI)
- Installs development tools (Vite, PostCSS)

**Expected output:**

```
added 847 packages in 45s
```

---

### Step 2: Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` in your editor and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find Supabase credentials:**

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Click "Settings" → "API"
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**

```
  VITE v6.3.5  ready in 423 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open your browser to [http://localhost:5173](http://localhost:5173)

---

## 🎯 First Steps After Installation

### 1. Test the Customer View

- Browse the weekly menu
- Add items to cart
- Try placing an order (test mode)

### 2. Access Admin Portal

Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac) to open the admin portal

### 3. Verify Tailwind CSS

Open browser DevTools:

- Right-click any element → Inspect
- Check the `class` attribute
- You should see utility classes like `flex`, `bg-white`, `p-4`, etc.

---

## 🛠️ Development Workflow

### Hot Module Replacement (HMR)

Changes are reflected instantly without full page reload:

1. Edit any `.tsx` file in `src/components/`
2. Save the file
3. Browser updates automatically ⚡

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type-check TypeScript
npm run type-check

# Lint code (future)
npm run lint
```

---

## 📝 Your First Customization

### Change the Primary Color

1. Open `src/styles/globals.css`

2. Find the `:root` section:

```css
:root {
  --primary: 170 100% 15%; /* Current: Dark teal */
}
```

3. Change to a different color (HSL format):

```css
:root {
  --primary: 220 90% 50%; /* New: Blue */
}
```

4. Save and see the change instantly!

**Color examples:**

- Blue: `220 90% 50%`
- Purple: `270 70% 50%`
- Green: `140 70% 45%`
- Orange: `30 90% 55%`

---

## 🎨 Tailwind CSS in Action

### Example: Create a Custom Button

Open `src/components/CustomerView.tsx` and try this:

```tsx
<button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
  Beautiful Button ✨
</button>
```

**What these classes do:**

- `bg-gradient-to-r`: Gradient background (right direction)
- `from-blue-500 to-purple-600`: Gradient colors
- `text-white`: White text
- `px-6 py-3`: Padding (horizontal & vertical)
- `rounded-full`: Fully rounded corners
- `shadow-lg`: Large shadow
- `hover:shadow-xl`: Extra large shadow on hover
- `hover:scale-105`: Slightly larger on hover
- `transition-all duration-300`: Smooth 300ms transition

---

## 🐛 Troubleshooting

### Issue: Port 5173 already in use

**Solution:**

```bash
# Kill the process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use a different port:
npm run dev -- --port 3000
```

### Issue: Tailwind styles not showing

**Solution:**

1. Check if `tailwind.config.js` exists
2. Verify `postcss.config.js` exists
3. Restart the dev server:

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Issue: Supabase connection error

**Solution:**

1. Verify `.env` file exists (not `.env.example`)
2. Check credentials in Supabase dashboard
3. Ensure no extra spaces in `.env`:

```env
# ❌ Wrong (spaces around =)
VITE_SUPABASE_URL = https://example.supabase.co

# ✅ Correct (no spaces)
VITE_SUPABASE_URL=https://example.supabase.co
```

### Issue: TypeScript errors

**Solution:**

```bash
# Check for type errors
npm run type-check

# Common fix: Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learn More

### Tailwind CSS Basics

```tsx
{/* Layout */}
<div className="flex flex-col items-center justify-center">

{/* Spacing */}
<div className="p-4 m-2 space-y-4">

{/* Typography */}
<h1 className="text-2xl font-bold text-gray-900">

{/* Colors */}
<div className="bg-blue-500 text-white border-2 border-blue-700">

{/* Responsive */}
<div className="w-full md:w-1/2 lg:w-1/3">

{/* Hover & Focus */}
<button className="hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
```

### React Hooks Quick Reference

```tsx
// State
const [count, setCount] = useState(0);

// Effect (runs on mount and when count changes)
useEffect(() => {
  console.log("Count changed:", count);
}, [count]);

// Ref (access DOM element)
const inputRef = useRef<HTMLInputElement>(null);
```

### TypeScript Tips

```tsx
// Define component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

// Use in component
export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

---

## 🎓 Next Steps

1. ✅ **Complete this guide**
2. 📖 **Read `ARCHITECTURE.md`** for deep dive into tech stack
3. 🎨 **Customize the UI** with Tailwind
4. 📊 **Set up Supabase tables** (see ARCHITECTURE.md)
5. 🚀 **Deploy to Vercel/Netlify**

---

## 💡 Pro Tips

### VS Code Extensions

Install these for best experience:

- **Tailwind CSS IntelliSense**: Auto-complete for classes
- **Prettier**: Code formatting
- **ES7+ React/Redux/React-Native snippets**: Code snippets
- **Error Lens**: Inline error display

### Keyboard Shortcuts

- `Ctrl+Shift+A`: Open admin portal
- `Ctrl+S`: Save (with auto-format if Prettier is set up)
- `Ctrl+\``: Open terminal in VS Code
- `Ctrl+P`: Quick file search

### Tailwind IntelliSense

Start typing a class name:

```tsx
<div className="flex |
              ↑ cursor here
```

Press `Ctrl+Space` to see all available classes!

---

## 🎉 You're Ready!

You now have a fully functional modern web application with:

- ⚛️ React + TypeScript
- 🎨 Tailwind CSS
- ⚡ Vite (lightning fast)
- 🗄️ Supabase (backend)
- 📱 Responsive design
- ♿ Accessible components

**Happy coding!** 🚀

---

Need help? Check these resources:

- 📖 [README.md](./README.md) - Full documentation
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical deep dive
- 💬 [GitHub Issues](https://github.com/your-repo/issues) - Report bugs
- 🎓 [Tailwind Docs](https://tailwindcss.com/docs) - CSS reference
