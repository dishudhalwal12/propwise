"use client";

import {
  addDoc,
  collection,
  documentId,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  QueryConstraint,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";

import { normalizeSnapshot, stripUndefined } from "@/lib/firestore/base";
import { db, storage } from "@/lib/firebase";
import { Property, PropertyFormInput, PropertyQueryOptions } from "@/types/property";

const propertiesCollection = collection(db, "properties");

export async function getProperties(options?: PropertyQueryOptions) {
  const constraints: QueryConstraint[] = [];

  if (options?.status && options.status !== "all") {
    constraints.push(where("status", "==", options.status));
  }

  if (!options?.status && options?.ids?.length && options.ids.length <= 10) {
    constraints.push(where(documentId(), "in", options.ids));
  }

  if (!options?.status && options?.createdBy) {
    constraints.push(where("createdBy", "==", options.createdBy));
  }

  const snapshot = await getDocs(
    constraints.length > 0 ? query(propertiesCollection, ...constraints) : propertiesCollection
  );
  const documents = snapshot.docs
    .map((entry) => normalizeSnapshot<Property>(entry))
    .filter(Boolean) as Property[];

  return documents
    .filter((property) => {
      if (options?.status && options.status !== "all" && property.status !== options.status) {
        return false;
      }

      if (options?.createdBy && property.createdBy !== options.createdBy) {
        return false;
      }

      if (options?.ids?.length && !options.ids.includes(property.id)) {
        return false;
      }

      return true;
    })
    .sort((first, second) => {
      const firstTime = new Date(first.createdAt ?? 0).getTime();
      const secondTime = new Date(second.createdAt ?? 0).getTime();
      return secondTime - firstTime;
    });
}

export async function getPropertyById(id: string) {
  const snapshot = await getDoc(doc(db, "properties", id));
  if (!snapshot.exists()) return null;
  return normalizeSnapshot<Property>(snapshot);
}

export async function uploadPropertyImages(files: File[]) {
  const uploads = files.map(async (file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${file.name} is not a supported image file.`);
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(`${file.name} exceeds the 10MB upload limit.`);
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]+/g, "-").toLowerCase();
    const storageRef = ref(storage, `properties/${Date.now()}-${sanitizedName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploads);
}

export async function deletePropertyImages(urls: string[]) {
  await Promise.all(
    urls.map(async (url) => {
      try {
        await deleteObject(ref(storage, url));
      } catch {
        return undefined;
      }
    })
  );
}

export async function createProperty(payload: PropertyFormInput) {
  const docRef = await addDoc(propertiesCollection, {
    ...stripUndefined(payload),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function editProperty(id: string, payload: Partial<PropertyFormInput>) {
  await updateDoc(doc(db, "properties", id), {
    ...stripUndefined(payload),
    updatedAt: serverTimestamp()
  });
}

export async function deleteProperty(id: string, imageUrls: string[]) {
  if (imageUrls.length > 0) {
    await deletePropertyImages(imageUrls);
  }
  await deleteDoc(doc(db, "properties", id));
}
