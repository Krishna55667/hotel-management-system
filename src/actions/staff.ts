"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { staffSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";
import bcrypt from "bcryptjs";

export async function getStaff() {
  return db.staff.findMany({
    include: { user: { select: { id: true, name: true, email: true, phone: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createStaff(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    position: formData.get("position"),
    salary: formData.get("salary"),
    shift: formData.get("shift"),
  };

  const validated = staffSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Invalid data", errors: validated.error.flatten().fieldErrors };
  }

  try {
    const hashedPw = await bcrypt.hash("staff123", 12);
    const user = await db.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone || null,
        password: hashedPw,
        role: validated.data.position === "MANAGER" ? "MANAGER" : "RECEPTION",
      },
    });

    await db.staff.create({
      data: {
        userId: user.id,
        position: validated.data.position,
        salary: validated.data.salary || null,
        shift: validated.data.shift,
      },
    });

    return { success: true, message: "Staff member added" };
  } catch {
    return { success: false, message: "Failed to add staff. Email may already exist." };
  }
}

export async function updateStaffStatus(staffId: string, status: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.staff.update({
      where: { id: staffId },
      data: { status: status as "ACTIVE" | "ON_LEAVE" | "INACTIVE" },
    });
    return { success: true, message: "Staff status updated" };
  } catch {
    return { success: false, message: "Failed to update status" };
  }
}
