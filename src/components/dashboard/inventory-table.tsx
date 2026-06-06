"use client";

import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, Search, AlertTriangle, 
  PackageCheck, Edit, ArrowUpDown, Loader2 
} from "lucide-react";
import { createInventoryItem, updateInventoryQuantity } from "@/actions/inventory";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InventoryTableProps {
  items: any[];
}

export default function InventoryTable({ items: initialItems }: InventoryTableProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // New item form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("FOOD_INGREDIENTS");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [minStock, setMinStock] = useState("10");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [supplier, setSupplier] = useState("");

  const handleUpdateStock = async (id: string, currentQty: number, change: number) => {
    const newQty = Math.max(0, currentQty + change);
    const result = await updateInventoryQuantity(id, newQty);
    if (result.success) {
      toast.success(result.message);
      setItems(prev => 
        prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
      );
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity || !unit || !minStock) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("unit", unit);
    formData.append("minStock", minStock);
    formData.append("costPerUnit", costPerUnit);
    formData.append("supplier", supplier);

    const result = await createInventoryItem(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Inventory item added!");
      setIsOpen(false);
      // Reset form
      setName("");
      setQuantity("");
      setSupplier("");
      router.refresh();
      // Simple reload to fetch fresh items
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/40">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory supplies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-border/60"
          />
        </div>

        {/* Dialog for adding item */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button className="bg-primary hover:bg-primary/95 text-white gap-2">
              <PlusCircle className="h-4.5 w-4.5" />
              Add Supply Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Inventory Stock</DialogTitle>
              <DialogDescription>
                Track a new raw ingredient, cleaning agent, or room amenity item.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateItem} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="invName">Item Name *</Label>
                <Input
                  id="invName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Dishwashing Soap"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="invQty">Initial Quantity *</Label>
                  <Input
                    id="invQty"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="invUnit">Unit of Measure *</Label>
                  <Input
                    id="invUnit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="pcs, kg, liters"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="invCat">Category *</Label>
                  <select
                    id="invCat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
                    required
                  >
                    <option value="FOOD_INGREDIENTS">Ingredients</option>
                    <option value="CLEANING_SUPPLIES">Cleaning</option>
                    <option value="KITCHEN_INVENTORY">Kitchen</option>
                    <option value="ROOM_SUPPLIES">Room Supplies</option>
                  </select>
                </div>
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="invMin">Min Alert *</Label>
                  <Input
                    id="invMin"
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="invCost">Cost / Unit</Label>
                  <Input
                    id="invCost"
                    type="number"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(e.target.value)}
                    placeholder="120"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invSupplier">Supplier Name</Label>
                <Input
                  id="invSupplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Agro Suppliers Ltd"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/95 text-white">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Inventory Item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock Alerts list if any item is low */}
      {items.some(item => item.quantity <= item.minStock) && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-700">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
          <div>
            <p className="font-bold">Low Stock Warning</p>
            <p className="mt-0.5">Some essential kitchen or cleaning items are below their minimum threshold and require restocking.</p>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supply Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Adjust Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isLow = item.quantity <= item.minStock;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-foreground">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[10px] uppercase">
                        {item.category.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      {item.quantity} {item.unit}
                      <span className="text-[10px] text-muted-foreground block">Min: {item.minStock} {item.unit}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.supplier || "Local Purchase"}</TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge className="bg-red-500 text-white gap-1 py-0.5">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-600 text-white gap-1 py-0.5">
                          <PackageCheck className="h-3 w-3" />
                          Good Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStock(item.id, item.quantity, -5)}
                          className="h-7 px-2 border-border text-muted-foreground hover:text-foreground"
                        >
                          -5
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStock(item.id, item.quantity, 5)}
                          className="h-7 px-2 border-border text-muted-foreground hover:text-foreground"
                        >
                          +5
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
