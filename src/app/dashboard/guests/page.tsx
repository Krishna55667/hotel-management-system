import { getCustomers } from "@/actions/customers";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Star, Mail, Phone, MapPin } from "lucide-react";

export const revalidate = 0;

export default async function GuestsPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Customer Profiles</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review guest registration details, booking history, visit frequencies, and identify repeat loyal guests.
        </p>
      </div>

      {/* Guest Directory */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Visit Frequency</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead className="text-right">Loyalty Badge</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((c: any) => {
                const totalBookings = c.bookings.length;
                const completedBookings = c.bookings.filter((b: any) => b.status === "COMPLETED" || b.status === "CHECKED_OUT").length;
                
                // Identify repeat guests (2+ stays)
                const isRepeatGuest = completedBookings >= 2;

                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/5 text-primary font-bold flex items-center justify-center text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-sm text-foreground">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 text-primary" />
                        <span>{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 text-primary" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{c.address || "Nepal"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold">
                        {totalBookings} Booking(s)
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {completedBookings} Completed Stay(s)
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {isRepeatGuest ? (
                        <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary border-none gap-1 py-0.5">
                          <Star className="h-3 w-3 fill-current" />
                          Loyal Guest
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          Standard
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
