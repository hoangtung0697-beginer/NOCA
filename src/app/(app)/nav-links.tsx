"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Calculator,
  BadgePercent,
  Scale,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/orders", label: "Đơn hàng", icon: ShoppingCart },
  { href: "/expenses", label: "Chi phí", icon: Receipt },
  { href: "/commission", label: "Hoa hồng bán hàng", icon: BadgePercent },
  { href: "/profit-split", label: "Chia lợi nhuận", icon: Scale },
  { href: "/calculator", label: "Máy tính giá", icon: Sparkles },
  { href: "/pricing", label: "Tính giá", icon: Calculator },
  { href: "/settings", label: "Cài đặt", icon: Settings },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5">
      {LINKS.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-base font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
