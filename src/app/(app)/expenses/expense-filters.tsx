"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";

export function ExpenseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/expenses?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        items={{ ALL: "Tất cả danh mục", ...EXPENSE_CATEGORY_LABELS }}
        defaultValue={searchParams.get("category") ?? "ALL"}
        onValueChange={(v) => setParam("category", v)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả danh mục</SelectItem>
          {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        type="month"
        defaultValue={searchParams.get("month") ?? ""}
        onChange={(e) => setParam("month", e.target.value)}
        className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
      />
    </div>
  );
}
