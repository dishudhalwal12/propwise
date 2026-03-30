import { LoginForm } from "@/components/forms/auth-forms";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <LoginForm redirectTo={params.redirect} />
    </main>
  );
}
