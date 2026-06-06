import { getInventory } from "@/actions/inventory";
import InventoryTable from "@/components/dashboard/inventory-table";

export const revalidate = 0;

export default async function InventoryAdminPage() {
  const items = await getInventory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Inventory & Stock Tracking</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor resort asset logs, trace raw kitchen ingredients, trigger alert thresholds, and log new purchases.
        </p>
      </div>

      {/* Inventory Table Component */}
      <InventoryTable items={items} />
    </div>
  );
}
