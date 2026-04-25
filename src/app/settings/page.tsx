"use client";

import { useEffect, useState } from "react";
import { Key, Save, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key") || "";
    setApiKey(savedKey);
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
  };

  if (!isLoaded) return null;

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Settings</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Configure your AI assistant and workspace preferences.
          </p>
        </div>

        <div className="grid gap-8">
          <section className="glass-panel overflow-hidden">
            <div className="border-b border-border bg-slate-50/50 dark:bg-white/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-950 dark:text-white">Gemini API Configuration</h2>
                  <p className="text-sm text-muted-foreground">Power your PropWise Assistant with your own API key.</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="rounded-[24px] border border-amber-100 dark:border-amber-900/30 bg-amber-50/86 dark:bg-amber-950/20 p-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  <div className="mb-2 flex items-center gap-2 text-slate-950 dark:text-white">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <p className="font-semibold">Why use your own key?</p>
                  </div>
                  Using your own Gemini API key ensures consistent performance and allows you to chat with the assistant even when the shared project quotas are reached. You can get a free key from the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">Google AI Studio</a>.
                </div>

                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Gemini API Key
                  </label>
                  <div className="flex gap-3">
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Paste your API key here..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={handleClear} title="Clear Key">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Your key is stored locally in your browser and is only used to make requests to the Gemini API.
                    </p>
                    {success && (
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-right-4">
                        Changes saved! 🚀
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Configuration
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6">
            <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">Workspace Info</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white dark:bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Version</p>
                <p className="mt-1 font-medium">v1.2.0 (Premium Build)</p>
              </div>
              <div className="rounded-2xl border border-border bg-white dark:bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Region</p>
                <p className="mt-1 font-medium">India (Primary Cluster)</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
