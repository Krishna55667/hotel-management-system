"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonsProps {
  bookings: any[];
  payments: any[];
}

export default function ExportButtons({ bookings, payments }: ExportButtonsProps) {
  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const csvRows = data.map(row => 
      Object.values(row)
        .map(val => {
          if (val === null || val === undefined) return '""';
          const strVal = String(val).replace(/"/g, '""');
          return `"${strVal}"`;
        })
        .join(",")
    );
    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => downloadCSV(bookings, "bookings_export")}>
        <Download className="h-4 w-4 mr-2" />
        Export Bookings
      </Button>
      <Button variant="outline" size="sm" onClick={() => downloadCSV(payments, "payments_export")}>
        <Download className="h-4 w-4 mr-2" />
        Export Payments
      </Button>
    </div>
  );
}
