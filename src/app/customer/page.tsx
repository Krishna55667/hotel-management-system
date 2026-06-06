import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, CalendarRange, Key, Compass } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function CustomerDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch only this guest's bookings
  let bookings = [] as any[];
  try {
    bookings = await db.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        room: true,
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    console.error("Failed to query guest bookings", e);
  }

  const statusColors = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    CHECKED_IN: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    CHECKED_OUT: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    COMPLETED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  } as any;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">My Reservations</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track stay schedules, verify manual payment submissions, and view invoices.
          </p>
        </div>
        <Link href="/booking">
          <Button className="bg-primary hover:bg-primary/95 text-white gap-2">
            <CalendarRange className="h-4.5 w-4.5" />
            Book New Room
          </Button>
        </Link>
      </div>

      {/* Bookings Directory */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking Reference</TableHead>
              <TableHead>Room Details</TableHead>
              <TableHead>Check-In</TableHead>
              <TableHead>Check-Out</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings && bookings.length > 0 ? (
              bookings.map((b) => {
                const isConfirmed = ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "COMPLETED"].includes(b.status);
                
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      {b.bookingNumber}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold">Room {b.room.number}</div>
                      <div className="text-[10px] text-muted-foreground">{b.room.name} ({b.room.type})</div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {new Date(b.checkIn).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {new Date(b.checkOut).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-primary text-sm">
                      Rs. {b.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[b.status]}>
                        {b.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isConfirmed ? (
                        <a href={`/api/receipts/${b.id}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-primary border-primary/20 hover:border-primary">
                            <Printer className="h-4 w-4" />
                            Print
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Awaiting payment verification</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-sm text-muted-foreground space-y-3">
                  <Compass className="h-10 w-10 mx-auto text-muted-foreground/60" />
                  <p className="font-semibold text-foreground">No bookings found</p>
                  <p className="text-xs max-w-xs mx-auto">
                    You haven't scheduled any stays yet. Visit our Booking page to make a reservation.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
