import { getRooms } from "@/actions/rooms";
import RoomCard from "@/components/public/room-card";
import { BedDouble, Sparkles, Home } from "lucide-react";

export const revalidate = 0;

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary border border-primary/10 px-4 py-1.5 rounded-full text-xs font-semibold">
          <BedDouble className="h-3.5 w-3.5" />
          Luxurious Accommodations
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary">
          Our Rooms & Suites
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Stay in comfort and style. Choose from our standard, deluxe, or suite rooms, each offering pristine views and quiet comfort away from the city.
        </p>
      </div>

      {/* Grid of rooms */}
      {rooms && rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {rooms.map((room: any) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 border rounded-2xl max-w-xl mx-auto space-y-4">
          <Home className="h-12 w-12 text-muted-foreground/60 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-foreground">No Rooms Configured</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Please run the database seed script to import standard room configurations.
          </p>
        </div>
      )}
    </div>
  );
}
