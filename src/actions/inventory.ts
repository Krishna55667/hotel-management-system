"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { inventorySchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function getInventory(category?: string) {
  const where = category ? { category: category as "FOOD_INGREDIENTS" | "CLEANING_SUPPLIES" | "KITCHEN_INVENTORY" | "ROOM_SUPPLIES" } : {};
  return db.inventory.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function createInventoryItem(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name"),
    category: formData.get("category"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    minStock: formData.get("minStock"),
    costPerUnit: formData.get("costPerUnit"),
    supplier: formData.get("supplier"),
    supplierPhone: formData.get("supplierPhone"),
  };

  const validated = inventorySchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Invalid data", errors: validated.error.flatten().fieldErrors };
  }

  try {
    await db.inventory.create({ data: validated.data });
    return { success: true, message: "Inventory item added" };
  } catch {
    return { success: false, message: "Failed to add inventory item" };
  }
}

export async function updateInventoryQuantity(id: string, quantity: number): Promise<ActionResult> {
  try {
    await db.inventory.update({
      where: { id },
      data: { quantity, lastRestocked: new Date() },
    });
    return { success: true, message: "Stock updated" };
  } catch {
    return { success: false, message: "Failed to update stock" };
  }
}

export async function getLowStockItems() {
  return db.$queryRaw`
    SELECT * FROM "Inventory"
    WHERE quantity <= "minStock"
    ORDER BY quantity ASC
  `;
}
