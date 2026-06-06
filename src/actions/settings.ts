"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await db.setting.findMany();
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

export async function saveSettings(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const keys = Array.from(formData.keys());
    for (const key of keys) {
      if (key.startsWith("$ACTION")) continue;
      
      const value = formData.get(key) as string;
      await db.setting.upsert({
        where: { key },
        update: { value, updatedById: session.user.id },
        create: { key, value, updatedById: session.user.id },
      });
    }

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Settings saved successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to save settings" };
  }
}
