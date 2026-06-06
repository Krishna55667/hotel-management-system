"use server";

import { db } from "@/lib/db";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [
    totalRooms,
    availableRooms,
    occupiedRooms,
    todayCheckIns,
    todayCheckOuts,
    monthlyRevenueResult,
    pendingBookings,
    pendingPayments,
  ] = await Promise.all([
    db.room.count(),
    db.room.count({ where: { status: "AVAILABLE" } }),
    db.room.count({ where: { status: "OCCUPIED" } }),
    db.booking.count({
      where: { checkIn: { gte: today, lt: tomorrow }, status: { in: ["CONFIRMED", "CHECKED_IN"] } },
    }),
    db.booking.count({
      where: { checkOut: { gte: today, lt: tomorrow }, status: { in: ["CHECKED_IN", "CHECKED_OUT"] } },
    }),
    db.payment.aggregate({
      where: {
        status: "VERIFIED",
        createdAt: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
      _sum: { amount: true },
    }),
    db.booking.count({ where: { status: "PENDING" } }),
    db.payment.count({ where: { status: "PENDING" } }),
  ]);

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    todayCheckIns,
    todayCheckOuts,
    monthlyRevenue: monthlyRevenueResult._sum.amount || 0,
    pendingBookings,
    pendingPayments,
  };
}

export async function getRevenueData() {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const result = await db.payment.aggregate({
      where: {
        status: "VERIFIED",
        createdAt: { gte: start, lte: end },
      },
      _sum: { amount: true },
    });

    months.push({
      month: start.toLocaleString("default", { month: "short" }),
      revenue: result._sum.amount || 0,
    });
  }
  return months;
}

export async function getBookingTrends() {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const count = await db.booking.count({
      where: { createdAt: { gte: start, lte: end } },
    });

    months.push({
      month: start.toLocaleString("default", { month: "short" }),
      bookings: count,
    });
  }
  return months;
}

export async function getOccupancyData() {
  const [available, booked, occupied, maintenance] = await Promise.all([
    db.room.count({ where: { status: "AVAILABLE" } }),
    db.room.count({ where: { status: "BOOKED" } }),
    db.room.count({ where: { status: "OCCUPIED" } }),
    db.room.count({ where: { status: { in: ["MAINTENANCE", "CLEANING"] } } }),
  ]);

  return [
    { name: "Available", value: available, color: "#10b981" },
    { name: "Booked", value: booked, color: "#3b82f6" },
    { name: "Occupied", value: occupied, color: "#f59e0b" },
    { name: "Maintenance", value: maintenance, color: "#ef4444" },
  ];
}
