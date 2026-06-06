import { getDashboardStats, getRevenueData, getBookingTrends, getOccupancyData } from "@/actions/reports";
import DashboardCharts from "@/components/dashboard/dashboard-charts";
import { 
  BedDouble, Sparkles, CheckSquare, LogIn, 
  LogOut, Wallet, Calendar, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 0;

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const revenueData = await getRevenueData();
  const bookingTrends = await getBookingTrends();
  const occupancyData = await getOccupancyData();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Overview Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time performance analytics and operations tracking for Sauraha Fish Village & Agro.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Rooms</CardTitle>
            <BedDouble className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalRooms}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Configured in system</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Available Rooms</CardTitle>
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.availableRooms}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Ready for check-in</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Occupied Rooms</CardTitle>
            <CheckSquare className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.occupiedRooms}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Guests currently staying</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Monthly Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Rs. {stats.monthlyRevenue}</div>
            <p className="text-[10px] text-muted-foreground mt-1">This calendar month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Today checkins</CardTitle>
            <LogIn className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayCheckIns}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Expected check-ins today</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Today checkouts</CardTitle>
            <LogOut className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.todayCheckOuts}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Expected check-outs today</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Pending Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Awaiting confirmations</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pendingPayments}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Awaiting verifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Component */}
      <DashboardCharts 
        revenueData={revenueData} 
        bookingTrends={bookingTrends} 
        occupancyData={occupancyData} 
      />
    </div>
  );
}
