import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { calculatePricing } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { formatDate, formatVnd } from "@/lib/format";
import { SKU_LABELS } from "@/lib/constants";
import { OrderDialog } from "./order-dialog";
import { OrderDeleteButton } from "./order-delete-button";
import { OrderFilters } from "./order-filters";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sku?: string; month?: string }>;
}) {
  const { status, sku, month } = await searchParams;

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status as Prisma.EnumOrderStatusFilter["equals"];
  if (sku) where.sku = sku as Prisma.EnumSkuFilter["equals"];
  if (month) {
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);
    where.orderDate = { gte: start, lt: end };
  }

  const [orders, products, salespeople] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { orderDate: "desc" }, include: { salesperson: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, include: { printer: true } }),
    prisma.salesperson.findMany({ orderBy: { name: "asc" } }),
  ]);

  const productOptions = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    computedPrice: calculatePricing({
      filamentWeightGram: Number(p.filamentWeightGram),
      filamentPricePerKg: Number(p.filamentPricePerKg),
      printHours: Number(p.printHours),
      machineWattage: Number(p.printer.machineWattage),
      electricityPricePerKwh: Number(p.printer.electricityPricePerKwh),
      machinePrice: Number(p.printer.machinePrice),
      machineLifetimeHours: Number(p.printer.machineLifetimeHours),
      otherCost: Number(p.otherCost),
      commissionCost: Number(p.commissionCost),
      marginPercent: Number(p.marginPercent),
    }).suggestedPrice,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý đơn hàng đèn, đồ chơi, móc khoá.
          </p>
        </div>
        <OrderDialog
          mode="create"
          products={productOptions}
          salespeople={salespeople}
          trigger={
            <Button className="h-11 gap-2 rounded-xl px-5 text-[15px] font-semibold shadow-sm">
              + Tạo đơn hàng
            </Button>
          }
        />
      </div>

      <OrderFilters />

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead className="text-right">SL</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
              <TableHead className="text-right">Tiền cọc</TableHead>
              <TableHead className="text-right">Chi phí</TableHead>
              <TableHead className="text-right">Lợi nhuận</TableHead>
              <TableHead>Người bán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} className="text-center text-muted-foreground">
                  Chưa có đơn hàng nào.
                </TableCell>
              </TableRow>
            )}
            {orders.map((order) => {
              const total = Number(order.total);
              const cost = order.unitCost != null ? Number(order.unitCost) * order.quantity : null;
              const profit = cost != null ? total - cost : null;
              return (
                <TableRow key={order.id}>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{SKU_LABELS[order.sku]}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell className="text-right">{order.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatVnd(order.unitPrice.toString())}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatVnd(total)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatVnd(order.depositAmount.toString())}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {cost != null ? formatVnd(cost) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {profit != null ? formatVnd(profit) : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.salesperson?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="flex justify-end gap-1">
                    <OrderDialog
                      mode="edit"
                      products={productOptions}
                      salespeople={salespeople}
                      order={{
                        id: order.id,
                        customerName: order.customerName,
                        sku: order.sku,
                        productName: order.productName,
                        quantity: order.quantity,
                        unitPrice: Number(order.unitPrice),
                        orderDate: order.orderDate.toISOString(),
                        status: order.status,
                        note: order.note,
                        productId: order.productId,
                        salespersonId: order.salespersonId,
                        unitCommissionCost:
                          order.unitCommissionCost != null ? Number(order.unitCommissionCost) : null,
                        depositAmount: Number(order.depositAmount),
                      }}
                      trigger={
                        <Button variant="outline" size="sm">
                          Sửa
                        </Button>
                      }
                    />
                    <OrderDeleteButton id={order.id} />
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
