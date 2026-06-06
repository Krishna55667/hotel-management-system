import { getBookings } from "@/actions/bookings";
import BookingTable from "@/components/dashboard/booking-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const revalidate = 0;

export default async function BookingsAdminPage() {
  const { bookings } = await getBookings({ limit: 100 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Manage Bookings</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Verify guest details, assign rooms, check guests in/out, and generate digital receipt invoices.
          </p>
        </div>
        <Link href="/booking">
          <Button className="bg-primary hover:bg-primary/95 text-white gap-2">
            <Plus className="h-4 w-4" />
            Book Now (Walk-in)
          </Button>
        </Link>
      </div>

      {/* Bookings Table Component */}
      <BookingTable bookings={bookings} />
    </div>
  );
}
