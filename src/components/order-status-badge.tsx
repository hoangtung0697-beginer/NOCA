import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_BADGE_CLASS, ORDER_STATUS_LABELS } from "@/lib/constants";

interface OrderStatusBadgeProps {
  status: string;
  children?: ReactNode;
}

export function OrderStatusBadge({ status, children }: OrderStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn("gap-1.5", ORDER_STATUS_BADGE_CLASS[status])}>
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {children ?? ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
