"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatVnd } from "@/lib/format";
import { calculatePricing } from "@/lib/pricing";

export interface MaterialOption {
  id: string;
  name: string;
  pricePerKg: number;
}

export interface PrinterOption {
  id: string;
  name: string;
  machineWattage: number;
  electricityPricePerKwh: number;
  machinePrice: number;
  machineLifetimeHours: number;
}

export interface AccessoryOption {
  id: string;
  name: string;
  price: number;
}

interface QuickQuoteFormProps {
  materials: MaterialOption[];
  printers: PrinterOption[];
  accessories: AccessoryOption[];
}

export function QuickQuoteForm({ materials, printers, accessories }: QuickQuoteFormProps) {
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [printerId, setPrinterId] = useState(printers[0]?.id ?? "");
  const [weightGram, setWeightGram] = useState(50);
  const [printHours, setPrintHours] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [commissionCost, setCommissionCost] = useState(0);
  const [marginPercent, setMarginPercent] = useState(30);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);

  const selectedMaterial = materials.find((m) => m.id === materialId);
  const selectedPrinter = printers.find((p) => p.id === printerId);
  const accessoriesCost = accessories
    .filter((a) => selectedAccessoryIds.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const breakdown = useMemo(
    () =>
      calculatePricing({
        filamentWeightGram: weightGram,
        filamentPricePerKg: selectedMaterial?.pricePerKg ?? 0,
        printHours,
        machineWattage: selectedPrinter?.machineWattage ?? 0,
        electricityPricePerKwh: selectedPrinter?.electricityPricePerKwh ?? 0,
        machinePrice: selectedPrinter?.machinePrice ?? 0,
        machineLifetimeHours: selectedPrinter?.machineLifetimeHours ?? 0,
        otherCost: accessoriesCost,
        commissionCost,
        marginPercent,
      }),
    [weightGram, selectedMaterial, printHours, selectedPrinter, accessoriesCost, commissionCost, marginPercent],
  );

  function toggleAccessory(id: string) {
    setSelectedAccessoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const noCatalogData = materials.length === 0 || printers.length === 0;

  return (
    <div className="space-y-6">
      {noCatalogData && (
        <p className="rounded-xl border border-dashed border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Thêm ít nhất 1 loại nhựa (tab Nhựa) và 1 loại máy in (tab Máy in) để tính giá.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông số</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại nhựa</Label>
                <Select
                  items={Object.fromEntries(materials.map((m) => [m.id, m.name]))}
                  value={materialId}
                  onValueChange={(v) => v && setMaterialId(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại nhựa" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Loại máy in</Label>
                <Select
                  items={Object.fromEntries(printers.map((p) => [p.id, p.name]))}
                  value={printerId}
                  onValueChange={(v) => v && setPrinterId(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn máy in" />
                  </SelectTrigger>
                  <SelectContent>
                    {printers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Khối lượng nhựa (gram)</Label>
                <NumberInput allowDecimal value={weightGram} onValueChange={setWeightGram} />
              </div>
              <div className="space-y-2">
                <Label>Thời gian in (giờ)</Label>
                <NumberInput allowDecimal value={printHours} onValueChange={setPrintHours} />
              </div>

              <div className="space-y-2">
                <Label>Số lượng (khay)</Label>
                <NumberInput value={quantity} onValueChange={(v) => setQuantity(v || 1)} />
              </div>
              <div className="space-y-2">
                <Label>% Lợi nhuận mong muốn</Label>
                <NumberInput allowDecimal value={marginPercent} onValueChange={setMarginPercent} />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Chi phí hoa hồng (VNĐ)</Label>
                <NumberInput value={commissionCost} onValueChange={setCommissionCost} />
              </div>
            </div>

            {accessories.length > 0 && (
              <div className="space-y-2">
                <Label>Phụ kiện</Label>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/60 p-3">
                  {accessories.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={selectedAccessoryIds.includes(a.id)}
                        onCheckedChange={() => toggleAccessory(a.id)}
                      />
                      <span className="flex-1">{a.name}</span>
                      <span className="text-muted-foreground">{formatVnd(a.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Kết quả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row label="Chi phí nguyên liệu (nhựa)" value={breakdown.materialCost} />
            <Row label="Chi phí sản xuất chung (điện, khấu hao)" value={breakdown.generalProductionCost} />
            <Row label="Chi phí phụ kiện" value={accessoriesCost} />
            <Row label="Chi phí hoa hồng" value={breakdown.commissionCost} />
            <Separator />
            <Row label="Tổng chi phí / sản phẩm" value={breakdown.totalCost} bold />
            <Row label="Giá bán đề xuất / sản phẩm" value={breakdown.suggestedPrice} bold highlight />
            {quantity > 1 && (
              <>
                <Separator />
                <Row label={`Tổng chi phí (${quantity} sản phẩm)`} value={breakdown.totalCost * quantity} bold />
                <Row
                  label={`Tổng doanh thu đề xuất (${quantity} sản phẩm)`}
                  value={breakdown.suggestedPrice * quantity}
                  bold
                  highlight
                />
              </>
            )}
            <Button render={<Link href="/pricing" />} variant="outline" className="mt-2 w-full">
              Lưu vào Danh mục sản phẩm →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({
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
