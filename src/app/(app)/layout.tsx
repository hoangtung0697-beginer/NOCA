import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./nav-links";
import { logout } from "./logout-action";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh gap-4 bg-background p-3 md:p-4">
      <aside className="flex w-18 shrink-0 flex-col rounded-2xl bg-sidebar p-3.5 text-sidebar-foreground md:w-72 md:p-5">
        <div className="mb-7 flex items-center gap-3 px-1">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-base font-extrabold tracking-tight text-sidebar-primary-foreground">
            NO
          </div>
          <div className="hidden md:block">
            <p className="text-base font-bold leading-tight">NOCA.</p>
            <p className="text-sm text-sidebar-foreground/60">Quản lý kinh doanh</p>
          </div>
        </div>

        <NavLinks />

        <div className="mt-auto pt-4">
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className="h-auto w-full justify-center gap-3.5 rounded-xl px-3.5 py-3 text-base text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:justify-start"
            >
              <LogOut className="size-5 shrink-0" />
              <span className="hidden md:inline">Đăng xuất</span>
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
