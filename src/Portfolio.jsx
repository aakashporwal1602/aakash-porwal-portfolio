import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Github, Linkedin, Mail, MapPin, ArrowUpRight, ArrowUp, Download,
  Server, Database, Cloud, Activity, Layers, Zap, GitBranch, Boxes,
  Workflow, Gauge, Terminal, ChevronDown, Sparkles,
} from "lucide-react";

/*
  Aakash Porwal — portfolio (single-file reference build)
  Synced to the finalized SDE-3 résumé. Real tech only.

  DROP-IN NOTES
  1. Put your résumé at:  public/Aakash_Porwal_SDE3_Resume.pdf
     (the Download button already points to /Aakash_Porwal_SDE3_Resume.pdf)
  2. OFFICIAL BRAND LOGOS: this build uses styled chips + lucide category
     icons so it renders anywhere. To use real logos in your repo:
       npm i react-icons
       import { SiNodedotjs, SiTypescript, SiApachekafka,
                SiGooglebigquery, SiDatabricks, SiApachespark,
                SiKubernetes, SiDocker, SiRedis, SiMongodb,
                SiGrafana, SiPython, SiGit, SiGithubactions } from "react-icons/si";
     then swap the <Chip> glyph for the matching <Si...> icon.
  3. Animations use transform/opacity only + IntersectionObserver (60fps),
     and respect prefers-reduced-motion. Framer Motion is optional in-repo.
*/

const RESUME_URL = "/Aakash_Porwal_SDE3_Resume.pdf";
const LINKS = {
  email: "aakashporwal111@gmail.com",
  github: "https://github.com/aakashporwal1602",
  linkedin: "https://www.linkedin.com/in/aakash-porwal-bab05b189",
};

/* ---------- scroll reveal ---------- */
function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`pf-reveal ${shown ? "pf-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ---------- count-up ---------- */
function useCountUp(target, { decimals = 0, duration = 1600 } = {}) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target); return;
    }
    let raf, started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(target * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);
  return [decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString(), ref];
}

function Stat({ value, decimals, suffix, label }) {
  const [display, ref] = useCountUp(value, { decimals });
  return (
    <div className="pf-stat" ref={ref}>
      <div className="pf-stat-num">
        {display}<span className="pf-stat-suffix">{suffix}</span>
      </div>
      <div className="pf-stat-label">{label}</div>
    </div>
  );
}

/* ---------- data ---------- */
const HERO_ROLES = [
  "Backend & Distributed Systems",
  "Real-Time Data Platforms",
  "Event-Driven Architecture",
];

const EXPERIENCE = [
  {
    company: "Tata Digital",
    location: "Bangalore",
    period: "Dec 2021 — Present",
    accent: "var(--violet)",
    roles: [
      {
        title: "Senior Backend + Data Engineer",
        dates: "Jun 2024 — Present",
        summary:
          "Own platform-wide initiatives across Kafka, BigQuery and Databricks — cost, reliability, and data trust.",
        points: [
          "Owned the platform-wide BigQuery cost-optimization strategy end-to-end — partition-expiry TTLs, dataset lifecycle management, job governance, and purging of ~100 TB of orphaned data — cutting BigQuery spend ~90%; mentored 2 engineers.",
          "Led an org-wide JSON→Avro migration for Kafka pipelines (~1.5B events) with Confluent Schema Registry — cutting storage footprint ~50% and enforcing producer-consumer schema contracts.",
          "Achieved 100% data parity between Databricks (DWH) and BigQuery via reconciliation pipelines, validation jobs, and continuous monitoring.",
          "Designed streaming and micro-batch ingestion on Databricks with layered Bronze/Silver/Gold (medallion) PySpark pipelines powering analytics and ML.",
          "Built a resilient backfilling & recovery framework that restores production pipelines after consumer lag, offset resets, and warehouse drift — cutting recovery from days to hours.",
        ],
        tech: ["Kafka", "Avro", "Confluent Schema Registry", "BigQuery", "Databricks", "PySpark", "Spark"],
      },
      {
        title: "Backend Engineer",
        dates: "Dec 2021 — Jun 2024",
        summary:
          "Architected and scaled JARVIS, the company's first-party real-time analytics platform.",
        points: [
          "Architected JARVIS — the company's first real-time platform to stitch native-app and WebView journeys into a single unified customer journey across the Tata Digital ecosystem (Tata Neu, 1mg, BigBasket, Croma, Tata CLiQ). 300M+ events/day in production.",
          "Engineered a multi-sink event-distribution layer — streaming to BigQuery for product analytics (Mixpanel) and BI, fanning out to Meta, Firebase, Branch and MoEngage, and publishing to Kafka for real-time consumers.",
          "Cut BigQuery costs ~70% via partitioning, clustering, materialized views, and migration to the BigQuery Storage API.",
          "Owned BigQuery observability end-to-end — monitoring and proactive alerting across slot utilization, query cost, job health, and failure rates.",
          "Migrated event ingestion from Azure EventHub to Kafka — exponential-backoff retries, replication, and a dead-letter topic — cutting event-processing cost 7x; mentored 2 interns.",
        ],
        tech: ["Node.js", "TypeScript", "Express.js", "AKS", "Kafka", "BigQuery", "Redis", "MongoDB"],
      },
    ],
  },
  {
    company: "Kantar",
    location: "",
    period: "Jul 2021 — Dec 2021",
    accent: "var(--cyan)",
    roles: [
      {
        title: "Senior Analyst — Data Strategy & Engineering",
        dates: "Jul 2021 — Dec 2021",
        summary: "Data modeling and analytics for large-scale marketing-ROI programs.",
        points: [
          "Modeled data for large-scale Marketing-ROI (MROI) programs across South-East Asia for a $150B+ global CPG brand.",
          "Delivered competitor analysis and marketing-effectiveness recommendations through advanced analytics.",
        ],
        tech: ["SQL", "Python", "Data Modeling", "Advanced Analytics"],
      },
    ],
  },
  {
    company: "RoboMQ",
    location: "",
    period: "Jan 2021 — Jun 2021",
    accent: "var(--amber)",
    roles: [
      {
        title: "Software Engineer Intern",
        dates: "Jan 2021 — Jun 2021",
        summary: "Backend microservices and event-driven integration automation.",
        points: [
          "Built Spring Boot microservices in a distributed backend.",
          "Automated real-time Jira ticket creation from PagerDuty incident triggers via REST API integrations.",
          "Developed CRM/ERP/HRM integration flows on an in-house iPaaS.",
        ],
        tech: ["Java", "Spring Boot", "Microservices", "REST APIs", "iPaaS"],
      },
    ],
  },
];

const PROJECTS = [
  {
    icon: Workflow,
    name: "JARVIS — Real-Time Analytics Platform",
    blurb:
      "First-party analytics engine stitching native-app and WebView journeys into one customer journey across the Tata Neu ecosystem.",
    metrics: ["300M+ events/day", "native + WebView unification", "multi-sink distribution"],
    tech: ["Node.js", "TypeScript", "Express.js", "AKS", "Kafka", "BigQuery"],
  },
  {
    icon: GitBranch,
    name: "JSON → Avro Migration",
    blurb:
      "Org-wide migration of Kafka event pipelines to Avro with Confluent Schema Registry, enforcing schema contracts and safe evolution.",
    metrics: ["~1.5B events", "~50% storage cut", "schema governance"],
    tech: ["Kafka", "Avro", "Confluent Schema Registry"],
  },
  {
    icon: Layers,
    name: "Databricks Lakehouse Pipelines",
    blurb:
      "Streaming and micro-batch ingestion with layered Bronze/Silver/Gold pipelines, plus 100% parity with the BigQuery warehouse.",
    metrics: ["medallion architecture", "100% data parity", "analytics + ML ready"],
    tech: ["Databricks", "PySpark", "Spark", "Kafka"],
  },
  {
    icon: Gauge,
    name: "BigQuery Cost Governance",
    blurb:
      "Platform-wide cost strategy — TTLs, lifecycle management, job governance, and dataset purging with durable guardrails.",
    metrics: ["~90% cost cut", "~100 TB managed", "cost-governance guardrails"],
    tech: ["BigQuery", "SQL"],
  },
];

const SKILLS = [
  { n: "Node.js", c: "lang", l: 95 }, { n: "TypeScript", c: "lang", l: 93 },
  { n: "JavaScript", c: "lang", l: 92 }, { n: "Python", c: "lang", l: 88 },
  { n: "PySpark", c: "lang", l: 85 }, { n: "SQL", c: "lang", l: 85 },
  { n: "Java", c: "lang", l: 65 },
  { n: "Apache Kafka", c: "stream", l: 92 }, { n: "Avro", c: "stream", l: 80 },
  { n: "Schema Registry", c: "stream", l: 78 }, { n: "Microservices", c: "stream", l: 90 },
  { n: "Event-Driven Arch", c: "stream", l: 90 }, { n: "REST APIs", c: "stream", l: 90 },
  { n: "Express.js", c: "stream", l: 85 },
  { n: "BigQuery", c: "data", l: 92 }, { n: "Databricks", c: "data", l: 85 },
  { n: "Apache Spark", c: "data", l: 82 }, { n: "Medallion / Lakehouse", c: "data", l: 82 },
  { n: "Data Pipelines", c: "data", l: 88 }, { n: "Redis", c: "data", l: 82 },
  { n: "MongoDB", c: "data", l: 82 },
  { n: "GCP", c: "cloud", l: 85 }, { n: "Azure", c: "cloud", l: 80 },
  { n: "AKS", c: "cloud", l: 80 }, { n: "Kubernetes", c: "cloud", l: 80 },
  { n: "Docker", c: "cloud", l: 82 }, { n: "NGINX", c: "cloud", l: 72 },
  { n: "Prometheus", c: "devops", l: 76 }, { n: "Grafana", c: "devops", l: 80 },
  { n: "Git", c: "devops", l: 90 }, { n: "CI/CD", c: "devops", l: 82 },
  { n: "GitHub Actions", c: "devops", l: 80 },
];

const CATS = [
  { id: "all", label: "All" },
  { id: "lang", label: "Languages" },
  { id: "stream", label: "Streaming & Backend" },
  { id: "data", label: "Data & Stores" },
  { id: "cloud", label: "Cloud & Infra" },
  { id: "devops", label: "Observability & CI/CD" },
];

const CAT_ICON = {
  lang: Terminal, stream: Zap, data: Database, cloud: Cloud, devops: Activity,
};

const NAV = [
  ["about", "About"], ["experience", "Experience"],
  ["work", "Work"], ["skills", "Skills"], ["contact", "Contact"],
];

/* ---------- component ---------- */
export default function Portfolio() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [toTop, setToTop] = useState(false);
  const [filter, setFilter] = useState("all");
  const [openKey, setOpenKey] = useState("Tata Digital-0");
  const [scrolled, setScrolled] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % HERO_ROLES.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setToTop(h.scrollTop > 600);
      setScrolled(h.scrollTop > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduce) return;
    const move = (e) => {
      if (cursorRef.current)
        cursorRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const go = useCallback((id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const shownSkills = filter === "all" ? SKILLS : SKILLS.filter((s) => s.c === filter);

  return (
    <div className="pf">
      <style>{CSS}</style>

      <div className="pf-cursor" ref={cursorRef} aria-hidden />
      <div className="pf-progress" style={{ width: `${progress}%` }} aria-hidden />

      {/* ambient background */}
      <div className="pf-bg" aria-hidden>
        <div className="pf-blob pf-blob-a" />
        <div className="pf-blob pf-blob-b" />
        <div className="pf-grid" />
      </div>

      {/* nav */}
      <header className={`pf-nav ${scrolled ? "pf-nav-solid" : ""}`}>
        <a href="#top" className="pf-brand" onClick={go("top")}>
          <span className="pf-brand-mark">AP</span>
          <span className="pf-brand-name">Aakash Porwal</span>
        </a>
        <nav className="pf-nav-links">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>{label}</a>
          ))}
        </nav>
        <a className="pf-btn pf-btn-ghost pf-nav-cta" href={RESUME_URL} download>
          <Download size={15} /> Résumé
        </a>
      </header>

      <main id="top">
        {/* hero */}
        <section className="pf-hero" aria-label="Introduction">
          <Reveal>
            <p className="pf-eyebrow">
              <MapPin size={13} /> Bangalore, India
              <span className="pf-dot" /> open to Senior / SDE-3 roles
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="pf-h1">
              Aakash <span className="pf-grad">Porwal</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <div className="pf-role-wrap">
              <span className="pf-role-tick" />
              <span className="pf-role" key={roleIdx}>{HERO_ROLES[roleIdx]}</span>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <p className="pf-lede">
              I design and operate high-scale, event-driven systems and real-time
              data platforms — from a <strong>300M+ events/day</strong> analytics
              engine to org-wide streaming and cost-governance initiatives at Tata
              Digital.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="pf-cta-row">
              <a className="pf-btn pf-btn-primary" href={RESUME_URL} download>
                <Download size={16} /> Download résumé
              </a>
              <a className="pf-btn pf-btn-ghost" href="#contact" onClick={go("contact")}>
                Get in touch <ArrowUpRight size={16} />
              </a>
              <div className="pf-social">
                <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>
                <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
                <a href={`mailto:${LINKS.email}`} aria-label="Email"><Mail size={19} /></a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="pf-stats">
              <Stat value={300} suffix="M+" label="events / day" />
              <Stat value={1.5} decimals={1} suffix="B" label="events migrated to Avro" />
              <Stat value={90} suffix="%" label="BigQuery cost cut" />
              <Stat value={100} suffix="TB" label="data managed" />
            </div>
          </Reveal>

          <a className="pf-scroll-ind" href="#about" onClick={go("about")} aria-label="Scroll">
            <span>scroll</span><ChevronDown size={16} />
          </a>
        </section>

        {/* tech marquee */}
        <div className="pf-marquee" aria-hidden>
          <div className="pf-marquee-track">
            {[...TECHCLOUD, ...TECHCLOUD].map((t, i) => (
              <span className="pf-chip pf-chip-sm" key={i}>{t}</span>
            ))}
          </div>
        </div>

        {/* about */}
        <section id="about" className="pf-section">
          <Reveal><p className="pf-kicker">about</p></Reveal>
          <div className="pf-about">
            <Reveal delay={60}>
              <h2 className="pf-h2">
                Backend engineer at the seam of{" "}
                <span className="pf-grad">distributed systems</span> and data
                engineering.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <div className="pf-about-body">
                <p>
                  I'm a backend-focused engineer with <strong>4.5+ years</strong> at
                  Tata Digital. I architected <strong>JARVIS</strong> — the company's
                  first platform to unify native-app and WebView journeys into a single
                  customer journey — and have since owned platform-wide initiatives
                  across Kafka, BigQuery and Databricks.
                </p>
                <p>
                  That includes a JSON-to-Avro migration over <strong>~1.5B events</strong>,
                  a <strong>~90% BigQuery cost reduction</strong>, and{" "}
                  <strong>100% data parity</strong> between our lakehouse and warehouse.
                  I like owning systems end to end — architecture, reliability, and the
                  production health that keeps them honest.
                </p>
                <div className="pf-about-tags">
                  <span><Server size={14} /> Distributed systems</span>
                  <span><Zap size={14} /> Event-driven</span>
                  <span><Boxes size={14} /> Data platforms</span>
                  <span><Sparkles size={14} /> Technical leadership</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* experience */}
        <section id="experience" className="pf-section">
          <Reveal><p className="pf-kicker">experience</p></Reveal>
          <Reveal delay={60}><h2 className="pf-h2">Where I've built</h2></Reveal>
          <div className="pf-timeline">
            {EXPERIENCE.map((org) =>
              org.roles.map((role, ri) => {
                const key = `${org.company}-${ri}`;
                const open = openKey === key;
                return (
                  <Reveal key={key} delay={40}>
                    <article
                      className={`pf-xp ${open ? "pf-xp-open" : ""}`}
                      style={{ "--accent": org.accent }}
                    >
                      <div className="pf-xp-rail"><span className="pf-xp-node" /></div>
                      <div className="pf-xp-body">
                        <button
                          className="pf-xp-head"
                          onClick={() => setOpenKey(open ? null : key)}
                          aria-expanded={open}
                        >
                          <div>
                            <h3 className="pf-xp-role">{role.title}</h3>
                            <p className="pf-xp-meta">
                              <span className="pf-xp-co">{org.company}</span>
                              {org.location && <span className="pf-xp-loc">· {org.location}</span>}
                            </p>
                          </div>
                          <div className="pf-xp-right">
                            <span className="pf-xp-dates">{role.dates}</span>
                            <ChevronDown size={18} className="pf-xp-caret" />
                          </div>
                        </button>
                        <p className="pf-xp-summary">{role.summary}</p>
                        <div className="pf-xp-collapse">
                          <div className="pf-xp-collapse-inner">
                            <ul className="pf-xp-points">
                              {role.points.map((p, i) => (
                                <li key={i}><span className="pf-bullet" />{p}</li>
                              ))}
                            </ul>
                            <div className="pf-xp-tech">
                              {role.tech.map((t) => (
                                <span className="pf-chip pf-chip-out" key={t}>{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })
            )}
          </div>
        </section>

        {/* work / projects */}
        <section id="work" className="pf-section">
          <Reveal><p className="pf-kicker">selected work</p></Reveal>
          <Reveal delay={60}><h2 className="pf-h2">Systems I've shipped</h2></Reveal>
          <div className="pf-projects">
            {PROJECTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.name} delay={i * 70}>
                  <article className="pf-card">
                    <div className="pf-card-top">
                      <span className="pf-card-icon"><Icon size={20} /></span>
                      <span className="pf-card-tag">Production · Tata Digital</span>
                    </div>
                    <h3 className="pf-card-title">{p.name}</h3>
                    <p className="pf-card-blurb">{p.blurb}</p>
                    <ul className="pf-card-metrics">
                      {p.metrics.map((m) => (
                        <li key={m}><span className="pf-metric-dot" />{m}</li>
                      ))}
                    </ul>
                    <div className="pf-card-tech">
                      {p.tech.map((t) => (
                        <span className="pf-chip pf-chip-out" key={t}>{t}</span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* skills */}
        <section id="skills" className="pf-section">
          <Reveal><p className="pf-kicker">toolkit</p></Reveal>
          <Reveal delay={60}><h2 className="pf-h2">Skills & technologies</h2></Reveal>
          <Reveal delay={110}>
            <div className="pf-filters">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  className={`pf-filter ${filter === c.id ? "pf-filter-on" : ""}`}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="pf-skills">
            {shownSkills.map((s, i) => {
              const Icon = CAT_ICON[s.c] || Terminal;
              return (
                <Reveal key={s.n} delay={Math.min(i * 22, 260)}>
                  <div className="pf-skill" style={{ "--lvl": `${s.l}%` }}>
                    <div className="pf-skill-head">
                      <span className="pf-skill-glyph"><Icon size={15} /></span>
                      <span className="pf-skill-name">{s.n}</span>
                    </div>
                    <div className="pf-skill-bar"><span className="pf-skill-fill" /></div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* education */}
        <section id="education" className="pf-section">
          <Reveal><p className="pf-kicker">education</p></Reveal>
          <Reveal delay={60}>
            <div className="pf-edu">
              <div className="pf-edu-icon"><Layers size={22} /></div>
              <div className="pf-edu-body">
                <h3>B.E., Computer Science & Engineering</h3>
                <p>Birla Institute of Technology, Mesra</p>
              </div>
              <div className="pf-edu-meta">
                <span>2021</span><span className="pf-edu-gpa">GPA 7.27</span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* contact */}
        <section id="contact" className="pf-section pf-contact">
          <Reveal><p className="pf-kicker">contact</p></Reveal>
          <Reveal delay={60}>
            <h2 className="pf-h2 pf-contact-h">
              Let's build something that<br /><span className="pf-grad">scales</span>.
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="pf-contact-sub">
              Open to Senior Software Engineer / SDE-3 roles in backend, distributed
              systems, and platform engineering.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="pf-contact-actions">
              <a className="pf-btn pf-btn-primary" href={`mailto:${LINKS.email}`}>
                <Mail size={16} /> {LINKS.email}
              </a>
              <a className="pf-btn pf-btn-ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a className="pf-btn pf-btn-ghost" href={LINKS.github} target="_blank" rel="noreferrer">
                <Github size={16} /> GitHub
              </a>
            </div>
          </Reveal>
        </section>

        <footer className="pf-footer">
          <span>© {new Date().getFullYear()} Aakash Porwal</span>
          <span className="pf-footer-mono">designed & built · real-time by nature</span>
        </footer>
      </main>

      <button
        className={`pf-totop ${toTop ? "pf-totop-on" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}

const TECHCLOUD = [
  "Node.js", "TypeScript", "Python", "PySpark", "Apache Kafka", "Avro",
  "BigQuery", "Databricks", "Apache Spark", "Kubernetes", "Docker", "GCP",
  "Azure", "Redis", "MongoDB", "Grafana", "Prometheus", "Git", "CI/CD",
];

/* ---------- styles ---------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.pf{
  --bg:#0B0E14; --bg-2:#0E1220; --surface:rgba(255,255,255,0.03);
  --surface-2:rgba(255,255,255,0.05); --border:rgba(255,255,255,0.08);
  --border-2:rgba(255,255,255,0.14); --text:#E7ECF3; --muted:#93A0B4;
  --muted-2:#68758A; --violet:#7C5CFF; --cyan:#22D3EE; --amber:#F5B841;
  --grad:linear-gradient(115deg,#7C5CFF 0%,#22D3EE 100%);
  --font-d:'Space Grotesk','Segoe UI',system-ui,sans-serif;
  --font-b:'Inter',system-ui,-apple-system,sans-serif;
  --font-m:'JetBrains Mono','SF Mono',ui-monospace,monospace;
  background:var(--bg); color:var(--text); font-family:var(--font-b);
  line-height:1.6; position:relative; overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.pf *{ box-sizing:border-box; }
.pf a{ color:inherit; text-decoration:none; }
.pf ::selection{ background:rgba(124,92,255,.35); color:#fff; }
.pf strong{ color:var(--text); font-weight:600; }

/* background */
.pf-bg{ position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.pf-blob{ position:absolute; border-radius:50%; filter:blur(90px); opacity:.5; }
.pf-blob-a{ width:46vw; height:46vw; left:-10vw; top:-8vw;
  background:radial-gradient(circle,#7C5CFF 0%,transparent 68%);
  animation:pf-drift-a 22s ease-in-out infinite; }
.pf-blob-b{ width:42vw; height:42vw; right:-12vw; top:32vh;
  background:radial-gradient(circle,#22D3EE 0%,transparent 68%); opacity:.35;
  animation:pf-drift-b 26s ease-in-out infinite; }
.pf-grid{ position:absolute; inset:0;
  background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
  background-size:64px 64px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000 30%,transparent 75%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000 30%,transparent 75%); }
@keyframes pf-drift-a{ 50%{ transform:translate(6vw,4vh) scale(1.08);} }
@keyframes pf-drift-b{ 50%{ transform:translate(-5vw,-3vh) scale(1.12);} }

/* cursor + progress */
.pf-cursor{ position:fixed; top:0; left:0; width:26px; height:26px; margin:-13px 0 0 -13px;
  border-radius:50%; background:radial-gradient(circle,rgba(124,92,255,.55),transparent 70%);
  pointer-events:none; z-index:60; mix-blend-mode:screen; transition:opacity .3s; }
.pf-progress{ position:fixed; top:0; left:0; height:2px; z-index:70;
  background:var(--grad); box-shadow:0 0 12px rgba(124,92,255,.6); }

/* nav */
.pf-nav{ position:fixed; top:0; left:0; right:0; z-index:50;
  display:flex; align-items:center; justify-content:space-between;
  padding:18px clamp(20px,5vw,64px); transition:background .3s,border-color .3s,padding .3s;
  border-bottom:1px solid transparent; }
.pf-nav-solid{ background:rgba(11,14,20,.72); backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border); padding-top:12px; padding-bottom:12px; }
.pf-brand{ display:flex; align-items:center; gap:11px; font-family:var(--font-d); font-weight:600; }
.pf-brand-mark{ display:grid; place-items:center; width:34px; height:34px; border-radius:9px;
  background:var(--grad); color:#0B0E14; font-weight:700; font-size:14px; letter-spacing:.5px; }
.pf-brand-name{ font-size:15px; letter-spacing:.2px; }
.pf-nav-links{ display:flex; gap:30px; font-size:14px; color:var(--muted); }
.pf-nav-links a{ position:relative; transition:color .2s; }
.pf-nav-links a:hover{ color:var(--text); }
.pf-nav-links a::after{ content:""; position:absolute; left:0; bottom:-6px; height:1.5px; width:0;
  background:var(--grad); transition:width .25s; }
.pf-nav-links a:hover::after{ width:100%; }
.pf-nav-cta{ padding:8px 15px; font-size:13.5px; }

/* buttons */
.pf-btn{ display:inline-flex; align-items:center; gap:8px; font-weight:500; font-size:14.5px;
  padding:12px 20px; border-radius:11px; cursor:pointer; transition:transform .2s,box-shadow .25s,background .2s,border-color .2s;
  border:1px solid transparent; font-family:var(--font-b); }
.pf-btn-primary{ background:var(--grad); color:#08111a; font-weight:600;
  box-shadow:0 8px 26px -10px rgba(124,92,255,.7); }
.pf-btn-primary:hover{ transform:translateY(-2px); box-shadow:0 14px 34px -10px rgba(34,211,238,.6); }
.pf-btn-ghost{ background:var(--surface); border-color:var(--border-2); color:var(--text); }
.pf-btn-ghost:hover{ transform:translateY(-2px); background:var(--surface-2); border-color:var(--violet); }

/* hero */
.pf-hero{ position:relative; z-index:2; max-width:1080px; margin:0 auto;
  padding:clamp(120px,20vh,190px) clamp(20px,5vw,40px) 60px; }
.pf-eyebrow{ display:inline-flex; align-items:center; gap:9px; font-family:var(--font-m);
  font-size:12.5px; color:var(--muted); letter-spacing:.3px; margin:0 0 26px;
  padding:7px 13px; border:1px solid var(--border); border-radius:100px; background:var(--surface); }
.pf-dot{ width:5px; height:5px; border-radius:50%; background:var(--cyan);
  box-shadow:0 0 8px var(--cyan); animation:pf-pulse 2s infinite; }
@keyframes pf-pulse{ 50%{ opacity:.35; } }
.pf-h1{ font-family:var(--font-d); font-weight:600; letter-spacing:-.03em; line-height:1.02;
  font-size:clamp(46px,9vw,104px); margin:0 0 18px; }
.pf-grad{ background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; }
.pf-role-wrap{ display:flex; align-items:center; gap:14px; height:34px; margin-bottom:24px; }
.pf-role-tick{ width:34px; height:2px; background:var(--grad); border-radius:2px; }
.pf-role{ font-family:var(--font-m); font-size:clamp(15px,2.4vw,20px); color:var(--cyan);
  letter-spacing:.2px; animation:pf-role-in .5s ease; }
@keyframes pf-role-in{ from{ opacity:0; transform:translateY(8px);} to{ opacity:1; transform:none;} }
.pf-lede{ max-width:640px; font-size:clamp(16px,2.2vw,19px); color:var(--muted); margin:0 0 36px; }
.pf-cta-row{ display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.pf-social{ display:flex; gap:8px; margin-left:6px; }
.pf-social a{ display:grid; place-items:center; width:42px; height:42px; border-radius:11px;
  color:var(--muted); border:1px solid var(--border); background:var(--surface);
  transition:transform .2s,color .2s,border-color .2s; }
.pf-social a:hover{ color:var(--text); transform:translateY(-2px); border-color:var(--violet); }

/* stats */
.pf-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:56px;
  padding:26px; border:1px solid var(--border); border-radius:18px;
  background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01)); }
.pf-stat{ text-align:left; }
.pf-stat-num{ font-family:var(--font-d); font-weight:600; font-size:clamp(28px,4.6vw,44px);
  color:var(--amber); letter-spacing:-.02em; line-height:1; }
.pf-stat-suffix{ font-size:.55em; margin-left:2px; color:var(--amber); }
.pf-stat-label{ font-size:12.5px; color:var(--muted); margin-top:9px; font-family:var(--font-m); letter-spacing:.2px; }

.pf-scroll-ind{ display:inline-flex; flex-direction:column; align-items:center; gap:5px;
  margin-top:56px; font-family:var(--font-m); font-size:11px; color:var(--muted-2); letter-spacing:1px;
  text-transform:uppercase; animation:pf-bob 2.2s ease-in-out infinite; }
@keyframes pf-bob{ 50%{ transform:translateY(6px); } }

/* marquee */
.pf-marquee{ position:relative; z-index:2; overflow:hidden; padding:22px 0;
  border-top:1px solid var(--border); border-bottom:1px solid var(--border);
  mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
  background:rgba(255,255,255,.01); }
.pf-marquee-track{ display:flex; gap:12px; width:max-content; animation:pf-scroll 34s linear infinite; }
.pf-marquee:hover .pf-marquee-track{ animation-play-state:paused; }
@keyframes pf-scroll{ to{ transform:translateX(-50%); } }

/* chips */
.pf-chip{ display:inline-flex; align-items:center; font-family:var(--font-m); font-size:12.5px;
  color:var(--muted); padding:7px 13px; border-radius:9px; border:1px solid var(--border);
  background:var(--surface); white-space:nowrap; }
.pf-chip-sm{ font-size:12px; padding:6px 12px; color:var(--text); }
.pf-chip-out{ background:transparent; color:var(--muted); transition:color .2s,border-color .2s; }
.pf-xp-tech .pf-chip-out:hover,.pf-card-tech .pf-chip-out:hover{ color:var(--text); border-color:var(--violet); }

/* sections */
.pf-section{ position:relative; z-index:2; max-width:1080px; margin:0 auto;
  padding:clamp(72px,11vh,120px) clamp(20px,5vw,40px); }
.pf-kicker{ font-family:var(--font-m); font-size:12.5px; color:var(--cyan); letter-spacing:2px;
  text-transform:uppercase; margin:0 0 18px; display:flex; align-items:center; gap:12px; }
.pf-kicker::before{ content:""; width:26px; height:1.5px; background:var(--grad); }
.pf-h2{ font-family:var(--font-d); font-weight:600; letter-spacing:-.02em; line-height:1.12;
  font-size:clamp(28px,4.6vw,44px); margin:0 0 8px; max-width:820px; }

/* about */
.pf-about{ display:grid; grid-template-columns:1fr 1fr; gap:clamp(28px,5vw,64px); align-items:start; margin-top:20px; }
.pf-about-body p{ color:var(--muted); font-size:16.5px; margin:0 0 18px; }
.pf-about-tags{ display:flex; flex-wrap:wrap; gap:10px; margin-top:26px; }
.pf-about-tags span{ display:inline-flex; align-items:center; gap:8px; font-size:13.5px; color:var(--text);
  padding:9px 14px; border-radius:100px; border:1px solid var(--border); background:var(--surface); }
.pf-about-tags svg{ color:var(--cyan); }

/* timeline */
.pf-timeline{ margin-top:34px; display:flex; flex-direction:column; gap:14px; }
.pf-xp{ --accent:var(--violet); display:flex; gap:20px; }
.pf-xp-rail{ position:relative; width:14px; flex:none; display:flex; justify-content:center; padding-top:24px; }
.pf-xp-rail::before{ content:""; position:absolute; top:0; bottom:-14px; width:1.5px;
  background:linear-gradient(var(--border),transparent); }
.pf-xp:last-child .pf-xp-rail::before{ display:none; }
.pf-xp-node{ position:relative; z-index:1; width:12px; height:12px; border-radius:50%;
  background:var(--bg); border:2px solid var(--accent); box-shadow:0 0 0 4px rgba(124,92,255,.08); }
.pf-xp-body{ flex:1; border:1px solid var(--border); border-radius:16px; padding:22px 24px;
  background:var(--surface); transition:border-color .25s,background .25s; }
.pf-xp-open .pf-xp-body,.pf-xp-body:hover{ border-color:var(--border-2); background:var(--surface-2); }
.pf-xp-head{ width:100%; display:flex; align-items:flex-start; justify-content:space-between; gap:16px;
  background:none; border:none; padding:0; cursor:pointer; color:inherit; text-align:left; font-family:inherit; }
.pf-xp-role{ font-family:var(--font-d); font-weight:600; font-size:19px; margin:0 0 5px; }
.pf-xp-meta{ margin:0; font-size:14px; color:var(--muted); }
.pf-xp-co{ color:var(--accent); font-weight:600; }
.pf-xp-loc{ margin-left:6px; }
.pf-xp-right{ display:flex; align-items:center; gap:12px; flex:none; }
.pf-xp-dates{ font-family:var(--font-m); font-size:12.5px; color:var(--muted-2); white-space:nowrap; }
.pf-xp-caret{ color:var(--muted); transition:transform .3s; }
.pf-xp-open .pf-xp-caret{ transform:rotate(180deg); }
.pf-xp-summary{ color:var(--muted); font-size:15px; margin:12px 0 0; }
.pf-xp-collapse{ display:grid; grid-template-rows:0fr; transition:grid-template-rows .35s ease; }
.pf-xp-open .pf-xp-collapse{ grid-template-rows:1fr; }
.pf-xp-collapse-inner{ overflow:hidden; }
.pf-xp-points{ list-style:none; padding:0; margin:18px 0 0; display:flex; flex-direction:column; gap:11px; }
.pf-xp-points li{ position:relative; display:flex; gap:11px; font-size:14.5px; color:var(--muted); }
.pf-bullet{ flex:none; width:6px; height:6px; margin-top:8px; border-radius:50%; background:var(--accent); }
.pf-xp-tech{ display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }

/* projects */
.pf-projects{ margin-top:34px; display:grid; grid-template-columns:1fr 1fr; gap:18px; }
.pf-card{ position:relative; border:1px solid var(--border); border-radius:18px; padding:26px;
  background:var(--surface); overflow:hidden; transition:transform .25s,border-color .25s,background .25s; }
.pf-card::before{ content:""; position:absolute; inset:0; border-radius:18px; padding:1px;
  background:var(--grad); opacity:0; transition:opacity .3s;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude; }
.pf-card:hover{ transform:translateY(-5px); background:var(--surface-2); }
.pf-card:hover::before{ opacity:.9; }
.pf-card-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
.pf-card-icon{ display:grid; place-items:center; width:44px; height:44px; border-radius:12px;
  background:linear-gradient(135deg,rgba(124,92,255,.22),rgba(34,211,238,.18)); color:var(--cyan);
  border:1px solid var(--border); }
.pf-card-tag{ font-family:var(--font-m); font-size:10.5px; color:var(--muted-2); letter-spacing:.4px;
  text-transform:uppercase; padding:5px 10px; border:1px solid var(--border); border-radius:100px; }
.pf-card-title{ font-family:var(--font-d); font-weight:600; font-size:19px; margin:0 0 10px; line-height:1.25; }
.pf-card-blurb{ color:var(--muted); font-size:14.5px; margin:0 0 16px; }
.pf-card-metrics{ list-style:none; padding:0; margin:0 0 18px; display:flex; flex-direction:column; gap:8px; }
.pf-card-metrics li{ display:flex; align-items:center; gap:10px; font-size:13.5px; color:var(--text); font-family:var(--font-m); }
.pf-metric-dot{ width:5px; height:5px; border-radius:50%; background:var(--amber); box-shadow:0 0 8px rgba(245,184,65,.6); }
.pf-card-tech{ display:flex; flex-wrap:wrap; gap:7px; }

/* skills */
.pf-filters{ display:flex; flex-wrap:wrap; gap:9px; margin:26px 0 30px; }
.pf-filter{ font-family:var(--font-m); font-size:13px; color:var(--muted); cursor:pointer;
  padding:8px 15px; border-radius:100px; border:1px solid var(--border); background:var(--surface);
  transition:color .2s,border-color .2s,background .2s; }
.pf-filter:hover{ color:var(--text); border-color:var(--border-2); }
.pf-filter-on{ color:#08111a; background:var(--grad); border-color:transparent; font-weight:500; }
.pf-skills{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.pf-skill{ border:1px solid var(--border); border-radius:13px; padding:15px 16px; background:var(--surface);
  transition:transform .2s,border-color .2s,background .2s; }
.pf-skill:hover{ transform:translateY(-3px); border-color:var(--border-2); background:var(--surface-2); }
.pf-skill-head{ display:flex; align-items:center; gap:10px; margin-bottom:12px; }
.pf-skill-glyph{ display:grid; place-items:center; width:28px; height:28px; border-radius:8px;
  background:rgba(124,92,255,.14); color:var(--cyan); flex:none; }
.pf-skill-name{ font-size:14px; font-weight:500; color:var(--text); }
.pf-skill-bar{ height:4px; border-radius:100px; background:rgba(255,255,255,.06); overflow:hidden; }
.pf-skill-fill{ display:block; height:100%; width:0; border-radius:100px; background:var(--grad);
  animation:pf-fill 1.1s .1s cubic-bezier(.2,.7,.2,1) forwards; }
@keyframes pf-fill{ to{ width:var(--lvl); } }

/* education */
.pf-edu{ margin-top:20px; display:flex; align-items:center; gap:20px; padding:24px 26px;
  border:1px solid var(--border); border-radius:18px; background:var(--surface); }
.pf-edu-icon{ display:grid; place-items:center; width:52px; height:52px; border-radius:13px; flex:none;
  background:linear-gradient(135deg,rgba(124,92,255,.22),rgba(34,211,238,.18)); color:var(--cyan); }
.pf-edu-body{ flex:1; }
.pf-edu-body h3{ font-family:var(--font-d); font-weight:600; font-size:17px; margin:0 0 4px; }
.pf-edu-body p{ color:var(--muted); font-size:14.5px; margin:0; }
.pf-edu-meta{ display:flex; flex-direction:column; align-items:flex-end; gap:6px; font-family:var(--font-m); font-size:13px; color:var(--muted); }
.pf-edu-gpa{ color:var(--amber); }

/* contact */
.pf-contact{ text-align:center; }
.pf-contact .pf-kicker{ justify-content:center; }
.pf-contact-h{ margin:0 auto 18px; }
.pf-contact-sub{ color:var(--muted); font-size:17px; max-width:560px; margin:0 auto 34px; }
.pf-contact-actions{ display:flex; justify-content:center; gap:14px; flex-wrap:wrap; }

/* footer */
.pf-footer{ position:relative; z-index:2; max-width:1080px; margin:0 auto;
  padding:34px clamp(20px,5vw,40px); border-top:1px solid var(--border);
  display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;
  font-size:13px; color:var(--muted-2); }
.pf-footer-mono{ font-family:var(--font-m); }

/* back to top */
.pf-totop{ position:fixed; right:26px; bottom:26px; z-index:55; width:46px; height:46px; border-radius:13px;
  display:grid; place-items:center; cursor:pointer; color:var(--text);
  background:rgba(11,14,20,.8); backdrop-filter:blur(10px); border:1px solid var(--border-2);
  opacity:0; transform:translateY(14px) scale(.9); pointer-events:none;
  transition:opacity .3s,transform .3s,border-color .2s; }
.pf-totop-on{ opacity:1; transform:none; pointer-events:auto; }
.pf-totop:hover{ border-color:var(--violet); transform:translateY(-2px); }

/* reveal */
.pf-reveal{ opacity:0; transform:translateY(22px); transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1); }
.pf-reveal.pf-in{ opacity:1; transform:none; }

/* focus */
.pf a:focus-visible,.pf button:focus-visible{ outline:2px solid var(--cyan); outline-offset:3px; border-radius:8px; }

/* responsive */
@media (max-width:860px){
  .pf-nav-links{ display:none; }
  .pf-about{ grid-template-columns:1fr; }
  .pf-projects{ grid-template-columns:1fr; }
  .pf-skills{ grid-template-columns:repeat(2,1fr); }
  .pf-stats{ grid-template-columns:repeat(2,1fr); gap:22px 14px; }
}
@media (max-width:480px){
  .pf-skills{ grid-template-columns:1fr; }
  .pf-cta-row{ gap:12px; }
  .pf-edu{ flex-wrap:wrap; }
  .pf-edu-meta{ flex-direction:row; align-items:center; gap:14px; }
}
@media (prefers-reduced-motion:reduce){
  .pf *{ animation:none !important; transition:none !important; }
  .pf-reveal{ opacity:1; transform:none; }
  .pf-skill-fill{ width:var(--lvl); }
  .pf-cursor{ display:none; }
}
`;
