"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginUser, registerUser } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function resolveRolePath(role?: string | null) {
  switch (role) {
    case "agent":
      return "/agent";
    case "property_manager":
      return "/manage-properties";
    case "admin":
      return "/admin";
    default:
      return "/dashboard";
  }
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        const { profile } = await loginUser(email, password);
        router.push(redirectTo ?? resolveRolePath(profile?.role));
      } catch (submissionError) {
        setError(
          submissionError instanceof Error ? submissionError.message : "Unable to sign in."
        );
      }
    });
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to access PropWise dashboards, comparisons, and CRM.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Login"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <Link href="/register" className="font-semibold text-foreground dark:text-white hover:underline">
              Register
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<"buyer" | "investor">("buyer");

  async function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        const payload = {
          fullName: String(formData.get("fullName") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
          role,
          phone: String(formData.get("phone") ?? "")
        };

        registerSchema.parse(payload);
        await registerUser(payload);
        router.push("/dashboard");
      } catch (submissionError) {
        setError(
          submissionError instanceof Error ? submissionError.message : "Unable to create account."
        );
      }
    });
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle>Create your PropWise account</CardTitle>
        <CardDescription>Buyer and investor registration is open. Professional roles are provisioned separately.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>
          <div className="space-y-2">
            <Label>Account type</Label>
            <Select value={role} onValueChange={(value: "buyer" | "investor") => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Register"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-foreground dark:text-white hover:underline">
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
