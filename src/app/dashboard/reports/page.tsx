import { db } from "@/lib/db";
import { getRevenueData, getBookingTrends, getOccupancyData } from "@/actions/reports";
import DashboardCharts from "@/components/dashboard/dashboard-charts";
import ExportButtons from "@/components/dashboard/export-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

export default async function ReportsPage() {
  const [revenueData, bookingTrends, occupancyData, logs, bookings, payments] = await Promise.all([
    getRevenueData(),
    getBookingTrends(),
    getOccupancyData(),
    db.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, role: true } } }
    }),
    db.booking.findMany({
      take: 1000,
      orderBy: { createdAt: "desc" },
      include: { 
        room: { select: { number: true, name: true } },
        user: { select: { name: true, email: true, phone: true } }
      }
    }),
    db.payment.findMany({
      take: 1000,
      orderBy: { createdAt: "desc" }
    })
  ]);

  // Clean data for CSV exports
  const flatBookings = bookings.map(b => ({
    id: b.id,
    customerName: b.user?.name || "",
    customerEmail: b.user?.email || "",
    customerPhone: b.user?.phone || "",
    roomNumber: b.room?.number || "",
    roomName: b.room?.name || "",
    checkIn: b.checkIn.toISOString(),
    checkOut: b.checkOut.toISOString(),
    totalAmount: b.totalAmount,
    status: b.status,
    createdAt: b.createdAt.toISOString()
  }));

  const flatPayments = payments.map(p => ({
    id: p.id,
    bookingId: p.bookingId,
    method: p.method,
    amount: p.amount,
    status: p.status,
    transactionId: p.transactionId || "",
    createdAt: p.createdAt.toISOString()
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">System Reports</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Analytics, data export, and system audit logs.
          </p>
        </div>
        <ExportButtons bookings={flatBookings} payments={flatPayments} />
      </div>

      <div className="mt-4">
        <DashboardCharts 
          revenueData={revenueData} 
          bookingTrends={bookingTrends} 
          occupancyData={occupancyData} 
        />
      </div>

      <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-primary font-heading">
            Recent Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-40">Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {log.user ? `${log.user.name} (${log.user.role})` : "System"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] tracking-wide uppercase">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{log.entity}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {log.details || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-sm text-muted-foreground">
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
