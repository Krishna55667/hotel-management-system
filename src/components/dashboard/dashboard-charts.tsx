"use client";

import { useEffect, useState } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, Cell, PieChart, Pie, Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartsProps {
  revenueData: any[];
  bookingTrends: any[];
  occupancyData: any[];
}

export default function DashboardCharts({ 
  revenueData, 
  bookingTrends, 
  occupancyData 
}: ChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96">
        <div className="bg-card border rounded-2xl animate-pulse" />
        <div className="bg-card border rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Fallbacks if data empty
  const revData = revenueData.length > 0 ? revenueData : [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 }
  ];

  const trendData = bookingTrends.length > 0 ? bookingTrends : [
    { month: "Jan", bookings: 0 },
    { month: "Feb", bookings: 0 },
    { month: "Mar", bookings: 0 },
    { month: "Apr", bookings: 0 },
    { month: "May", bookings: 0 },
    { month: "Jun", bookings: 0 }
  ];

  const occData = occupancyData.length > 0 ? occupancyData : [
    { name: "Available", value: 3, color: "#10b981" },
    { name: "Booked", value: 0, color: "#3b82f6" },
    { name: "Occupied", value: 0, color: "#f59e0b" },
    { name: "Maintenance", value: 0, color: "#ef4444" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Area Chart */}
      <Card className="lg:col-span-2 border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-base text-primary">
            Revenue Analytics (Rs.)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F4C3A" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0F4C3A" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickLine={false} className="text-xs text-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
              <Tooltip 
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                labelClassName="font-bold text-primary"
              />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0F4C3A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Occupancy Donut Chart */}
      <Card className="lg:col-span-1 border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-base text-primary">
            Room Occupancy Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex flex-col justify-center">
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={occData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {occData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                className="text-xs"
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Booking Trends Bar Chart */}
      <Card className="lg:col-span-3 border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-base text-primary">
            Monthly Booking Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" tickLine={false} className="text-xs text-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
              <Tooltip 
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
              />
              <Bar dataKey="bookings" name="Bookings" fill="#C9A84C" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
