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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, UserCog, MoreVertical, Loader2 } from "lucide-react";
import { createStaff, updateStaffStatus } from "@/actions/staff";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StaffTableProps {
  staffList: any[];
}

export default function StaffTable({ staffList: initialStaff }: StaffTableProps) {
  const router = useRouter();
  const [staffList, setStaffList] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // New staff form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("RECEPTIONIST");
  const [salary, setSalary] = useState("");
  const [shift, setShift] = useState("MORNING");

  const handleStatusChange = async (staffId: string, newStatus: string) => {
    const result = await updateStaffStatus(staffId, newStatus);
    if (result.success) {
      toast.success(result.message);
      setStaffList(prev => 
        prev.map(s => s.id === staffId ? { ...s, status: newStatus } : s)
      );
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !position) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("position", position);
    formData.append("salary", salary);
    formData.append("shift", shift);

    const result = await createStaff(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Staff member added successfully! Default login password is: staff123");
      setIsOpen(false);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setSalary("");
      router.refresh();
      // Simple reload to fetch fresh list
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.user.name.toLowerCase().includes(search.toLowerCase()) ||
    s.position.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    ON_LEAVE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    INACTIVE: "bg-red-500/10 text-red-600 border-red-500/20",
  } as any;

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/40">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff name or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-border/60"
          />
        </div>

        {/* Dialog for adding staff */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button className="bg-primary hover:bg-primary/95 text-white gap-2">
              <PlusCircle className="h-4.5 w-4.5" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Register a new employee. This automatically creates an authentication account with role permissions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateStaff} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="staffName">Full Name *</Label>
                <Input
                  id="staffName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ram Bahadur"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="staffEmail">Email Address *</Label>
                  <Input
                    id="staffEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ram@saurahafishvillage.com"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="staffPhone">Phone Number</Label>
                  <Input
                    id="staffPhone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9812345678"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="staffPos">Position *</Label>
                  <select
                    id="staffPos"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
                    required
                  >
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="HOUSEKEEPING">Housekeeping</option>
                    <option value="KITCHEN_STAFF">Kitchen Staff</option>
                    <option value="MANAGER">Manager</option>
                    <option value="SECURITY">Security</option>
                  </select>
                </div>
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="staffSalary">Salary (Rs.)</Label>
                  <Input
                    id="staffSalary"
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="25000"
                  />
                </div>
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="staffShift">Shift *</Label>
                  <select
                    id="staffShift"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
                    required
                  >
                    <option value="MORNING">Morning</option>
                    <option value="AFTERNOON">Afternoon</option>
                    <option value="NIGHT">Night</option>
                  </select>
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/95 text-white">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Employee"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Table */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-xs">
                        {staff.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">{staff.user.name}</div>
                        <div className="text-[10px] text-muted-foreground">{staff.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-xs">
                      {staff.position.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold capitalize">{staff.shift.toLowerCase()}</TableCell>
                  <TableCell className="text-xs font-bold text-primary">Rs. {staff.salary || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[staff.status]}>
                      {staff.status.toLowerCase().replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => handleStatusChange(staff.id, "ACTIVE")} className="gap-2">
                          Active Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(staff.id, "ON_LEAVE")} className="gap-2">
                          On Leave
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(staff.id, "INACTIVE")} className="gap-2 text-destructive">
                          Mark Inactive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  No employee records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
