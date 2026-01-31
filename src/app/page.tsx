import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquareQuote,
  Zap,
  Target,
  Code2,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquareQuote className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">TestimonialStack</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Built for indie makers
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
          Turn happy customers into{" "}
          <span className="text-primary">social proof</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Collect testimonials, showcase milestones, and embed beautiful widgets
          on your website. Everything you need to build trust and convert
          visitors.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Start for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              See how it works
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Free plan includes 3 testimonials. No credit card required.
        </p>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-sm">
              Trusted by <strong className="text-foreground">500+</strong> makers
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm ml-1">4.9/5 average rating</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          Everything you need to showcase social proof
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          From collection to display, TestimonialStack handles the entire testimonial
          workflow so you can focus on building your product.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MessageSquareQuote className="w-6 h-6" />}
            title="Testimonial Collection"
            description="Custom collection pages with your branding. Share a link and let customers submit testimonials easily."
          />
          <FeatureCard
            icon={<Code2 className="w-6 h-6" />}
            title="Embeddable Widgets"
            description="Beautiful, responsive widgets you can embed anywhere. Grid, carousel, spotlight, or Wall of Love layouts."
          />
          <FeatureCard
            icon={<Target className="w-6 h-6" />}
            title="Milestone Badges"
            description="Showcase MRR milestones, user counts, and launch anniversaries. Connect Stripe or Lemon Squeezy for auto-updates."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Import from Anywhere"
            description="Pull testimonials from Twitter/X, Product Hunt, and other platforms automatically."
          />
          <FeatureCard
            icon={<Star className="w-6 h-6" />}
            title="Full Customization"
            description="Match your brand with custom colors, fonts, and layouts. No coding required."
          />
          <FeatureCard
            icon={<CheckCircle2 className="w-6 h-6" />}
            title="Analytics Dashboard"
            description="Track widget impressions and clicks. See which testimonials drive the most engagement."
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Start free and upgrade as you grow. No hidden fees, no surprises.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            description="Perfect for getting started"
            features={[
              "3 testimonials",
              "1 widget",
              "1 collection page",
              "TestimonialStack branding",
            ]}
            cta="Get Started"
            href="/signup"
          />
          <PricingCard
            name="Starter"
            price="$19"
            period="/month"
            description="For growing products"
            features={[
              "25 testimonials",
              "3 widgets",
              "3 collection pages",
              "No branding",
              "3 milestones",
            ]}
            cta="Start Free Trial"
            href="/signup?plan=starter"
            popular
          />
          <PricingCard
            name="Pro"
            price="$39"
            period="/month"
            description="For serious makers"
            features={[
              "Unlimited testimonials",
              "Unlimited widgets",
              "Unlimited collection pages",
              "No branding",
              "Unlimited milestones",
              "Stripe/LS integration",
              "Twitter/X import",
            ]}
            cta="Start Free Trial"
            href="/signup?plan=pro"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary rounded-2xl p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">
            Ready to showcase your social proof?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join hundreds of indie makers using TestimonialStack to build trust and
            convert visitors into customers.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Get started for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquareQuote className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">TestimonialStack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with love for indie makers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-2 hover:border-primary/20 transition-colors">
      <CardContent className="pt-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  popular,
}: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}) {
  return (
    <Card
      className={`relative ${
        popular ? "border-2 border-primary shadow-lg scale-105" : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="mt-2 mb-4">
          <span className="text-4xl font-bold">{price}</span>
          {period && (
            <span className="text-muted-foreground">{period}</span>
          )}
        </div>
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
        <Link href={href}>
          <Button className="w-full" variant={popular ? "default" : "outline"}>
            {cta}
          </Button>
        </Link>
        <ul className="mt-6 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
