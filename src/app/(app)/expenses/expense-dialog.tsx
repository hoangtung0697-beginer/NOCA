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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import { createExpense, updateExpense } from "./actions";

interface ExpenseSourceOption {
  id: string;
  name: string;
}

interface ExpenseDialogProps {
  mode: "create" | "edit";
  expenseSources: ExpenseSourceOption[];
  expense?: {
    id: string;
    category: string;
    amount: number;
    date: string;
    note: string | null;
    expenseSourceId: string | null;
  };
  trigger: React.ReactElement;
}

const NO_SOURCE = "NONE";
const TAI_SAN_CO_DINH = "TAI_SAN_CO_DINH";

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export function ExpenseDialog({ mode, expenseSources, expense, trigger }: ExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState(expense?.category ?? "NGUYEN_LIEU");
  const isFixedAsset = category === TAI_SAN_CO_DINH;

  const initialSourceId =
    expense?.expenseSourceId && expenseSources.some((s) => s.id === expense.expenseSourceId)
      ? expense.expenseSourceId
      : NO_SOURCE;
  const [selectedSourceId, setSelectedSourceId] = useState(initialSourceId);

  const sourceItems: Record<string, string> = { [NO_SOURCE]: "— Không chọn —" };
  for (const s of expenseSources) sourceItems[s.id] = s.name;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createExpense(formData);
          toast.success("Đã ghi nhận chi phí");
        } else if (expense) {
          await updateExpense(expense.id, formData);
          toast.success("Đã cập nhật chi phí");
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
          <DialogTitle>{mode === "create" ? "Nhập chi phí" : "Sửa chi phí"}</DialogTitle>
          <DialogDescription>
            {isFixedAsset
              ? "Khoản này sẽ tự động thêm vào mục Tài sản cố định bên dưới."
              : "Ghi nhận chi phí theo danh mục."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục</Label>
            <Select
              name="category"
              items={EXPENSE_CATEGORY_LABELS}
              value={category}
              onValueChange={(v) => v && setCategory(v)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VNĐ)</Label>
            <NumberInput id="amount" name="amount" defaultValue={expense?.amount} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseSource">Nguồn chi</Label>
            <input
              type="hidden"
              name="expenseSourceId"
              value={selectedSourceId === NO_SOURCE ? "" : selectedSourceId}
            />
            <Select
              items={sourceItems}
              value={selectedSourceId}
              onValueChange={(v) => v && setSelectedSourceId(v)}
            >
              <SelectTrigger id="expenseSource" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(sourceItems).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Ngày chi</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={toDateInputValue(expense?.date)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">{isFixedAsset ? "Tên tài sản" : "Ghi chú"}</Label>
            {isFixedAsset ? (
              <Input
                id="note"
                name="note"
                required
                placeholder="VD: Máy in Bambu Lab A1"
                defaultValue={expense?.note ?? ""}
              />
            ) : (
              <Textarea id="note" name="note" rows={2} defaultValue={expense?.note ?? ""} />
            )}
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
