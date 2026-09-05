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
import { Label } from "@/components/ui/label";
import { createPartner, updatePartner } from "./actions";

interface PartnerDialogProps {
  mode: "create" | "edit";
  partner?: {
    id: string;
    name: string;
  };
  trigger: React.ReactElement;
}

export function PartnerDialog({ mode, partner, trigger }: PartnerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createPartner(formData);
          toast.success("Đã thêm đối tác");
        } else if (partner) {
          await updatePartner(partner.id, formData);
          toast.success("Đã cập nhật đối tác");
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
          <DialogTitle>{mode === "create" ? "Thêm đối tác" : "Sửa đối tác"}</DialogTitle>
          <DialogDescription>
            Tên nên khớp với tên trong Người bán hàng / Nguồn chi để tự động gộp hoa hồng và chi
            phí đã ứng của người đó ở trang Chia lợi nhuận.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partnerName">Tên đối tác</Label>
            <Input
              id="partnerName"
              name="name"
              required
              defaultValue={partner?.name}
              placeholder="VD: Tùng"
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
