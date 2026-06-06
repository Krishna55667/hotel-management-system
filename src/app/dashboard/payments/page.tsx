import { db } from "@/lib/db";
import PaymentVerifier from "@/components/dashboard/payment-verifier";

export const revalidate = 0;

export default async function PaymentsAdminPage() {
  // Fetch payments with details
  let payments: any[] = [];
  try {
    payments = await db.payment.findMany({
      include: {
        booking: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    console.error("Failed to query payments", e);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Verify Bank Payments</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review manual bank deposit files, inspect QR code transaction IDs, and verify bookings.
        </p>
      </div>

      {/* Payment Verifier Component */}
      <PaymentVerifier payments={payments} />
    </div>
  );
}
