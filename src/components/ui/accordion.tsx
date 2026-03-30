import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item
    className={cn("rounded-[24px] border border-white/50 bg-white/70 px-6 shadow-glass", className)}
    {...props}
  />
);

const AccordionTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        "flex flex-1 items-center justify-between py-5 text-left text-sm font-semibold transition-all hover:text-slate-950 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

const AccordionContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    className={cn(
      "overflow-hidden text-sm text-slate-600 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-5">{children}</div>
  </AccordionPrimitive.Content>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
