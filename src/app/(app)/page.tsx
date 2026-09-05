import Link from "next/link";
import { Wallet, Percent, TrendingUp, PackageSearch, PiggyBank, HandCoins } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { StatCard } from "@/components/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatVnd } from "@/lib/format";
import { ORDER_STATUS_LABELS, SKU_LABELS } from "@/lib/constants";
import { buildReportBuckets, buildYAxisTicks, type ReportRange } from "@/lib/report-buckets";
import { OverviewChart } from "./overview-chart";
import { ReportRangeSelect } from "./report-range-select";

function monthRange(offsetMonths: number) {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offsetMonths, 1));
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
  return { start, end };
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range: ReportRange =
    rangeParam === "day" || rangeParam === "week" ? rangeParam : "month";

  const { start: monthStart, end: monthEnd } = monthRange(0);
  const buckets = buildReportBuckets(range);
  const reportStart = buckets[0].start;
  const reportEnd = buckets[buckets.length - 1].end;

  const [revenueAgg, commissionOrdersThisMonth, paymentOrdersThisMonth, statusCounts, recentOrders, reportOrders] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          orderDate: { gte: monthStart, lt: monthEnd },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.order.findMany({
        where: {
          orderDate: { gte: monthStart, lt: monthEnd },
          status: { not: "CANCELLED" },
          unitCommissionCost: { not: null },
        },
        select: { quantity: true, unitCommissionCost: true, status: true },
      }),
      prisma.order.findMany({
        where: {
          orderDate: { gte: monthStart, lt: monthEnd },
          status: { not: "CANCELLED" },
        },
        select: { status: true, total: true, depositAmount: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.order.findMany({
        orderBy: { orderDate: "desc" },
        take: 8,
      }),
      prisma.order.findMany({
        where: { orderDate: { gte: reportStart, lt: reportEnd }, status: { not: "CANCELLED" } },
        select: { orderDate: true, total: true },
      }),
    ]);

  const revenueThisMonth = Number(revenueAgg._sum.total ?? 0);
  const commissionThisMonth = commissionOrdersThisMonth.reduce(
    (sum, o) => sum + Number(o.unitCommissionCost ?? 0) * o.quantity,
    0,
  );
  const commissionActualThisMonth = commissionOrdersThisMonth.reduce(
    (sum, o) => (o.status === "COMPLETED" ? sum + Number(o.unitCommissionCost ?? 0) * o.quantity : sum),
    0,
  );
  const profitThisMonth = revenueThisMonth - commissionThisMonth;

  const receivedAmount = paymentOrdersThisMonth.reduce((sum, o) => {
    if (o.status === "COMPLETED") return sum + Number(o.total);
    return sum + Number(o.depositAmount);
  }, 0);
  const pendingAmount = paymentOrdersThisMonth.reduce((sum, o) => {
    if (o.status === "COMPLETED") return sum;
    return sum + (Number(o.total) - Number(o.depositAmount));
  }, 0);

  const statusCountMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count._all]),
  ) as Record<string, number>;

  const chartData = buckets.map((b) => ({ label: b.label, revenue: 0 }));
  for (const order of reportOrders) {
    const d = order.orderDate;
    const bucketIndex = buckets.findIndex((b) => d >= b.start && d < b.end);
    if (bucketIndex >= 0) chartData[bucketIndex].revenue += Number(order.total);
  }
  const { ticks, maxTick } = buildYAxisTicks(Math.max(...chartData.map((d) => d.revenue), 0));

  return (
    <div className="space-y-8 py-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-sm text-muted-foreground">Tình hình kinh doanh tháng này.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Doanh thu tháng này"
          value={formatVnd(revenueThisMonth)}
          icon={Wallet}
          variant="hero"
        />
        <StatCard
          label="Thực nhận"
          value={formatVnd(receivedAmount)}
          icon={PiggyBank}
          tone="good"
          valueClassName="text-emerald-700 dark:text-emerald-400"
        />
        <StatCard
          label="Chưa nhận"
          value={formatVnd(pendingAmount)}
          icon={HandCoins}
          tone="warn"
          valueClassName="text-amber-700 dark:text-amber-400"
        />
        <StatCard
          label="Chi phí hoa hồng"
          value={formatVnd(commissionThisMonth)}
          icon={Percent}
        />
        <StatCard
          label="Chi phí hoa hồng thực tế"
          value={formatVnd(commissionActualThisMonth)}
          icon={Percent}
        />
        <StatCard
          label="Lợi nhuận ước tính"
          value={formatVnd(profitThisMonth)}
          icon={TrendingUp}
          tone={profitThisMonth < 0 ? undefined : "good"}
          valueClassName={
            profitThisMonth < 0 ? "text-destructive" : "text-emerald-700 dark:text-emerald-400"
          }
        />
        <StatCard
          label="Đơn đang xử lý"
          value={(statusCountMap.PENDING ?? 0) + (statusCountMap.IN_PRODUCTION ?? 0)}
          icon={PackageSearch}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <OrderStatusBadge key={value} status={value}>
            {label}: {statusCountMap[value] ?? 0}
          </OrderStatusBadge>
        ))}
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Báo cáo</CardTitle>
          <ReportRangeSelect />
        </CardHeader>
        <CardContent>
          <OverviewChart data={chartData} ticks={ticks} maxTick={maxTick} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Đơn hàng gần đây</h2>
          <Link href="/orders" className="text-sm text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Chưa có đơn hàng nào.
                  </TableCell>
                </TableRow>
              )}
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{SKU_LABELS[order.sku]}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatVnd(order.total.toString())}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
