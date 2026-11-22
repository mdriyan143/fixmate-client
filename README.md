# FixMate — Client

FixMate is a full-stack, role-based device and home-appliance repair booking platform. This repository contains the **Next.js frontend** for customers, technicians, and administrators.

Customers can discover approved repair services, submit repair requests, follow job progress, pay after completion, review paid jobs, and download invoices. Technicians manage services and repair requests, while administrators manage users, approve services, and monitor bookings and transactions.

## Live Application

- **Live site:** https://fixmate-client-mdriyan143.vercel.app
- **Backend API:** https://fixmate-server-pi.vercel.app


## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- BetterAuth (MongoDB adapter, JWT, optional Google sign-in)
- Tailwind CSS 4
- Radix UI / shadcn UI components
- Recharts
- Sonner
- Lucide React and React Icons
- jsPDF
- MongoDB Node.js driver

## Main Features

### Public Website
- Responsive home page with hero section, featured services, repair categories, and workflow explanation.
- Browse approved and available services.
- Server-side search by service title/category, category and service-mode filters, sorting, and pagination.
- Service details with technician information and ratings.
- Customer-only repair request form.
- About / How It Works page.
- Responsive navigation, footer, loading states, custom not-found page, and error page.
- Light/dark theme toggle.

### Authentication and Authorization
- Email/password registration and sign-in with BetterAuth.
- Customer and Technician role selection; Admin is not selectable during public registration.
- Optional Google sign-in when Google OAuth credentials are configured.
- Role-based dashboard routing and protected dashboard pages.
- JWT token retrieval for authenticated requests to the Express API.
- Profile update for name, phone, area, bio, and profile photo.

### Customer Dashboard
- Overview statistics and booking status visualization.
- View bookings and track job status.
- Cancel a booking while it is still requested.
- Pay for completed, unpaid jobs through Stripe Checkout.
- View payment history, submit a rating/review for a paid booking, and download a PDF invoice.

### Technician Dashboard
- Add, edit, delete, and manage availability of repair services.
- New and edited services are submitted for admin approval.
- View and manage repair requests: accept, reject, start work, and complete jobs with a final amount.

### Admin Dashboard
- View platform statistics.
- Manage users and roles.
- Approve or reject technician services.
- Monitor all bookings and filter by status.
- View transactions and platform revenue.

## Demo Accounts

The server repository's `seed.js` creates the following demo accounts. The seed script uses the same password for all four accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fixmate.com` | `Fixmate123` |
| Technician | `rafiq@fixmate.com` | `Fixmate123` |
| Technician | `sabbir@fixmate.com` | `Fixmate123` |
| Customer | `customer@fixmate.com` | `Fixmate123` |

These credentials are valid only after the server seed process has completed successfully and the accounts exist in the connected database. Change demo credentials before using a production database.

## Environment Variables

Create a `.env.local` file in the root of this client project. Do not commit it.

```env
# MongoDB connection used by BetterAuth
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=fixmate

# BetterAuth
BETTER_AUTH_SECRET=replace_with_a_long_random_secret_at_least_32_characters
BETTER_AUTH_URL=http://localhost:3000
TRUSTED_ORIGINS=http://localhost:3000

# Express API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Image upload (used by the Next.js upload route)
IMGBB_KEY=your_imgbb_api_key

# Optional Google OAuth (configure both values to enable Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

For production, update `BETTER_AUTH_URL`, `TRUSTED_ORIGINS`, and `NEXT_PUBLIC_API_URL` to the correct deployed origins. Add the frontend production origin to BetterAuth trusted origins and the backend CORS allowlist.

## Installation and Run

**Requirements:** Node.js (LTS recommended), npm, MongoDB, and a running FixMate Express server.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

## Related Repository

The Express API and database operations are maintained in the [FixMate Server repository](YOUR-SERVER-GITHUB-REPOSITORY-URL).

## Project Structure

```text
app/
  (public)/        Public pages: home, services, about, auth, payment
  api/             BetterAuth handler and image upload endpoint
  dashboard/       Customer, Technician, and Admin dashboards
components/        Shared UI, navigation, service cards, dashboard widgets
lib/               Authentication, API client, types, utilities, uploads
```

## Notes

- Stripe uses test mode for the assignment workflow.
- Never expose private credentials in client-side code or commit `.env.local`.
- The frontend expects the Express API to be reachable through `NEXT_PUBLIC_API_URL`.
