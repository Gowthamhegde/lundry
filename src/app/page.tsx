import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Leaf,
  MapPin,
  Shirt,
  Sparkles,
  ThumbsUp,
  Truck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Same-day pickup",
    desc: "Book before noon and we collect the same day. No waiting, no rescheduling.",
  },
  {
    icon: Leaf,
    title: "Eco-friendly process",
    desc: "Biodegradable detergents and water-efficient machines — clean clothes, clean conscience.",
  },
  {
    icon: Clock,
    title: "24-hour turnaround",
    desc: "Most orders are washed, pressed, and back at your door within 24 hours.",
  },
  {
    icon: MapPin,
    title: "Door-to-door service",
    desc: "We pick up and drop off at your address. You never leave home.",
  },
  {
    icon: ThumbsUp,
    title: "Satisfaction guarantee",
    desc: "Not happy? We re-clean for free. No questions, no hassle.",
  },
  {
    icon: BadgeCheck,
    title: "Trained care team",
    desc: "Every garment is inspected, sorted by fabric type, and handled by trained staff.",
  },
];

const stats = [
  { value: "10,000+", label: "Orders completed" },
  { value: "4.9 ★",  label: "Average rating" },
  { value: "24h",    label: "Avg. turnaround" },
  { value: "98%",    label: "On-time delivery" },
];

const pricingPlans = [
  {
    name: "Basic",
    price: "₹99",
    unit: "from",
    features: ["Wash + fold", "48-hour return", "Eco detergent", "Pickup reminders"],
    popular: false,
  },
  {
    name: "Pro",
    price: "₹199",
    unit: "from",
    features: ["Wash + iron", "24-hour return", "Priority pickup", "Stain pre-check"],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹399",
    unit: "from",
    features: ["Dry cleaning", "Fabric care notes", "Same-day slots", "Garment protection"],
    popular: false,
  },
];

const steps = [
  { title: "Schedule", desc: "Pick a slot that fits your actual life.", icon: Calendar, num: "01" },
  { title: "Pickup", desc: "We collect from your door with live updates.", icon: Truck, num: "02" },
  { title: "Clean", desc: "Sorted, treated, washed, steamed, checked.", icon: Sparkles, num: "03" },
  { title: "Deliver", desc: "Your fit returns crisp, packed, and ready.", icon: BadgeCheck, num: "04" },
];

export default function Home() {
  return (
    <div className="genz-page">
      {/* ── Hero ── */}
      <section className="hero-section" id="hero">
        <div className="blob blob-one" />
        <div className="blob blob-two" />
        <div className="blob blob-three" />

        <div className="hero-content">
          <p className="eyebrow">Laundry management for people with plans</p>
          <h1>
            Your fit.
            <span>Always Fresh.</span>
          </h1>
          <p className="hero-copy">
            Premium pickup, wash, fold, press, and delivery — clean app flow, zero waiting-room energy.
          </p>
          <div className="hero-actions">
            <Link href="/order" className="shimmer-btn">
              Book a pickup <ChevronRight size={18} />
            </Link>
            <a href="#services" className="ghost-btn">
              See services
            </a>
          </div>
        </div>

        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-card card-a">
            24h<br /><span>turnaround</span>
          </div>
          <div className="orbit-card card-b">
            4.9<br /><span>rated</span>
          </div>
          <div className="machine">
            <div className="machine-top" />
            <div className="machine-door">
              <div className="drum">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>

        <a className="scroll-down" href="#services" aria-label="Scroll to why section">
          <ArrowDown size={22} />
        </a>
      </section>

      {/* ── Why FreshWash ── */}
      <section className="content-section why-section" id="services">

        {/* Stats bar */}
        <div className="stats-bar">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Heading */}
        <div className="section-kicker" style={{ marginTop: "64px" }}>Why FreshWash</div>
        <h2 className="split-heading static-heading">Laundry that actually works for you</h2>
        <p className="section-copy">
          We built FreshWash around one idea — your time is worth more than laundry day.
          Here&apos;s what makes us different.
        </p>

        {/* Feature grid */}
        <div className="features-grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>

        <div className="static-cta-bar">
          <Link href="/order" className="shimmer-btn">
            Book your first pickup <ChevronRight size={16} />
          </Link>
          <Link href="/services" className="ghost-btn">
            See all services
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="content-section timeline-section" id="process">
        <div className="section-kicker">How it works</div>
        <h2 className="split-heading static-heading">Four steps. Zero drama.</h2>
        <div className="timeline">
          <div className="timeline-line" />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article className="timeline-step" key={step.title}>
                <span className="step-number">{step.num}</span>
                <span className="step-icon">
                  <Icon size={24} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="content-section pricing-section" id="pricing">
        <div className="section-kicker">Pricing</div>
        <h2 className="split-heading static-heading">Simple, honest plans</h2>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`price-card static-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && <span className="popular-badge">Most popular</span>}
              <h3>{plan.name}</h3>
              <div className="price-line">
                <span>{plan.price}</span>
                <em>{plan.unit}</em>
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 size={17} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/order" className="plan-cta">
                Choose {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Order Tracking CTA ── */}
      <section className="content-section tracking-section" id="tracking">
        <div className="tracking-cta-card">
          <div className="tracking-cta-icon">
            <Shirt size={32} />
          </div>
          <div className="tracking-cta-text">
            <h2>Know exactly where your laundry is</h2>
            <p>Sign in to your account to see live order status, pickup times, and delivery updates — all in one place.</p>
          </div>
          <div className="tracking-cta-actions">
            <Link href="/login" className="shimmer-btn">
              Sign in to track <ChevronRight size={16} />
            </Link>
            <Link href="/signup" className="ghost-btn">
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="genz-footer" id="footer">
        <div className="footer-watermark" aria-hidden="true">FreshWash</div>
        <div>
          <h2>FreshWash</h2>
          <p>Clean clothes. Sharp schedules. No corporate aftertaste.</p>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#pricing">Pricing</a>
          <Link href="/order">Booking</Link>
          <Link href="/admin" className="footer-admin-link">Admin login</Link>
        </div>
        <div className="footer-bottom-row">
          <p className="footer-copy-text">© {new Date().getFullYear()} FreshWash. All rights reserved.</p>
          <a className="back-top" href="#hero" aria-label="Back to top">
            <ArrowUp size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
}
