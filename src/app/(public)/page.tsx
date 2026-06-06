import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/public/hero";
import RoomCard from "@/components/public/room-card";
import { Button } from "@/components/ui/button";
import { RESORT_FEATURES } from "@/lib/constants";
import { db } from "@/lib/db";
import { 
  Leaf, Mountain, Volume2, TreePine, 
  UtensilsCrossed, Heart, Users, Sprout, ArrowRight, Fish 
} from "lucide-react";

// Helper to match icon names to Lucide icons
const IconMap = {
  Leaf,
  Mountain,
  Volume2,
  TreePine,
  UtensilsCrossed,
  Heart,
  Users,
  Sprout,
} as any;

export const revalidate = 0;

export default async function HomePage() {
  // Fetch first 3 rooms for preview
  let rooms = [];
  try {
    rooms = await db.room.findMany({
      take: 3,
      orderBy: { number: "asc" },
    });
  } catch (e) {
    console.error("Failed to load rooms, using fallback mock", e);
    rooms = [
      {
        id: "mock1",
        number: 101,
        name: "Garden View Standard",
        type: "STANDARD",
        capacity: 2,
        pricePerNight: 2500,
        status: "AVAILABLE",
        description: "A cozy standard room with beautiful garden views. Features comfortable bedding, attached bathroom, and natural ventilation.",
        amenities: ["WiFi", "Hot Water", "Garden View", "Room Service"],
      },
      {
        id: "mock2",
        number: 102,
        name: "River Side Deluxe",
        type: "DELUXE",
        capacity: 3,
        pricePerNight: 4500,
        status: "AVAILABLE",
        description: "Spacious deluxe room overlooking the serene riverside. Equipped with premium amenities, AC, TV, and balcony.",
        amenities: ["WiFi", "Hot Water", "River View", "AC", "TV", "Balcony"],
      },
      {
        id: "mock3",
        number: 201,
        name: "Premium Nature Suite",
        type: "SUITE",
        capacity: 4,
        pricePerNight: 7500,
        status: "AVAILABLE",
        description: "Our finest suite offering panoramic views of the lush greenery and river. Features separate living area and luxury bath.",
        amenities: ["WiFi", "Hot Water", "Panoramic View", "AC", "Smart TV", "Mini Bar", "Balcony"],
      },
    ];
  }

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <Hero />

      {/* About & Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-pattern">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary">
            Why Choose Sauraha Fish Village?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Nestled in Rupandehi, Butwal-18, Sauraha, our resort is a sanctuary where natural beauty meets modern hospitality. We promote eco-tourism, clean living, and organic gastronomy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
          {RESORT_FEATURES.map((feature, idx) => {
            const Icon = IconMap[feature.icon] || Leaf;
            return (
              <div
                key={idx}
                className="bg-card border border-border/40 p-6 rounded-2xl hover:shadow-md hover:border-primary/10 transition-all group duration-300"
              >
                <div className="bg-primary/5 text-primary p-3 rounded-xl inline-block group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mt-4 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs uppercase tracking-wider text-secondary font-bold">Accommodations</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary">Our Peaceful Rooms</h2>
              <p className="text-muted-foreground text-sm">
                Each room is designed to provide maximum peace, quiet, and beautiful natural views.
              </p>
            </div>
            <Link href="/rooms">
              <Button variant="outline" className="group border-primary/20 hover:border-primary">
                View All Rooms
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map((room: any) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* Agro Tourism & Dining Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual Presentation */}
          <div className="relative rounded-3xl overflow-hidden h-[400px] bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col justify-end p-8 text-white">
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
            <div className="absolute top-6 left-6 bg-secondary text-secondary-foreground p-3 rounded-2xl">
              <Fish className="h-8 w-8" />
            </div>
            <div className="relative z-10 space-y-3">
              <span className="text-xs uppercase tracking-wider text-secondary font-bold">Farm to Table</span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading">Sauraha Fish Village & Agro Experience</h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed max-w-md">
                We cultivate our own vegetables and run sustainable fish ponds. Enjoy fresh, clean fish items prepared by our expert chefs.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-secondary font-bold font-sans">Organic Living</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary">Delicious Food & Agro Tourism</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              At Sauraha Fish Village, we believe in healthy, delicious, and sustainable living. Our restaurant features fish freshly caught from our ponds and vegetables grown in our organic garden. 
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Whether you are looking for local Kukhura (local chicken), traditional duck curry, or local fish delicacies, our kitchen serves clean, mouthwatering dishes with nepali spices.
            </p>
            <div className="pt-2">
              <Link href="/menu">
                <Button className="bg-primary hover:bg-primary/95 text-white">
                  View Dining Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
