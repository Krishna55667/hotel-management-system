import { getRooms } from "@/actions/rooms";
import RoomGrid from "@/components/dashboard/room-grid";
import AddRoomModal from "@/components/dashboard/add-room-modal";

export const revalidate = 0;

export default async function RoomsAdminPage() {
  const rooms = await getRooms();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Resort Rooms</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor current room occupancies, trigger cleaning status, or mark rooms for maintenance.
          </p>
        </div>
        <AddRoomModal />
      </div>

      {/* Grid of Room Cards */}
      <RoomGrid rooms={rooms} />
    </div>
  );
}
