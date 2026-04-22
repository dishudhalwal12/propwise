"use client";

import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? ""
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const isFirebaseConfigured = missingKeys.length === 0;
const useFirebaseEmulators =
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" ||
  (!isFirebaseConfigured && process.env.NODE_ENV !== "production");

if (!isFirebaseConfigured) {
  console.warn(
    `Firebase public config missing: ${missingKeys.join(", ")}. Running in local demo mode with fallback Firebase app config.`
  );
}

const resolvedFirebaseConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: "demo-api-key",
      authDomain: "demo.local",
      projectId: "demo-propwise",
      storageBucket: "demo-propwise.appspot.com",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:demo"
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
