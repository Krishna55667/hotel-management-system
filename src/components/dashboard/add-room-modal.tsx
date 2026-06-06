"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createRoom } from "@/actions/rooms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddRoomModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createRoom(formData);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to add room");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-9 rounded-xl" />}>
        <Plus className="h-4 w-4" />
        Add Room
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Enter the details for the new room. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Room Number *</Label>
              <Input id="number" name="number" type="number" required placeholder="101" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input id="floor" name="floor" type="number" defaultValue="1" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Room Name *</Label>
            <Input id="name" name="name" required placeholder="Deluxe Queen Room" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Room Type *</Label>
              <select id="type" name="type" className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required>
                <option value="STANDARD">Standard</option>
                <option value="DELUXE">Deluxe</option>
                <option value="SUITE">Suite</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input id="capacity" name="capacity" type="number" required min="1" max="10" defaultValue="2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerNight">Base Price/Night (Rs.) *</Label>
              <Input id="pricePerNight" name="pricePerNight" type="number" required min="0" placeholder="2500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dayPrice">Day Price (Rs.)</Label>
              <Input id="dayPrice" name="dayPrice" type="number" min="0" placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nightPrice">Night Price (Rs.)</Label>
              <Input id="nightPrice" name="nightPrice" type="number" min="0" placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wholeDayPrice">Whole Day (Rs.)</Label>
              <Input id="wholeDayPrice" name="wholeDayPrice" type="number" min="0" placeholder="Optional" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="Short description..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
