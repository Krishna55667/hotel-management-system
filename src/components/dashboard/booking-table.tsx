"use client";

import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, Search, CheckCircle, LogIn, 
  LogOut, XCircle, Printer, Loader2 
} from "lucide-react";
import { updateBookingStatus } from "@/actions/bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingTableProps {
  bookings: any[];
}

export default function BookingTable({ bookings: initialBookings }: BookingTableProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const result = await updateBookingStatus(id, newStatus);
    setUpdatingId("");

    if (result.success) {
      toast.success(result.message);
      // Update local state
      setBookings(prev => 
        prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
      );
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handlePrint = (bookingId: string) => {
    window.open(`/api/receipts/${bookingId}`, "_blank");
  };

  const filteredBookings = bookings.filter(b => 
    b.user.name.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.room.number.toString().includes(search)
  );

  const statusColors = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    CHECKED_IN: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    CHECKED_OUT: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    COMPLETED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  } as any;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/40">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search booking ID, customer or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-border/60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs font-semibold">
                    {b.bookingNumber.slice(0, 12)}...
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold">{b.user.name}</div>
                    <div className="text-[10px] text-muted-foreground">{b.user.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-semibold">Room {b.room.number}</div>
                    <div className="text-[10px] text-muted-foreground">{b.room.type}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      Sched In: <span className="font-semibold">{new Date(b.checkIn).toLocaleDateString()} {b.expectedCheckInTime ? `at ${b.expectedCheckInTime}` : ''}</span>
                    </div>
                    {b.actualCheckIn && (
                      <div className="text-[10px] text-emerald-600 mt-0.5">
                        Actual In: {new Date(b.actualCheckIn).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    )}
                    <div className="text-xs mt-1">
                      Sched Out: <span className="font-semibold">{new Date(b.checkOut).toLocaleDateString()} {b.expectedCheckOutTime ? `at ${b.expectedCheckOutTime}` : ''}</span>
                    </div>
                    {b.actualCheckOut && (
                      <div className="text-[10px] text-purple-600 mt-0.5">
                        Actual Out: {new Date(b.actualCheckOut).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    )}
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
                    {updatingId === b.id ? (
                      <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            {b.status === "PENDING" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(b.id, "CONFIRMED")} className="text-blue-600 gap-2 font-medium">
                                <CheckCircle className="h-4 w-4" />
                                Confirm Booking
                              </DropdownMenuItem>
                            )}
                            {b.status === "CONFIRMED" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(b.id, "CHECKED_IN")} className="text-emerald-600 gap-2 font-medium">
                                <LogIn className="h-4 w-4" />
                                Check In
                              </DropdownMenuItem>
                            )}
                            {b.status === "CHECKED_IN" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(b.id, "CHECKED_OUT")} className="text-purple-600 gap-2 font-medium">
                                <LogOut className="h-4 w-4" />
                                Check Out
                              </DropdownMenuItem>
                            )}
                            {b.status === "CHECKED_OUT" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(b.id, "COMPLETED")} className="text-gray-600 gap-2 font-medium">
                                <CheckCircle className="h-4 w-4" />
                                Complete Stay
                              </DropdownMenuItem>
                            )}
                            {["PENDING", "CONFIRMED"].includes(b.status) && (
                              <DropdownMenuItem onClick={() => handleStatusChange(b.id, "CANCELLED")} className="text-destructive gap-2 font-medium">
                                <XCircle className="h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handlePrint(b.id)} className="gap-2">
                              <Printer className="h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={async () => {
                              if (confirm("Are you sure you want to delete this booking?")) {
                                const { deleteBooking } = await import("@/actions/bookings");
                                const res = await deleteBooking(b.id);
                                if (res.success) {
                                  toast.success(res.message);
                                  setBookings(prev => prev.filter(item => item.id !== b.id));
                                  router.refresh();
                                } else {
                                  toast.error(res.message);
                                }
                              }
                            }} className="gap-2 text-destructive font-bold">
                              Delete Booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-sm text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
