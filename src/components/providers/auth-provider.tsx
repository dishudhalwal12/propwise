"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";

import { getUserProfile, subscribeToAuth } from "@/lib/auth";
import { clearSessionCookies, persistSessionCookie } from "@/lib/cookies";
import { auth } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

type AuthContextValue = {
  user: { uid: string; email: string | null } | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user?.uid) return;
    const nextProfile = await getUserProfile(user.uid);
    setProfile(nextProfile);
    if (nextProfile?.role) persistSessionCookie(nextProfile.role, user.uid);
  }, [user]);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        clearSessionCookies();
        setLoading(false);
        return;
      }

      setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      const nextProfile = await getUserProfile(firebaseUser.uid);
      if (!nextProfile) {
        clearSessionCookies();
        await signOut(auth);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setProfile(nextProfile);
      if (nextProfile?.role) persistSessionCookie(nextProfile.role, firebaseUser.uid);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, refreshProfile }),
    [loading, profile, refreshProfile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
