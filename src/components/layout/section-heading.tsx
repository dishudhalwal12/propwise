"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-4", align === "center" && "mx-auto max-w-3xl text-center", className)}
    >
      {eyebrow ? (
        <div className="inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? <p className="text-balance text-base leading-7 text-slate-600">{description}</p> : null}
    </motion.div>
  );
}
