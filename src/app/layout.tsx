import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sauraha Fish Village & Agro Pvt. Ltd | Premium Resort in Butwal, Nepal",
    template: "%s | Sauraha Fish Village",
  },
  description:
    "Experience the best of nature at Sauraha Fish Village & Agro Pvt. Ltd. Clean environment, peaceful atmosphere, delicious food, and agro tourism in Rupandehi, Butwal-18, Sauraha, Nepal.",
  keywords: [
    "Sauraha Fish Village",
    "Butwal resort",
    "Nepal resort",
    "agro tourism",
    "fish village",
    "Rupandehi hotel",
    "Sauraha Nepal",
  ],
  authors: [{ name: "Sauraha Fish Village & Agro Pvt. Ltd" }],
  openGraph: {
    title: "Sauraha Fish Village & Agro Pvt. Ltd",
    description: "Premium resort experience in the heart of nature - Butwal, Nepal",
    type: "website",
    locale: "en_US",
    siteName: "Sauraha Fish Village",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <TooltipProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
