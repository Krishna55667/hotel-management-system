"use client";

import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, Loader2, Sparkles } from "lucide-react";
import { verifyPayment } from "@/actions/payments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PaymentVerifierProps {
  payments: any[];
}

export default function PaymentVerifier({ payments: initialPayments }: PaymentVerifierProps) {
  const router = useRouter();
  const [payments, setPayments] = useState(initialPayments);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState("");

  const handleVerify = async (id: string, approve: boolean) => {
    setVerifyingId(id);
    const result = await verifyPayment(id, approve);
    setVerifyingId("");

    if (result.success) {
      toast.success(result.message);
      setPayments(prev => 
        prev.map(p => p.id === id ? { ...p, status: approve ? "SUCCESS" : "FAILED" } : p)
      );
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const statusColors = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    SUCCESS: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
  } as any;

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking Ref</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead className="text-right">Verify Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs font-semibold">
                    {p.booking.bookingNumber.slice(0, 12)}...
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold">{p.booking.user.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.booking.user.email}</div>
                  </TableCell>
                  <TableCell className="font-bold text-primary">Rs. {p.amount}</TableCell>
                  <TableCell className="text-xs uppercase font-bold tracking-wide text-muted-foreground">
                    {p.method.replace("_", " ")}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium">{p.transactionId || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[p.status]}>
                      {p.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.screenshotUrl ? (
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-primary hover:bg-primary/5 hover:text-primary">
                            <Eye className="h-4 w-4" />
                            View Receipt
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Uploaded Screenshot</DialogTitle>
                            <DialogDescription>
                              Transaction ID: <strong>{p.transactionId}</strong>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center p-2 border rounded-xl bg-muted/40">
                            {/* Standard base64 image renderer */}
                            {p.screenshotUrl.startsWith("data:") ? (
                              <img
                                src={p.screenshotUrl}
                                alt="Payment Screenshot"
                                className="max-h-96 object-contain rounded-lg"
                              />
                            ) : (
                              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                <Sparkles className="h-10 w-10 text-primary" />
                                <span className="text-xs font-semibold">No screenshot attachment</span>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {verifyingId === p.id ? (
                      <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                    ) : p.status === "PENDING" ? (
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVerify(p.id, false)}
                          className="h-8 w-8 text-destructive p-0 hover:bg-destructive/10"
                        >
                          <XCircle className="h-4.5 w-4.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVerify(p.id, true)}
                          className="h-8 w-8 text-emerald-600 p-0 hover:bg-emerald-50/10"
                        >
                          <CheckCircle className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                  No payment records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
