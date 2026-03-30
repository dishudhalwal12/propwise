import {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp
} from "firebase/firestore";

function mapValue(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => mapValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, mapValue(entry)])
    );
  }

  return value;
}

export function normalizeSnapshot<T extends object>(
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
): (T & { id: string }) | null {
  const data = snapshot.data();
  if (!data) return null;

  const mappedData = mapValue(data);
  if (!mappedData || typeof mappedData !== "object" || Array.isArray(mappedData)) {
    return null;
  }

  return {
    id: snapshot.id,
    ...mappedData
  } as T & { id: string };
}

export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((entry) => entry !== undefined)
      .map((entry) => stripUndefined(entry)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, stripUndefined(entry)])
    ) as T;
  }

  return value;
}
