import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean up existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.room.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@saurahafishvillage.com",
      password: adminPassword,
      phone: "9857030654",
      role: "ADMIN",
      address: "Rupandehi, Butwal-18, Sauraha, Nepal",
    },
  });
  console.log("👤 Admin user created:", admin.email);

  // Create Reception Staff
  const receptionPassword = await bcrypt.hash("staff123", 12);
  const receptionUser = await prisma.user.create({
    data: {
      name: "Ram Prasad Sharma",
      email: "reception@saurahafishvillage.com",
      password: receptionPassword,
      phone: "9812345678",
      role: "RECEPTION",
    },
  });

  await prisma.staff.create({
    data: {
      userId: receptionUser.id,
      position: "RECEPTIONIST",
      salary: 25000,
      shift: "MORNING",
      status: "ACTIVE",
    },
  });

  // Create Manager
  const managerPassword = await bcrypt.hash("manager123", 12);
  const managerUser = await prisma.user.create({
    data: {
      name: "Sita Devi Thapa",
      email: "manager@saurahafishvillage.com",
      password: managerPassword,
      phone: "9823456789",
      role: "MANAGER",
    },
  });

  await prisma.staff.create({
    data: {
      userId: managerUser.id,
      position: "MANAGER",
      salary: 45000,
      shift: "MORNING",
      status: "ACTIVE",
    },
  });

  // Create Customer
  const customerPassword = await bcrypt.hash("customer123", 12);
  await prisma.user.create({
    data: {
      name: "Hari Bahadur KC",
      email: "customer@example.com",
      password: customerPassword,
      phone: "9834567890",
      role: "CUSTOMER",
      address: "Kathmandu, Nepal",
    },
  });

  // Additional Staff
  const kitchenPassword = await bcrypt.hash("staff123", 12);
  const kitchenUser = await prisma.user.create({
    data: {
      name: "Bikash Gurung",
      email: "kitchen@saurahafishvillage.com",
      password: kitchenPassword,
      phone: "9845678901",
      role: "RECEPTION",
    },
  });

  await prisma.staff.create({
    data: {
      userId: kitchenUser.id,
      position: "KITCHEN_STAFF",
      salary: 20000,
      shift: "MORNING",
      status: "ACTIVE",
    },
  });

  const securityUser = await prisma.user.create({
    data: {
      name: "Deepak Tamang",
      email: "security@saurahafishvillage.com",
      password: kitchenPassword,
      phone: "9856789012",
      role: "RECEPTION",
    },
  });

  await prisma.staff.create({
    data: {
      userId: securityUser.id,
      position: "SECURITY",
      salary: 18000,
      shift: "NIGHT",
      status: "ACTIVE",
    },
  });

  console.log("👥 Staff members created");

  // Create Rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        number: 101,
        name: "Garden View Standard",
        type: "STANDARD",
        capacity: 2,
        pricePerNight: 2500,
        status: "AVAILABLE",
        description: "A cozy standard room with beautiful garden views. Features comfortable bedding, attached bathroom, and natural ventilation. Perfect for couples or solo travelers seeking peace and tranquility.",
        amenities: ["WiFi", "Hot Water", "Garden View", "Fan", "Attached Bathroom", "Towels", "Room Service"],
        images: [],
        floor: 1,
      },
    }),
    prisma.room.create({
      data: {
        number: 102,
        name: "River Side Deluxe",
        type: "DELUXE",
        capacity: 3,
        pricePerNight: 4500,
        status: "AVAILABLE",
        description: "Spacious deluxe room overlooking the serene riverside. Equipped with premium amenities, a sitting area, and large windows that bring nature indoors. Ideal for families and those wanting extra comfort.",
        amenities: ["WiFi", "Hot Water", "River View", "AC", "TV", "Mini Fridge", "Attached Bathroom", "Balcony", "Room Service"],
        images: [],
        floor: 1,
      },
    }),
    prisma.room.create({
      data: {
        number: 201,
        name: "Premium Nature Suite",
        type: "SUITE",
        capacity: 4,
        pricePerNight: 7500,
        status: "AVAILABLE",
        description: "Our finest suite offering panoramic views of the lush greenery and river. Features a separate living area, premium king-size bed, luxury bathroom, and private balcony. The ultimate retreat for a premium resort experience.",
        amenities: ["WiFi", "Hot Water", "Panoramic View", "AC", "Smart TV", "Mini Bar", "Luxury Bathroom", "Private Balcony", "Room Service", "King Bed", "Sitting Area", "Wardrobe"],
        images: [],
        floor: 2,
      },
    }),
  ]);

  console.log("🏨 Rooms created:", rooms.length);

  // Create Menu Categories and Items
  const categories = [
    {
      name: "Hot Beverages",
      slug: "hot-beverages",
      sortOrder: 1,
      items: [
        { name: "Nepali Milk Tea", price: 50, description: "Traditional Nepali chiya with spices" },
        { name: "Black Tea", price: 40, description: "Simple and refreshing black tea" },
        { name: "Green Tea", price: 60, description: "Healthy organic green tea" },
        { name: "Hot Coffee", price: 100, description: "Freshly brewed coffee" },
        { name: "Hot Lemon", price: 60, description: "Warm lemon water with honey" },
      ],
    },
    {
      name: "Fish Items",
      slug: "fish-items",
      sortOrder: 2,
      items: [
        { name: "Fried Fish (Rohu)", price: 450, description: "Crispy fried Rohu fish with spices" },
        { name: "Fish Curry", price: 400, description: "Traditional Nepali fish curry" },
        { name: "Grilled Fish", price: 500, description: "Herb-marinated grilled fish" },
        { name: "Fish Fry (Tilapia)", price: 350, description: "Deep fried Tilapia with masala" },
        { name: "Fish Sekuwa", price: 500, description: "Smoky barbecued fish chunks" },
      ],
    },
    {
      name: "Chicken Items",
      slug: "chicken-items",
      sortOrder: 3,
      items: [
        { name: "Chicken Curry", price: 350, description: "Homestyle chicken curry" },
        { name: "Chicken Fry", price: 300, description: "Crispy fried chicken pieces" },
        { name: "Chicken Sekuwa", price: 400, description: "Grilled marinated chicken" },
        { name: "Butter Chicken", price: 450, description: "Creamy butter chicken" },
        { name: "Chicken Chilli", price: 350, description: "Indo-Chinese style chicken chilli" },
      ],
    },
    {
      name: "Mutton Items",
      slug: "mutton-items",
      sortOrder: 4,
      items: [
        { name: "Mutton Curry", price: 500, description: "Slow-cooked mutton curry" },
        { name: "Mutton Sekuwa", price: 550, description: "Smoky grilled mutton" },
        { name: "Mutton Fry", price: 500, description: "Deep fried spiced mutton" },
      ],
    },
    {
      name: "Local Kukhura",
      slug: "local-kukhura",
      sortOrder: 5,
      items: [
        { name: "Local Chicken Curry", price: 600, description: "Free-range local chicken curry" },
        { name: "Local Chicken Fry", price: 550, description: "Fried local chicken with herbs" },
        { name: "Local Chicken Sekuwa", price: 650, description: "Grilled local chicken" },
      ],
    },
    {
      name: "Duck",
      slug: "duck",
      sortOrder: 6,
      items: [
        { name: "Duck Curry", price: 550, description: "Traditional duck curry" },
        { name: "Roasted Duck", price: 650, description: "Slow roasted duck with spices" },
      ],
    },
    {
      name: "Momo",
      slug: "momo",
      sortOrder: 7,
      items: [
        { name: "Chicken Momo (Steam)", price: 200, description: "Steamed chicken dumplings" },
        { name: "Chicken Momo (Fried)", price: 220, description: "Crispy fried chicken momo" },
        { name: "Buff Momo", price: 200, description: "Buffalo meat steamed momo" },
        { name: "Veg Momo", price: 150, description: "Vegetable steamed momo" },
        { name: "Jhol Momo", price: 250, description: "Momo in spicy soup" },
      ],
    },
    {
      name: "Chowmein",
      slug: "chowmein",
      sortOrder: 8,
      items: [
        { name: "Veg Chowmein", price: 150, description: "Stir-fried noodles with vegetables" },
        { name: "Chicken Chowmein", price: 200, description: "Chicken stir-fried noodles" },
        { name: "Egg Chowmein", price: 180, description: "Egg fried noodles" },
        { name: "Mix Chowmein", price: 250, description: "Mixed meat and veg noodles" },
      ],
    },
    {
      name: "Salad",
      slug: "salad",
      sortOrder: 9,
      items: [
        { name: "Green Salad", price: 100, description: "Fresh garden vegetables" },
        { name: "Mixed Salad", price: 120, description: "Mixed vegetables and fruits" },
      ],
    },
    {
      name: "Soup",
      slug: "soup",
      sortOrder: 10,
      items: [
        { name: "Chicken Soup", price: 150, description: "Clear chicken broth" },
        { name: "Tomato Soup", price: 100, description: "Creamy tomato soup" },
        { name: "Mushroom Soup", price: 130, description: "Rich mushroom soup" },
        { name: "Mixed Veg Soup", price: 120, description: "Healthy vegetable soup" },
      ],
    },
    {
      name: "Thukpa",
      slug: "thukpa",
      sortOrder: 11,
      items: [
        { name: "Veg Thukpa", price: 150, description: "Tibetan noodle soup with veggies" },
        { name: "Chicken Thukpa", price: 200, description: "Chicken noodle soup" },
      ],
    },
    {
      name: "Curry",
      slug: "curry",
      sortOrder: 12,
      items: [
        { name: "Paneer Curry", price: 250, description: "Cottage cheese curry" },
        { name: "Mixed Veg Curry", price: 200, description: "Seasonal vegetable curry" },
        { name: "Mushroom Curry", price: 220, description: "Fresh mushroom curry" },
        { name: "Egg Curry", price: 180, description: "Boiled egg in spiced gravy" },
      ],
    },
    {
      name: "Rice",
      slug: "rice",
      sortOrder: 13,
      items: [
        { name: "Plain Rice", price: 80, description: "Steamed white rice" },
        { name: "Jeera Rice", price: 120, description: "Cumin flavored rice" },
        { name: "Fried Rice (Veg)", price: 180, description: "Vegetable fried rice" },
        { name: "Chicken Fried Rice", price: 220, description: "Chicken fried rice" },
        { name: "Egg Fried Rice", price: 200, description: "Egg fried rice" },
      ],
    },
    {
      name: "Roti",
      slug: "roti",
      sortOrder: 14,
      items: [
        { name: "Plain Roti", price: 30, description: "Tandoor cooked flatbread" },
        { name: "Butter Naan", price: 60, description: "Butter naan bread" },
        { name: "Garlic Naan", price: 70, description: "Garlic flavored naan" },
        { name: "Paratha", price: 50, description: "Layered flatbread" },
      ],
    },
    {
      name: "Khana Set",
      slug: "khana-set",
      sortOrder: 15,
      items: [
        { name: "Veg Khana Set", price: 250, description: "Dal, rice, curry, salad, pickle" },
        { name: "Chicken Khana Set", price: 350, description: "Dal, rice, chicken curry, salad, pickle" },
        { name: "Fish Khana Set", price: 400, description: "Dal, rice, fish curry, salad, pickle" },
        { name: "Special Khana Set", price: 500, description: "Premium thali with multiple items" },
      ],
    },
    {
      name: "Vegetarian Items",
      slug: "vegetarian-items",
      sortOrder: 16,
      items: [
        { name: "Aloo Gobi", price: 180, description: "Cauliflower and potato curry" },
        { name: "Dal Fry", price: 150, description: "Tempered lentils" },
        { name: "Paneer Tikka", price: 300, description: "Grilled cottage cheese" },
        { name: "Veg Pakoda", price: 120, description: "Mixed vegetable fritters" },
        { name: "Aloo Paratha", price: 100, description: "Stuffed potato paratha" },
      ],
    },
  ];

  for (const cat of categories) {
    const category = await prisma.menuCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      },
    });

    for (const item of cat.items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          description: item.description,
          categoryId: category.id,
          available: true,
        },
      });
    }
  }

  console.log("🍽️ Menu categories and items created");

  // Create Inventory Items
  const inventoryItems = [
    { name: "Rice (Basmati)", category: "FOOD_INGREDIENTS" as const, quantity: 50, unit: "kg", minStock: 10, supplier: "Nepal Agro Traders" },
    { name: "Cooking Oil", category: "FOOD_INGREDIENTS" as const, quantity: 20, unit: "liters", minStock: 5, supplier: "Nepal Agro Traders" },
    { name: "Chicken", category: "FOOD_INGREDIENTS" as const, quantity: 15, unit: "kg", minStock: 5, supplier: "Local Market" },
    { name: "Fish (Rohu)", category: "FOOD_INGREDIENTS" as const, quantity: 20, unit: "kg", minStock: 5, supplier: "Own Farm" },
    { name: "Vegetables (Mixed)", category: "FOOD_INGREDIENTS" as const, quantity: 30, unit: "kg", minStock: 10, supplier: "Local Farm" },
    { name: "Flour (Maida)", category: "FOOD_INGREDIENTS" as const, quantity: 25, unit: "kg", minStock: 5, supplier: "Nepal Agro Traders" },
    { name: "Spices Set", category: "FOOD_INGREDIENTS" as const, quantity: 10, unit: "kg", minStock: 3, supplier: "Spice Market" },
    { name: "Floor Cleaner", category: "CLEANING_SUPPLIES" as const, quantity: 10, unit: "liters", minStock: 3, supplier: "Wholesale Market" },
    { name: "Toilet Cleaner", category: "CLEANING_SUPPLIES" as const, quantity: 8, unit: "liters", minStock: 3, supplier: "Wholesale Market" },
    { name: "Detergent", category: "CLEANING_SUPPLIES" as const, quantity: 15, unit: "kg", minStock: 5, supplier: "Wholesale Market" },
    { name: "Cooking Pans", category: "KITCHEN_INVENTORY" as const, quantity: 6, unit: "pcs", minStock: 2, supplier: "Kitchen Store" },
    { name: "Plates (Set)", category: "KITCHEN_INVENTORY" as const, quantity: 30, unit: "pcs", minStock: 10, supplier: "Kitchen Store" },
    { name: "Glasses", category: "KITCHEN_INVENTORY" as const, quantity: 24, unit: "pcs", minStock: 8, supplier: "Kitchen Store" },
    { name: "Bed Sheets", category: "ROOM_SUPPLIES" as const, quantity: 12, unit: "pcs", minStock: 4, supplier: "Textile Shop" },
    { name: "Towels", category: "ROOM_SUPPLIES" as const, quantity: 18, unit: "pcs", minStock: 6, supplier: "Textile Shop" },
    { name: "Pillows", category: "ROOM_SUPPLIES" as const, quantity: 10, unit: "pcs", minStock: 4, supplier: "Textile Shop" },
    { name: "Soap", category: "ROOM_SUPPLIES" as const, quantity: 30, unit: "pcs", minStock: 10, supplier: "Wholesale Market" },
  ];

  for (const item of inventoryItems) {
    await prisma.inventory.create({ data: item });
  }

  console.log("📦 Inventory items created");
  console.log("");
  console.log("✅ Seed completed successfully!");
  console.log("");
  console.log("📋 Login Credentials:");
  console.log("   Admin:     admin@saurahafishvillage.com / admin123");
  console.log("   Manager:   manager@saurahafishvillage.com / manager123");
  console.log("   Reception: reception@saurahafishvillage.com / staff123");
  console.log("   Customer:  customer@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
