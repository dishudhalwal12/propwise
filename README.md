# PropWise

PropWise is a Next.js 15 real-estate intelligence app for VC32 students, buyers, investors, and internal agency workflows.

## Quick start

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy your working Firebase env file into `.env.local`, or keep the local emulator values already present there.
4. Start Firebase locally with `npm run dev:emulators`.
5. Start the app with `npm run dev`.
6. Open `http://localhost:3000`.

## Local Firebase emulator mode

When `.env.local` is left on the local demo values, the app connects to:

- Firebase Auth emulator on `127.0.0.1:9099`
- Firestore emulator on `127.0.0.1:8080`
- Storage emulator on `127.0.0.1:9199`

The repo includes `scripts/firebase-emulators.sh`, which reuses the local JDK installed at `~/.local/propwise/jdk-21` when present so Firestore can start reliably on a fresh shell.

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
