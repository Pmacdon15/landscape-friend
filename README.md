# Lawn Buddy

## Project Description

Lawn Buddy is a comprehensive SaaS (Software as a Service) platform designed to empower landscapers and lawn care businesses. It provides a streamlined solution for managing and tracking all aspects of lawn maintenance and snow clearing operations. From scheduling services to sending professional emails and invoices, Lawn Buddy aims to simplify daily workflows and enhance client communication.

## Key Features

*   **Client Management:** Efficiently manage client information and service history.
*   **Service Scheduling:** Schedule and track lawn maintenance and snow clearing jobs with ease.
*   **Job Tracking:** Monitor the status and progress of ongoing and completed services.
*   **Email Communication:** Send automated or custom emails to clients for updates, confirmations, and marketing.
*   **Invoicing:** Generate and send professional invoices for completed services.
*   **Geocoding & Mapping:** Utilize Google Maps API for location-based services and route optimization.

## Tech Stack

Lawn Buddy is built with a modern, robust, and scalable technology stack, leveraging the power of Vercel's ecosystem:

*   **Platform:** [Vercel](https://vercel.com/)
*   **Database:** [Neon (Serverless PostgreSQL)](https://vercel.com/integrations/neon)
*   **Authentication:** [Clerk](https://vercel.com/integrations/clerk)
*   **Email Service:** [Resend](https://vercel.com/integrations/resend)
*   **File Storage:** Vercel Blobs
*   **Mapping:** Google Maps API
*   **Framework:** Next.js (with a strong emphasis on Server-Side Rendering)

## Architecture Highlights

Lawn Buddy is architected for performance and efficiency, prioritizing Server-Side Rendering (SSR) to deliver a fast and responsive user experience.

*   **Server-Side Rendering (SSR):** The application heavily utilizes SSR, ensuring that most of the page content is rendered on the server before being sent to the client. This improves initial page load times and SEO.
*   **Server-First Data Fetching:** All critical data fetches are initiated on the server during page load. This data is then efficiently passed down to either Server Components or Client Components, minimizing client-side data fetching and improving perceived performance.
*   **Minimal Client Components:** To maintain a lean client-side bundle and maximize SSR benefits, client components are used sparingly and only when interactive client-side functionality is strictly necessary.

## Getting Started

To set up and run Lawn Buddy locally, you'll need to configure several services.

### 1. Service Sign-ups & API Keys

Lawn Buddy relies on external services for its core functionality. You will need to sign up for accounts and obtain API keys for the following:

*   **Neon (PostgreSQL Database):**
    *   Sign up via the [Vercel Marketplace](https://vercel.com/integrations/neon) for seamless integration.
*   **Clerk (Authentication):**
    *   Integrate directly through the [Vercel Marketplace](https://vercel.com/integrations/clerk) for easy setup and environment variable management.
*   **Resend (Email Service):**
    *   Get started via the [Vercel Marketplace](https://vercel.com/integrations/resend) to handle all email communications.
*   **Google Maps API:**
    *   Obtain an API key from the [Google Cloud Console](https://console.cloud.com/google/maps-apis/overview). Enable the necessary APIs (e.g., Geocoding API, Maps JavaScript API).
*   **Vercel Blobs:**
    *   Vercel Blobs are typically managed within your Vercel project settings.
*   **Inngest (Serverless Functions/Event Platform):**
    *   Sign up for an account directly on the [Inngest website](https://www.inngest.com/). While not available on the Vercel Marketplace, Inngest integrates seamlessly with Vercel deployments.

### 2. Environment Variables

Create a `.env.local` file in the root of your project and populate it with the API keys and connection strings obtained from the services above. A typical `.env.local` might look like this (variable names may vary slightly based on specific library configurations):

```
DATABASE_URL="your_neon_connection_string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
RESEND_API_KEY="your_resend_api_key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

### 3. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Pmacdon15/lawn-buddy.git
cd lawn-buddy
npm install # or yarn install or bun install
```

### 4. Database Setup

If you're using Neon, you'll typically manage your database schema through migrations. Refer to your project's `SQL/schema.sql` file for the initial database structure. You might use a tool like `psql` or a database client to apply this schema to your Neon database.

### 5. Running the Project

Once dependencies are installed and environment variables are set, you can run the development server:

```bash
npm run dev # or yarn dev or bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.