"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Bed,
  Brush,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Footprints,
  House,
  LoaderCircle,
  MapPin,
  Moon,
  PackageCheck,
  Phone,
  Shirt,
  Sparkles,
  Star,
  Sun,
  Truck,
  User,
  Wand2,
  Wind,
} from "lucide-react";

const cycleWords = ["Fresh", "Clean", "Crisp", "On time"];

const services = [
  { id: "iron", title: "Iron only", price: 49, icon: Wind },
  { id: "wash-iron", title: "Wash + iron", price: 149, icon: Shirt },
  { id: "wash-fold", title: "Wash + fold", price: 129, icon: PackageCheck },
  { id: "dry-clean", title: "Dry cleaning", price: 249, icon: Sparkles },
  { id: "premium", title: "Premium wash", price: 199, icon: Droplets },
  { id: "stain", title: "Stain removal", price: 99, icon: Wand2 },
  { id: "shoe", title: "Shoe cleaning", price: 199, icon: Footprints },
  { id: "carpet", title: "Carpet/blanket", price: 349, icon: Bed },
];

const pricing = {
  item: [
    { name: "Basic", price: "₹99", unit: "from", features: ["Wash + fold", "48-hour return", "Eco detergent", "Pickup reminders"] },
    { name: "Pro", price: "₹199", unit: "from", features: ["Wash + iron", "24-hour return", "Priority pickup", "Stain pre-check"] },
    { name: "Premium", price: "₹399", unit: "from", features: ["Dry cleaning", "Fabric care notes", "Same-day slots", "Garment protection"] },
  ],
  monthly: [
    { name: "Basic", price: "₹999", unit: "monthly", features: ["2 pickups", "30 items", "48-hour return", "Shared support"] },
    { name: "Pro", price: "₹1,799", unit: "monthly", features: ["4 pickups", "70 items", "24-hour return", "Priority support"] },
    { name: "Premium", price: "₹2,999", unit: "monthly", features: ["8 pickups", "Unlimited shirts", "Same-day windows", "Dedicated care lead"] },
  ],
};

const testimonials = [
  { name: "Ari K.", initials: "AK", quote: "My black tees came back soft, sharp, and not faded. Finally.", rating: 5 },
  { name: "Maya S.", initials: "MS", quote: "The pickup flow feels like ordering coffee. Two taps and done.", rating: 5 },
  { name: "Dev R.", initials: "DR", quote: "Suits looked editorial. The delivery was exactly on the minute.", rating: 5 },
  { name: "Noor P.", initials: "NP", quote: "Obsessed with the premium wash. Everything smells expensive.", rating: 5 },
  { name: "Leo V.", initials: "LV", quote: "Shoe cleaning revived a pair I had already written off.", rating: 5 },
  { name: "Isha T.", initials: "IT", quote: "Zero chaos, zero calls, just clean clothes at the door.", rating: 5 },
];



const steps = [
  { title: "Schedule", desc: "Pick a slot that fits your actual life.", icon: Calendar },
  { title: "Pickup", desc: "We collect from your door with live updates.", icon: Truck },
  { title: "Clean", desc: "Sorted, treated, washed, steamed, checked.", icon: Sparkles },
  { title: "Deliver", desc: "Your fit returns crisp, packed, and ready.", icon: BadgeCheck },
];

type PlanMode = "item" | "monthly";

function SplitHeading({ children }: { children: string }) {
  return (
    <h2 className="split-heading reveal">
      {children.split(" ").map((word, index) => (
        <span className="word-wrap" key={`${word}-${index}`}>
          <span className="word" style={{ transitionDelay: `${index * 70}ms` }}>
            {word}
          </span>
        </span>
      ))}
    </h2>
  );
}

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>(["wash-fold", "premium"]);
  const [activeStep, setActiveStep] = useState(0);
  const [planMode, setPlanMode] = useState<PlanMode>("item");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle");
  const cursorRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme } = useTheme();

  const selectedTotal = useMemo(
    () => services.filter((service) => selectedServices.includes(service.id)).reduce((sum, service) => sum + service.price, 0),
    [selectedServices],
  );

  const selectedLabels = useMemo(
    () => services.filter((service) => selectedServices.includes(service.id)).map((service) => service.title),
    [selectedServices],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % cycleWords.length);
    }, 1700);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(Number((entry.target as HTMLElement).dataset.step || 0));
          }
        });
      },
      { threshold: 0.55 },
    );

    document.querySelectorAll(".reveal, .service-tile, .price-card, .review-card").forEach((element) => revealObserver.observe(element));
    document.querySelectorAll(".timeline-step").forEach((element) => stepObserver.observe(element));

    return () => {
      revealObserver.disconnect();
      stepObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (event: MouseEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    };

    const syncCursorState = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      document.body.classList.toggle("cursor-is-active", Boolean(target.closest("a, button, input, textarea, select, .service-tile, .chip")));
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", syncCursorState);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", syncCursorState);
      document.body.classList.remove("cursor-is-active");
    };
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices((current) => (current.includes(id) ? current.filter((serviceId) => serviceId !== id) : [...current, id]));
  };

  const submitOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("loading");
    window.setTimeout(() => setSubmitState("success"), 1200);
    window.setTimeout(() => setSubmitState("idle"), 3200);
  };

  return (
    <div className="genz-page">
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      <nav className="genz-nav">
        <a className="brand-mark" href="#hero" aria-label="FreshWash home">
          <span className="brand-icon"><Shirt size={18} /></span>
          FreshWash
        </a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#booking">Book</a>
        </div>
        <button
          className="theme-toggle"
          type="button"
          aria-label="Toggle light mode"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      <section className="hero-section" id="hero">
        <div className="blob blob-one" />
        <div className="blob blob-two" />
        <div className="blob blob-three" />

        <div className="hero-content page-load">
          <p className="eyebrow">Laundry management for people with plans</p>
          <h1>
            Your fit.
            <span>Always {cycleWords[wordIndex]}.</span>
          </h1>
          <p className="hero-copy">
            Premium pickup, wash, fold, press, and delivery with a clean app flow and no beige waiting-room energy.
          </p>
          <div className="hero-actions">
            <a href="#booking" className="shimmer-btn">Book a pickup <ChevronRight size={18} /></a>
            <a href="#services" className="ghost-btn">Build my order</a>
          </div>
        </div>

        <div className="hero-orbit page-load" aria-hidden="true">
          <div className="orbit-card card-a">24h<br /><span>turnaround</span></div>
          <div className="orbit-card card-b">4.9<br /><span>rated</span></div>
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

        <a className="scroll-down" href="#services" aria-label="Scroll to services">
          <ArrowDown size={22} />
        </a>
      </section>

      <section className="content-section services-section" id="services">
        <div className="section-kicker reveal">Services</div>
        <SplitHeading>Pick your care stack</SplitHeading>
        <p className="section-copy reveal">Tap multiple services and watch your order summary build itself in real time.</p>

        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isSelected = selectedServices.includes(service.id);

            return (
              <button
                type="button"
                className={`service-tile ${isSelected ? "selected" : ""}`}
                key={service.id}
                onClick={() => toggleService(service.id)}
                style={{ transitionDelay: `${index * 55}ms` }}
                aria-pressed={isSelected}
              >
                <span className="tile-icon"><Icon size={28} /></span>
                <span className="tile-title">{service.title}</span>
                <span className="tile-price">₹{service.price}</span>
              </button>
            );
          })}
        </div>

        <div className={`live-summary ${selectedServices.length ? "visible" : ""}`}>
          <span>{selectedServices.length || "No"} selected</span>
          <strong>{selectedLabels.join(" + ") || "Choose a service"}</strong>
          <a href="#booking">Order from ₹{selectedTotal}<ChevronRight size={16} /></a>
        </div>
      </section>

      <section className="content-section timeline-section" id="process">
        <div className="section-kicker reveal">How it works</div>
        <SplitHeading>Four steps. Zero drama.</SplitHeading>
        <div className="timeline">
          <div className="timeline-line" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep >= index;

            return (
              <article className={`timeline-step reveal ${isActive ? "active" : ""}`} data-step={index} key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <span className="step-icon"><Icon size={24} /></span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section pricing-section" id="pricing">
        <div className="section-kicker reveal">Pricing</div>
        <SplitHeading>Plans with main-character energy</SplitHeading>
        <div className="price-toggle reveal" role="group" aria-label="Pricing mode">
          <button type="button" className={planMode === "item" ? "active" : ""} onClick={() => setPlanMode("item")}>Per item</button>
          <button type="button" className={planMode === "monthly" ? "active" : ""} onClick={() => setPlanMode("monthly")}>Monthly subscription</button>
        </div>

        <div className="pricing-grid">
          {pricing[planMode].map((plan, index) => (
            <article className={`price-card ${plan.name === "Pro" ? "popular" : ""}`} key={plan.name} style={{ transitionDelay: `${index * 80}ms` }}>
              {plan.name === "Pro" && <span className="popular-badge">Most popular</span>}
              <h3>{plan.name}</h3>
              <div className="price-line">
                <span>{plan.price}</span>
                <em>{plan.unit}</em>
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><CheckCircle2 size={17} />{feature}</li>
                ))}
              </ul>
              <a href="#booking" className="plan-cta">Choose {plan.name}</a>
            </article>
          ))}
        </div>
      </section>
      

      <section className="content-section booking-section" id="booking">
        <div className="booking-copy">
          <div className="section-kicker reveal">Booking</div>
          <SplitHeading>Send the laundry era into retirement</SplitHeading>
          <p className="section-copy reveal">Choose services, add the door details, and let the care team handle the boring part beautifully.</p>
        </div>

        <div className="booking-grid">
          <form className="booking-form reveal" onSubmit={submitOrder}>
            <FloatingInput id="name" label="Name" icon={<User size={18} />} />
            <FloatingInput id="phone" label="Phone" icon={<Phone size={18} />} />
            <FloatingInput id="address" label="Address" icon={<MapPin size={18} />} />
            <div className="form-row">
              <FloatingInput id="date" label="Date" type="date" icon={<Calendar size={18} />} />
              <FloatingInput id="time" label="Time" type="time" icon={<Clock size={18} />} />
            </div>

            <div className="chip-group" aria-label="Selected services">
              {services.map((service) => (
                <button
                  type="button"
                  className={`chip ${selectedServices.includes(service.id) ? "active" : ""}`}
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                >
                  {service.title}
                </button>
              ))}
            </div>

            <button className={`submit-btn ${submitState}`} type="submit" disabled={submitState === "loading"}>
              {submitState === "loading" && <LoaderCircle size={19} className="spin" />}
              {submitState === "success" && <Check size={19} />}
              {submitState === "idle" && "Confirm pickup"}
              {submitState === "loading" && "Booking"}
              {submitState === "success" && "Booked"}
            </button>
          </form>

          <aside className="order-summary reveal">
            <span className="summary-label">Live order</span>
            <h3>{selectedServices.length ? `${selectedServices.length} service stack` : "No services yet"}</h3>
            <div className="summary-list">
              {selectedServices.length ? (
                services.filter((service) => selectedServices.includes(service.id)).map((service) => (
                  <div key={service.id}>
                    <span>{service.title}</span>
                    <strong>₹{service.price}</strong>
                  </div>
                ))
              ) : (
                <p>Start with a wash, press, or specialty clean.</p>
              )}
            </div>
            <div className="summary-total">
              <span>Estimated total</span>
              <strong>₹{selectedTotal}</strong>
            </div>
          </aside>
        </div>
      </section>

      <footer className="genz-footer">
        <div className="footer-watermark" aria-hidden="true">FreshWash</div>
        <div>
          <h2>FreshWash</h2>
          <p>Clean clothes. Sharp schedules. No corporate aftertaste.</p>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#pricing">Pricing</a>
          <a href="#booking">Booking</a>
        </div>
        <div className="socials" aria-label="Social links">
          <a href="#" aria-label="Instagram"><Sparkles size={19} /></a>
          <a href="#" aria-label="Community"><BadgeCheck size={19} /></a>
          <a href="#" aria-label="Studio"><Brush size={19} /></a>
          <a href="#" aria-label="Home"><House size={19} /></a>
        </div>
        <a className="back-top" href="#hero" aria-label="Back to top"><ArrowUp size={20} /></a>
      </footer>
    </div>
  );
}

function FloatingInput({ id, label, type = "text", icon }: { id: string; label: string; type?: string; icon: ReactNode }) {
  return (
    <label className="floating-field" htmlFor={id}>
      {icon}
      <input id={id} name={id} type={type} placeholder=" " required />
      <span>{label}</span>
    </label>
  );
}
