import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 10,
  tickLine: false,
  axisLine: false,
} as const;

function ChartFrame({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border bg-card p-5", className)}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle ? <span className="label-mono">{subtitle}</span> : null}
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "var(--color-popover-foreground)",
  },
  labelStyle: { color: "var(--color-muted-foreground)", fontSize: "10px" },
} as const;

export interface SeriesRow {
  round: string;
  revenue: number;
  profit: number;
  expenses: number;
  customers: number;
  marketShare: number;
}

export function RevenueChart({ data, className }: { data: SeriesRow[]; className?: string }) {
  return (
    <ChartFrame title="Revenue" subtitle="per round" className={className}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="round" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-brand)"
          strokeWidth={2}
          fill="url(#revFill)"
        />
      </AreaChart>
    </ChartFrame>
  );
}

export function ProfitChart({ data, className }: { data: SeriesRow[]; className?: string }) {
  return (
    <ChartFrame title="Profit vs expenses" subtitle="per round" className={className}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="round" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
        <Bar dataKey="expenses" fill="var(--color-chart-5)" radius={[2, 2, 0, 0]} />
        <Bar dataKey="profit" fill="var(--color-brand)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartFrame>
  );
}

export function CustomerChart({ data, className }: { data: SeriesRow[]; className?: string }) {
  return (
    <ChartFrame title="Customer growth" subtitle="per round" className={className}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="round" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => v.toLocaleString()} />
        <Line
          type="monotone"
          dataKey="customers"
          stroke="var(--color-chart-3)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartFrame>
  );
}

export function MarketShareChart({ data, className }: { data: SeriesRow[]; className?: string }) {
  return (
    <ChartFrame title="Market share" subtitle="% per round" className={className}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="msFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="round" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => `${v}%`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}%`} />
        <Area
          type="monotone"
          dataKey="marketShare"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          fill="url(#msFill)"
        />
      </AreaChart>
    </ChartFrame>
  );
}

export function PlatformRevenueChart({
  data,
}: {
  data: { month: string; mrr: number; users: number }[];
}) {
  return (
    <ChartFrame title="Platform MRR" subtitle="last 6 months">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
        <Bar dataKey="mrr" fill="var(--color-brand)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartFrame>
  );
}
