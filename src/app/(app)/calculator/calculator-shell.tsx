"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatVnd } from "@/lib/format";
import { SKU_LABELS } from "@/lib/constants";
import { QuickQuoteForm, type MaterialOption, type PrinterOption, type AccessoryOption } from "./quick-quote-form";
import { MaterialDialog } from "./material/material-dialog";
import { MaterialDeleteButton } from "./material/material-delete-button";
import { AccessoryDialog } from "./accessory/accessory-dialog";
import { AccessoryDeleteButton } from "./accessory/accessory-delete-button";

interface MaterialRow extends MaterialOption {
  type: string | null;
  remainingGram: number;
  note: string | null;
}

interface AccessoryRow extends AccessoryOption {
  note: string | null;
}

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  printerName: string;
  computedPrice: number;
}

interface CalculatorShellProps {
  materials: MaterialRow[];
  printers: PrinterOption[];
  accessories: AccessoryRow[];
  products: ProductRow[];
}

const TABS = [
  { value: "tinh-gia", label: "Tính giá" },
  { value: "nhua", label: "Nhựa" },
  { value: "may-in", label: "Máy in" },
  { value: "san-pham", label: "Sản phẩm" },
  { value: "phu-kien", label: "Phụ kiện" },
  { value: "cai-dat", label: "Cài đặt" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function CalculatorShell({ materials, printers, accessories, products }: CalculatorShellProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("tinh-gia");

  return (
    <div>
      <div className="inline-flex w-fit items-center gap-[3px] rounded-lg bg-muted p-[3px]">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-md px-2.5 py-1 text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "tinh-gia" && (
        <div className="pt-4">
          <QuickQuoteForm materials={materials} printers={printers} accessories={accessories} />
        </div>
      )}

      {activeTab === "nhua" && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Loại nhựa dùng để chọn nhanh khi tính giá.</p>
            <MaterialDialog mode="create" trigger={<Button>+ Thêm loại nhựa</Button>} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Chất liệu</TableHead>
                  <TableHead className="text-right">Giá/kg</TableHead>
                  <TableHead className="text-right">Tồn kho (g)</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Chưa có loại nhựa nào.
                    </TableCell>
                  </TableRow>
                )}
                {materials.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="text-muted-foreground">{m.type ?? "—"}</TableCell>
                    <TableCell className="text-right">{formatVnd(m.pricePerKg)}</TableCell>
                    <TableCell className="text-right">{m.remainingGram}</TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <MaterialDialog mode="edit" material={m} trigger={<Button variant="outline" size="sm">Sửa</Button>} />
                      <MaterialDeleteButton id={m.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "may-in" && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Danh sách loại máy in — dùng chung với trang Cài đặt.
            </p>
            <Button render={<Link href="/settings" />} variant="outline">
              Quản lý chi tiết →
            </Button>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {printers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Chưa có loại máy in nào.
                    </TableCell>
                  </TableRow>
                )}
                {printers.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">{p.machineWattage}</TableCell>
                    <TableCell className="text-right">{formatVnd(p.electricityPricePerKwh)}</TableCell>
                    <TableCell className="text-right">{formatVnd(p.machinePrice)}</TableCell>
                    <TableCell className="text-right">{p.machineLifetimeHours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "san-pham" && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Danh mục sản phẩm — dùng chung với trang Tính giá.
            </p>
            <Button render={<Link href="/pricing" />} variant="outline">
              Quản lý chi tiết →
            </Button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Loại máy in</TableHead>
                  <TableHead className="text-right">Giá đề xuất</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Chưa có sản phẩm nào.
                    </TableCell>
                  </TableRow>
                )}
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{SKU_LABELS[p.sku]}</TableCell>
                    <TableCell className="text-muted-foreground">{p.printerName}</TableCell>
                    <TableCell className="text-right">{formatVnd(p.computedPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "phu-kien" && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Phụ kiện dùng để chọn nhanh khi tính giá.</p>
            <AccessoryDialog mode="create" trigger={<Button>+ Thêm phụ kiện</Button>} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead className="text-right">Giá</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Chưa có phụ kiện nào.
                    </TableCell>
                  </TableRow>
                )}
                {accessories.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-right">{formatVnd(a.price)}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{a.note}</TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <AccessoryDialog mode="edit" accessory={a} trigger={<Button variant="outline" size="sm">Sửa</Button>} />
                      <AccessoryDeleteButton id={a.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "cai-dat" && (
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Loại máy in được quản lý ở trang Cài đặt chung của hệ thống.
          </p>
          <Button render={<Link href="/settings" />} variant="outline">
            Đi đến Cài đặt →
          </Button>
        </div>
      )}
    </div>
  );
}
