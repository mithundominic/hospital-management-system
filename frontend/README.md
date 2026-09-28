# Hospital Management System - Frontend

A modern, responsive React + TypeScript frontend for the Hospital Management System with comprehensive features for hospital operations.

## 🚀 Features

### ✅ Core Functionality
- **Authentication** - Secure login with Supabase Auth
- **Multi-tenant** - Hospital selector for staff with multiple memberships
- **Role-based UI** - Navigation and features adapt to user permissions
- **Real-time data** - React Query for efficient data fetching and caching

### 📱 Pages & Modules

#### Dashboard
- Overview statistics (patients, appointments, beds, revenue)
- Weekly revenue chart (bar chart)
- Today's appointments timeline (line chart)
- Recent activity feed
- Alerts panel (low stock, pending bills, bed availability)

#### Patient Management
- Patient registration with MRN
- Search by name, MRN, or phone
- Patient demographics (age, gender, blood group)
- Patient detail view with encounters, lab results, prescriptions
- Quick actions (book appointment, create encounter, view billing)

#### Appointments
- Date-based appointment view
- Timeline display with time slots
- Status badges (scheduled, completed, cancelled, no-show)
- Patient and doctor information
- Appointment booking

#### Clinical Encounters
- OPD/Emergency/IPD encounter types
- Chief complaint and diagnosis tracking
- Vitals documentation
- Prescription creation
- Encounter history

#### Lab Orders
- Test ordering and tracking
- Status workflow (ordered → in-progress → completed → cancelled)
- Result entry for lab technicians
- Order queue management

#### Pharmacy & Inventory
- Medicine stock management
- Low stock alerts
- Stock level indicators
- Transaction ledger (purchases, dispensing, adjustments)
- Reorder level monitoring
- Real-time stock value calculation

#### Billing & Invoicing
- GST-aware invoice generation
- Invoice status tracking (draft, pending, paid, overdue)
- Payment recording
- Invoice line items
- Balance calculation
- Due date management

#### Insurance Management
- Policy management (cashless/reimbursement)
- Claim submission and tracking
- Status workflow (draft → submitted → pre-authorized → approved/rejected → settled)
- Claim amount vs approved amount tracking
- TPA integration ready

#### IPD Management
- Bed inventory and status (available, occupied, maintenance)
- Admission tracking
- Ward management
- Bed occupancy percentage
- Active admission monitoring
- Discharge workflow

#### Staff Management
- Staff invitation and onboarding
- Role assignment (9 roles supported)
- Status management (active/inactive)
- Contact information
- Role-based cards with color coding

#### Staff Shifts
- Weekly schedule view
- Shift creation and assignment
- Calendar-based display
- Shift timing (start/end)
- Staff roster visibility

#### Reports & Analytics
- Bed occupancy pie chart
- Daily revenue bar chart (last 7 days)
- Low stock alerts table
- Key performance indicators
- Export functionality (ready for implementation)

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: 
  - Zustand (lightweight state)
  - React Query (server state)
  - Context API (auth & hospital)
- **Data Fetching**: TanStack React Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast
- **Authentication**: Supabase Auth
- **Backend API**: RESTful API with JWT authentication

## 📦 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── layout/          # Layout components
│   │       ├── Header.tsx
│   │       ├── MainLayout.tsx
│   │       └── Sidebar.tsx
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── HospitalContext.tsx
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts          # API client wrapper
│   │   └── supabase.ts     # Supabase client
│   ├── pages/              # Page components
│   │   ├── appointments/
│   │   ├── auth/
│   │   ├── billing/
│   │   ├── encounters/
│   │   ├── insurance/
│   │   ├── ipd/
│   │   ├── lab/
│   │   ├── patients/
│   │   ├── pharmacy/
│   │   ├── reports/
│   │   ├── shifts/
│   │   ├── staff/
│   │   └── DashboardPage.tsx
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
```bash
cd hospital-saas/hospital-saas/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:3000
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication Setup

1. **Create a Supabase project** at https://supabase.com
2. **Get your credentials** from Settings → API
3. **Create a test user** in Authentication → Users
4. **Create hospital record** in your database
5. **Create membership** linking user to hospital with a role

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... customize all shades
        900: '#1e3a8a',
      },
    },
  },
}
```

### Logo & Branding

- Update hospital name in `src/components/layout/Sidebar.tsx`
- Replace icon in login page `src/pages/auth/LoginPage.tsx`
- Modify `index.html` title and meta tags

## 📡 API Integration

The frontend communicates with the backend via a REST API. The API client in `src/lib/api.ts` handles:

- **Authentication**: Automatic JWT token injection
- **Error handling**: Standardized error responses
- **Response formatting**: Unwraps `{ data, error }` envelope

### Example API Call

```typescript
import { api } from '@/lib/api'

// GET request
const patients = await api.get('/hospitals/123/patients')

// POST request
const newPatient = await api.post('/hospitals/123/patients', {
  full_name: 'John Doe',
  dob: '1990-01-01',
  gender: 'Male',
  phone: '+919876543210',
  hospital_patient_number: 'MRN001234'
})

// PATCH request
const updated = await api.patch('/hospitals/123/patients/456', {
  phone: '+919876543211'
})
```

## 🧪 Development Tips

### Hot Reload

Vite provides instant HMR (Hot Module Replacement). Changes appear immediately without full page reload.

### Browser DevTools

- React Query Devtools are included in development mode
- Press `Ctrl/Cmd + Shift + I` to open browser devtools
- Use React DevTools extension for component inspection

### TypeScript

The project uses strict TypeScript. Type errors will show in your editor and during build.

### Path Aliases

Import using `@/` alias instead of relative paths:

```typescript
// ✅ Good
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

// ❌ Avoid
import { api } from '../../../lib/api'
```

## 📱 Responsive Design

All pages are fully responsive:
- **Mobile**: Stack layouts, hamburger menu
- **Tablet**: Two-column layouts
- **Desktop**: Full sidebar navigation, multi-column dashboards

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🔒 Security

- JWT tokens stored in Supabase session (httpOnly)
- No sensitive data in localStorage
- API calls require valid authentication
- Row-level security enforced by backend
- XSS protection via React's built-in escaping
- CSRF protection through JWT-based auth

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

- Ensure `.env` file exists in the frontend directory
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after changing `.env`

### "API Error: Network request failed"

- Check backend is running on `http://localhost:3000`
- Verify `VITE_API_URL` in `.env` matches backend URL
- Check browser console for CORS errors

### "Not authenticated" errors

- Ensure you're logged in
- Check Supabase session hasn't expired
- Try logging out and back in

### Charts not rendering

- Ensure `recharts` is installed: `npm install recharts`
- Check browser console for errors
- Verify data format matches chart expectations

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)
- [Recharts Documentation](https://recharts.org)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure TypeScript compiles without errors
4. Test in development mode
5. Build for production and test
6. Submit pull request

## 📄 License

This project is part of the Hospital Management System. See root LICENSE file.

---

**Ready to start!** Run `npm run dev` and open http://localhost:5173
