"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { createPrinter, updatePrinter } from "./actions";

interface PrinterDialogProps {
  mode: "create" | "edit";
  printer?: {
    id: string;
    name: string;
    machineWattage: number;
    electricityPricePerKwh: number;
    machinePrice: number;
    machineLifetimeHours: number;
  };
  trigger: React.ReactElement;
}

export function PrinterDialog({ mode, printer, trigger }: PrinterDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createPrinter(formData);
          toast.success("Đã thêm loại máy in");
        } else if (printer) {
          await updatePrinter(printer.id, formData);
          toast.success("Đã cập nhật loại máy in");
        }
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm loại máy in" : "Sửa loại máy in"}</DialogTitle>
          <DialogDescription>
            Thông số này sẽ dùng chung cho mọi sản phẩm chọn loại máy in này ở trang Tính giá.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên loại máy in</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={printer?.name}
              placeholder="VD: Bambu Lab A1 Combo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="machineWattage">Công suất máy in trung bình (W)</Label>
            <NumberInput
              id="machineWattage"
              name="machineWattage"
              allowDecimal
              defaultValue={printer?.machineWattage}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="electricityPricePerKwh">Giá điện (VNĐ/kWh)</Label>
            <NumberInput
              id="electricityPricePerKwh"
              name="electricityPricePerKwh"
              defaultValue={printer?.electricityPricePerKwh}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="machinePrice">Giá máy in (VNĐ)</Label>
            <NumberInput
              id="machinePrice"
              name="machinePrice"
              defaultValue={printer?.machinePrice}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="machineLifetimeHours">Tuổi thọ máy (giờ)</Label>
            <NumberInput
              id="machineLifetimeHours"
              name="machineLifetimeHours"
              allowDecimal
              defaultValue={printer?.machineLifetimeHours}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
