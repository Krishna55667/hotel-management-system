import Link from "next/link";
import { Leaf, Phone, Mail, MapPin, Globe, MessageCircle, Send } from "lucide-react";
import { CONTACT, APP_SHORT_NAME, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and About */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-secondary p-1.5 rounded-lg text-secondary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-white">
                {APP_SHORT_NAME}
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/75 leading-relaxed">
              Experience the perfect blend of natural greenery, premium hospitality, and agro tourism at Rupandehi, Butwal-18, Nepal.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/75 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white mb-4">Contact Info</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/75 leading-relaxed">
                  {CONTACT.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-sm text-primary-foreground/75">
                  {CONTACT.phone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-sm text-primary-foreground/75">
                  {CONTACT.email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-primary-foreground/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60">
            &copy; {new Date().getFullYear()} {APP_SHORT_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/60">
            Designed for Agro Tourism & Luxury Resort Experience
          </p>
        </div>
      </div>
    </footer>
  );
}
