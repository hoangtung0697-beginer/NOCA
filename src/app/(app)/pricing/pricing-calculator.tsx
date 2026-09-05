"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SKU_LABELS } from "@/lib/constants";
import { formatVnd } from "@/lib/format";
import { calculatePricing } from "@/lib/pricing";
import { createProduct, updateProduct } from "./actions";

export interface PrinterOption {
  id: string;
  name: string;
  machineWattage: number;
  electricityPricePerKwh: number;
  machinePrice: number;
  machineLifetimeHours: number;
}

export interface EditableProduct {
  id: string;
  name: string;
  sku: string;
  printerId: string;
  filamentWeightGram: number;
  filamentPricePerKg: number;
  printHours: number;
  otherCost: number;
  otherCostNote: string | null;
  commissionCost: number;
  marginPercent: number;
}

interface ManualValues {
  filamentWeightGram: number;
  filamentPricePerKg: number;
  printHours: number;
  otherCost: number;
  commissionCost: number;
  marginPercent: number;
}

interface PricingCalculatorProps {
  printers: PrinterOption[];
  editingProduct?: EditableProduct | null;
  onDoneEditing?: () => void;
}

const INITIAL_VALUES: ManualValues = {
  filamentWeightGram: 50,
  filamentPricePerKg: 0,
  printHours: 3,
  otherCost: 0,
  commissionCost: 0,
  marginPercent: 30,
};

export function PricingCalculator({ printers, editingProduct, onDoneEditing }: PricingCalculatorProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("DEN");
  const [printerId, setPrinterId] = useState(printers[0]?.id ?? "");
  const [values, setValues] = useState<ManualValues>(INITIAL_VALUES);
  const [otherCostNote, setOtherCostNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(editingProduct);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSku(editingProduct.sku);
      setPrinterId(editingProduct.printerId);
      setValues({
        filamentWeightGram: editingProduct.filamentWeightGram,
        filamentPricePerKg: editingProduct.filamentPricePerKg,
        printHours: editingProduct.printHours,
        otherCost: editingProduct.otherCost,
        commissionCost: editingProduct.commissionCost,
        marginPercent: editingProduct.marginPercent,
      });
      setOtherCostNote(editingProduct.otherCostNote ?? "");
    } else {
      setName("");
      setSku("DEN");
      setPrinterId(printers[0]?.id ?? "");
      setValues(INITIAL_VALUES);
      setOtherCostNote("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct]);

  const selectedPrinter = printers.find((p) => p.id === printerId);

  const breakdown = useMemo(
    () =>
      calculatePricing({
        ...values,
        machineWattage: selectedPrinter?.machineWattage ?? 0,
        electricityPricePerKwh: selectedPrinter?.electricityPricePerKwh ?? 0,
        machinePrice: selectedPrinter?.machinePrice ?? 0,
        machineLifetimeHours: selectedPrinter?.machineLifetimeHours ?? 0,
      }),
    [values, selectedPrinter],
  );

  function setField(field: keyof ManualValues) {
    return (num: number) => {
      setValues((prev) => ({ ...prev, [field]: num }));
    };
  }

  function resetForm() {
    setName("");
    setSku("DEN");
    setPrinterId(printers[0]?.id ?? "");
    setValues(INITIAL_VALUES);
    setOtherCostNote("");
  }

  function handleSave(formData: FormData) {
    startTransition(async () => {
      try {
        if (isEditing && editingProduct) {
          await updateProduct(editingProduct.id, formData);
          toast.success("Đã cập nhật sản phẩm");
          onDoneEditing?.();
        } else {
          await createProduct(formData);
          toast.success("Đã thêm sản phẩm vào danh mục");
          resetForm();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
      }
    });
  }

  if (printers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-base font-semibold">Chưa có loại máy in nào</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Cần thêm ít nhất một loại máy in (công suất, giá điện, giá máy, tuổi thọ) ở trang Cài
            đặt trước khi tạo sản phẩm.
          </p>
          <Button render={<Link href="/settings" />}>Đi đến Cài đặt</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSave} className="space-y-4">
            <input type="hidden" name="printerId" value={printerId} />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Đèn ngủ mèo con"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Select
                  name="sku"
                  items={SKU_LABELS}
                  value={sku}
                  onValueChange={(v) => v && setSku(v)}
                >
                  <SelectTrigger id="sku" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SKU_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="printer">Loại máy in</Label>
                <Select
                  items={Object.fromEntries(printers.map((p) => [p.id, p.name]))}
                  value={printerId}
                  onValueChange={(v) => v && setPrinterId(v)}
                >
                  <SelectTrigger id="printer" className="w-full">
                    <SelectValue />
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
                <NumberInput
                  name="filamentWeightGram"
                  allowDecimal
                  value={values.filamentWeightGram}
                  onValueChange={setField("filamentWeightGram")}
                />
              </div>
              <div className="space-y-2">
                <Label>Giá nhựa (VNĐ/kg)</Label>
                <NumberInput
                  name="filamentPricePerKg"
                  value={values.filamentPricePerKg}
                  onValueChange={setField("filamentPricePerKg")}
                />
              </div>

              <div className="space-y-2">
                <Label>Thời gian in (giờ)</Label>
                <NumberInput
                  name="printHours"
                  allowDecimal
                  value={values.printHours}
                  onValueChange={setField("printHours")}
                />
              </div>
              <div className="space-y-2">
                <Label>% Lợi nhuận mong muốn</Label>
                <NumberInput
                  name="marginPercent"
                  allowDecimal
                  value={values.marginPercent}
                  onValueChange={setField("marginPercent")}
                />
              </div>

              <div className="space-y-2">
                <Label>Chi phí khác (VNĐ)</Label>
                <NumberInput
                  name="otherCost"
                  value={values.otherCost}
                  onValueChange={setField("otherCost")}
                />
              </div>
              <div className="space-y-2">
                <Label>Chi phí hoa hồng (VNĐ)</Label>
                <NumberInput
                  name="commissionCost"
                  value={values.commissionCost}
                  onValueChange={setField("commissionCost")}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Ghi chú chi phí khác</Label>
                <Textarea
                  name="otherCostNote"
                  rows={2}
                  value={otherCostNote}
                  onChange={(e) => setOtherCostNote(e.target.value)}
                  placeholder="VD: hộp giấy, phí ship, hao hụt..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang lưu..." : isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={() => onDoneEditing?.()}>
                  Huỷ
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Kết quả tính giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Chi phí nguyên liệu (nhựa)" value={breakdown.materialCost} />
          <Row label="Chi phí sản xuất chung (điện, khấu hao)" value={breakdown.generalProductionCost} />
          <Row label="Chi phí khác" value={breakdown.otherCost} />
          <Row label="Chi phí hoa hồng" value={breakdown.commissionCost} />
          <Separator />
          <Row label="Tổng chi phí" value={breakdown.totalCost} bold />
          <Row
            label={`Giá bán đề xuất (+${values.marginPercent}%)`}
            value={breakdown.suggestedPrice}
            bold
            highlight
          />
        </CardContent>
      </Card>
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
