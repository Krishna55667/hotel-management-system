"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { roomSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function getRooms(params?: { status?: string; type?: string }) {
  const where: Record<string, unknown> = {};
  if (params?.status) where.status = params.status;
  if (params?.type) where.type = params.type;

  return db.room.findMany({
    where,
    include: {
      bookings: {
        where: {
          status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
          checkOut: { gte: new Date() },
        },
        select: { id: true, checkIn: true, checkOut: true, status: true },
      },
    },
    orderBy: { number: "asc" },
  });
}

export async function getRoom(id: string) {
  return db.room.findUnique({
    where: { id },
    include: {
      bookings: {
        where: { checkOut: { gte: new Date() } },
        include: {
          user: { select: { name: true, email: true } },
        },
        orderBy: { checkIn: "asc" },
      },
    },
  });
}

export async function getAvailableRooms(checkIn: Date, checkOut: Date) {
  const bookedRoomIds = await db.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
      OR: [{ checkIn: { lte: checkOut }, checkOut: { gte: checkIn } }],
    },
    select: { roomId: true },
  });

  const bookedIds = bookedRoomIds.map((b: { roomId: string }) => b.roomId);

  return db.room.findMany({
    where: {
      id: { notIn: bookedIds },
      status: { in: ["AVAILABLE", "BOOKED"] },
    },
    orderBy: { number: "asc" },
  });
}

export async function createRoom(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    number: formData.get("number"),
    name: formData.get("name"),
    type: formData.get("type"),
    capacity: formData.get("capacity"),
    pricePerNight: formData.get("pricePerNight"),
    dayPrice: formData.get("dayPrice") || undefined,
    nightPrice: formData.get("nightPrice") || undefined,
    wholeDayPrice: formData.get("wholeDayPrice") || undefined,
    description: formData.get("description"),
    floor: formData.get("floor"),
  };

  const validated = roomSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Invalid data", errors: validated.error.flatten().fieldErrors };
  }

  try {
    await db.room.create({
      data: {
        number: validated.data.number,
        name: validated.data.name,
        type: validated.data.type,
        capacity: validated.data.capacity,
        pricePerNight: validated.data.pricePerNight,
        dayPrice: validated.data.dayPrice || null,
        nightPrice: validated.data.nightPrice || null,
        wholeDayPrice: validated.data.wholeDayPrice || null,
        description: validated.data.description || null,
        floor: validated.data.floor || 1,
        amenities: [],
        images: [],
      },
    });

    return { success: true, message: "Room created successfully" };
  } catch {
    return { success: false, message: "Failed to create room. Number may already exist." };
  }
}

export async function updateRoom(id: string, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.room.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        type: formData.get("type") as "STANDARD" | "DELUXE" | "SUITE",
        capacity: Number(formData.get("capacity")),
        pricePerNight: Number(formData.get("pricePerNight")),
        dayPrice: formData.get("dayPrice") ? Number(formData.get("dayPrice")) : null,
        nightPrice: formData.get("nightPrice") ? Number(formData.get("nightPrice")) : null,
        wholeDayPrice: formData.get("wholeDayPrice") ? Number(formData.get("wholeDayPrice")) : null,
        description: formData.get("description") as string,
        status: formData.get("status") as "AVAILABLE" | "MAINTENANCE" | "CLEANING",
      },
    });

    return { success: true, message: "Room updated successfully" };
  } catch {
    return { success: false, message: "Failed to update room" };
  }
}

export async function updateRoomStatus(id: string, status: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["RECEPTION", "MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.room.update({
      where: { id },
      data: { status: status as "AVAILABLE" | "BOOKED" | "OCCUPIED" | "MAINTENANCE" | "CLEANING" | "RESERVED" },
    });
    return { success: true, message: "Room status updated" };
  } catch {
    return { success: false, message: "Failed to update room status" };
  }
}

export async function updateRoomName(id: string, newName: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.room.update({
      where: { id },
      data: { name: newName },
    });
    return { success: true, message: "Room name updated" };
  } catch {
    return { success: false, message: "Failed to update room name" };
  }
}

export async function updateRoomPricing(
  id: string, 
  pricing: { pricePerNight: number, dayPrice?: number, nightPrice?: number, wholeDayPrice?: number }
): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  if (pricing.pricePerNight < 0) {
    return { success: false, message: "Price cannot be negative" };
  }

  try {
    await db.room.update({
      where: { id },
      data: { 
        pricePerNight: pricing.pricePerNight,
        dayPrice: pricing.dayPrice || null,
        nightPrice: pricing.nightPrice || null,
        wholeDayPrice: pricing.wholeDayPrice || null,
      },
    });
    return { success: true, message: "Room prices updated successfully" };
  } catch {
    return { success: false, message: "Failed to update room prices" };
  }
}

export async function deleteRoom(roomId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Get all bookings for this room to cascade-delete payments/receipts
    const bookings = await db.booking.findMany({
      where: { roomId },
      select: { id: true },
    });
    const bookingIds = bookings.map((b) => b.id);

    await db.$transaction([
      db.receipt.deleteMany({ where: { bookingId: { in: bookingIds } } }),
      db.payment.deleteMany({ where: { bookingId: { in: bookingIds } } }),
      db.booking.deleteMany({ where: { roomId } }),
      db.room.delete({ where: { id: roomId } }),
    ]);

    return { success: true, message: "Room deleted permanently" };
  } catch (error) {
    console.error("Delete room error:", error);
    return { success: false, message: "Failed to delete room. It may still have active records." };
  }
}
