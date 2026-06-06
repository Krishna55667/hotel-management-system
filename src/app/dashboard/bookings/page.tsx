import { getBookings } from "@/actions/bookings";
import BookingTable from "@/components/dashboard/booking-table";

export const revalidate = 0;

export default async function BookingsAdminPage() {
  const { bookings } = await getBookings({ limit: 100 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Manage Bookings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Verify guest details, assign rooms, check guests in/out, and generate digital receipt invoices.
        </p>
      </div>

      {/* Bookings Table Component */}
      <BookingTable bookings={bookings} />
    </div>
  );
}
