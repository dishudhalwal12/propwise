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

  if (!serviceAccount) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp({
    credential: cert(serviceAccount)
  });
}

const adminApp: App | null = initAdminApp();
export const adminAuth = adminApp ? getAuth(adminApp) : null;
export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminEnabled = Boolean(adminAuth);
