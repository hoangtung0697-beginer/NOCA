"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RANGE_LABELS: Record<string, string> = {
  day: "Theo ngày",
  week: "Theo tuần",
  month: "Theo tháng",
};

export function ReportRangeSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const range = searchParams.get("range") ?? "month";

  function setRange(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "month") {
      params.delete("range");
    } else {
      params.set("range", value);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <Select items={RANGE_LABELS} value={range} onValueChange={setRange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(RANGE_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
