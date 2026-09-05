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
import { createFixedAsset, updateFixedAsset } from "./actions";

interface FixedAssetDialogProps {
  mode: "create" | "edit";
  asset?: {
    id: string;
    name: string;
    price: number;
    purchaseDate: string;
    note: string | null;
  };
  trigger: React.ReactElement;
}

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export function FixedAssetDialog({ mode, asset, trigger }: FixedAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createFixedAsset(formData);
          toast.success("Đã thêm tài sản cố định");
        } else if (asset) {
          await updateFixedAsset(asset.id, formData);
          toast.success("Đã cập nhật tài sản cố định");
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
          <DialogTitle>
            {mode === "create" ? "Thêm tài sản cố định" : "Sửa tài sản cố định"}
          </DialogTitle>
          <DialogDescription>
            Ghi nhận tài sản đầu tư (máy in, dụng cụ...) — không tính vào chi phí vận hành hàng
            tháng, chỉ để theo dõi.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên tài sản</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={asset?.name}
              placeholder="VD: Máy in Bambu Lab A1 Combo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Giá trị (VNĐ)</Label>
            <NumberInput id="price" name="price" defaultValue={asset?.price} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Ngày mua</Label>
            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              required
              defaultValue={toDateInputValue(asset?.purchaseDate)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" name="note" rows={2} defaultValue={asset?.note ?? ""} />
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
