"use server";

import { db } from "@/lib/db";

export async function getCustomers(search?: string) {
  const where = search
    ? {
        role: "CUSTOMER" as const,
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search } },
        ],
      }
    : { role: "CUSTOMER" as const };

  return db.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      createdAt: true,
      bookings: {
        select: { id: true, status: true, checkIn: true, checkOut: true, totalAmount: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerProfile(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      image: true,
      createdAt: true,
      bookings: {
        include: {
          room: { select: { number: true, name: true, type: true } },
          payment: true,
          receipt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
