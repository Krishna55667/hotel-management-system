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
  const orderId = resolvedParams.id;

  try {
    const order = await db.restaurantOrder.findUnique({
      where: { id: orderId },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          }
        }
      },
    });

    if (!order) {
      return new Response("Order Not Found", { status: 404 });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Table_Receipt_${order.id}</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            padding: 40px;
            color: #333;
            max-width: 500px;
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
            font-size: 20px;
            font-weight: bold;
            margin: 0;
            color: #0F4C3A;
          }
          .subtitle {
            font-size: 12px;
            margin: 5px 0 0 0;
          }
          .details {
            font-size: 13px;
            margin-bottom: 15px;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 13px;
          }
          .details-table th, .details-table td {
            text-align: left;
            padding: 5px 0;
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
          <img src="/logo.png" alt="Logo" style="height: 60px; object-fit: contain; margin-bottom: 10px;" />
          <h1 class="title">${APP_NAME}</h1>
          <p class="subtitle">${CONTACT.address}</p>
          <p class="subtitle">Phone: ${CONTACT.phone} | Email: ${CONTACT.email}</p>
        </div>

        <button class="print-btn" onclick="window.print()">Print Bill</button>

        <h3 style="text-align: center; margin-top: 20px;">TABLE BILL</h3>

        <div class="details">
          <strong>Order ID:</strong> ${order.id.slice(-8).toUpperCase()}<br/>
          <strong>Table:</strong> ${order.table.name}<br/>
          ${order.customerName ? `<strong>Customer:</strong> ${order.customerName}<br/>` : ""}
          <strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}
        </div>

        <table class="details-table">
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.menuItem.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">Rs. ${item.priceAtOrder * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <p>Total Amount: Rs. ${order.totalAmount}</p>
        </div>

        <div class="footer">
          <p>Thank you for dining with us!</p>
          <p>Sauraha Fish Village & Agro Pvt. Ltd</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
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
