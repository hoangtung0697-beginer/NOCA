import { Printer as PrinterIcon, Users, Wallet, HandCoins } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatVnd } from "@/lib/format";
import { PrinterDialog } from "./printer-dialog";
import { PrinterDeleteButton } from "./printer-delete-button";
import { SalespersonDialog } from "./salesperson-dialog";
import { SalespersonDeleteButton } from "./salesperson-delete-button";
import { ExpenseSourceDialog } from "./expense-source-dialog";
import { ExpenseSourceDeleteButton } from "./expense-source-delete-button";
import { PartnerDialog } from "./partner-dialog";
import { PartnerDeleteButton } from "./partner-delete-button";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [printers, salespeople, expenseSources, partners] = await Promise.all([
    prisma.printer.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.salesperson.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.expenseSource.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.partner.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các loại máy in — công suất, giá điện, giá máy, tuổi thọ. Chọn loại máy in khi
            tạo sản phẩm ở trang Tính giá, sửa ở đây sẽ áp dụng ngay cho mọi sản phẩm dùng máy đó.
          </p>
        </div>
        <PrinterDialog
          mode="create"
          trigger={<Button>+ Thêm loại máy in</Button>}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên máy</TableHead>
              <TableHead className="text-right">Công suất (W)</TableHead>
              <TableHead className="text-right">Giá điện (VNĐ/kWh)</TableHead>
              <TableHead className="text-right">Giá máy (VNĐ)</TableHead>
              <TableHead className="text-right">Tuổi thọ (giờ)</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {printers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 py-4">
                    <PrinterIcon className="size-6 text-muted-foreground/60" />
                    Chưa có loại máy in nào. Thêm loại máy in trước khi tạo sản phẩm ở trang Tính
                    giá.
                  </div>
                </TableCell>
              </TableRow>
            )}
            {printers.map((printer) => (
              <TableRow key={printer.id}>
                <TableCell className="font-medium">{printer.name}</TableCell>
                <TableCell className="text-right">{Number(printer.machineWattage)}</TableCell>
                <TableCell className="text-right">
                  {formatVnd(printer.electricityPricePerKwh.toString())}
                </TableCell>
                <TableCell className="text-right">
                  {formatVnd(printer.machinePrice.toString())}
                </TableCell>
                <TableCell className="text-right">{Number(printer.machineLifetimeHours)}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  <PrinterDialog
                    mode="edit"
                    printer={{
                      id: printer.id,
                      name: printer.name,
                      machineWattage: Number(printer.machineWattage),
                      electricityPricePerKwh: Number(printer.electricityPricePerKwh),
                      machinePrice: Number(printer.machinePrice),
                      machineLifetimeHours: Number(printer.machineLifetimeHours),
                    }}
                    trigger={
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    }
                  />
                  <PrinterDeleteButton id={printer.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Người bán hàng</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý danh sách người bán hàng. Chọn khi tạo đơn hàng để theo dõi hoa hồng theo từng
            người ở trang Hoa hồng bán hàng.
          </p>
        </div>
        <SalespersonDialog
          mode="create"
          trigger={<Button>+ Thêm người bán hàng</Button>}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salespeople.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Users className="size-6 text-muted-foreground/60" />
                    Chưa có người bán hàng nào.
                  </div>
                </TableCell>
              </TableRow>
            )}
            {salespeople.map((sp) => (
              <TableRow key={sp.id}>
                <TableCell className="font-medium">{sp.name}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  <SalespersonDialog
                    mode="edit"
                    salesperson={{ id: sp.id, name: sp.name }}
                    trigger={
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    }
                  />
                  <SalespersonDeleteButton id={sp.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Nguồn chi</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý danh sách nguồn chi (ai/quỹ nào bỏ tiền). Chọn khi nhập chi phí để xem tổng tiền
            đã chi theo từng nguồn ở trang Chi phí.
          </p>
        </div>
        <ExpenseSourceDialog
          mode="create"
          trigger={<Button>+ Thêm nguồn chi</Button>}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenseSources.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Wallet className="size-6 text-muted-foreground/60" />
                    Chưa có nguồn chi nào.
                  </div>
                </TableCell>
              </TableRow>
            )}
            {expenseSources.map((es) => (
              <TableRow key={es.id}>
                <TableCell className="font-medium">{es.name}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  <ExpenseSourceDialog
                    mode="edit"
                    expenseSource={{ id: es.id, name: es.name }}
                    trigger={
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    }
                  />
                  <ExpenseSourceDeleteButton id={es.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Đối tác chia lợi nhuận</h2>
          <p className="text-sm text-muted-foreground">
            Lợi nhuận hằng tháng chia đều cho các đối tác dưới đây. Tên nên khớp với Người bán
            hàng / Nguồn chi để tự động gộp hoa hồng và chi phí đã ứng ở trang Chia lợi nhuận.
          </p>
        </div>
        <PartnerDialog mode="create" trigger={<Button>+ Thêm đối tác</Button>} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 py-4">
                    <HandCoins className="size-6 text-muted-foreground/60" />
                    Chưa có đối tác nào.
                  </div>
                </TableCell>
              </TableRow>
            )}
            {partners.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  <PartnerDialog
                    mode="edit"
                    partner={{ id: p.id, name: p.name }}
                    trigger={
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    }
                  />
                  <PartnerDeleteButton id={p.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
