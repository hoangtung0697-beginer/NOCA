export type ReportRange = "day" | "week" | "month";

export interface ReportBucket {
  label: string;
  start: Date;
  end: Date;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function buildReportBuckets(range: ReportRange): ReportBucket[] {
  const now = new Date();
  const buckets: ReportBucket[] = [];

  if (range === "day") {
    for (let i = 13; i >= 0; i--) {
      const start = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i),
      );
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      buckets.push({ label: `${pad(start.getUTCDate())}/${pad(start.getUTCMonth() + 1)}`, start, end });
    }
  } else if (range === "week") {
    const dayOfWeek = (now.getUTCDay() + 6) % 7; // 0 = Monday
    const thisWeekStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - dayOfWeek),
    );
    for (let i = 7; i >= 0; i--) {
      const start = new Date(thisWeekStart);
      start.setUTCDate(start.getUTCDate() - i * 7);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 7);
      buckets.push({ label: `${pad(start.getUTCDate())}/${pad(start.getUTCMonth() + 1)}`, start, end });
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
      buckets.push({ label: `${pad(start.getUTCMonth() + 1)}/${start.getUTCFullYear()}`, start, end });
    }
  }

  return buckets;
}

export function buildYAxisTicks(maxValue: number, step = 50000) {
  const maxTick = Math.max(step, Math.ceil((maxValue || 0) / step) * step);
  const ticks: number[] = [];
  for (let v = 0; v <= maxTick; v += step) ticks.push(v);
  return { ticks, maxTick };
}
