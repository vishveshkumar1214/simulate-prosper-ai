export type AgentStatus = "thinking" | "analyzing" | "completed" | "waiting" | "warning";

export type AgentKey =
  | "ceo"
  | "finance"
  | "marketing"
  | "sales"
  | "hr"
  | "operations"
  | "strategy"
  | "risk";

export interface Agent {
  id: AgentKey;
  code: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  currentTask: string;
  decision: string;
  impact: string;
  impactDirection: "positive" | "negative" | "neutral";
}

export type SimulationStatus = "running" | "completed" | "draft" | "failed" | "archived";

export interface Simulation {
  id: string;
  name: string;
  industry: string;
  status: SimulationStatus;
  createdAt: string;
  rounds: number;
  currentRound: number;
  score: number;
  revenue: number;
  profit: number;
  customers: number;
  marketShare: number;
  riskScore: number;
}

export interface SeriesPoint {
  round: string;
  revenue: number;
  profit: number;
  expenses: number;
  customers: number;
  marketShare: number;
}

export interface MarketEvent {
  id: string;
  round: number;
  title: string;
  detail: string;
  severity: "info" | "warning" | "critical";
}

export interface ActivityItem {
  id: string;
  agent: string;
  message: string;
  time: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: "Trial" | "Starter" | "Professional" | "Business";
  simulations: number;
  status: "active" | "suspended" | "invited";
  joined: string;
}

export interface CurrentUser {
  name: string;
  email: string;
  company: string;
  role: string;
  initials: string;
  plan: string;
  trialDaysLeft: number;
}
