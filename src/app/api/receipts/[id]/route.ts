import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CONTACT, APP_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const bookingId = resolvedParams.id;

  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
        user: true,
        payment: true,
      },
    });

    if (!booking) {
      return new Response("Receipt Not Found", { status: 404 });
    }

    const verifiedPayment = booking.payment?.status === "VERIFIED" ? booking.payment : null;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt_${booking.bookingNumber}</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            padding: 40px;
            color: #333;
            max-width: 800px;
            margin: auto;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
            color: #0F4C3A;
          }
          .subtitle {
            font-size: 12px;
            margin: 5px 0 0 0;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .details-table th, .details-table td {
            text-align: left;
            padding: 8px;
            font-size: 13px;
          }
          .details-table th {
            border-bottom: 1px solid #000;
          }
          .total-section {
            text-align: right;
            border-top: 2px dashed #000;
            padding-top: 15px;
            margin-top: 20px;
            font-size: 16px;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 50px;
            font-size: 11px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
          @media print {
            body {
              border: none;
              box-shadow: none;
              padding: 0;
            }
            .print-btn {
              display: none;
            }
          }
          .print-btn {
            background-color: #0F4C3A;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
            display: block;
            margin: 20px auto 0 auto;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${APP_NAME}</h1>
          <p class="subtitle">${CONTACT.address}</p>
          <p class="subtitle">Phone: ${CONTACT.phone} | Email: ${CONTACT.email}</p>
        </div>

        <button class="print-btn" onclick="window.print()">Print Receipt / PDF</button>

        <h3 style="text-align: center; margin-top: 20px;">DIGITAL BOOKING RECEIPT</h3>

        <table class="details-table">
          <tr>
            <th>Booking Reference:</th>
            <td>${booking.bookingNumber}</td>
            <th>Date Issued:</th>
            <td>${new Date().toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Customer Name:</th>
            <td>${booking.user.name}</td>
            <th>Phone:</th>
            <td>${booking.user.phone || "N/A"}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>${booking.user.email}</td>
            <th>Address:</th>
            <td>${booking.user.address || "N/A"}</td>
          </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #000;" />

        <table class="details-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty / Duration</th>
              <th>Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Room ${booking.room.number} - ${booking.room.name} (${booking.room.type})<br/>
                  <small>Check-In: ${new Date(booking.checkIn).toLocaleDateString()} to Check-Out: ${new Date(booking.checkOut).toLocaleDateString()}</small>
              </td>
              <td>
                ${Math.ceil(Math.abs(new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} Night(s)
              </td>
              <td>Rs. ${booking.room.pricePerNight}</td>
              <td style="text-align: right;">Rs. ${booking.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <p>Total Paid: Rs. ${booking.totalAmount}</p>
          <p style="font-size: 11px; font-weight: normal; margin-top: 5px;">
            Payment Method: ${verifiedPayment ? verifiedPayment.method.replace("_", " ") : "CASH"}<br/>
            Transaction Ref ID: ${verifiedPayment ? verifiedPayment.transactionId : "Verified Offline"}
          </p>
        </div>

        <div class="footer">
          <p>Thank you for choosing Sauraha Fish Village & Agro Pvt. Ltd!</p>
          <p>Clean Environment • Peaceful Atmosphere • Nature Retreat</p>
        </div>
      </body>
      </html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Receipt API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
