"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommissionFiltersProps {
  salespeople: { id: string; name: string }[];
}

const ALL_SALESPEOPLE = "ALL";

export function CommissionFilters({ salespeople }: CommissionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/commission?${params.toString()}`);
  }

  const salespersonItems: Record<string, string> = { [ALL_SALESPEOPLE]: "Tất cả người bán" };
  for (const s of salespeople) salespersonItems[s.id] = s.name;

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        items={salespersonItems}
        value={searchParams.get("salesperson") ?? ALL_SALESPEOPLE}
        onValueChange={(v) => v && setParam("salesperson", v === ALL_SALESPEOPLE ? "" : v)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(salespersonItems).map(([value, label]) => (
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
