"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/types";

export async function submitPayment(formData: FormData): Promise<ActionResult> {
  const bookingId = formData.get("bookingId") as string;
  const method = formData.get("method") as string;
  const transactionId = formData.get("transactionId") as string;
  const screenshotUrl = formData.get("screenshotUrl") as string;

  try {
    const booking = await db.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return { success: false, message: "Booking not found" };

    const session = await auth();
    const userId = session?.user?.id || booking.userId;

    await db.payment.create({
      data: {
        bookingId,
        userId,
        amount: booking.totalAmount,
        method: method as "QR_PAYMENT" | "FONEPAY" | "ESEWA" | "KHALTI" | "CASH",
        transactionId: transactionId || null,
        screenshotUrl: screenshotUrl || null,
        status: method === "CASH" ? "VERIFIED" : "PENDING",
      },
    });

    return { success: true, message: "Payment submitted. Awaiting verification." };
  } catch {
    return { success: false, message: "Failed to submit payment" };
  }
}

export async function verifyPayment(paymentId: string, approved: boolean): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["RECEPTION", "MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const payment = await db.payment.update({
      where: { id: paymentId },
      data: {
        status: approved ? "VERIFIED" : "REJECTED",
        verifiedById: session.user.id,
        verifiedAt: new Date(),
      },
    });

    if (approved) {
      await db.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });

      // Generate receipt
      const receiptNumber = `RCP-${Date.now().toString(36).toUpperCase()}`;
      await db.receipt.create({
        data: {
          bookingId: payment.bookingId,
          paymentId: payment.id,
          receiptNumber,
          qrCode: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${receiptNumber}`,
        },
      });
    }

    return { success: true, message: approved ? "Payment verified and receipt generated" : "Payment rejected" };
  } catch {
    return { success: false, message: "Failed to verify payment" };
  }
}

export async function getPayments(params?: { status?: string; page?: number }) {
  const page = params?.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = params?.status ? { status: params.status as "PENDING" | "VERIFIED" } : {};

  const [payments, total] = await Promise.all([
    db.payment.findMany({
      where,
      include: {
        booking: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            room: { select: { id: true, number: true, name: true } },
          },
        },
        user: { select: { id: true, name: true, email: true } },
        verifiedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.payment.count({ where }),
  ]);

  return { payments, total, pages: Math.ceil(total / limit) };
}
