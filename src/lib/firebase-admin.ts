import "server-only";

import {
  App,
  cert,
  getApp,
  getApps,
  initializeApp
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function readServiceAccount() {
  const inline = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
  if (inline) {
    return JSON.parse(inline);
  }

  if (
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    };
  }

  return null;
}

function initAdminApp() {
  const serviceAccount = readServiceAccount();
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    "demo-propwise";
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? `${projectId}.appspot.com`;
  const isUsingEmulators = Boolean(
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
      process.env.FIRESTORE_EMULATOR_HOST ||
      process.env.FIREBASE_STORAGE_EMULATOR_HOST
  );

  if (!process.env.GOOGLE_CLOUD_PROJECT) {
    process.env.GOOGLE_CLOUD_PROJECT = projectId;
  }

  if (!process.env.GCLOUD_PROJECT) {
    process.env.GCLOUD_PROJECT = projectId;
  }

  if (!process.env.FIREBASE_CONFIG) {
    process.env.FIREBASE_CONFIG = JSON.stringify({
      projectId,
      storageBucket
    });
  }

  if (!serviceAccount && !isUsingEmulators) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount)
    });
  }

  return initializeApp({
    projectId
  });
}

const adminApp: App | null = initAdminApp();
export const adminAuth = adminApp ? getAuth(adminApp) : null;
export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminEnabled = Boolean(adminAuth);
