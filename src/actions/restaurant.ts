"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

export async function getTables() {
  return db.restaurantTable.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createTable(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const capacity = Number(formData.get("capacity"));

  try {
    await db.restaurantTable.create({
      data: { name, capacity },
    });
    revalidatePath("/dashboard/restaurant");
    return { success: true, message: "Table created" };
  } catch (error) {
    return { success: false, message: "Failed to create table" };
  }
}

export async function updateTableStatus(id: string, status: "AVAILABLE" | "OCCUPIED" | "RESERVED"): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    await db.restaurantTable.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/dashboard/restaurant");
    return { success: true, message: "Status updated" };
  } catch (error) {
    return { success: false, message: "Update failed" };
  }
}

export async function getActiveOrder(tableId: string) {
  return db.restaurantOrder.findFirst({
    where: { 
      tableId, 
      status: { in: ["PENDING", "IN_PROGRESS", "SERVED"] } 
    },
    include: {
      items: {
        include: { menuItem: true }
      }
    }
  });
}

export async function updateTableName(id: string, name: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }
  try {
    await db.restaurantTable.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/dashboard/restaurant");
    return { success: true, message: "Table renamed" };
  } catch (error) {
    return { success: false, message: "Failed to rename table" };
  }
}

export async function placeOrder(tableId: string, items: Array<{ menuItemId: string, quantity: number, priceOverride: number }>, customerName?: string): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    // check if there's an active order for this table
    let order = await db.restaurantOrder.findFirst({
      where: { tableId, status: { in: ["PENDING", "IN_PROGRESS", "SERVED"] } }
    });

    if (!order) {
      order = await db.restaurantOrder.create({
        data: {
          tableId,
          customerName,
          status: "PENDING",
        }
      });
      // also set table to OCCUPIED
      await db.restaurantTable.update({ where: { id: tableId }, data: { status: "OCCUPIED" } });
    } else if (customerName && !order.customerName) {
      // Update customer name if provided on subsequent order additions
      order = await db.restaurantOrder.update({
        where: { id: order.id },
        data: { customerName }
      });
    }

    let totalAmount = order.totalAmount;

    for (const item of items) {
      await db.restaurantOrderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceAtOrder: item.priceOverride,
        }
      });
      totalAmount += (item.priceOverride * item.quantity);
    }

    await db.restaurantOrder.update({
      where: { id: order.id },
      data: { totalAmount }
    });

    revalidatePath("/dashboard/restaurant");
    return { success: true, message: "Order placed successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to place order" };
  }
}

export async function completeOrder(orderId: string, tableId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    await db.restaurantOrder.update({
      where: { id: orderId },
      data: { status: "COMPLETED" }
    });
    await db.restaurantTable.update({
      where: { id: tableId },
      data: { status: "AVAILABLE" }
    });
    revalidatePath("/dashboard/restaurant");
    return { success: true, message: "Order completed and table freed" };
  } catch (error) {
    return { success: false, message: "Failed to complete order" };
  }
}

export async function getTableOrders() {
  return db.restaurantOrder.findMany({
    include: {
      table: true,
      items: {
        include: { menuItem: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function deleteTableOrder(orderId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const order = await db.restaurantOrder.findUnique({ where: { id: orderId } });
    if (!order) return { success: false, message: "Order not found" };

    // If deleting active order, reset table status to AVAILABLE
    if (order.status !== "COMPLETED" && order.status !== "CANCELLED") {
      await db.restaurantTable.update({
        where: { id: order.tableId },
        data: { status: "AVAILABLE" }
      });
    }

    await db.$transaction([
      db.restaurantOrderItem.deleteMany({ where: { orderId } }),
      db.restaurantOrder.delete({ where: { id: orderId } })
    ]);

    revalidatePath("/dashboard/restaurant");
    return { success: true, message: "Table reservation record deleted" };
  } catch (error) {
    console.error("Delete table order error:", error);
    return { success: false, message: "Failed to delete table reservation record" };
  }
}
