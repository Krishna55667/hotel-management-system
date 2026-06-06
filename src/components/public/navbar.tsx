"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Leaf, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, APP_SHORT_NAME } from "@/lib/constants";
import { logoutAction } from "@/actions/auth";
import { toast } from "sonner";

interface NavbarProps {
  session: any;
}

export default function Navbar({ session }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Sauraha Fish Village Logo" className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-300" />
            <span className="font-heading font-bold text-xl sm:text-2xl text-primary tracking-tight hidden sm:block">
              {APP_SHORT_NAME}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium text-sm transition-colors duration-200 hover:text-primary ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={session.user.role === "CUSTOMER" ? "/customer" : "/dashboard"}
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    {session.user.role === "CUSTOMER" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <LayoutDashboard className="h-4 w-4" />
                    )}
                    {session.user.role === "CUSTOMER" ? "My Portal" : "Dashboard"}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/95">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <hr className="my-2 border-border" />
              {session ? (
                <div className="space-y-2">
                  <div className="px-3 py-1 text-xs text-muted-foreground">
                    Logged in as <strong>{session.user.name}</strong>
                  </div>
                  <Link
                    href={session.user.role === "CUSTOMER" ? "/customer" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button className="w-full gap-2 justify-center" variant="outline">
                      {session.user.role === "CUSTOMER" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <LayoutDashboard className="h-4 w-4" />
                      )}
                      {session.user.role === "CUSTOMER" ? "My Portal" : "Dashboard"}
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    variant="ghost"
                    className="w-full gap-2 justify-center text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                  <Button className="w-full bg-primary text-primary-foreground">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
