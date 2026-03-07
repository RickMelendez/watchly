import * as React from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "../../lib/utils";

type SectionProps = { children: React.ReactNode; className?: string; id?: string };
type ContainerProps = { children: React.ReactNode; className?: string; id?: string };

const Section = ({ children, className, id }: SectionProps) => (
  <section className={cn("py-8 md:py-12", className)} id={id}>
    {children}
  </section>
);

const Container = ({ children, className, id }: ContainerProps) => (
  <div className={cn("mx-auto max-w-5xl p-6 sm:p-8", className)} id={id}>
    {children}
  </div>
);

type PlanTier = "Starter" | "Pro" | "Business" | "Enterprise";

interface PricingCardProps {
  title: PlanTier;
  price: string;
  description?: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

const pricingData: PricingCardProps[] = [
  {
    title: "Starter",
    price: "$9/month",
    description: "Perfect for personal projects and small sites.",
    features: ["5 websites monitored", "30-second checks", "Email alerts", "7-day history", "Public status page"],
    cta: "Get Started",
    href: "/login",
    featured: false,
  },
  {
    title: "Pro",
    price: "$29/month",
    description: "For teams that need reliability and deeper insights.",
    features: [
      "50 websites monitored",
      "10-second checks",
      "Email + SMS alerts",
      "90-day history",
      "API access",
      "AI incident analysis",
    ],
    cta: "Start Free Trial",
    href: "/login",
    featured: true,
  },
  {
    title: "Business",
    price: "$79/month",
    description: "For organizations that demand zero downtime.",
    features: [
      "Unlimited websites",
      "5-second checks",
      "All alert channels",
      "1-year history",
      "AI root cause analysis",
      "Priority support",
      "Custom SLA",
    ],
    cta: "Start Free Trial",
    href: "/login",
    featured: false,
  },
];

interface PricingSectionProps {
  onNavigate?: (path: string) => void;
}

export default function PricingSection({ onNavigate }: PricingSectionProps) {
  return (
    <Section id="pricing">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h2 className="!my-0 text-4xl md:text-5xl font-extrabold tracking-tight text-white">Pricing</h2>
        <p className="text-lg text-neutral-400 md:text-xl">
          Select the plan that best suits your needs.
        </p>

        <div className="not-prose mt-6 grid w-full grid-cols-1 gap-6 min-[900px]:grid-cols-3">
          {pricingData.map((plan) => (
            <PricingCard key={plan.title} plan={plan} onNavigate={onNavigate} />
          ))}
        </div>

        <p className="mt-4 text-sm text-neutral-500">
          All plans include a 14-day free trial. No credit card required.{" "}
          <button
            onClick={() => onNavigate?.("/login")}
            className="text-green-400 hover:underline"
          >
            Contact us
          </button>{" "}
          for Enterprise pricing.
        </p>
      </Container>
    </Section>
  );
}

function PricingCard({
  plan,
  onNavigate,
}: {
  plan: PricingCardProps;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6 text-left bg-neutral-950/70",
        plan.featured
          ? "border-green-500/50 shadow-sm ring-1 ring-green-500/10"
          : "border-white/10",
      )}
      aria-label={`${plan.title} plan`}
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2">
          <Badge
            variant={plan.featured ? "default" : "secondary"}
            className={plan.featured ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/25" : ""}
          >
            {plan.title}
          </Badge>
          {plan.featured && (
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 border border-green-500/20">
              Most popular
            </span>
          )}
        </div>
        <h4 className="mb-2 mt-4 text-2xl font-bold text-white">{plan.price}</h4>
        {plan.description && (
          <p className="text-sm text-neutral-400">{plan.description}</p>
        )}
      </div>

      <div className="my-4 border-t border-white/8" />

      <ul className="space-y-2.5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center text-sm text-neutral-300">
            <CircleCheck className="mr-2 h-4 w-4 text-green-500 shrink-0" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Button
          size="sm"
          className={cn(
            "w-full",
            plan.featured
              ? "bg-green-500 hover:bg-green-400 text-black font-semibold"
              : "bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10",
          )}
          variant={plan.featured ? "default" : "secondary"}
          onClick={() => onNavigate?.(plan.href)}
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  );
}
