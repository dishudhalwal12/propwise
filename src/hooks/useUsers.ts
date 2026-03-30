"use client";

import { useCallback, useEffect, useState } from "react";

import { getDemoUsers } from "@/data/demo";
import { getUsers } from "@/lib/firestore/users";
import { UserProfile } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDemoData, setIsDemoData] = useState(false);
  const [notice, setNotice] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const nextUsers = await getUsers();
      if (nextUsers.length > 0) {
        setUsers(nextUsers);
        setIsDemoData(false);
        setNotice("");
      } else {
        setUsers(getDemoUsers());
        setIsDemoData(true);
        setNotice("Showing staged user profiles because no live profiles are available yet.");
      }
    } catch (fetchError) {
      setUsers(getDemoUsers());
      setIsDemoData(true);
      setNotice("Showing staged user profiles while live user data is temporarily unavailable.");
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { users, loading, error, isDemoData, notice, refetch, setUsers };
}
