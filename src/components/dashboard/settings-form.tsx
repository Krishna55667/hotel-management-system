"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveSettings } from "@/actions/settings";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveSettings(formData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="financial">Financial & Tax</TabsTrigger>
          <TabsTrigger value="system">System Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Resort Information</CardTitle>
              <CardDescription>Update the public-facing details of the resort.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resortName">Resort Name</Label>
                <Input id="resortName" name="resortName" defaultValue={initialSettings["resortName"] || "Sauraha Fish Village & Agro Pvt. Ltd"} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" name="contactEmail" defaultValue={initialSettings["contactEmail"] || "info@saurahafishvillage.com"} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input id="contactPhone" name="contactPhone" defaultValue={initialSettings["contactPhone"] || "9857030654"} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" defaultValue={initialSettings["address"] || "Rupandehi, Butwal-18, Sauraha, Nepal"} required />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial & Tax Configuration</CardTitle>
              <CardDescription>Set tax percentages and service charges applied to billings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vatPercentage">VAT Percentage (%)</Label>
                <Input id="vatPercentage" type="number" step="0.01" name="vatPercentage" defaultValue={initialSettings["vatPercentage"] || "13"} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceCharge">Service Charge (%)</Label>
                <Input id="serviceCharge" type="number" step="0.01" name="serviceCharge" defaultValue={initialSettings["serviceCharge"] || "10"} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currencySymbol">Currency Symbol</Label>
                <Input id="currencySymbol" name="currencySymbol" defaultValue={initialSettings["currencySymbol"] || "Rs."} required />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure rules like checkout times and system behaviors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Default Check-in Time</Label>
                <Input id="checkInTime" type="time" name="checkInTime" defaultValue={initialSettings["checkInTime"] || "14:00"} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Default Check-out Time</Label>
                <Input id="checkOutTime" type="time" name="checkOutTime" defaultValue={initialSettings["checkOutTime"] || "12:00"} required />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes
          </Button>
        </div>
      </Tabs>
    </form>
  );
}
