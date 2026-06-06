"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Loader2, UploadCloud } from "lucide-react";
import { submitPayment } from "@/actions/payments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PaymentUploadModalProps {
  bookingId: string;
  totalAmount: number;
}

export default function PaymentUploadModal({ bookingId, totalAmount }: PaymentUploadModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to process image");
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId || !screenshotBase64) {
      toast.error("Please provide both Transaction ID and screenshot");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("method", "QR_PAYMENT");
    formData.append("transactionId", transactionId);
    formData.append("screenshotUrl", screenshotBase64);

    const result = await submitPayment(formData);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setIsOpen(false);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to submit payment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={<Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" />}
      >
        <UploadCloud className="h-4 w-4" /> Upload Receipt
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Payment Receipt</DialogTitle>
          <DialogDescription>
            Complete your booking payment. Amount due: <strong>Rs. {totalAmount}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-muted/40 rounded-xl border">
            <div className="bg-white p-2 rounded-lg border shadow-sm">
              <img src="/qr.png" alt="Payment QR" className="w-24 h-24 object-contain" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-foreground">Sauraha Fish Village & Agro</p>
              <p className="text-muted-foreground">Bank: Siddhartha Bank Ltd</p>
              <p className="text-muted-foreground">Account No: 01515236236236</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction / Reference ID *</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Upload Screenshot *</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {uploading && <p className="text-xs text-primary animate-pulse">Processing image...</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={loading || uploading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Payment for Verification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
