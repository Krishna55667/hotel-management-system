import { getAllMenuCategories, getMenuItems } from "@/actions/menu";
import MenuManager from "@/components/dashboard/menu-manager";

export const revalidate = 0;

export default async function MenuAdminPage() {
  const categories = await getAllMenuCategories();
  const items = await getMenuItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Restaurant Menu Manager</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Add new dishes, update pricing instantly, and toggle food item availability on the guest portal.
        </p>
      </div>

      {/* Menu manager dashboard component */}
      <MenuManager categories={categories} items={items} />
    </div>
  );
}
