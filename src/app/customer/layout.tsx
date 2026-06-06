import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { 
  User, CalendarRange, Heart, 
  Settings, Leaf, LogOut, ShieldCheck 
} from "lucide-react";
import { APP_SHORT_NAME } from "@/lib/constants";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Route protection
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-primary-foreground border-r border-primary/20 flex flex-col shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-primary-foreground/10 bg-white">
          <img src="/logo.png" alt="Sauraha Fish Village Logo" className="h-10 w-10 object-contain" />
          <span className="font-heading font-bold text-lg text-primary tracking-tight">
            {APP_SHORT_NAME}
          </span>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-primary-foreground/10 space-y-1 bg-black/10">
          <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-secondary" />
            <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">
              Guest Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-4 px-4 space-y-1">
          <Link
            href="/customer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-foreground/10 hover:text-white transition-colors"
          >
            <CalendarRange className="h-4 w-4 text-secondary" />
            <span>My Bookings</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-foreground/10 hover:text-white transition-colors"
          >
            <Leaf className="h-4 w-4 text-secondary" />
            <span>Explore Sauraha</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="p-4 border-t border-primary-foreground/10 space-y-2">
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full text-xs text-secondary-foreground hover:bg-primary-foreground/10 justify-start gap-2 text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
          <h2 className="text-sm font-semibold text-foreground">Guest Control</h2>
          <span className="text-xs text-muted-foreground">
            Welcome, <strong>{session.user.name}</strong>
          </span>
        </header>

        <main className="flex-grow p-6 md:p-8 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
