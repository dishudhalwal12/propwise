"use client";

import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBCnaC7Q8EcASXbd3LYb5ycE7twOGVJeOI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "krishna-e9c59.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "krishna-e9c59",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "krishna-e9c59.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "1048468387337",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:1048468387337:web:3b4f2de61b34cabab02ad8"
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const isFirebaseConfigured = true; // Hard-coded fallback ensures it is always configured

// ONLY use emulators if EXPLICITLY set to "true"
const useFirebaseEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

if (!isFirebaseConfigured && !useFirebaseEmulators) {
  console.error(
    `Firebase configuration missing! Please check your .env.local for NEXT_PUBLIC_FIREBASE_* keys. Missing: ${missingKeys.join(", ")}`
  );
}

const resolvedFirebaseConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: "missing-api-key",
      authDomain: "missing-auth-domain",
      projectId: "missing-project-id",
      storageBucket: "missing-storage-bucket",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:missing"
    };

const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(resolvedFirebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

declare global {
  var __PROPWISE_FIREBASE_EMULATORS_CONNECTED__: boolean | undefined;
}

if (typeof window !== "undefined" && useFirebaseEmulators && !globalThis.__PROPWISE_FIREBASE_EMULATORS_CONNECTED__) {
  const authHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1";
  const authPort = Number(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT ?? "9099");
  const firestoreHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST ?? "127.0.0.1";
  const firestorePort = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT ?? "8080");
  const storageHost = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST ?? "127.0.0.1";
  const storagePort = Number(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT ?? "9199");

  connectAuthEmulator(auth, `http://${authHost}:${authPort}`, { disableWarnings: true });
  connectFirestoreEmulator(db, firestoreHost, firestorePort);
  connectStorageEmulator(storage, storageHost, storagePort);

  globalThis.__PROPWISE_FIREBASE_EMULATORS_CONNECTED__ = true;
}

export { isFirebaseConfigured };
export { useFirebaseEmulators };
export { app };
