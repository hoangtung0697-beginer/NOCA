import { Wallet, Boxes, CircleEllipsis, Zap, Wrench } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
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
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import { ExpenseDialog } from "./expense-dialog";
import { ExpenseDeleteButton } from "./expense-delete-button";
import { ExpenseFilters } from "./expense-filters";
import { FixedAssetDialog } from "./fixed-assets/fixed-asset-dialog";
import { FixedAssetDeleteButton } from "./fixed-assets/fixed-asset-delete-button";

export const dynamic = "force-dynamic";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; month?: string }>;
}) {
  const { category, month } = await searchParams;

  const where: Prisma.ExpenseWhereInput = {};
  if (category) where.category = category as Prisma.EnumExpenseCategoryFilter["equals"];
  if (month) {
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);
    where.date = { gte: start, lt: end };
  }

  const orderWhere: Prisma.OrderWhereInput = {
    status: { not: "CANCELLED" },
    unitProductionCost: { not: null },
  };
  if (month) {
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);
    orderWhere.orderDate = { gte: start, lt: end };
  }

  const [expenses, expenseSources, fixedAssets, productionOrders] = await Promise.all([
    prisma.expense.findMany({ where, orderBy: { date: "desc" }, include: { expenseSource: true } }),
    prisma.expenseSource.findMany({ orderBy: { name: "asc" } }),
    prisma.fixedAsset.findMany({ orderBy: { purchaseDate: "desc" } }),
    prisma.order.findMany({
      where: orderWhere,
      select: {
        quantity: true,
        unitProductionCost: true,
        unitOtherCost: true,
        unitCommissionCost: true,
      },
    }),
  ]);

  const autoProductionCost = productionOrders.reduce(
    (sum, o) => sum + Number(o.unitProductionCost) * o.quantity,
    0,
  );
  const autoOtherCost = productionOrders.reduce(
    (sum, o) => sum + Number(o.unitOtherCost ?? 0) * o.quantity,
    0,
  );
  const autoCommissionCost = productionOrders.reduce(
    (sum, o) => sum + Number(o.unitCommissionCost ?? 0) * o.quantity,
    0,
  );
  const autoOtherAndCommissionCost = autoOtherCost + autoCommissionCost;

  const totalsByCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount);
    return acc;
  }, {});
  totalsByCategory.SAN_XUAT_CHUNG = (totalsByCategory.SAN_XUAT_CHUNG ?? 0) + autoProductionCost;
  totalsByCategory.BAO_BI_VAN_CHUYEN =
    (totalsByCategory.BAO_BI_VAN_CHUYEN ?? 0) + autoOtherAndCommissionCost;
  const total = Object.values(totalsByCategory).reduce((a, b) => a + b, 0);
  const fixedAssetsTotal = fixedAssets.reduce((sum, a) => sum + Number(a.price), 0);

  const totalsBySource = new Map<string, { name: string; amount: number }>();
  for (const expense of expenses) {
    const key = expense.expenseSourceId ?? "__none__";
    const name = expense.expenseSource?.name ?? "Chưa gán";
    const entry = totalsBySource.get(key) ?? { name, amount: 0 };
    entry.amount += Number(expense.amount);
    totalsBySource.set(key, entry);
  }
  const sourceRows = Array.from(totalsBySource.values()).sort((a, b) => b.amount - a.amount);

  const CATEGORY_ICONS: Record<string, typeof Boxes> = {
    NGUYEN_LIEU: Boxes,
    BAO_BI_VAN_CHUYEN: CircleEllipsis,
    SAN_XUAT_CHUNG: Zap,
    TAI_SAN_CO_DINH: Wrench,
  };

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi phí</h1>
            <p className="text-sm text-muted-foreground">
              Nhập và theo dõi chi phí nguyên liệu, chi phí khác, sản xuất chung, tài sản cố định.
            </p>
          </div>
          <ExpenseDialog
            mode="create"
            expenseSources={expenseSources}
            trigger={
              <Button className="h-11 gap-2 rounded-xl px-5 text-[15px] font-semibold shadow-sm">
                + Nhập chi phí
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatCard label="Tổng cộng" value={formatVnd(total)} icon={Wallet} variant="hero" />
          {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
            <StatCard
              key={value}
              label={label}
              value={formatVnd(totalsByCategory[value] ?? 0)}
              icon={CATEGORY_ICONS[value] ?? Boxes}
              sub={
                value === "SAN_XUAT_CHUNG" && autoProductionCost > 0
                  ? `Trong đó ${formatVnd(autoProductionCost)} tự động từ ${productionOrders.length} đơn hàng`
                  : value === "BAO_BI_VAN_CHUYEN" && autoOtherAndCommissionCost > 0
                    ? `Trong đó ${formatVnd(autoOtherAndCommissionCost)} tự động (chi phí khác + hoa hồng) từ ${productionOrders.length} đơn hàng`
                    : undefined
              }
            />
          ))}
        </div>

        <ExpenseFilters />

        <div className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight">Chi phí theo nguồn chi</h2>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nguồn chi</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sourceRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Chưa có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
                {sourceRows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-right">{formatVnd(row.amount)}</TableCell>
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
                <TableHead>Danh mục</TableHead>
                <TableHead>Nguồn chi</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Chưa có khoản chi phí nào.
                  </TableCell>
                </TableRow>
              )}
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>{EXPENSE_CATEGORY_LABELS[expense.category]}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {expense.expenseSource?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatVnd(expense.amount.toString())}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {expense.note}
                  </TableCell>
                  <TableCell className="flex justify-end gap-1">
                    <ExpenseDialog
                      mode="edit"
                      expenseSources={expenseSources}
                      expense={{
                        id: expense.id,
                        category: expense.category,
                        amount: Number(expense.amount),
                        date: expense.date.toISOString(),
                        note: expense.note,
                        expenseSourceId: expense.expenseSourceId,
                      }}
                      trigger={
                        <Button variant="outline" size="sm">
                          Sửa
                        </Button>
                      }
                    />
                    <ExpenseDeleteButton id={expense.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-6 border-t pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Tài sản cố định</h2>
            <p className="text-sm text-muted-foreground">
              Máy in, dụng cụ đã đầu tư — chỉ để theo dõi, <strong>không</strong> tính vào chi phí
              vận hành hoặc lợi nhuận ở trên.
            </p>
          </div>
          <FixedAssetDialog mode="create" trigger={<Button variant="outline">+ Thêm tài sản</Button>} />
        </div>

        <div className="max-w-xs">
          <StatCard label="Tổng giá trị tài sản" value={formatVnd(fixedAssetsTotal)} icon={Wrench} />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày mua</TableHead>
                <TableHead>Tên tài sản</TableHead>
                <TableHead className="text-right">Giá trị</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixedAssets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Chưa có tài sản cố định nào.
                  </TableCell>
                </TableRow>
              )}
              {fixedAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{formatDate(asset.purchaseDate)}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatVnd(asset.price.toString())}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {asset.note}
                  </TableCell>
                  <TableCell className="flex justify-end gap-1">
                    <FixedAssetDialog
                      mode="edit"
                      asset={{
                        id: asset.id,
                        name: asset.name,
                        price: Number(asset.price),
                        purchaseDate: asset.purchaseDate.toISOString(),
                        note: asset.note,
                      }}
                      trigger={
                        <Button variant="outline" size="sm">
                          Sửa
                        </Button>
                      }
                    />
                    <FixedAssetDeleteButton id={asset.id} />
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
