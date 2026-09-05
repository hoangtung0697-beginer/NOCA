import { BadgePercent, Wallet, Percent } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatVnd } from "@/lib/format";
import { CommissionFilters } from "./commission-filters";

export const dynamic = "force-dynamic";

export default async function CommissionPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; salesperson?: string }>;
}) {
  const { month, salesperson } = await searchParams;

  const where: Prisma.OrderWhereInput = { status: { not: "CANCELLED" } };
  if (month) {
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);
    where.orderDate = { gte: start, lt: end };
  }
  if (salesperson) where.salespersonId = salesperson;

  const [orders, salespeople] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { orderDate: "desc" }, include: { salesperson: true } }),
    prisma.salesperson.findMany({ orderBy: { name: "asc" } }),
  ]);

  let totalRevenue = 0;
  let totalCommission = 0;
  let totalActualCommission = 0;
  const bySalesperson = new Map<
    string,
    { name: string; revenue: number; commission: number; actualCommission: number }
  >();
  const NO_SALESPERSON_KEY = "__none__";
  for (const order of orders) {
    const revenue = Number(order.total);
    const commission = Number(order.unitCommissionCost ?? 0) * order.quantity;
    const actualCommission = order.status === "COMPLETED" ? commission : 0;
    totalRevenue += revenue;
    totalCommission += commission;
    totalActualCommission += actualCommission;

    const key = order.salespersonId ?? NO_SALESPERSON_KEY;
    const name = order.salesperson?.name ?? "Chưa gán";
    const entry = bySalesperson.get(key) ?? { name, revenue: 0, commission: 0, actualCommission: 0 };
    entry.revenue += revenue;
    entry.commission += commission;
    entry.actualCommission += actualCommission;
    bySalesperson.set(key, entry);
  }
  const averageRate = totalRevenue > 0 ? (totalCommission / totalRevenue) * 100 : 0;
  const salespersonRows = Array.from(bySalesperson.values()).sort((a, b) => b.commission - a.commission);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hoa hồng bán hàng</h1>
        <p className="text-sm text-muted-foreground">
          Chi phí hoa hồng theo từng đơn hàng — mặc định 20% đơn giá, có thể chỉnh tay khi tạo đơn.
          "Hoa hồng thực tế" chỉ tính cho đơn đã hoàn thành (đã thu tiền đầy đủ) — dùng để tính hoa
          hồng cá nhân ở trang Chia lợi nhuận.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatVnd(totalRevenue)} icon={Wallet} variant="hero" />
        <StatCard label="Tổng hoa hồng" value={formatVnd(totalCommission)} icon={BadgePercent} />
        <StatCard
          label="Tổng hoa hồng thực tế"
          value={formatVnd(totalActualCommission)}
          icon={BadgePercent}
          tone="good"
        />
        <StatCard label="Tỷ lệ hoa hồng trung bình" value={`${averageRate.toFixed(1)}%`} icon={Percent} />
      </div>

      <CommissionFilters salespeople={salespeople} />

      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">Hoa hồng theo người bán</h2>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người bán</TableHead>
                <TableHead className="text-right">Doanh thu</TableHead>
                <TableHead className="text-right">Hoa hồng</TableHead>
                <TableHead className="text-right">Hoa hồng thực tế</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salespersonRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Chưa có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
              {salespersonRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-right">{formatVnd(row.revenue)}</TableCell>
                  <TableCell className="text-right">{formatVnd(row.commission)}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-700 dark:text-emerald-400">
                    {formatVnd(row.actualCommission)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.revenue > 0 ? `${((row.commission / row.revenue) * 100).toFixed(1)}%` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Người bán</TableHead>
              <TableHead className="text-right">Doanh thu</TableHead>
              <TableHead className="text-right">Hoa hồng</TableHead>
              <TableHead className="text-right">%</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Chưa có đơn hàng nào.
                </TableCell>
              </TableRow>
            )}
            {orders.map((order) => {
              const total = Number(order.total);
              const commission =
                order.unitCommissionCost != null ? Number(order.unitCommissionCost) * order.quantity : null;
              const rate = commission != null && total > 0 ? (commission / total) * 100 : null;
              return (
                <TableRow key={order.id}>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.salesperson?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatVnd(total)}</TableCell>
                  <TableCell className="text-right">
                    {commission != null ? formatVnd(commission) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {rate != null ? `${rate.toFixed(1)}%` : "—"}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
