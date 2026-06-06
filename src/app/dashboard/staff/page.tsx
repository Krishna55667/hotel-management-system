import { getStaff } from "@/actions/staff";
import StaffTable from "@/components/dashboard/staff-table";

export const revalidate = 0;

export default async function StaffAdminPage() {
  const staffList = await getStaff();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">Resort Staff Directory</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review staff positions, shift timings, set salaries, and manage employee active/leave statuses.
        </p>
      </div>

      {/* Staff Directory Table Component */}
      <StaffTable staffList={staffList} />
    </div>
  );
}
