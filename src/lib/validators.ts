import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const bookingSchema = z.object({
  roomId: z.string().min(1, "Please select a room"),
  checkIn: z.coerce.date().refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Check-in date must be today or later",
  }),
  checkOut: z.coerce.date(),
  guests: z.coerce.number().min(1, "At least 1 guest required").max(10, "Maximum 10 guests"),
  specialRequests: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

export const paymentSchema = z.object({
  bookingId: z.string().min(1),
  method: z.enum(["QR_PAYMENT", "FONEPAY", "ESEWA", "KHALTI", "CASH"]),
  transactionId: z.string().optional(),
  screenshotUrl: z.string().optional(),
});

export const roomSchema = z.object({
  number: z.coerce.number().min(1, "Room number required"),
  name: z.string().min(1, "Room name required"),
  type: z.enum(["STANDARD", "DELUXE", "SUITE"]),
  capacity: z.coerce.number().min(1).max(10),
  pricePerNight: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  floor: z.coerce.number().min(1).optional(),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category required"),
  available: z.boolean().optional(),
  image: z.string().optional(),
});

export const menuCategorySchema = z.object({
  name: z.string().min(1, "Category name required"),
  sortOrder: z.coerce.number().optional(),
  image: z.string().optional(),
});

export const staffSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  position: z.enum(["RECEPTIONIST", "HOUSEKEEPING", "KITCHEN_STAFF", "MANAGER", "SECURITY"]),
  salary: z.coerce.number().optional(),
  shift: z.enum(["MORNING", "AFTERNOON", "NIGHT"]),
});

export const inventorySchema = z.object({
  name: z.string().min(1, "Item name required"),
  category: z.enum(["FOOD_INGREDIENTS", "CLEANING_SUPPLIES", "KITCHEN_INVENTORY", "ROOM_SUPPLIES"]),
  quantity: z.coerce.number().min(0),
  unit: z.string().min(1),
  minStock: z.coerce.number().min(0),
  costPerUnit: z.coerce.number().optional(),
  supplier: z.string().optional(),
  supplierPhone: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type RoomInput = z.infer<typeof roomSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type MenuCategoryInput = z.infer<typeof menuCategorySchema>;
export type StaffInput = z.infer<typeof staffSchema>;
export type InventoryInput = z.infer<typeof inventorySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
