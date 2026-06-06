"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAction(formData);
    
    // If it reaches here, it means loginAction returned an error object instead of throwing a redirect
    setLoading(false);
    if (result) {
      setError(result.message || "Invalid email or password");
      toast.error(result.message || "Failed to log in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06),transparent_40%)]" />

      <Card className="w-full max-w-md border-border/50 shadow-2xl relative z-10 bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground">
              <Leaf className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-primary">Welcome Back</CardTitle>
          <CardDescription>
            Access your Sauraha Fish Village account portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-xs font-semibold text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 border-border/60"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-secondary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 border-border/60"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-lg font-semibold gap-2 mt-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t bg-muted/20 py-5 text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create Account
            </Link>
          </p>
          
          <div className="space-y-1.5 border-t pt-4 w-full">
            <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground text-left max-w-xs mx-auto">
              <p>🔑 <span className="font-semibold">Admin:</span> admin@saurahafishvillage.com</p>
              <p>🔑 <span className="font-semibold">Manager:</span> manager@saurahafishvillage.com</p>
              <p>🔑 <span className="font-semibold">Staff:</span> reception@saurahafishvillage.com</p>
              <p>🔑 <span className="font-semibold">Customer:</span> customer@example.com</p>
            </div>
            <p className="text-[9px] text-muted-foreground italic pt-1">All accounts use password: <strong className="not-italic text-foreground">admin123</strong> or <strong className="not-italic text-foreground">staff123</strong> / <strong className="not-italic text-foreground">customer123</strong></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
