import { CONTACT, APP_SHORT_NAME } from "@/lib/constants";
import { Phone, Mail, MapPin, Compass, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary border border-primary/10 px-4 py-1.5 rounded-full text-xs font-semibold">
          <Compass className="h-3.5 w-3.5" />
          Location & Access
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary">
          Contact Us
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Have questions about our rooms, restaurant menu, or group event bookings? Reach out to us directly or drop by. We are always ready to welcome you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6 lg:col-span-1">
          <h3 className="font-heading font-bold text-xl text-primary">Get In Touch</h3>
          
          <div className="bg-card border border-border/40 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-primary/5 text-primary p-3 rounded-xl">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Location</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{CONTACT.address}</p>
            </div>
          </div>

          <div className="bg-card border border-border/40 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-primary/5 text-primary p-3 rounded-xl">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Phone Number</h4>
              <p className="text-xs text-muted-foreground mt-1">{CONTACT.phone}</p>
              <p className="text-[10px] text-muted-foreground/85 mt-0.5">Viber / WhatsApp Available</p>
            </div>
          </div>

          <div className="bg-card border border-border/40 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-primary/5 text-primary p-3 rounded-xl">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Email Address</h4>
              <p className="text-xs text-muted-foreground mt-1">{CONTACT.email}</p>
            </div>
          </div>

          <div className="bg-card border border-border/40 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-primary/5 text-primary p-3 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Opening Hours</h4>
              <p className="text-xs text-muted-foreground mt-1">Reception: 6:00 AM - 10:00 PM</p>
              <p className="text-xs text-muted-foreground mt-0.5">Restaurant: 7:00 AM - 9:30 PM</p>
            </div>
          </div>
        </div>

        {/* Message Form & Map */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-xl text-primary">Send a Message</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required className="border-border/60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required className="border-border/60" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="General Inquiry, Event Reservation..." required className="border-border/60" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you?" rows={5} required className="border-border/60" />
              </div>

              <Button type="submit" className="bg-primary hover:bg-primary/95 text-white gap-2">
                Send Message
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
