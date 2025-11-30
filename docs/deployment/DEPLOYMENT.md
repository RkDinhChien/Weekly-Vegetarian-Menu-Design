# 🚀 Deployment Guide

Complete guide to deploy your Weekly Vegetarian Menu application to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build for Production](#build-for-production)
3. [Deploy to Vercel](#deploy-to-vercel)
4. [Deploy to Netlify](#deploy-to-netlify)
5. [Environment Variables](#environment-variables)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### 1. Test Production Build Locally

```bash
# Build the app
npm run build

# Preview the build
npm run preview
```

Visit `http://localhost:4173` and test:

- ✅ All pages load correctly
- ✅ Images display properly
- ✅ Supabase connection works
- ✅ Admin portal accessible (Ctrl+Shift+A)
- ✅ Orders can be placed
- ✅ No console errors

### 2. Environment Variables

Ensure `.env` has all required variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=Weekly Vegetarian Menu
VITE_APP_VERSION=1.0.0
```

### 3. Code Quality

```bash
# Type-check TypeScript
npm run type-check

# Lint code (if configured)
npm run lint
```

Fix any errors before deploying.

### 4. Supabase Setup

Ensure your Supabase project has:

- ✅ Database tables created
- ✅ Row Level Security (RLS) policies set
- ✅ Storage buckets configured
- ✅ API keys generated

---

## 🏗️ Build for Production

```bash
npm run build
```

**What happens:**

1. TypeScript compiled to JavaScript
2. React components bundled
3. Tailwind CSS purged (unused styles removed)
4. Assets optimized and minified
5. Output created in `dist/` folder

**Build output structure:**

```
dist/
├── assets/
│   ├── index-[hash].js      # Main JS bundle
│   ├── index-[hash].css     # Main CSS bundle
│   └── [images]             # Optimized images
└── index.html               # Entry HTML file
```

---

## 🔷 Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Choose your authentication method (GitHub, GitLab, email).

#### Step 3: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Prompts:**

- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → weekly-vegetarian-menu
- **Directory?** → `./` (current directory)
- **Override settings?** → No

#### Step 4: Set Environment Variables

```bash
# Add via CLI
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted
```

Or add via dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add each variable

#### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

---

### Method 2: GitHub Integration (Easiest)

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/weekly-vegetarian-menu.git
git push -u origin main
```

#### Step 2: Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

#### Step 3: Add Environment Variables

Before deploying, add environment variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
```

#### Step 4: Deploy

Click "Deploy" button. Vercel will:

1. Clone your repository
2. Install dependencies
3. Build the project
4. Deploy to production

**Deployment URL:**

```
https://weekly-vegetarian-menu.vercel.app
```

---

### Automatic Deployments

With GitHub integration, every push to `main` branch triggers a new deployment:

```bash
git add .
git commit -m "Update menu items"
git push origin main
```

Vercel automatically:

- Builds the new version
- Runs checks
- Deploys to production
- Updates your live site

---

## 🟢 Deploy to Netlify

### Method 1: Netlify CLI

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login

```bash
netlify login
```

#### Step 3: Build and Deploy

```bash
# Build the project
npm run build

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

**Prompts:**

- **Create new site?** → Yes
- **Team?** → Your team
- **Site name?** → weekly-vegetarian-menu
- **Publish directory?** → `dist`

#### Step 4: Set Environment Variables

```bash
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
```

---

### Method 2: Netlify Dashboard

#### Step 1: Build Locally

```bash
npm run build
```

#### Step 2: Deploy via Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `dist` folder
4. Your site is live!

#### Step 3: Add Environment Variables

1. Go to Site settings → Environment variables
2. Click "Add a variable"
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

#### Step 4: Trigger Rebuild

1. Go to Deploys tab
2. Click "Trigger deploy" → "Deploy site"

---

### Method 3: GitHub Integration

1. Push code to GitHub (see Vercel Method 2, Step 1)
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Choose Git provider (GitHub)
5. Select repository
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Add environment variables
8. Click "Deploy site"

**Deployment URL:**

```
https://weekly-vegetarian-menu.netlify.app
```

---

## 🔐 Environment Variables

### Required Variables

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application (Optional)
VITE_APP_NAME=Weekly Vegetarian Menu
VITE_APP_VERSION=1.0.0
```

### Setting Variables on Vercel

**Via CLI:**

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

**Via Dashboard:**

1. Project Settings → Environment Variables
2. Add each variable
3. Select environments (Production, Preview, Development)
4. Save

### Setting Variables on Netlify

**Via CLI:**

```bash
netlify env:set VITE_SUPABASE_URL "your-value"
```

**Via Dashboard:**

1. Site settings → Environment variables
2. Add variable
3. Save

---

## 🌐 Custom Domain Setup

### On Vercel

#### Step 1: Add Domain

1. Project → Settings → Domains
2. Enter your domain (e.g., `vegmenu.com`)
3. Click "Add"

#### Step 2: Configure DNS

Add these DNS records at your domain registrar:

**For root domain:**

```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Step 3: Verify

Wait 24-48 hours for DNS propagation. Vercel will automatically provision SSL certificate.

---

### On Netlify

#### Step 1: Add Domain

1. Site settings → Domain management
2. Click "Add custom domain"
3. Enter domain name
4. Click "Verify"

#### Step 2: Configure DNS

**Option A: Use Netlify DNS (Recommended)**

1. Click "Set up Netlify DNS"
2. Update nameservers at your registrar:
   ```
   dns1.p03.nsone.net
   dns2.p03.nsone.net
   dns3.p03.nsone.net
   dns4.p03.nsone.net
   ```

**Option B: External DNS**
Add these records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

---

## ✨ Post-Deployment

### 1. Test Production Site

Visit your deployment URL and verify:

- ✅ All pages load
- ✅ Supabase connection works
- ✅ Images display correctly
- ✅ Forms submit successfully
- ✅ Admin portal accessible
- ✅ Mobile responsiveness

### 2. Monitor Performance

**Vercel Analytics:**

1. Enable in Project Settings → Analytics
2. View real-time metrics

**Netlify Analytics:**

1. Enable in Site settings → Analytics
2. View visitor statistics

### 3. Set Up Monitoring

**Error Tracking (Optional):**

- [Sentry](https://sentry.io) for error monitoring
- [LogRocket](https://logrocket.com) for session replay

**Uptime Monitoring:**

- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://www.pingdom.com)

### 4. SEO Optimization

Add to `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO Meta Tags -->
  <meta name="description" content="Weekly vegetarian menu with delicious plant-based dishes" />
  <meta name="keywords" content="vegetarian, menu, food, healthy, plant-based" />
  <meta name="author" content="Your Name" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://vegmenu.com/" />
  <meta property="og:title" content="Weekly Vegetarian Menu" />
  <meta property="og:description" content="Delicious vegetarian dishes every week" />
  <meta property="og:image" content="https://vegmenu.com/og-image.jpg" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://vegmenu.com/" />
  <meta property="twitter:title" content="Weekly Vegetarian Menu" />
  <meta property="twitter:description" content="Delicious vegetarian dishes every week" />
  <meta property="twitter:image" content="https://vegmenu.com/og-image.jpg" />

  <title>Weekly Vegetarian Menu</title>
</head>
```

### 5. Create `robots.txt`

Create `public/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://vegmenu.com/sitemap.xml
```

---

## 🔧 Troubleshooting

### Issue: Build Fails

**Error:** `Module not found` or `Cannot resolve`

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

---

### Issue: Environment Variables Not Working

**Error:** Supabase connection fails in production

**Solution:**

1. Ensure variables start with `VITE_`
2. Check spelling (case-sensitive)
3. Verify values in hosting dashboard
4. Redeploy after adding variables

---

### Issue: 404 on Routes

**Problem:** Direct URL navigation returns 404

**Solution for Vercel:**
Create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Solution for Netlify:**
Create `public/_redirects`:

```
/*    /index.html   200
```

---

### Issue: Slow Load Times

**Solutions:**

1. Enable compression (usually automatic on Vercel/Netlify)
2. Optimize images:
   ```bash
   npm install -D vite-plugin-imagemin
   ```
3. Code splitting (Vite does this automatically)
4. Use CDN for assets

---

### Issue: SSL Certificate Error

**Solution:**

1. Wait 24-48 hours for DNS propagation
2. Check DNS records are correct
3. Try forcing SSL renewal (in hosting dashboard)

---

## 📊 Performance Optimization

### 1. Image Optimization

Convert images to WebP:

```bash
npm install -D @vitejs/plugin-image-optimizer
```

Update `vite.config.ts`:

```typescript
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [react(), imagetools()],
});
```

### 2. Lazy Loading

```tsx
import { lazy, Suspense } from "react";

const AdminPortal = lazy(() => import("./components/AdminPortal"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPortal />
    </Suspense>
  );
}
```

### 3. Enable Caching

**Vercel:** Automatic caching for static assets

**Netlify:** Add `netlify.toml`:

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🎉 Success!

Your application is now live at:

- **Vercel:** `https://your-project.vercel.app`
- **Netlify:** `https://your-project.netlify.app`
- **Custom Domain:** `https://yourdomain.com`

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

Made with ❤️ for the Weekly Vegetarian Menu Project
