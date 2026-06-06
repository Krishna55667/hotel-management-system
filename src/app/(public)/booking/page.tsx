import { getRooms } from "@/actions/rooms";
import BookingForm from "@/components/public/booking-form";
import { CalendarRange } from "lucide-react";

export const revalidate = 0;

export default async function BookingPage() {
  const rooms = await getRooms();

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary border border-primary/10 px-4 py-1.5 rounded-full text-xs font-semibold">
          <CalendarRange className="h-3.5 w-3.5" />
          Easy Reservations
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary">
          Book Your Stay
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Plan your escape to nature. Fill out our simple multi-step booking form, make the QR code payment transfer, and your room confirmation will be ready instantly.
        </p>
      </div>

      {/* Interactive Form */}
      <BookingForm rooms={rooms} />
    </div>
  );
}
