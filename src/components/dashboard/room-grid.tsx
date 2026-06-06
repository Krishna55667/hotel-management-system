"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  BedDouble, Wrench, RefreshCw, CheckCircle, 
  MoreVertical, CalendarRange 
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
              <CardTitle className="font-heading font-bold text-lg text-primary">
                {room.name}
              </CardTitle>
            </div>
            
            {/* Status Change Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-4 pb-4">
            <div className="flex justify-between items-baseline">
              <p className="text-xl font-extrabold text-foreground font-heading">
                Rs. {room.pricePerNight}
                <span className="text-xs font-normal text-muted-foreground"> / night</span>
              </p>
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
