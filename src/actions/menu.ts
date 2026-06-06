"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { menuItemSchema, menuCategorySchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function getMenuCategories() {
  return db.menuCategory.findMany({
    where: { isActive: true },
    include: { items: { where: { available: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllMenuCategories() {
  return db.menuCategory.findMany({
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getMenuItems(categoryId?: string) {
  const where = categoryId ? { categoryId } : {};
  return db.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createMenuItem(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    image: formData.get("image"),
  };

  const validated = menuItemSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Invalid data", errors: validated.error.flatten().fieldErrors };
  }

  try {
    await db.menuItem.create({
      data: {
        name: validated.data.name,
        description: validated.data.description || null,
        price: validated.data.price,
        categoryId: validated.data.categoryId,
        image: validated.data.image || null,
      },
    });
    return { success: true, message: "Menu item created" };
  } catch {
    return { success: false, message: "Failed to create menu item" };
  }
}

export async function updateMenuItem(id: string, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.menuItem.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        categoryId: formData.get("categoryId") as string,
        available: formData.get("available") === "true",
      },
    });
    return { success: true, message: "Menu item updated" };
  } catch {
    return { success: false, message: "Failed to update menu item" };
  }
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.menuItem.delete({ where: { id } });
    return { success: true, message: "Menu item deleted" };
  } catch {
    return { success: false, message: "Failed to delete menu item" };
  }
}

export async function createMenuCategory(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder"),
  };

  const validated = menuCategorySchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Invalid data", errors: validated.error.flatten().fieldErrors };
  }

  try {
    const slug = validated.data.name.toLowerCase().replace(/\s+/g, "-");
    await db.menuCategory.create({
      data: {
        name: validated.data.name,
        slug,
        sortOrder: validated.data.sortOrder || 0,
      },
    });
    return { success: true, message: "Category created" };
  } catch {
    return { success: false, message: "Failed to create category" };
  }
}

export async function toggleMenuItemAvailability(id: string): Promise<ActionResult> {
  try {
    const item = await db.menuItem.findUnique({ where: { id } });
    if (!item) return { success: false, message: "Item not found" };

    await db.menuItem.update({
      where: { id },
      data: { available: !item.available },
    });
    return { success: true, message: `Item ${item.available ? "hidden" : "shown"}` };
  } catch {
    return { success: false, message: "Failed to toggle availability" };
  }
}
