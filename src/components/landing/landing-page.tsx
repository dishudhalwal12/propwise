"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartColumnIncreasing, Search, ShieldCheck, Users2 } from "lucide-react";
import { motion } from "framer-motion";

import { SectionHeading } from "@/components/layout/section-heading";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqItems, logoCloud, workflowSteps } from "@/data/site";

const featureCards = [
  {
    icon: Search,
    title: "Property Comparison Tool",
    description: "Stack up to four properties with a high-signal, weighted decision layer."
  },
  {
    icon: ChartColumnIncreasing,
    title: "Investment Calculator",
    description: "Run EMI, ROI, and rental yield models in the same decision workflow."
  },
  {
    icon: Users2,
    title: "CRM for Agents",
    description: "Track leads, interactions, and viewings from one clean operating surface."
  },
  {
    icon: ShieldCheck,
    title: "Smart Search Filters",
    description: "Refine opportunities by city, pricing, asset type, area, and amenities."
  }
];

const pricingCards = [
  {
    title: "Starter",
    price: "Free",
    description: "For buyers and investors exploring properties, comparisons, and calculators."
  },
  {
    title: "Professional",
    price: "₹2,499/mo",
    description: "For agents managing leads, follow-ups, and high-conviction property recommendations."
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "For managers and admins who need portfolio oversight, analytics, and team controls."
  }
];

function FloatingMetric({
  value,
  label,
  tint,
  delay
}: {
  value: string;
  label: string;
  tint: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-[28px] border border-white/60 p-6 shadow-glass backdrop-blur-2xl ${tint}`}
    >
      <p className="font-display text-4xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{label}</p>
    </motion.div>
  );
}

export function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 soft-grid opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(23,37,84,0.12),_transparent_58%)]" />
      <SiteNavbar />

      <section className="container-shell relative pt-10">
        <div className="glass-panel rich-hero-shell mx-auto max-w-6xl overflow-hidden px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,_1.08fr)_minmax(0,_0.92fr)] lg:items-start">
            <div className="min-w-0 space-y-8">
              <div className="space-y-6 pt-6 lg:pt-10">
                <Badge variant="outline" className="border-white/70 bg-white/88 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                  Premium SaaS for property intelligence
                </Badge>
                <div className="space-y-5">
                  <h1 className="text-balance font-display text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                    Make Smarter Property Decisions with Data
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600">
                    PropWise combines discovery, side-by-side comparison, ROI modeling, and CRM workflows so buyers and teams can move with conviction.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/properties">
                      Explore Properties
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/compare">See comparison mode</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,_0.44fr)_minmax(0,_0.56fr)]">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel rounded-[28px] p-5"
                  >
                    <div className="mb-5 flex items-center gap-2">
                      <span className="h-9 w-9 rounded-2xl bg-indigo-100" />
                      <span className="h-9 w-9 rounded-2xl bg-rose-100" />
                      <span className="h-9 w-9 rounded-2xl bg-amber-100" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-slate-950">Integrated workflows</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      From shortlist to ROI to follow-up, every decision stays connected.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-[28px] p-5"
                  >
                    <p className="font-display text-5xl font-semibold text-slate-950">5.5B</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      rupees in opportunities benchmarked across live comparison sessions.
                    </p>
                  </motion.div>
                </div>

                <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,_1.02fr)_minmax(0,_0.98fr)]">
                  <div className="glass-panel row-span-2 overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-50 via-white to-amber-50">
                    <div className="relative h-full min-h-[390px]">
                      <Image
                        src="/landing/showcase-property.svg"
                        alt="Property portrait"
                        fill
                        priority
                        sizes="(max-width: 640px) 100vw, 28vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-x-5 top-5 rounded-2xl bg-white/72 px-4 py-3 backdrop-blur-xl">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Prime shortlist</p>
                        <p className="mt-1 font-display text-xl font-semibold text-slate-950">Sector 150, Noida</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[30px] border border-amber-200/80 bg-gradient-to-br from-amber-100 via-orange-50 to-white p-6 shadow-glass">
                    <p className="font-display text-5xl font-semibold text-slate-950">83%</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      of shortlisted properties become easier to rank after weighted comparison.
                    </p>
                  </div>
                  <div className="glass-panel overflow-hidden rounded-[30px] bg-gradient-to-br from-rose-50 via-white to-indigo-50">
                    <div className="relative h-full min-h-[184px]">
                      <Image
                        src="/landing/showcase-interior.svg"
                        alt="Interior card"
                        fill
                        sizes="(max-width: 640px) 100vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-6 pt-4 lg:pt-0">
              <div className="glass-panel rounded-[32px] p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Frameworks and expertise</p>
                <div className="mt-4 rounded-[28px] bg-slate-50/80 p-4">
                  <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr] lg:grid-cols-1 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-4">
                      <p className="font-display text-xl font-semibold text-slate-950">PropWise portfolio</p>
                      <p className="text-sm leading-6 text-slate-600">
                        Rapidly compare new opportunities and highlight the strongest fit for budget, yield, and location.
                      </p>
                      <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-indigo-300" />
                    </div>
                    <div className="relative min-h-[180px] overflow-hidden rounded-[24px]">
                      <Image
                        src="/landing/showcase-dashboard.svg"
                        alt="Dashboard visual"
                        fill
                        sizes="(max-width: 768px) 100vw, 24vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div id="how-it-works" className="grid gap-4 sm:grid-cols-2">
                <FloatingMetric value="42%" label="better decision confidence from structured comparison views" tint="bg-indigo-100/85" />
                <FloatingMetric value="60k" label="monthly user-level valuation points surfaced across listings" tint="bg-white/80" delay={0.1} />
                <FloatingMetric value="5x" label="faster shortlist analysis with linked ROI and CRM workflows" tint="bg-rose-100/85" delay={0.15} />
                <FloatingMetric value="80%" label="clearer ROI visibility before scheduling a site visit" tint="bg-amber-50/90" delay={0.22} />
              </div>

              <div className="glass-panel grid gap-6 rounded-[32px] p-6 md:grid-cols-[1fr_0.9fr]">
                <div className="space-y-4">
                  <p className="font-display text-4xl font-semibold text-slate-950">
                    Effortless onboarding and rapid deal movement
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Transition browsing, evaluation, and follow-up into one calm workspace with purpose-built dashboards.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li>Free migration mindset for existing research and lead notes</li>
                    <li>Transparent workflows across properties, comparisons, and viewings</li>
                    <li>Personalized support surfaces for buyers, investors, and agents</li>
                  </ul>
                </div>
                <div className="relative min-h-[260px] overflow-hidden rounded-[28px]">
                  <Image
                    src="/landing/showcase-agent.svg"
                    alt="Agent using platform"
                    fill
                    sizes="(max-width: 768px) 100vw, 32vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-hidden border-t border-white/50 pt-8">
            <div className="flex animate-marquee gap-12 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              {[...logoCloud, ...logoCloud].map((logo, index) => (
                <span key={`${logo}-${index}`}>{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container-shell section-space">
        <SectionHeading
          align="center"
          eyebrow="Capabilities"
          title="Drive Transformative Impact with Real Estate Intelligence"
          description="Every layer of PropWise is designed to reduce guesswork and compress the time from discovery to conviction."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full">
                  <CardContent className="space-y-5 p-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white text-slate-950 shadow-soft">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-display text-2xl font-semibold text-slate-950">{feature.title}</h3>
                      <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="container-shell pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Workflow"
            title="A clean decision path from browsing to booking"
            description="The product flow is intentionally calm: discover, compare, model, and then act when the signal is strong."
          />
          <div className="space-y-4">
            {workflowSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="glass-panel flex gap-5 p-6"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-slate-950 text-sm font-semibold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="container-shell pb-24">
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title="Flexible entry points for every real estate workflow"
          description="Simple access for self-serve users, operational depth for teams, and room to scale into admin-level oversight."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingCards.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <Card className={index === 1 ? "bg-slate-950 text-white" : ""}>
                <CardContent className="space-y-5 p-8">
                  <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${index === 1 ? "text-white/70" : "text-slate-400"}`}>
                    {plan.title}
                  </p>
                  <div className="space-y-2">
                    <p className="font-display text-5xl font-semibold">{plan.price}</p>
                    <p className={index === 1 ? "text-white/72" : "text-slate-600"}>{plan.description}</p>
                  </div>
                  <Button variant={index === 1 ? "secondary" : "default"} asChild>
                    <Link href="/register">Get started</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="faq" className="container-shell pb-24">
        <SectionHeading
          align="center"
          eyebrow="FAQ"
          title="Write in the customer's voice"
          description="Answers tuned for the moments where buyers and teams usually pause before moving forward."
        />
        <div className="mx-auto mt-12 max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
