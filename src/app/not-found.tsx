import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-24">
      <Card className="max-w-xl text-center">
        <CardContent className="space-y-6 p-10">
          <div className="mx-auto w-fit rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            404
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-semibold text-slate-950">This page is off market</h1>
            <p className="text-balance text-slate-600">
              The route you requested does not exist or may have moved. Head back to PropWise and continue from a safe starting point.
            </p>
          </div>
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
