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
import { createExpenseSource, updateExpenseSource } from "./actions";

interface ExpenseSourceDialogProps {
  mode: "create" | "edit";
  expenseSource?: {
    id: string;
    name: string;
  };
  trigger: React.ReactElement;
}

export function ExpenseSourceDialog({ mode, expenseSource, trigger }: ExpenseSourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createExpenseSource(formData);
          toast.success("Đã thêm nguồn chi");
        } else if (expenseSource) {
          await updateExpenseSource(expenseSource.id, formData);
          toast.success("Đã cập nhật nguồn chi");
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
          <DialogTitle>{mode === "create" ? "Thêm nguồn chi" : "Sửa nguồn chi"}</DialogTitle>
          <DialogDescription>
            Chọn nguồn chi khi nhập chi phí để theo dõi tổng tiền theo từng người/quỹ chi.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expenseSourceName">Tên nguồn chi</Label>
            <Input
              id="expenseSourceName"
              name="name"
              required
              defaultValue={expenseSource?.name}
              placeholder="VD: Tùng, Quỹ chung"
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
