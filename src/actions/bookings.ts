"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { bookingSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";
import bcrypt from "bcryptjs";

export async function createBooking(formData: FormData): Promise<ActionResult> {
  const rawData = {
    roomId: formData.get("roomId") as string,
    checkIn: formData.get("checkIn") as string,
    checkOut: formData.get("checkOut") as string,
    expectedCheckInTime: formData.get("expectedCheckInTime") as string,
    expectedCheckOutTime: formData.get("expectedCheckOutTime") as string,
    bookingType: formData.get("bookingType") as string,
    guests: formData.get("guests") as string,
    specialRequests: formData.get("specialRequests") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  };

  const validated = bookingSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Invalid booking data", errors: validated.error.flatten().fieldErrors };
  }

  try {
    // Check room availability
    const conflicting = await db.booking.findFirst({
      where: {
        roomId: validated.data.roomId,
        status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
        OR: [
          {
            checkIn: { lte: validated.data.checkOut },
            checkOut: { gte: validated.data.checkIn },
          },
        ],
      },
    });

    if (conflicting) {
      return { success: false, message: "Room is not available for the selected dates" };
    }

    // Get room price
    const room = await db.room.findUnique({ where: { id: validated.data.roomId } });
    if (!room) {
      return { success: false, message: "Room not found" };
    }

    // Calculate total based on booking type
    let totalAmount = 0;
    const bType = validated.data.bookingType;
    
    if (bType === "DAY" && room.dayPrice) {
      totalAmount = room.dayPrice;
    } else if (bType === "NIGHT" && room.nightPrice) {
      totalAmount = room.nightPrice;
    } else if (bType === "WHOLE_DAY" && room.wholeDayPrice) {
      totalAmount = room.wholeDayPrice;
    } else {
      // Fallback to old logic
      const nights = Math.max(1, Math.ceil(
        (validated.data.checkOut.getTime() - validated.data.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      ));
      totalAmount = nights * room.pricePerNight;
    }

    // Get or create user
    const session = await auth();
    let userId: string;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Create guest user
      let user = await db.user.findUnique({ where: { email: validated.data.email } });
      if (!user) {
        const hashedPw = await bcrypt.hash("changeme123", 12);
        user = await db.user.create({
          data: {
            name: validated.data.name,
            email: validated.data.email,
            phone: validated.data.phone,
            address: validated.data.address || null,
            password: hashedPw,
            role: "CUSTOMER",
          },
        });
      }
      userId = user.id;
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        userId,
        roomId: validated.data.roomId,
        checkIn: validated.data.checkIn,
        checkOut: validated.data.checkOut,
        expectedCheckInTime: validated.data.expectedCheckInTime || null,
        expectedCheckOutTime: validated.data.expectedCheckOutTime || null,
        bookingType: validated.data.bookingType || null,
        guests: validated.data.guests,
        specialRequests: validated.data.specialRequests || null,
        totalAmount,
        status: "PENDING",
      },
    });

    return { success: true, message: "Booking created successfully", data: { bookingId: booking.id, totalAmount } };
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, message: "Failed to create booking" };
  }
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["RECEPTION", "MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const updateData: any = { 
      status: status as "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "COMPLETED" | "CANCELLED" 
    };

    if (status === "CHECKED_IN") {
      updateData.actualCheckIn = new Date();
    } else if (status === "CHECKED_OUT" || status === "COMPLETED") {
      updateData.actualCheckOut = new Date();
    }

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    // Update room status based on booking status
    if (status === "CHECKED_IN") {
      await db.room.update({ where: { id: booking.roomId }, data: { status: "OCCUPIED" } });
    } else if (status === "CHECKED_OUT" || status === "COMPLETED" || status === "CANCELLED") {
      await db.room.update({ where: { id: booking.roomId }, data: { status: "AVAILABLE" } });
    } else if (status === "CONFIRMED") {
      await db.room.update({ where: { id: booking.roomId }, data: { status: "BOOKED" } });
    }

    return { success: true, message: `Booking ${status.toLowerCase().replace("_", " ")}` };
  } catch {
    return { success: false, message: "Failed to update booking" };
  }
}

export async function getBookings(params?: { status?: string; page?: number; limit?: number }) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where = params?.status ? { status: params.status as "PENDING" | "CONFIRMED" } : {};

  const [bookings, total] = await Promise.all([
    db.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        room: { select: { id: true, number: true, name: true, type: true, pricePerNight: true } },
        payment: true,
        receipt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.booking.count({ where }),
  ]);

  return { bookings, total, pages: Math.ceil(total / limit) };
}

export async function getUserBookings(userId: string) {
  return db.booking.findMany({
    where: { userId },
    include: {
      room: { select: { id: true, number: true, name: true, type: true, pricePerNight: true } },
      payment: true,
      receipt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteBooking(bookingId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const booking = await db.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return { success: false, message: "Booking not found" };

    await db.$transaction([
      db.receipt.deleteMany({ where: { bookingId } }),
      db.payment.deleteMany({ where: { bookingId } }),
      db.booking.delete({ where: { id: bookingId } })
    ]);

    if (booking.roomId) {
      await db.room.update({
        where: { id: booking.roomId },
        data: { status: "AVAILABLE" }
      });
    }

    return { success: true, message: "Booking deleted permanently" };
  } catch (error) {
    console.error("Delete booking error:", error);
    return { success: false, message: "Failed to delete booking" };
  }
}
