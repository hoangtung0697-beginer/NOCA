"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SKU_LABELS, ORDER_STATUS_LABELS } from "@/lib/constants";

export function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/orders?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        items={{ ALL: "Tất cả trạng thái", ...ORDER_STATUS_LABELS }}
        defaultValue={searchParams.get("status") ?? "ALL"}
        onValueChange={(v) => setParam("status", v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={{ ALL: "Tất cả SKU", ...SKU_LABELS }}
        defaultValue={searchParams.get("sku") ?? "ALL"}
        onValueChange={(v) => setParam("sku", v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="SKU" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả SKU</SelectItem>
          {Object.entries(SKU_LABELS).map(([value, label]) => (
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
