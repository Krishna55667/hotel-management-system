"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Leaf, ArrowRight, Compass, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 hero-gradient">
      {/* Decorative Natural Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)]" />

      {/* Floating Leafs background decoration */}
      <div className="absolute top-1/4 left-10 text-emerald-500/10 animate-float" style={{ animationDelay: "0s" }}>
        <Leaf className="w-16 h-16 rotate-45" />
      </div>
      <div className="absolute bottom-1/4 right-10 text-amber-500/10 animate-float" style={{ animationDelay: "2s" }}>
        <Leaf className="w-20 h-20 -rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-1.5 rounded-full text-emerald-300 text-sm font-semibold tracking-wide">
            <Sprout className="h-4 w-4" />
            Agro-Tourism & Nature Retreat
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading tracking-tight leading-tight">
            Escape to a peaceful <span className="text-secondary font-semibold">oasis</span> in Sauraha
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-emerald-100/80 leading-relaxed max-w-2xl mx-auto">
            Experience the clean environment, natural greenery, and warm hospitality of Nepal's leading Agro-Resort. Delicious farm-to-table dining and comfortable riverside accommodation await you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/booking">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base font-semibold px-8 py-6 rounded-xl shadow-lg shadow-secondary/20 transition-all duration-300 transform hover:-translate-y-0.5">
                Book Your Stay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="border-emerald-500/30 text-white hover:bg-white/10 text-base font-semibold px-8 py-6 rounded-xl backdrop-blur-sm">
                Explore Food Menu
                <Compass className="ml-2 h-5 w-5 text-emerald-400" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 text-background fill-current"
        >
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>
    </section>
  );
}
