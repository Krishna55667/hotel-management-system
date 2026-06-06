import type {
  User,
  Room,
  Booking,
  Payment,
  Receipt,
  MenuItem,
  MenuCategory,
  Staff,
  Inventory,
  Notification,
} from "@prisma/client";

// Extended types with relations
export type BookingWithRelations = Booking & {
  user: Pick<User, "id" | "name" | "email" | "phone">;
  room: Pick<Room, "id" | "number" | "name" | "type" | "pricePerNight">;
  payment?: Payment | null;
  receipt?: Receipt | null;
};

export type PaymentWithRelations = Payment & {
  booking: Booking & {
    user: Pick<User, "id" | "name" | "email">;
    room: Pick<Room, "id" | "number" | "name">;
  };
  user: Pick<User, "id" | "name" | "email">;
  verifiedBy?: Pick<User, "id" | "name"> | null;
};

export type StaffWithUser = Staff & {
  user: Pick<User, "id" | "name" | "email" | "phone" | "image">;
};

export type MenuItemWithCategory = MenuItem & {
  category: MenuCategory;
};

export type RoomWithBookings = Room & {
  bookings: Booking[];
};

// Dashboard stats
export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  monthlyRevenue: number;
  pendingBookings: number;
  pendingPayments: number;
}

// Chart data
export interface RevenueData {
  month: string;
  revenue: number;
}

export interface BookingTrendData {
  month: string;
  bookings: number;
}

export interface OccupancyData {
  name: string;
  value: number;
}

// Action results
export interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: Record<string, string[]>;
}

// Search params
export interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  sort?: string;
  order?: string;
}
