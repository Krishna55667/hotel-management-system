"use server";

import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Invalid credentials", errors: validated.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    });
    return { success: true, message: "Logged in successfully" };
  } catch (error: any) {
    return { success: false, message: `DEBUG: ${error?.message || "Unknown error"} | Type: ${error?.name}` };
  }
}

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  };

  const validated = registerSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Invalid data", errors: validated.error.flatten().fieldErrors };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email: validated.data.email },
    });

    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 12);

    await db.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
        phone: validated.data.phone || null,
        address: validated.data.address || null,
        role: "CUSTOMER",
      },
    });

    return { success: true, message: "Account created successfully" };
  } catch {
    return { success: false, message: "Failed to create account" };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
}
