# PropWise

PropWise is a Next.js 15 real-estate intelligence app for VC32 students, buyers, investors, and internal agency workflows.

## Quick start

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy your working Firebase env file into `.env.local`.
4. Start the app with `npm run dev`.
5. Open `http://localhost:3000`.

## Required setup

The app will not boot without the public Firebase keys below:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

You can use [.env.example](/Users/divyanshusaini/Downloads/Propwise/.env.example) as the template.

## Optional server-side admin setup

For secure server-verified sessions, add Firebase Admin credentials through one of these options:

- `FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON`
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY`

If those admin values are not present, the app still runs using the client-auth fallback that is already built into the project.

## Recommended local environment

- Node.js 20 or 22 LTS
- npm 10+

## Verification

These commands pass in the current repo when the Firebase env is present:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
