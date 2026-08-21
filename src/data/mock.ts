import type {
  ActivityItem,
  AdminUser,
  Agent,
  CurrentUser,
  MarketEvent,
  SeriesPoint,
  Simulation,
} from "./types";

export const currentUser: CurrentUser = {
  name: "Alex Moreau",
  email: "alex@northwind.io",
  company: "Northwind Labs",
  role: "Head of Strategy",
  initials: "AM",
  plan: "Professional (Trial)",
  trialDaysLeft: 21,
};

export const agents: Agent[] = [
  {
    id: "ceo",
    code: "AGENT_01",
    name: "CEO Agent",
    role: "Executive orchestration",
    description: "Orchestrates cross-functional alignment and long-term vision.",
    status: "analyzing",
    currentTask: "Reconciling growth targets with capital constraints",
    decision: "Prioritise mid-market expansion over enterprise pilots",
    impact: "Revenue trajectory +6.4%",
    impactDirection: "positive",
  },
  {
    id: "finance",
    code: "AGENT_02",
    name: "Finance Agent",
    role: "Capital & P&L",
    description: "Manages burn rate, capital allocation, and P&L modeling.",
    status: "thinking",
    currentTask: "Modelling runway under three spend scenarios",
    decision: "Hold 14% of budget as contingency reserve",
    impact: "Runway extended by 2.1 months",
    impactDirection: "positive",
  },
  {
    id: "marketing",
    code: "AGENT_03",
    name: "Marketing Agent",
    role: "Demand generation",
    description: "Simulates customer acquisition costs and brand penetration.",
    status: "waiting",
    currentTask: "Awaiting budget allocation from Finance Agent",
    decision: "Shift 30% of spend to retention campaigns",
    impact: "CAC down 11%, reach down 4%",
    impactDirection: "neutral",
  },
  {
    id: "sales",
    code: "AGENT_04",
    name: "Sales Agent",
    role: "Pipeline & conversion",
    description: "Models pipeline velocity and conversion probabilities.",
    status: "completed",
    currentTask: "Round 14 pipeline forecast delivered",
    decision: "Add two mid-market reps in region EU-West",
    impact: "Bookings +$412K next round",
    impactDirection: "positive",
  },
  {
    id: "hr",
    code: "AGENT_05",
    name: "HR Agent",
    role: "Talent & capacity",
    description: "Analyzes talent density, churn risk, and hiring velocity.",
    status: "thinking",
    currentTask: "Evaluating attrition risk in engineering",
    decision: "Bring forward compensation review by one quarter",
    impact: "Attrition risk down 3.2 pts",
    impactDirection: "positive",
  },
  {
    id: "operations",
    code: "AGENT_06",
    name: "Operations Agent",
    role: "Delivery & supply",
    description: "Simulates supply chain resilience and delivery overhead.",
    status: "analyzing",
    currentTask: "Stress-testing supplier concentration",
    decision: "Dual-source the top two components",
    impact: "Unit cost +2.1%, disruption risk -18%",
    impactDirection: "neutral",
  },
  {
    id: "strategy",
    code: "AGENT_07",
    name: "Strategy Agent",
    role: "Market positioning",
    description: "Synthesizes competitive data for market positioning.",
    status: "thinking",
    currentTask: "Mapping competitor pricing moves",
    decision: "Introduce a usage-based tier in round 16",
    impact: "Market share +1.8 pts projected",
    impactDirection: "positive",
  },
  {
    id: "risk",
    code: "AGENT_08",
    name: "Risk Agent",
    role: "Risk & compliance",
    description: "Flags regulatory hurdles and market volatility threats.",
    status: "warning",
    currentTask: "Reviewing exposure to new data-residency rules",
    decision: "Escalate: EU hosting required before round 18",
    impact: "Compliance cost +$180K if deferred",
    impactDirection: "negative",
  },
];

export const simulations: Simulation[] = [
  {
    id: "sim-8241",
    name: "EU Market Entry — Aggressive",
    industry: "B2B SaaS",
    status: "running",
    createdAt: "2026-08-14",
    rounds: 24,
    currentRound: 14,
    score: 82,
    revenue: 4200000,
    profit: 842000,
    customers: 42091,
    marketShare: 18.2,
    riskScore: 0.24,
  },
  {
    id: "sim-8190",
    name: "Pricing Overhaul Q3",
    industry: "B2B SaaS",
    status: "completed",
    createdAt: "2026-07-29",
    rounds: 18,
    currentRound: 18,
    score: 91,
    revenue: 3860000,
    profit: 1020000,
    customers: 38740,
    marketShare: 16.4,
    riskScore: 0.11,
  },
  {
    id: "sim-8102",
    name: "Retail Expansion — Conservative",
    industry: "Retail",
    status: "completed",
    createdAt: "2026-07-11",
    rounds: 12,
    currentRound: 12,
    score: 68,
    revenue: 2140000,
    profit: 214000,
    customers: 18220,
    marketShare: 7.9,
    riskScore: 0.38,
  },
  {
    id: "sim-8044",
    name: "Supply Shock Stress Test",
    industry: "Manufacturing",
    status: "failed",
    createdAt: "2026-06-30",
    rounds: 16,
    currentRound: 9,
    score: 41,
    revenue: 1490000,
    profit: -180000,
    customers: 9120,
    marketShare: 4.2,
    riskScore: 0.71,
  },
  {
    id: "sim-7998",
    name: "Series B Runway Model",
    industry: "Fintech",
    status: "draft",
    createdAt: "2026-06-18",
    rounds: 20,
    currentRound: 0,
    score: 0,
    revenue: 0,
    profit: 0,
    customers: 0,
    marketShare: 0,
    riskScore: 0,
  },
  {
    id: "sim-7930",
    name: "Churn Reduction Programme",
    industry: "B2B SaaS",
    status: "archived",
    createdAt: "2026-05-22",
    rounds: 14,
    currentRound: 14,
    score: 76,
    revenue: 2980000,
    profit: 604000,
    customers: 31400,
    marketShare: 12.1,
    riskScore: 0.19,
  },
];

export const series: SeriesPoint[] = Array.from({ length: 14 }, (_, i) => {
  const r = i + 1;
  const revenue = 1_200_000 + r * 215_000 + (r % 3) * 42_000;
  const expenses = 980_000 + r * 148_000;
  return {
    round: `R${r}`,
    revenue,
    expenses,
    profit: revenue - expenses,
    customers: 6_400 + r * 2_640 + (r % 4) * 380,
    marketShare: Number((4.2 + r * 1.02).toFixed(1)),
  };
});

export const marketEvents: MarketEvent[] = [
  {
    id: "ev-1",
    round: 14,
    title: "New entrant undercuts mid-tier pricing",
    detail: "A competitor launched a 20% cheaper plan targeting your core segment.",
    severity: "warning",
  },
  {
    id: "ev-2",
    round: 13,
    title: "Data-residency regulation announced",
    detail: "EU customers will require in-region hosting from the next fiscal year.",
    severity: "critical",
  },
  {
    id: "ev-3",
    round: 12,
    title: "Category demand up 8%",
    detail: "Sector-wide budget expansion increases addressable pipeline.",
    severity: "info",
  },
];

export const activity: ActivityItem[] = [
  { id: "a1", agent: "Sales Agent", message: "Closed round 14 pipeline forecast", time: "2 min ago" },
  { id: "a2", agent: "Risk Agent", message: "Escalated a compliance exposure", time: "9 min ago" },
  { id: "a3", agent: "Finance Agent", message: "Rebalanced contingency reserve to 14%", time: "24 min ago" },
  { id: "a4", agent: "CEO Agent", message: "Approved mid-market expansion plan", time: "1 hr ago" },
  { id: "a5", agent: "Operations Agent", message: "Flagged supplier concentration risk", time: "3 hrs ago" },
];

export const executiveSummary =
  "Across 14 simulated rounds the company converted a disciplined pricing change into durable margin. Revenue grew 3.5x from baseline while expenses grew 2.1x, lifting net profit to $842K. Mid-market expansion proved the strongest lever; enterprise pilots consumed disproportionate operating capacity for limited near-term return. The dominant open risk is regulatory: EU data-residency requirements land before round 18 and are not yet funded.";

export const keyDecisions = [
  { round: 4, decision: "Introduced a usage-based mid-tier plan", owner: "Strategy Agent" },
  { round: 6, decision: "Reallocated 30% of paid spend to retention", owner: "Marketing Agent" },
  { round: 9, decision: "Hired two mid-market reps in EU-West", owner: "Sales Agent" },
  { round: 11, decision: "Dual-sourced top two supply components", owner: "Operations Agent" },
  { round: 13, decision: "Held 14% of budget as contingency reserve", owner: "Finance Agent" },
];

export const businessImpacts = [
  { type: "positive" as const, text: "Gross margin improved 9.4 points after the pricing change." },
  { type: "positive" as const, text: "Customer base grew to 42,091 with CAC down 11%." },
  { type: "positive" as const, text: "Runway extended by 2.1 months via the contingency reserve." },
  { type: "negative" as const, text: "Unit cost rose 2.1% from dual-sourcing components." },
  { type: "negative" as const, text: "Enterprise pilots absorbed 18% of delivery capacity for 4% of revenue." },
];

export const risks = [
  { level: "High", title: "EU data-residency compliance", detail: "Unfunded hosting migration required before round 18." },
  { level: "Medium", title: "Competitive price pressure", detail: "A new entrant is undercutting the mid-tier by 20%." },
  { level: "Medium", title: "Supplier concentration", detail: "Two components still rely on a single region." },
  { level: "Low", title: "Engineering attrition", detail: "Attrition risk elevated but trending down after comp review." },
];

export const recommendations = [
  "Fund the EU hosting migration in the next planning cycle; deferring adds an estimated $180K.",
  "Defend the mid-tier with packaging rather than discounting to protect the 9.4pt margin gain.",
  "Cap enterprise pilots at three concurrent engagements until delivery capacity recovers.",
  "Re-run this scenario with a 25% higher marketing budget to test acquisition elasticity.",
];

export const adminUsers: AdminUser[] = [
  { id: "u-1041", name: "Alex Moreau", email: "alex@northwind.io", plan: "Trial", simulations: 12, status: "active", joined: "2026-08-01" },
  { id: "u-1039", name: "Priya Raman", email: "priya@vectorhq.com", plan: "Professional", simulations: 84, status: "active", joined: "2026-05-14" },
  { id: "u-1032", name: "Daniel Okoye", email: "d.okoye@meridian.co", plan: "Business", simulations: 210, status: "active", joined: "2026-02-08" },
  { id: "u-1028", name: "Lena Fischer", email: "lena@fischer-ops.de", plan: "Starter", simulations: 19, status: "suspended", joined: "2026-01-22" },
  { id: "u-1019", name: "Marco Bellini", email: "marco@bellini.io", plan: "Professional", simulations: 63, status: "invited", joined: "2025-12-03" },
];

export const platformRevenue = [
  { month: "Mar", mrr: 128000, users: 1840 },
  { month: "Apr", mrr: 141000, users: 2010 },
  { month: "May", mrr: 156000, users: 2280 },
  { month: "Jun", mrr: 172000, users: 2510 },
  { month: "Jul", mrr: 191000, users: 2860 },
  { month: "Aug", mrr: 214000, users: 3190 },
];

export const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    tagline: "For individual operators modelling a single business.",
    features: ["3 active agents", "20 simulations / month", "12 rounds per simulation", "Standard analytics", "Email support"],
    cta: "Start free trial",
  },
  {
    id: "professional",
    name: "Professional",
    price: 199,
    tagline: "For strategy teams running continuous scenarios.",
    features: ["All 8 agents", "Unlimited simulations", "48 rounds per simulation", "Full analytics & reports", "Scenario comparison", "Priority support"],
    cta: "Start free trial",
    featured: true,
  },
  {
    id: "business",
    name: "Business",
    price: 599,
    tagline: "For organisations standardising on simulation.",
    features: ["Everything in Professional", "Custom agent behaviour", "Shared workspaces & roles", "Audit log & data export", "SSO", "Dedicated success manager"],
    cta: "Contact sales",
  },
];

export const featureComparison = [
  { label: "Active AI agents", starter: "3", professional: "8", business: "8 + custom" },
  { label: "Simulations per month", starter: "20", professional: "Unlimited", business: "Unlimited" },
  { label: "Rounds per simulation", starter: "12", professional: "48", business: "Unlimited" },
  { label: "Automated reports", starter: "—", professional: "Included", business: "Included" },
  { label: "Scenario comparison", starter: "—", professional: "Included", business: "Included" },
  { label: "SSO & audit log", starter: "—", professional: "—", business: "Included" },
];

export const faqs = [
  {
    q: "What exactly does a simulation model?",
    a: "You define a business profile, market conditions, budget and goals. Eight specialised agents then negotiate decisions round by round, and the engine projects revenue, profit, customers, market share and risk from those decisions.",
  },
  {
    q: "How long is the free trial?",
    a: "30 days with full Professional features. No card is required to start, and nothing is charged automatically when the trial ends.",
  },
  {
    q: "Do I see the agents' reasoning?",
    a: "You see concise, user-facing summaries of every decision and its business impact — the task, the choice, and the projected effect. Internal reasoning traces are not exposed.",
  },
  {
    q: "Can I export results?",
    a: "Yes. Every completed simulation produces an executive report you can preview in-app and download as a PDF.",
  },
  {
    q: "Is my scenario data private?",
    a: "Scenarios run inside your own workspace and are never used to train shared models.",
  },
];
