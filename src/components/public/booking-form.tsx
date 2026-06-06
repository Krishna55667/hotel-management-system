"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, User, CreditCard, CheckCircle, 
  ArrowRight, ArrowLeft, Loader2, Sparkles, QrCode 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createBooking } from "@/actions/bookings";
import { submitPayment } from "@/actions/payments";
import { toast } from "sonner";

interface BookingFormProps {
  rooms: any[];
}

export default function BookingForm({ rooms }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoomId = searchParams.get("roomId") || "";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Form states
  const [roomId, setRoomId] = useState(initialRoomId);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("12:00");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("QR_PAYMENT");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState("");
  const [uploading, setUploading] = useState(false);

  // Selected room detail helper
  const selectedRoom = rooms.find(r => r.id === roomId);

  // Cost calculation
  const [bookingType, setBookingType] = useState("WHOLE_DAY");
  const [nights, setNights] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (checkIn && checkOut && selectedRoom) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      let diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      // Minimum 1 day calculation
      if (diffDays === 0) diffDays = 1;
      setNights(diffDays);

      let cost = 0;
      if (bookingType === "DAY" && selectedRoom.dayPrice) {
        cost = diffDays * selectedRoom.dayPrice;
      } else if (bookingType === "NIGHT" && selectedRoom.nightPrice) {
        cost = diffDays * selectedRoom.nightPrice;
      } else if (bookingType === "WHOLE_DAY" && selectedRoom.wholeDayPrice) {
        cost = diffDays * selectedRoom.wholeDayPrice;
      } else {
        cost = diffDays * selectedRoom.pricePerNight;
      }
      setTotalCost(cost);
    } else {
      setNights(0);
      setTotalCost(0);
    }
  }, [checkIn, checkOut, selectedRoom, bookingType]);

  // Handle file upload -> Base64 for local database storage simplicity
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotBase64(reader.result as string);
      setUploading(false);
      toast.success("Payment screenshot uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
      toast.error("Please select a room");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }
    if (new Date(checkIn) > new Date(checkOut)) {
      toast.error("Check-out date cannot be before check-in date");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Please fill all required contact fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("roomId", roomId);
    formData.append("checkIn", checkIn);
    formData.append("checkOut", checkOut);
    formData.append("expectedCheckInTime", checkInTime);
    formData.append("expectedCheckOutTime", checkOutTime);
    formData.append("bookingType", bookingType);
    formData.append("guests", guests.toString());
    formData.append("specialRequests", specialRequests);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);

    const result = await createBooking(formData);
    setLoading(false);

    if (result.success && result.data) {
      setBookingResult(result.data);
      setStep(3);
      toast.success("Booking details saved. Let's complete payment.");
    } else {
      toast.error(result.message || "Failed to submit booking details");
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod !== "CASH" && !transactionId) {
      toast.error("Please enter the Transaction ID");
      return;
    }
    if (paymentMethod !== "CASH" && !screenshotBase64) {
      toast.error("Please upload the payment receipt screenshot");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("bookingId", bookingResult.bookingId);
    formData.append("method", paymentMethod);
    formData.append("transactionId", transactionId);
    formData.append("screenshotUrl", screenshotBase64); // Storing base64 string directly in database

    const result = await submitPayment(formData);
    setLoading(false);

    if (result.success) {
      setStep(4);
      toast.success("Payment submitted for verification!");
    } else {
      toast.error(result.message || "Failed to submit payment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden">
      {/* Step Progress Indicator */}
      <div className="bg-primary/5 border-b py-6 px-8 flex justify-between items-center">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                step >= num
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground border"
              }`}
            >
              {num}
            </div>
            <span
              className={`text-xs font-medium hidden sm:inline ${
                step === num ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {num === 1 && "Dates"}
              {num === 2 && "Details"}
              {num === 3 && "Payment"}
              {num === 4 && "Confirm"}
            </span>
            {num < 4 && <div className="h-px w-6 sm:w-12 bg-border" />}
          </div>
        ))}
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleStep1Submit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="room">Select Room</Label>
                <select
                  id="room"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-3 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
                  required
                >
                  <option value="">-- Choose a Room --</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.number} - {room.name} (Rs. {room.pricePerNight}/night)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3 pb-4 border-b col-span-1 sm:col-span-2">
                    <Label className="text-primary font-semibold">Booking Type</Label>
                    <RadioGroup 
                      value={bookingType} 
                      onValueChange={setBookingType}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border flex-1 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="DAY" id="type-day" />
                        <Label htmlFor="type-day" className="cursor-pointer font-medium w-full">Day Only</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border flex-1 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="NIGHT" id="type-night" />
                        <Label htmlFor="type-night" className="cursor-pointer font-medium w-full">Night Only</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border flex-1 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="WHOLE_DAY" id="type-whole" />
                        <Label htmlFor="type-whole" className="cursor-pointer font-medium w-full">Whole Day (24hr)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check-In Date</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkInTime">Time</Label>
                    <Input
                      id="checkInTime"
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check-Out Date</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOutTime">Time</Label>
                    <Input
                      id="checkOutTime"
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {selectedRoom && checkIn && checkOut && (
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per night:</span>
                    <span className="font-semibold text-foreground">Rs. {selectedRoom.pricePerNight}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total stay duration:</span>
                    <span className="font-semibold text-foreground">{nights} Night(s)</span>
                  </div>
                  <hr className="border-border/60" />
                  <div className="flex justify-between text-base font-bold text-primary">
                    <span>Estimated Cost:</span>
                    <span>Rs. {totalCost}</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white gap-2">
                Continue to Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleStep2Submit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9857030654"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests *</Label>
                  <Input
                    id="guests"
                    type="number"
                    min={1}
                    max={selectedRoom?.capacity || 4}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Butwal, Rupandehi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests / Notes</Label>
                <Textarea
                  id="requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="E.g., early check-in, dietary preferences, extra bed..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/2">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="w-1/2 bg-primary hover:bg-primary/95 text-white gap-2">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Save & Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleStep3Submit}
              className="space-y-6 text-center"
            >
              <div className="text-left space-y-4">
                <h3 className="font-heading font-bold text-lg text-primary">Submit Payment</h3>
                
                {/* Step B: User Notice as requested */}
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm font-medium shadow-sm">
                  Please scan the QR code to pay the exact amount of <strong>Rs. {bookingResult?.totalAmount}</strong>. 
                  Download your payment receipt or take a screenshot of your successful transaction to upload below.
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-muted/40 rounded-xl border">
                  {/* Step A: Display QR from /qr.png */}
                  <div className="bg-white p-2 rounded-lg border shadow-sm">
                    <img src="/qr.png" alt="Payment QR" className="w-36 h-36 object-contain" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-foreground">Sauraha Fish Village & Agro Pvt. Ltd</p>
                    <p className="text-xs text-muted-foreground">Bank: Siddhartha Bank Ltd</p>
                    <p className="text-xs text-muted-foreground">Account Name: Sauraha Fish Village & Agro</p>
                    <p className="text-xs text-muted-foreground">Account No: 01515236236236</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID / Reference ID *</Label>
                    <Input
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction ID"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshot">Upload Payment Screenshot *</Label>
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    {uploading && <p className="text-xs text-primary animate-pulse">Uploading file...</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="sm:w-1/4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setStep(4); toast.success("Booking confirmed! You can pay later from your dashboard."); }} className="sm:w-1/3">
                  Book & Pay Later
                </Button>
                <Button type="submit" disabled={loading || uploading} className="sm:flex-1 bg-primary hover:bg-primary/95 text-white gap-2">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Confirm Payment
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <div className="bg-primary/10 text-primary p-4 rounded-full inline-block">
                <Sparkles className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-heading text-primary">Booking Submitted!</h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Thank you, {name}! Your booking has been submitted. Our receptionist will verify the payment screenshot and send a digital confirmation receipt to <strong>{email}</strong>.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/95 text-white">
                  Back to Homepage
                </Button>
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Sign In to Track Booking
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
