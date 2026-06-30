# WombCare Frontend 🌸

Welcome to the frontend repository for **WombCare**, a comprehensive lifestyle coaching platform tailored for individuals managing PCOD/PCOS. This application is built using Next.js (App Router), styled with Tailwind CSS, and integrated with Supabase, Sentry, Resend, and Razorpay.

---

## 🚀 Key Features

*   **PCOD/PCOS Lifestyle Coaching**: Guided support and modules tailored to managing symptoms and improving wellness.
*   **Hormonal Assessment Tool**: Interactive hormone checking/quiz to evaluate symptoms and offer custom coaching paths.
*   **Doctor Portal & Onboarding**: Dedicated registration workflows and marquee directories for specialized doctors.
*   **User Dashboard**: Clean and modern client dashboard offering progress tracking, diet plans, and period schedules.
*   **Admin Panel**: Admin interface for user management, doctor verification, and content publishing.
*   **Secure Payment Integration**: Seamless checkout via Razorpay.
*   **Newsletter & Emails**: Integrated communications powered by Resend.
*   **Error Monitoring**: Integrated crash reporting and debugging utilizing Sentry.

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Standalone Output)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with PostCSS
*   **Database Client**: [Supabase JS Client SDK](https://supabase.com/)
*   **Monitoring**: [@sentry/nextjs](https://sentry.io/)
*   **Payments**: [Razorpay SDK](https://razorpay.com/)
*   **Email Deliverability**: [Resend](https://resend.com/)
*   **Interactive Components**: Framer Motion, Tiptap WYSIWYG editor, Lucide React icons

---

## 📂 Project Structure

```bash
pcod-pcos-lifestyle-coaching-platform/
├── app/                              # Next.js App Router Pages
│   ├── about/                        # About page
│   ├── admin/                        # Admin Portal
│   ├── api/                          # Local API handlers & proxies
│   ├── blogs/                        # Blog directory & posts
│   ├── checkout/                     # Checkout & payments
│   ├── doctor/                       # Doctor dashboards
│   ├── hormonal-check/               # Hormonal assessment quiz
│   ├── join-wombcare/                # Booking and onboarding
│   ├── login/ / signup/              # Authentication routes
│   └── user/                         # User dashboard
├── components/                       # Shared UI Components
│   ├── admin/                        # Admin-specific components
│   ├── auth/                         # Authentication forms
│   ├── dashboard/                    # User dashboard components
│   ├── diet/                         # Diet planning UI
│   └── user/                         # User management UI
├── lib/                              # Shared utility libraries & Supabase configuration
├── public/                           # Static assets (images, icons, fonts)
└── tsconfig.json                     # TypeScript Configuration
```

---

## ⚙️ Configuration & Environment Variables

Create a `.env.local` file in the root directory to store your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Resend API Key
RESEND_API_KEY=your_resend_api_key

# Sentry Auth Token (used during builds)
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

### Backend Rewrite Configuration
This frontend automatically rewrites backend requests through `/api/admin-proxy/:path*` and `/api/public-proxy/:path*` to the deployed Google Cloud Run backend instance in Europe (configured in [next.config.ts](file:///Users/nitinkumar/Projects/wombcare-frontend/pcod-pcos-lifestyle-coaching-platform/next.config.ts)).

---

## 💻 Local Development

1.  **Clone the repository and install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the development server**:
    ```bash
    npm run dev
    ```
3.  **Build the application for production**:
    ```bash
    npm run build
    ```
4.  **Start the production server locally**:
    ```bash
    npm run start
    ```

---

## 🌐 Deployment on Vercel

The application is fully optimized for Vercel:
*   Automatically resolves dependencies across Linux and MacOS environments.
*   Enables automatic deployment, pull request previews, and source-map uploads to Sentry on production builds.

