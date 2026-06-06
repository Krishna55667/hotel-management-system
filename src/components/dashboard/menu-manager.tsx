"use client";

import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search, Trash2, Edit, Loader2 } from "lucide-react";
import { 
  createMenuItem, toggleMenuItemAvailability, 
  deleteMenuItem 
} from "@/actions/menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MenuManagerProps {
  categories: any[];
  items: any[];
}

export default function MenuManager({ categories, items: initialItems }: MenuManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // New item form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");

  const handleToggleAvailability = async (itemId: string) => {
    const result = await toggleMenuItemAvailability(itemId);
    if (result.success) {
      toast.success(result.message);
      setItems(prev => 
        prev.map(item => item.id === itemId ? { ...item, available: !item.available } : item)
      );
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    
    const result = await deleteMenuItem(itemId);
    if (result.success) {
      toast.success(result.message);
      setItems(prev => prev.filter(item => item.id !== itemId));
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryId", categoryId);

    const result = await createMenuItem(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Menu item created!");
      setIsOpen(false);
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      router.refresh();
      // Simple reload to fetch fresh items
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/40">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items or categories..."
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
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Create a new food or beverage item for the restaurant menu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateItem} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Chicken Choila"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="itemPrice">Price (Rs.) *</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="350"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="itemCat">Category *</Label>
                  <select
                    id="itemCat"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="itemDesc">Description</Label>
                <Input
                  id="itemDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Spicy barbecued chicken served with flakes"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/95 text-white">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Menu Item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Table */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dish Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-foreground">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">
                      {item.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">Rs. {item.price}</TableCell>
                  <TableCell>
                    <Badge className={item.available ? "bg-emerald-600" : "bg-muted text-muted-foreground"}>
                      {item.available ? "Available" : "Sold Out"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => handleToggleAvailability(item.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  No menu items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
