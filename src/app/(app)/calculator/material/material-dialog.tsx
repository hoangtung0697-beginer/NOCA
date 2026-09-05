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
import { Textarea } from "@/components/ui/textarea";
import { createMaterial, updateMaterial } from "./actions";

interface MaterialDialogProps {
  mode: "create" | "edit";
  material?: {
    id: string;
    name: string;
    type: string | null;
    pricePerKg: number;
    remainingGram: number;
    note: string | null;
  };
  trigger: React.ReactElement;
}

export function MaterialDialog({ mode, material, trigger }: MaterialDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createMaterial(formData);
          toast.success("Đã thêm loại nhựa");
        } else if (material) {
          await updateMaterial(material.id, formData);
          toast.success("Đã cập nhật loại nhựa");
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
          <DialogTitle>{mode === "create" ? "Thêm loại nhựa" : "Sửa loại nhựa"}</DialogTitle>
          <DialogDescription>Dùng để chọn nhanh khi tính giá.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên loại nhựa</Label>
            <Input id="name" name="name" required defaultValue={material?.name} placeholder="VD: PLA trắng" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Chất liệu</Label>
            <Input
              id="type"
              name="type"
              defaultValue={material?.type ?? ""}
              placeholder="VD: PLA, PETG, ABS..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerKg">Giá (VNĐ/kg)</Label>
            <NumberInput id="pricePerKg" name="pricePerKg" defaultValue={material?.pricePerKg} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remainingGram">Tồn kho (gram)</Label>
            <NumberInput
              id="remainingGram"
              name="remainingGram"
              allowDecimal
              defaultValue={material?.remainingGram ?? 0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" name="note" rows={2} defaultValue={material?.note ?? ""} />
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
