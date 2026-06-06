"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { RefreshCcw } from "lucide-react";
import { resetMonthlyRevenue } from "@/actions/reports";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetRevenueButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const result = await resetMonthlyRevenue();
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="h-6 px-2 text-[10px] gap-1 text-red-500 border-red-500/20 hover:bg-red-50 hover:text-red-600" />}>
        <RefreshCcw className="h-3 w-3" />
        Reset Data
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2">
            <RefreshCcw className="h-5 w-5" />
            Are you sure?
          </DialogTitle>
          <DialogDescription className="pt-2 text-foreground/80">
            This action will reset the monthly revenue displayed on the dashboard to <strong>Rs. 0</strong>. 
            <br/><br/>
            Historical guest booking data and payment records will <strong>not</strong> be deleted, but the dashboard analytics will start counting from zero as of today.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={handleReset} disabled={loading}>
            {loading ? "Resetting..." : "Yes, Reset Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
