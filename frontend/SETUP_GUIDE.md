# Frontend Setup Guide

Complete step-by-step guide to get the Hospital Management System frontend up and running.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account created
- [ ] Backend API running (port 3000)
- [ ] Code editor (VS Code recommended)

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

**Expected output**: ~80 packages installed, 0 vulnerabilities

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Open `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3000
```

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy **Project URL** → `VITE_SUPABASE_URL`
4. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.4.8  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Open Application

Open http://localhost:5173 in your browser.

✅ **Success!** You should see the login page.

---

## 🔐 Create Your First Login

### Option A: Using Supabase Dashboard

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: `admin@hospital.com`
   - Password: `Admin@123456`
4. Click **Create user**

### Option B: Using SQL (Advanced)

If you have SQL access:

```sql
-- Insert test user (get user_id from Supabase Auth)
-- Insert test hospital
INSERT INTO public.hospitals (name, registration_number, address, phone, email)
VALUES ('Test Hospital', 'HOSP001', '123 Main St', '+919876543210', 'info@test.com')
RETURNING id;

-- Create membership (replace USER_ID and HOSPITAL_ID)
INSERT INTO public.memberships (user_id, hospital_id, role_id, status)
VALUES (
  'USER_ID_FROM_AUTH',
  'HOSPITAL_ID_FROM_ABOVE',
  (SELECT id FROM roles WHERE name = 'HospitalAdmin'),
  'active'
);
```

---

## 🎯 First Login Steps

1. **Navigate to login page**: http://localhost:5173/login
2. **Enter credentials**:
   - Email: `admin@hospital.com`
   - Password: `Admin@123456`
3. **Click Sign in**

✅ You should be redirected to the dashboard!

---

## 📁 Project Structure Explained

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Generic components (LoadingSpinner, ErrorBoundary)
│   │   └── layout/       # Layout components (Header, Sidebar, MainLayout)
│   │
│   ├── contexts/         # React Context providers
│   │   ├── AuthContext.tsx      # User authentication state
│   │   └── HospitalContext.tsx  # Current hospital state
│   │
│   ├── lib/              # Utility libraries
│   │   ├── api.ts        # API client (wraps fetch with auth)
│   │   └── supabase.ts   # Supabase client configuration
│   │
│   ├── pages/            # Page components (one per route)
│   │   ├── auth/         # Login page
│   │   ├── patients/     # Patient management
│   │   ├── appointments/ # Appointment scheduling
│   │   ├── encounters/   # Clinical encounters
│   │   ├── lab/          # Lab orders
│   │   ├── pharmacy/     # Pharmacy & inventory
│   │   ├── billing/      # Invoicing
│   │   ├── insurance/    # Insurance claims
│   │   ├── ipd/          # IPD management
│   │   ├── staff/        # Staff management
│   │   ├── shifts/       # Shift scheduling
│   │   ├── reports/      # Analytics & reports
│   │   └── DashboardPage.tsx  # Main dashboard
│   │
│   ├── App.tsx           # Root component with routing
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global Tailwind styles
│
├── public/               # Static assets
├── .env.example          # Environment template
├── package.json          # Dependencies & scripts
├── tailwind.config.js    # Tailwind configuration
├── vite.config.ts        # Vite build configuration
└── tsconfig.json         # TypeScript configuration
```

---

## 🛠️ Available NPM Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload (port 5173)

# Production
npm run build        # Build for production (output: dist/)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
```

---

## 🌐 Pages & Features

Once logged in, you'll have access to:

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/` | Overview with stats, charts, recent activity |
| **Patients** | `/patients` | Patient registration & records |
| **Appointments** | `/appointments` | Appointment scheduling |
| **Encounters** | `/encounters` | Clinical visit documentation |
| **Lab Orders** | `/lab` | Lab test ordering & results |
| **Pharmacy** | `/pharmacy` | Medicine inventory management |
| **Billing** | `/billing` | Invoice generation & payments |
| **Insurance** | `/insurance` | Insurance claim tracking |
| **IPD** | `/ipd` | Bed & admission management |
| **Staff** | `/staff` | Staff member management |
| **Shifts** | `/shifts` | Staff shift scheduling |
| **Reports** | `/reports` | Analytics & insights |

---

## 🎨 Customization

### Change Hospital Name

Edit `src/components/layout/Sidebar.tsx`:

```typescript
<div>
  <h1 className="text-xl font-bold text-gray-900">Your Hospital Name</h1>
  <p className="text-xs text-gray-500">Hospital Management</p>
</div>
```

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
        // ...
      },
    },
  },
}
```

### Change Port

Edit `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change from 5173
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Missing Supabase environment variables"

**Cause**: `.env` file not found or incomplete

**Solution**:
```bash
# Verify .env exists
ls -la .env

# Check content
cat .env

# Recreate if needed
cp .env.example .env
# Then edit .env with your actual values
```

### Issue: "Network request failed" / API errors

**Cause**: Backend not running or wrong URL

**Solution**:
```bash
# Check backend is running
# In backend directory:
npm run dev

# Verify API URL in .env matches backend
VITE_API_URL=http://localhost:3000  # Default backend port
```

### Issue: "Invalid or expired token"

**Cause**: Supabase session expired

**Solution**:
1. Log out
2. Log back in
3. If persists, clear browser localStorage:
   - Open DevTools (F12)
   - Application → Storage → Clear site data

### Issue: Charts not displaying

**Cause**: Missing recharts package

**Solution**:
```bash
npm install recharts
npm run dev
```

### Issue: TypeScript errors in editor

**Cause**: IDE needs to reload TypeScript

**Solution**:
- **VS Code**: Press `Ctrl/Cmd + Shift + P` → "TypeScript: Restart TS Server"
- **Other editors**: Restart editor

### Issue: "Cannot find module '@/...'"

**Cause**: Path alias not recognized

**Solution**:
- Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
- Restart dev server

---

## 🔍 Development Tips

### Hot Module Replacement (HMR)

Vite provides instant updates without full page reload. When you save a file, changes appear immediately.

### React Query DevTools

Available in development mode at bottom-right corner. Click to inspect:
- Active queries
- Cached data
- Query status
- Mutations

### Browser DevTools

**React DevTools Extension:**
- Install from Chrome/Firefox store
- Inspect component tree
- View props & state
- Profile performance

**Network Tab:**
- Monitor API calls
- Check request/response
- Debug authentication headers

### TypeScript Checking

TypeScript errors appear:
1. In your editor (real-time)
2. In terminal when running dev server
3. During build (`npm run build`)

---

## 📦 Adding New Dependencies

```bash
# Install package
npm install package-name

# Install dev dependency
npm install -D package-name

# Remove package
npm uninstall package-name
```

**Recommended packages already included:**
- ✅ React Router (routing)
- ✅ React Query (data fetching)
- ✅ Tailwind CSS (styling)
- ✅ Lucide React (icons)
- ✅ Recharts (charts)
- ✅ date-fns (date utilities)
- ✅ React Hot Toast (notifications)

---

## 🚀 Deploying to Production

### Build for Production

```bash
npm run build
```

Output: `dist/` directory with optimized files

### Preview Production Build

```bash
npm run preview
```

### Deploy Options

**Vercel** (Recommended):
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Netlify**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy
```

**Manual Deploy**:
1. Build: `npm run build`
2. Upload `dist/` folder to your hosting
3. Configure environment variables on host
4. Set up custom domain

### Environment Variables in Production

Configure these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (production backend URL)

---

## 📚 Learning Resources

- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Query**: https://tanstack.com/query/latest/docs
- **React Router**: https://reactrouter.com/en/main
- **Supabase**: https://supabase.com/docs

---

## ✅ Final Checklist

Before considering setup complete:

- [ ] Dependencies installed successfully
- [ ] `.env` configured with Supabase credentials
- [ ] Dev server running on port 5173
- [ ] Backend API running on port 3000
- [ ] Test user created in Supabase
- [ ] Hospital and membership records created
- [ ] Successfully logged in
- [ ] Dashboard loads with data
- [ ] Can navigate to different pages

---

## 🆘 Getting Help

If you're stuck:

1. **Check console**: Press F12, look for errors in Console tab
2. **Check network**: Network tab shows API call failures
3. **Check backend**: Ensure backend is running and migrations applied
4. **Check Supabase**: Verify credentials and user setup
5. **Restart everything**: Stop dev server, restart backend, restart frontend

---

**🎉 Congratulations!** Your frontend is now running. Start exploring the features!
