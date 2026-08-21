/**
 * Data service layer.
 * Everything the UI reads goes through these functions so a real API can
 * replace the mock source without touching components.
 */
import * as mock from "./mock";
import type { Agent, Simulation } from "./types";

const latency = <T,>(value: T, ms = 320): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const api = {
  getCurrentUser: () => latency(mock.currentUser, 120),
  getAgents: () => latency(mock.agents),
  getSimulations: () => latency(mock.simulations),
  getSimulation: (id: string) =>
    latency(mock.simulations.find((s) => s.id === id) ?? mock.simulations[0]),
  getSeries: () => latency(mock.series),
  getMarketEvents: () => latency(mock.marketEvents),
  getActivity: () => latency(mock.activity),
  getAdminUsers: () => latency(mock.adminUsers),
  getPlatformRevenue: () => latency(mock.platformRevenue),
  getReport: () =>
    latency({
      executiveSummary: mock.executiveSummary,
      keyDecisions: mock.keyDecisions,
      businessImpacts: mock.businessImpacts,
      risks: mock.risks,
      recommendations: mock.recommendations,
    }),
};

export const queries = {
  agents: { queryKey: ["agents"], queryFn: api.getAgents },
  simulations: { queryKey: ["simulations"], queryFn: api.getSimulations },
  series: { queryKey: ["series"], queryFn: api.getSeries },
  activity: { queryKey: ["activity"], queryFn: api.getActivity },
  events: { queryKey: ["events"], queryFn: api.getMarketEvents },
  report: { queryKey: ["report"], queryFn: api.getReport },
  adminUsers: { queryKey: ["admin", "users"], queryFn: api.getAdminUsers },
  platformRevenue: { queryKey: ["admin", "revenue"], queryFn: api.getPlatformRevenue },
};

export type { Agent, Simulation };
export { mock };
