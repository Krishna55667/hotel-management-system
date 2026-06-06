"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UtensilsCrossed, Plus, Users, Receipt, Trash2, Printer } from "lucide-react";
import { createTable, updateTableStatus, placeOrder, completeOrder, getActiveOrder } from "@/actions/restaurant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";

export default function TableGrid({ initialTables, menuItems, initialOrders = [] }: { initialTables: any[], menuItems: any[], initialOrders?: any[] }) {
  const router = useRouter();
  const [tables, setTables] = useState(initialTables);
  const [orders, setOrders] = useState(initialOrders);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    setTables(initialTables);
  }, [initialTables]);

  // Edit Table Name State
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [tableNameInput, setTableNameInput] = useState<string>("");

  // New Order State
  const [orderItems, setOrderItems] = useState<Array<{menuItemId: string, quantity: number, priceOverride: number, name: string}>>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priceOverride, setPriceOverride] = useState("");
  const [customerName, setCustomerName] = useState("");

  const statusColors = {
    AVAILABLE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    OCCUPIED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    RESERVED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  } as any;

  const handleSaveTableName = async (tableId: string) => {
    if (!tableNameInput.trim()) {
      toast.error("Table name cannot be empty");
      return;
    }
    const { updateTableName } = await import("@/actions/restaurant");
    const result = await updateTableName(tableId, tableNameInput.trim());
    if (result.success) {
      toast.success(result.message);
      setTables(prev => prev.map(t => t.id === tableId ? { ...t, name: tableNameInput.trim() } : t));
      setEditingTableId(null);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleCreateTable = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createTable(formData);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
      // small hack to reset form
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.message);
    }
  };

  const openTableOrder = async (table: any) => {
    // Don't open modal if clicking on edit table name controls
    if (editingTableId === table.id) return;
    
    setSelectedTable(table);
    setOrderItems([]);
    setSelectedMenuItem("");
    setQuantity(1);
    setPriceOverride("");
    setCustomerName("");
    
    // fetch active order if occupied
    if (table.status === "OCCUPIED") {
      const order = await getActiveOrder(table.id);
      setActiveOrder(order);
      if (order?.customerName) setCustomerName(order.customerName);
    } else {
      setActiveOrder(null);
    }
    
    setIsOrderModalOpen(true);
  };

  const handleAddItem = () => {
    if (!selectedMenuItem) return;
    const item = menuItems.find(m => m.id === selectedMenuItem);
    if (!item) return;

    const price = priceOverride ? Number(priceOverride) : item.price;
    setOrderItems([...orderItems, {
      menuItemId: item.id,
      name: item.name,
      quantity,
      priceOverride: price
    }]);

    // reset
    setSelectedMenuItem("");
    setQuantity(1);
    setPriceOverride("");
  };

  const handlePlaceOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Add items first");
      return;
    }
    const result = await placeOrder(selectedTable.id, orderItems, customerName);
    if (result.success) {
      toast.success(result.message);
      setIsOrderModalOpen(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleCompleteOrder = async () => {
    if (!activeOrder) return;
    const orderId = activeOrder.id; // capture ID before active order is nullified
    const result = await completeOrder(activeOrder.id, selectedTable.id);
    if (result.success) {
      toast.success("Order marked as completed.");
      setIsOrderModalOpen(false);
      router.refresh();
      // Auto open print dialog
      window.open(`/api/table-receipts/${orderId}`, "_blank");
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this table booking?")) {
      const { deleteTableOrder } = await import("@/actions/restaurant");
      const res = await deleteTableOrder(orderId);
      if (res.success) {
        toast.success(res.message);
        setOrders(prev => prev.filter(o => o.id !== orderId));
        router.refresh();
      } else {
        toast.error(res.message);
      }
    }
  };

  const handlePrintOnly = () => {
    if (!activeOrder) return;
    window.open(`/api/table-receipts/${activeOrder.id}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Create Table Form */}
      <Card className="p-4 border-border/50 shadow-sm rounded-xl">
        <form onSubmit={handleCreateTable} className="flex gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold">Table Name</label>
            <Input name="name" placeholder="e.g. T-1" required className="w-40" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Capacity</label>
            <Input name="capacity" type="number" defaultValue="4" required className="w-24" />
          </div>
          <Button type="submit" className="gap-2">
            <Plus className="h-4 w-4" /> Add Table
          </Button>
        </form>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {initialTables.map(table => (
          <Card 
            key={table.id} 
            className="cursor-pointer hover:border-primary transition-colors border-border/50 rounded-2xl shadow-sm"
            onClick={() => openTableOrder(table)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                {editingTableId === table.id ? (
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <Input 
                      value={tableNameInput} 
                      onChange={e => setTableNameInput(e.target.value)}
                      className="w-24 h-8 text-sm font-bold text-primary"
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50" onClick={(e) => { e.stopPropagation(); handleSaveTableName(table.id); }}>
                      <Plus className="h-4 w-4" style={{transform: 'rotate(45deg)'}} /> {/* Assuming we don't have Check imported, but let's just use Save or complete */}
                      Save
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setEditingTableId(null); }}>
                      X
                    </Button>
                  </div>
                ) : (
                  <CardTitle className="font-heading font-bold text-lg text-primary flex items-center gap-2 group">
                    {table.name}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingTableId(table.id); setTableNameInput(table.name); }} 
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity"
                    >
                      <Plus className="h-3 w-3" style={{transform: 'rotate(45deg)'}} /> {/* using placeholder icon */}
                      Edit
                    </button>
                  </CardTitle>
                )}
                <Badge variant="outline" className={statusColors[table.status]}>{table.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Capacity: {table.capacity}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order for {selectedTable?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="px-1 pt-2">
            <label className="text-xs font-semibold">Customer Name (Optional)</label>
            <Input 
              placeholder="Enter customer name..." 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="max-w-sm mt-1"
            />
          </div>

          {activeOrder && (
            <div className="mb-4 p-4 border rounded-lg bg-muted/20 space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Receipt className="h-4 w-4"/> Current Bill</h3>
              <ul className="text-sm space-y-1">
                {activeOrder.items.map((it: any) => (
                  <li key={it.id} className="flex justify-between border-b pb-1">
                    <span>{it.quantity}x {it.menuItem.name}</span>
                    <span>Rs. {it.priceAtOrder * it.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold pt-2 border-t text-primary">
                <span>Total Amount:</span>
                <span>Rs. {activeOrder.totalAmount}</span>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-sm">Add New Items</h4>
            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5 space-y-1">
                <label className="text-xs">Select Item</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedMenuItem}
                  onChange={e => {
                    setSelectedMenuItem(e.target.value);
                    const item = menuItems.find(m => m.id === e.target.value);
                    if (item) setPriceOverride(item.price.toString());
                  }}
                >
                  <option value="">-- select --</option>
                  {menuItems.map(m => <option key={m.id} value={m.id}>{m.name} (Rs. {m.price})</option>)}
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs">Qty</label>
                <Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" className="h-9"/>
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-xs">Custom Price (Rs.)</label>
                <Input type="number" value={priceOverride} onChange={e => setPriceOverride(e.target.value)} placeholder="Override" className="h-9"/>
              </div>
              <div className="col-span-2">
                <Button onClick={handleAddItem} className="w-full h-9" size="sm">Add</Button>
              </div>
            </div>

            {orderItems.length > 0 && (
              <div className="mt-4 border rounded p-3 text-sm">
                <h4 className="font-semibold mb-2">New Items to Order</h4>
                {orderItems.map((it, idx) => (
                  <div key={idx} className="flex justify-between border-b pb-1 mb-1">
                    <span>{it.quantity}x {it.name}</span>
                    <span>Rs. {it.priceOverride * it.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
            {activeOrder && (
              <>
                <Button variant="outline" onClick={handlePrintOnly}>
                  Print Bill
                </Button>
                <Button variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" onClick={handleCompleteOrder}>
                  Complete Order & Free Table
                </Button>
              </>
            )}
            <Button onClick={handlePlaceOrder} disabled={orderItems.length === 0}>
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recent Table Bookings / Orders Section */}
      <div className="mt-8 space-y-4">
        <div>
          <h2 className="text-lg font-bold font-heading text-primary">Recent Table Orders & Reservations</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            View active/completed restaurant orders, print bills, or delete reservation records.
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Ref</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items Ordered</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      #{o.id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      {o.table.name}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {o.customerName || "Walk-in Guest"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {o.items && o.items.length > 0 ? (
                        o.items.map((it: any) => `${it.quantity}x ${it.menuItem.name}`).join(", ")
                      ) : (
                        "No items ordered yet"
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-primary text-sm">
                      Rs. {o.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        o.status === "PENDING" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                        o.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                        o.status === "SERVED" ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" :
                        o.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                        "bg-red-500/10 text-red-600 border-red-500/20"
                      }>
                        {o.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/5"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/api/table-receipts/${o.id}`, "_blank");
                          }}
                          title="Print Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOrder(o.id);
                          }}
                          title="Delete Booking Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                    No table reservations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
