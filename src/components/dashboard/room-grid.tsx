"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  BedDouble, Wrench, RefreshCw, CheckCircle, 
  MoreVertical, CalendarRange, Edit2, Check, X as XIcon, Trash2
} from "lucide-react";
import { updateRoomStatus } from "@/actions/rooms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RoomGridProps {
  rooms: any[];
}

export default function RoomGrid({ rooms: initialRooms }: RoomGridProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState<string>("");
  const [dayPriceInput, setDayPriceInput] = useState<string>("");
  const [nightPriceInput, setNightPriceInput] = useState<string>("");
  const [wholeDayPriceInput, setWholeDayPriceInput] = useState<string>("");

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    const result = await updateRoomStatus(roomId, newStatus);
    if (result.success) {
      toast.success(result.message);
      setRooms(prev => 
        prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r)
      );
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleSavePrice = async (roomId: string) => {
    const newPrice = Number(priceInput);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error("Please enter a valid base price.");
      return;
    }

    const { updateRoomPricing } = await import("@/actions/rooms");
    const result = await updateRoomPricing(roomId, {
      pricePerNight: newPrice,
      dayPrice: dayPriceInput ? Number(dayPriceInput) : undefined,
      nightPrice: nightPriceInput ? Number(nightPriceInput) : undefined,
      wholeDayPrice: wholeDayPriceInput ? Number(wholeDayPriceInput) : undefined,
    });
    
    if (result.success) {
      toast.success(result.message);
      setRooms(prev => 
        prev.map(r => r.id === roomId ? { 
          ...r, 
          pricePerNight: newPrice,
          dayPrice: dayPriceInput ? Number(dayPriceInput) : null,
          nightPrice: nightPriceInput ? Number(nightPriceInput) : null,
          wholeDayPrice: wholeDayPriceInput ? Number(wholeDayPriceInput) : null,
        } : r)
      );
      setEditingPriceId(null);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState<string>("");

  const handleSaveName = async (roomId: string) => {
    if (!nameInput.trim()) {
      toast.error("Please enter a valid name.");
      return;
    }

    const { updateRoomName } = await import("@/actions/rooms");
    const result = await updateRoomName(roomId, nameInput.trim());
    if (result.success) {
      toast.success(result.message);
      setRooms(prev => 
        prev.map(r => r.id === roomId ? { ...r, name: nameInput.trim() } : r)
      );
      setEditingNameId(null);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const statusColors = {
    AVAILABLE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    BOOKED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    OCCUPIED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    MAINTENANCE: "bg-red-500/10 text-red-600 border-red-500/20",
    CLEANING: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    RESERVED: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  } as any;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <Card key={room.id} className="border-border/50 bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 flex flex-row items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Floor {room.floor} • Room {room.number}
              </span>
              {editingNameId === room.id ? (
                <div className="flex items-center gap-1 mt-1">
                  <Input 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-32 h-8 text-sm font-bold font-heading text-primary"
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:bg-emerald-50" onClick={() => handleSaveName(room.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setEditingNameId(null)}>
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <CardTitle className="font-heading font-bold text-lg text-primary">
                  {room.name}
                </CardTitle>
              )}
            </div>
            
            {/* Status Change Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => { setEditingPriceId(room.id); setPriceInput(room.pricePerNight.toString()); }} className="gap-2">
                  <Edit2 className="h-4 w-4 text-primary" />
                  Edit Price
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setEditingNameId(room.id); setNameInput(room.name); }} className="gap-2">
                  <Edit2 className="h-4 w-4 text-primary" />
                  Edit Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(room.id, "AVAILABLE")} className="gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(room.id, "CLEANING")} className="gap-2">
                  <RefreshCw className="h-4 w-4 text-purple-500" />
                  Cleaning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(room.id, "MAINTENANCE")} className="gap-2">
                  <Wrench className="h-4 w-4 text-red-500" />
                  Maintenance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  if (confirm("Are you sure you want to delete this room? This will also delete all associated bookings, payments, and receipts.")) {
                    const { deleteRoom } = await import("@/actions/rooms");
                    const res = await deleteRoom(room.id);
                    if (res.success) {
                      toast.success(res.message);
                      setRooms(prev => prev.filter(r => r.id !== room.id));
                      router.refresh();
                    } else {
                      toast.error(res.message);
                    }
                  }
                }} className="gap-2 text-destructive font-bold">
                  <Trash2 className="h-4 w-4" />
                  Delete Room
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-4 pb-4">
            <div className="flex justify-between items-baseline flex-col gap-2">
              {editingPriceId === room.id ? (
                <div className="flex flex-col gap-2 w-full mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20">Base Price:</span>
                    <Input type="number" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} className="w-24 h-8 text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20">Day Only:</span>
                    <Input type="number" value={dayPriceInput} onChange={(e) => setDayPriceInput(e.target.value)} className="w-24 h-8 text-sm" placeholder="Optional" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20">Night Only:</span>
                    <Input type="number" value={nightPriceInput} onChange={(e) => setNightPriceInput(e.target.value)} className="w-24 h-8 text-sm" placeholder="Optional" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20">Whole Day:</span>
                    <Input type="number" value={wholeDayPriceInput} onChange={(e) => setWholeDayPriceInput(e.target.value)} className="w-24 h-8 text-sm" placeholder="Optional" />
                  </div>
                  <div className="flex gap-2 justify-end mt-1">
                    <Button size="sm" variant="ghost" className="h-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleSavePrice(room.id)}>
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setEditingPriceId(null)}>
                      <XIcon className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1 w-full relative group">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-xl font-extrabold text-foreground font-heading">
                      Rs. {room.pricePerNight} <span className="text-xs font-normal text-muted-foreground">/ night (Base)</span>
                    </p>
                    <button onClick={() => { 
                      setEditingPriceId(room.id); 
                      setPriceInput(room.pricePerNight.toString());
                      setDayPriceInput(room.dayPrice?.toString() || "");
                      setNightPriceInput(room.nightPrice?.toString() || "");
                      setWholeDayPriceInput(room.wholeDayPrice?.toString() || "");
                    }} className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                    {room.dayPrice && <span className="bg-muted px-2 py-1 rounded">Day: Rs. {room.dayPrice}</span>}
                    {room.nightPrice && <span className="bg-muted px-2 py-1 rounded">Night: Rs. {room.nightPrice}</span>}
                    {room.wholeDayPrice && <span className="bg-muted px-2 py-1 rounded">Whole: Rs. {room.wholeDayPrice}</span>}
                  </div>
                </div>
              )}
              <Badge variant="outline" className={statusColors[room.status]}>
                {room.status.toLowerCase()}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-primary" />
              <span>Capacity: Up to {room.capacity} guests</span>
            </div>

            {/* List active/upcoming bookings info */}
            {room.bookings && room.bookings.length > 0 ? (
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-primary font-semibold">
                  <CalendarRange className="h-3.5 w-3.5" />
                  <span>Upcoming Stay</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  In: {new Date(room.bookings[0].checkIn).toLocaleDateString()} • Out: {new Date(room.bookings[0].checkOut).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="bg-muted/30 border rounded-xl p-3 text-center text-[10px] text-muted-foreground">
                No active bookings scheduled.
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2 border-t bg-muted/20 px-6 py-3 flex justify-between text-[10px] text-muted-foreground">
            <span>Last Updated: {new Date(room.updatedAt).toLocaleDateString()}</span>
            <span>{room.type}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
