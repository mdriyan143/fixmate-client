# FixMate

## Purpose
FixMate is an on-demand device and home appliance repair booking platform. Verified technicians list repair services, customers send repair requests and track each job step by step, and they pay online only after the job is completed. Admins approve services, manage users and monitor all jobs and payments.

This is the **client** (Next.js). The API is in the server repo.

## Live URL and Repositories
| | |
|---|---|
| Live site | https://fixmate-client-mdriyan143.vercel.app |
| Live API | https://fixmate-server-pi.vercel.app |
| Client repo | https://github.com/mdriyan143/fixmate-client |
| Server repo | https://github.com/mdriyan143/fixmate-server |

## Credentials
Password for all accounts: `Fixmate123`

| Role | Email |
|---|---|
| Admin | admin@fixmate.com |
| Technician | rafiq@fixmate.com |
| Technician | sabbir@fixmate.com |
| Customer | customer@fixmate.com |

## Key Features

**Public**
- Hero, 6 latest services, how it works, popular categories, why choose us
- Server-side search, category and mode filter, sort and pagination on `/services` (filters stay after reload)
- Service details with technician info and ratings
- Customer-only repair request form
- About page, light and dark theme

**Authentication**
- BetterAuth email/password sign up and sign in, optional Google login
- Customer or Technician role at sign up (admin can't be chosen)
- Redirect back to the page the user wanted after sign in
- Protected dashboards using `proxy.ts` plus a role check in the dashboard layout

**Customer**
- Overview stats and chart
- My Bookings: cancel while requested, Pay Now when completed and unpaid, status tracker
- Payment history, rating and review, PDF invoice

**Technician**
- Add service with ImgBB image upload
- My Services: edit (goes back to pending), delete, availability switch
- Manage Requests: accept, reject, start work, complete with final amount, status filter

**Admin**
- Overview stats and charts
- Manage users and roles (can't change own role)
- Service approval, all bookings with filter, transactions with total revenue

**Shared**
- Update profile with photo (name and photo update in navbar without logout)
- Toasts, confirmation modals, empty states, loading pages, custom 404 and error pages

## Stripe Test (test mode)
1. Sign in as `customer@fixmate.com`.
2. Open **My Bookings**, find a booking that is `Completed` and `Unpaid`.
3. Click **Pay Now** and pay on Stripe Checkout.
4. You land on `/payment/success` with the amount and transaction ID. The booking becomes `Paid` and shows in Payment History.

| Card number | Result |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 0002` | Card is declined |
| `4000 0025 0000 3155` | Asks for 3D Secure |

Use any future expiry (like `12/34`), any 3-digit CVC and any ZIP. Cancelling on Stripe goes to `/payment/cancel` and changes nothing.

To test with a new job: sign in as a technician, move a request through Accept, Start Work and Mark Completed (enter the final amount), then pay as the customer.


## Tech Stack
| Area | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling and UI | Tailwind CSS 4, shadcn/ui (Radix UI), Lucide and React Icons |
| Authentication | BetterAuth (MongoDB adapter, JWT, optional Google login) |
| Charts and extras | Recharts, Sonner (toasts), jsPDF (invoice) |
| Payment | Stripe Checkout (test mode), started from the server API |
| Media | ImgBB API (image upload) |
| Hosting | Vercel |


## npm Packages
| Package | Used for |
|---|---|
| next, react, react-dom | App Router frontend |
| typescript | Types |
| tailwindcss, @tailwindcss/turbopack, tw-animate-css | Styling |
| better-auth | Auth, MongoDB adapter, JWT, Google login |
| mongodb | Database driver for BetterAuth |
| radix-ui, shadcn, class-variance-authority, cn | UI components |
| lucide-react, react-icons | Icons |
| recharts | Dashboard charts |
| sonner | Toast notifications |
| jspdf | PDF invoice |

## Environment Variables
Create `.env.local` (never commit it):

```env
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=fixmate
BETTER_AUTH_SECRET=a_long_random_string_32_chars_or_more
BETTER_AUTH_URL=http://localhost:3000
TRUSTED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
IMGBB_KEY=your_imgbb_api_key
# optional, enables Google login
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

For production, set `BETTER_AUTH_URL` and `TRUSTED_ORIGINS` to the live site, and `NEXT_PUBLIC_API_URL` to the live API.

## Run Locally
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```
Start the server repo first so the API is available.

## Folder Structure
```text
app/
  (public)/    home, services, about, sign-in, sign-up, payment
  dashboard/   customer, technician, admin, profile
  api/         BetterAuth handler, ImgBB upload
components/    navbar, footer, cards, modals, charts
lib/           auth, api client, types, constants
proxy.ts       redirects logged-out users to /sign-in
```