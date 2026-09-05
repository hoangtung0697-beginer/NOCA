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
import { createAccessory, updateAccessory } from "./actions";

interface AccessoryDialogProps {
  mode: "create" | "edit";
  accessory?: {
    id: string;
    name: string;
    price: number;
    note: string | null;
  };
  trigger: React.ReactElement;
}

export function AccessoryDialog({ mode, accessory, trigger }: AccessoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createAccessory(formData);
          toast.success("Đã thêm phụ kiện");
        } else if (accessory) {
          await updateAccessory(accessory.id, formData);
          toast.success("Đã cập nhật phụ kiện");
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
          <DialogTitle>{mode === "create" ? "Thêm phụ kiện" : "Sửa phụ kiện"}</DialogTitle>
          <DialogDescription>Dùng để chọn nhanh khi tính giá.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên phụ kiện</Label>
            <Input id="name" name="name" required defaultValue={accessory?.name} placeholder="VD: Đèn LED" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Giá (VNĐ)</Label>
            <NumberInput id="price" name="price" defaultValue={accessory?.price} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" name="note" rows={2} defaultValue={accessory?.note ?? ""} />
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
