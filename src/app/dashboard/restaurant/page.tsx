import { getTables, getTableOrders } from "@/actions/restaurant";
import { getMenuItems } from "@/actions/menu";
import TableGrid from "@/components/dashboard/restaurant/table-grid";

export const revalidate = 0;

export default async function RestaurantDashboard() {
  const tables = await getTables();
  const menuItems = await getMenuItems();
  const orders = await getTableOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Dining & Restaurant Management</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage tables, take orders, and override prices dynamically.
        </p>
      </div>

      <TableGrid initialTables={tables} menuItems={menuItems} initialOrders={orders} />
    </div>
  );
}
