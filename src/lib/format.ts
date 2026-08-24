export const currency = (n: number, opts: { compact?: boolean } = {}) => {
  if (opts.compact) {
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `${n < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${n < 0 ? "-" : ""}$${(abs / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
};

export const rupees = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

export const showTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

export const showDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

export const number = (n: number) => new Intl.NumberFormat("en-US").format(n);

export const percent = (n: number, digits = 1) => `${n.toFixed(digits)}%`;

export const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
