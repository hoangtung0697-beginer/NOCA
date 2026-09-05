"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProfitSplitFilters({ defaultMonth }: { defaultMonth: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/profit-split?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="month"
        defaultValue={searchParams.get("month") ?? defaultMonth}
        onChange={(e) => setParam("month", e.target.value)}
        className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
      />
    </div>
  );
}
