import Link from "next/link";
import { BedDouble, Users, Maximize, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  room: {
    id: string;
    number: number;
    name: string;
    type: string;
    capacity: number;
    pricePerNight: number;
    status: string;
    description: string | null;
    amenities: string[];
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  // Generate some room type badges and styles
  const typeBadgeColors = {
    STANDARD: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    DELUXE: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    SUITE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  } as any;

  // Custom premium gradient placeholders since there are no image uploads yet
  const roomPlaceholders = {
    STANDARD: "from-emerald-800 to-emerald-950",
    DELUXE: "from-teal-800 to-teal-950",
    SUITE: "from-amber-900 to-amber-950",
  } as any;

  return (
    <Card className="overflow-hidden border border-border/50 bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full group">
      {/* Premium Visual Placeholder */}
      <div className={`relative h-56 bg-gradient-to-br ${roomPlaceholders[room.type] || "from-primary to-primary-foreground"} flex items-center justify-center p-6 text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]" />
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
          <BedDouble className="w-40 h-40" />
        </div>

        <div className="relative z-10 text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">Room {room.number}</span>
          <h3 className="font-heading text-2xl font-bold">{room.name}</h3>
        </div>

        {/* Floating status / type badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="outline" className={`${typeBadgeColors[room.type]} bg-white/95 backdrop-blur-sm`}>
            {room.type}
          </Badge>
          <Badge className={`${room.status === "AVAILABLE" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"} border-none`}>
            {room.status.toLowerCase()}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-6 pb-2">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-primary font-heading">
            Rs. {room.pricePerNight}
            <span className="text-sm font-normal text-muted-foreground"> / night</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {room.description || "Enjoy a serene and peaceful stay with modern comforts in Sauraha, Rupandehi."}
        </p>

        {/* Room specs */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Up to {room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-primary" />
            <span>{room.type} Bedding</span>
          </div>
        </div>

        {/* Amenities chips */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {room.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="text-xs bg-muted/50 border border-muted px-2 py-0.5 rounded-md text-muted-foreground"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-xs text-muted-foreground pl-1">
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/booking?roomId=${room.id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/95 text-white gap-2 py-5 rounded-lg group-hover:shadow-md transition-all">
            Book Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
