import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, CalendarCheck, BedDouble, Users, 
  UtensilsCrossed, UserCog, Package, CreditCard, 
  BarChart3, Settings, Leaf, LogOut, ShieldCheck 
} from "lucide-react";
import { DASHBOARD_NAV, APP_SHORT_NAME } from "@/lib/constants";

const IconMap = {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Users,
  UtensilsCrossed,
  UserCog,
  Package,
  CreditCard,
  BarChart3,
  Settings,
} as any;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Route protection fallback
  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;
  if (role === "CUSTOMER") {
    redirect("/customer");
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border hidden md:flex flex-col shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="bg-sidebar-primary p-1.5 rounded-lg text-sidebar-primary-foreground">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="font-heading font-bold text-lg text-white tracking-tight">
            {APP_SHORT_NAME}
          </span>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-sidebar-border space-y-1 bg-black/15">
          <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-sidebar-primary" />
            <span className="text-[10px] uppercase tracking-wider text-sidebar-primary font-bold">
              {role}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow py-4 px-4 space-y-1 overflow-y-auto">
          {DASHBOARD_NAV.map((link) => {
            const Icon = IconMap[link.icon] || LayoutDashboard;

            // Restrict manager & reception access to settings/reports if role is receptionist
            if (role === "RECEPTION" && ["staff", "reports", "settings"].some(item => link.href.includes(item))) {
              return null;
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-sidebar-accent hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4 text-sidebar-primary" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link href="/" className="block">
            <Button variant="outline" size="sm" className="w-full text-xs text-sidebar-foreground hover:bg-sidebar-accent border-sidebar-border bg-transparent">
              View Website
            </Button>
          </Link>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
          <h2 className="text-base font-semibold text-foreground">Resort Console</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Nepal Standard Time: <strong>{new Date().toLocaleDateString()}</strong>
            </span>
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {session.user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
