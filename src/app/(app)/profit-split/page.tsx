import Link from "next/link";
import { Wallet, Scale, HandCoins, Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/stat-card";
import { formatVnd } from "@/lib/format";
import { ProfitSplitFilters } from "./profit-split-filters";

export const dynamic = "force-dynamic";

function currentMonthValue() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function resolveMonthRange(monthParam: string | undefined) {
  const monthValue = monthParam || currentMonthValue();
  const start = new Date(`${monthValue}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start, end, monthValue };
}

export default async function ProfitSplitPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const { start, end } = resolveMonthRange(month);

  const [partners, orders, expenses] = await Promise.all([
    prisma.partner.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.order.findMany({
      where: { status: { not: "CANCELLED" }, orderDate: { gte: start, lt: end } },
      select: {
        total: true,
        quantity: true,
        unitCommissionCost: true,
        status: true,
        salesperson: { select: { name: true } },
      },
    }),
    prisma.expense.findMany({
      where: { date: { gte: start, lt: end }, category: { not: "SAN_XUAT_CHUNG" } },
      select: { amount: true, expenseSource: { select: { name: true } } },
    }),
  ]);

  let totalRevenue = 0;
  let totalCommission = 0;
  const commissionByName = new Map<string, number>();
  for (const order of orders) {
    totalRevenue += Number(order.total);
    const commission = Number(order.unitCommissionCost ?? 0) * order.quantity;
    totalCommission += commission;
    if (order.salesperson?.name && order.status === "COMPLETED") {
      commissionByName.set(
        order.salesperson.name,
        (commissionByName.get(order.salesperson.name) ?? 0) + commission,
      );
    }
  }
  const totalProfit = totalRevenue - totalCommission;

  let totalExpense = 0;
  const expenseByName = new Map<string, number>();
  for (const expense of expenses) {
    totalExpense += Number(expense.amount);
    if (expense.expenseSource?.name) {
      expenseByName.set(
        expense.expenseSource.name,
        (expenseByName.get(expense.expenseSource.name) ?? 0) + Number(expense.amount),
      );
    }
  }

  const equalShare = partners.length > 0 ? totalProfit / partners.length : 0;
  const equalExpenseShare = partners.length > 0 ? totalExpense / partners.length : 0;

  const partnerRows = partners.map((p) => {
    const commission = commissionByName.get(p.name) ?? 0;
    const expensePaid = expenseByName.get(p.name) ?? 0;
    const expenseAdjustment = expensePaid - equalExpenseShare;
    return {
      id: p.id,
      name: p.name,
      commission,
      expensePaid,
      expenseAdjustment,
      totalReceive: equalShare + commission + expenseAdjustment,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chia lợi nhuận</h1>
        <p className="text-sm text-muted-foreground">
          Lợi nhuận và chi phí phát sinh (trừ sản xuất chung điện, khấu hao — đã tính vào giá bán)
          đều chia đều cho các đối tác. Ai đã ứng tiền chi trước sẽ được hoàn phần chênh lệch giữa
          số đã chi và phần phải gánh chia đều. Hoa hồng cá nhân chỉ tính từ đơn đã hoàn thành (hoa
          hồng thực tế) — xem chi tiết ở trang Hoa hồng bán hàng. Tổng nhận = Lợi nhuận chia đều +
          Hoa hồng cá nhân + (Đã ứng trước − Phần chi phí chia đều).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tổng lợi nhuận tháng" value={formatVnd(totalProfit)} icon={Wallet} variant="hero" />
        <StatCard
          label={`Lợi nhuận chia đều (${partners.length || 0})`}
          value={formatVnd(equalShare)}
          icon={Scale}
        />
        <StatCard
          label="Tổng chi phí phát sinh (trừ SXC)"
          value={formatVnd(totalExpense)}
          icon={Receipt}
          tone="warn"
        />
        <StatCard
          label={`Chi phí chia đều (${partners.length || 0})`}
          value={formatVnd(equalExpenseShare)}
          icon={Receipt}
          tone="warn"
        />
      </div>

      <ProfitSplitFilters defaultMonth={currentMonthValue()} />

      {partners.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card py-12 text-center">
          <HandCoins className="size-6 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">
            Chưa có đối tác nào. Thêm đối tác ở trang Cài đặt để bắt đầu chia lợi nhuận.
          </p>
          <Button render={<Link href="/settings" />} variant="outline">
            Đi đến Cài đặt →
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {partnerRows.map((row) => (
            <Card key={row.id} className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{row.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <PartnerRow label="Lợi nhuận chia đều" value={equalShare} />
                <PartnerRow label="Hoa hồng cá nhân (thực tế)" value={row.commission} />
                <PartnerRow label="Đã ứng trước (chi thực tế)" value={row.expensePaid} />
                <PartnerRow label="Phần chi phí chia đều" value={-equalExpenseShare} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>→ Chênh lệch chi phí đã ứng</span>
                  <span className={row.expenseAdjustment < 0 ? "text-destructive" : ""}>
                    {row.expenseAdjustment >= 0 ? "+" : ""}
                    {formatVnd(row.expenseAdjustment)}
                  </span>
                </div>
                <Separator />
                <PartnerRow label="Tổng nhận" value={row.totalReceive} bold highlight />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PartnerRow({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className={`${bold ? "font-semibold" : ""} ${highlight ? "text-lg text-primary" : ""}`}>
        {formatVnd(value)}
      </span>
    </div>
  );
}
