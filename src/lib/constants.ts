export const APP_NAME = "Sauraha Fish Village & Agro Pvt. Ltd";
export const APP_SHORT_NAME = "Sauraha Fish Village";
export const APP_DESCRIPTION = "Premium resort experience nestled in the natural beauty of Butwal, Sauraha. Enjoy clean environment, peaceful atmosphere, delicious food, and agro tourism.";

export const CONTACT = {
  email: "saurahafishvillage@gmail.com",
  phone: "9857030654",
  address: "Rupandehi, Butwal-18, Sauraha, Nepal",
  mapUrl: "https://maps.google.com/?q=27.7172,83.4622",
} as const;

export const RESORT_FEATURES = [
  { icon: "Leaf", title: "Clean Environment", description: "Pristine surroundings maintained with eco-friendly practices" },
  { icon: "Mountain", title: "Peaceful Atmosphere", description: "Escape the noise and find tranquility in nature" },
  { icon: "Volume2", title: "Quiet Location", description: "Serene setting away from urban chaos" },
  { icon: "TreePine", title: "Natural Greenery", description: "Lush landscapes and gardens to rejuvenate your soul" },
  { icon: "UtensilsCrossed", title: "Delicious Food", description: "Authentic Nepali cuisine with fresh local ingredients" },
  { icon: "Heart", title: "Friendly Staff", description: "Warm hospitality that makes you feel at home" },
  { icon: "Users", title: "Family-Friendly", description: "Perfect destination for memorable family holidays" },
  { icon: "Sprout", title: "Agro Tourism", description: "Experience rural farming and organic agriculture" },
] as const;

export const ROOM_STATUSES = [
  { value: "AVAILABLE", label: "Available", color: "bg-emerald-500" },
  { value: "BOOKED", label: "Booked", color: "bg-blue-500" },
  { value: "OCCUPIED", label: "Occupied", color: "bg-amber-500" },
  { value: "MAINTENANCE", label: "Maintenance", color: "bg-red-500" },
  { value: "CLEANING", label: "Cleaning", color: "bg-purple-500" },
  { value: "RESERVED", label: "Reserved", color: "bg-cyan-500" },
] as const;

export const BOOKING_STATUSES = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-500" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-500" },
  { value: "CHECKED_IN", label: "Checked In", color: "bg-emerald-500" },
  { value: "CHECKED_OUT", label: "Checked Out", color: "bg-purple-500" },
  { value: "COMPLETED", label: "Completed", color: "bg-gray-500" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-500" },
] as const;

export const PAYMENT_METHODS = [
  { value: "QR_PAYMENT", label: "QR Payment" },
  { value: "FONEPAY", label: "FonePay" },
  { value: "ESEWA", label: "eSewa" },
  { value: "KHALTI", label: "Khalti" },
  { value: "CASH", label: "Cash" },
] as const;

export const STAFF_POSITIONS = [
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "HOUSEKEEPING", label: "Housekeeping" },
  { value: "KITCHEN_STAFF", label: "Kitchen Staff" },
  { value: "MANAGER", label: "Manager" },
  { value: "SECURITY", label: "Security" },
] as const;

export const MENU_CATEGORIES = [
  "Hot Beverages",
  "Fish Items",
  "Chicken Items",
  "Mutton Items",
  "Local Kukhura",
  "Duck",
  "Momo",
  "Chowmein",
  "Salad",
  "Soup",
  "Thukpa",
  "Curry",
  "Rice",
  "Roti",
  "Khana Set",
  "Vegetarian Items",
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/menu", label: "Menu" },
  { href: "/booking", label: "Book Now" },
  { href: "/contact", label: "Contact" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/bookings", label: "Bookings", icon: "CalendarCheck" },
  { href: "/dashboard/rooms", label: "Rooms", icon: "BedDouble" },
  { href: "/dashboard/guests", label: "Guests", icon: "Users" },
  { href: "/dashboard/menu", label: "Menu", icon: "UtensilsCrossed" },
  { href: "/dashboard/staff", label: "Staff", icon: "UserCog" },
  { href: "/dashboard/inventory", label: "Inventory", icon: "Package" },
  { href: "/dashboard/payments", label: "Payments", icon: "CreditCard" },
  { href: "/dashboard/reports", label: "Reports", icon: "BarChart3" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;
