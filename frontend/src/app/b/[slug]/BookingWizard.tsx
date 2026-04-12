'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BookingWizard({ business }: { business: any }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<
    'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR' | 'GUEST_FORM'
  >('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSlots = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    if (!selectedService) return;

    setLoadingSlots(true);
    try {
      const res = await api.get(
        `/businesses/${business.id}/slots?serviceId=${selectedService.id}&date=${dateStr}`,
      );
      setAvailableSlots(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleBook = async () => {
    if (!isAuthenticated) {
      setBookingStatus('GUEST_FORM');
      return;
    }

    if (user?.role !== 'CUSTOMER') {
      alert('You must be logged in as a CUSTOMER to book.');
      return;
    }

    submitBooking();
  };

  const submitBooking = async () => {
    setBookingStatus('PROCESSING');
    setErrorMsg('');

    try {
      if (isAuthenticated) {
        await api.post('/bookings', {
          businessId: business.id,
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedSlot,
          notes: 'Booked via Public Web Flow',
        });
      } else {
        await api.post('/bookings/public', {
          businessId: business.id,
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedSlot,
          notes: 'Booked as Guest',
          ...guestData,
        });
      }
      setBookingStatus('SUCCESS');
    } catch (err: any) {
      setBookingStatus('ERROR');
      setErrorMsg(
        err.response?.data?.message ||
          'Failed to book slot. It might have been taken.',
      );
    }
  };

  if (bookingStatus === 'GUEST_FORM') {
    return (
      <Card className="bg-card/40 border-white/10 shadow-xl backdrop-blur-md overflow-hidden p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-heading text-white mb-2">Your Details</h2>
        <p className="text-muted-foreground mb-6">
          Please enter your details to complete the booking for{' '}
          {selectedService.name} on {selectedDate} at {selectedSlot}.
        </p>

        {errorMsg && (
          <div className="mb-6 p-3 bg-destructive/20 text-destructive-foreground border border-destructive/50 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitBooking();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="guestName">Full Name</Label>
            <Input
              id="guestName"
              required
              value={guestData.name}
              onChange={(e) =>
                setGuestData({ ...guestData, name: e.target.value })
              }
              className="bg-black/20 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email</Label>
            <Input
              id="guestEmail"
              type="email"
              required
              value={guestData.email}
              onChange={(e) =>
                setGuestData({ ...guestData, email: e.target.value })
              }
              className="bg-black/20 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestPhone">Phone Number</Label>
            <Input
              id="guestPhone"
              required
              value={guestData.phone}
              onChange={(e) =>
                setGuestData({ ...guestData, phone: e.target.value })
              }
              className="bg-black/20 focus-visible:ring-primary"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-white/10"
              onClick={() => setBookingStatus('IDLE')}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 font-semibold">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  if (bookingStatus === 'SUCCESS') {
    return (
      <Card className="bg-card/40 border-white/10 p-12 text-center shadow-2xl backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/20 p-4 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-heading text-white mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          You are scheduled for {selectedService.name} on {selectedDate} at{' '}
          {selectedSlot}.
        </p>
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="border-white/20"
        >
          Return Home
        </Button>
      </Card>
    );
  }

  // 1. Service Selection
  if (!selectedService) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-heading mb-6 tracking-tight">
          Select a Service
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {business.services?.length === 0 ? (
            <p className="text-muted-foreground">
              This business has no services listed yet.
            </p>
          ) : (
            business.services?.map((svc: any) => (
              <Card
                key={svc.id}
                className="bg-card/30 border-white/5 hover:border-primary/50 hover:bg-black/40 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => setSelectedService(svc)}
              >
                <CardContent className="p-6">
                  {svc.coverUrl && (
                    <div className="mb-4 overflow-hidden rounded-md border border-white/10">
                      <Image
                        src={svc.coverUrl}
                        alt={`${svc.name} cover`}
                        width={800}
                        height={400}
                        className="h-36 w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {svc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {svc.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary text-xl">
                        {svc.price} {svc.currency || 'EGP'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                        <Clock size={12} /> {svc.durationMinutes} mins
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // 2. Date & Time Selection
  return (
    <Card className="bg-card/40 border-white/10 shadow-xl backdrop-blur-md overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Left Side: Summary & Date */}
        <div className="p-8 border-r border-white/5 bg-black/20">
          <Button
            variant="link"
            className="px-0 text-muted-foreground hover:text-white mb-6"
            onClick={() => setSelectedService(null)}
          >
            ← Back to Services
          </Button>

          <div className="mb-8">
            <h3 className="text-2xl font-heading mb-2 text-white">
              {selectedService.name}
            </h3>
            <p className="text-primary font-medium text-lg">
              {selectedService.price} EGP
            </p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <Clock size={14} /> {selectedService.durationMinutes} Minutes
              Session
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <CalendarIcon size={16} /> Choose Date
            </h4>
            <input
              type="date"
              className="w-full bg-black/40 border border-white/10 rounded-md p-3 text-white focus:ring-primary focus:border-primary transition-all"
              value={selectedDate}
              onChange={(e) => fetchSlots(e.target.value)}
              // Rough min date calculation for today
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Right Side: Slots & Checkout */}
        <div className="p-8">
          {!selectedDate ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center">
              <CalendarIcon size={32} className="mb-4 opacity-20" />
              <p>Please select a date to view available time slots.</p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <h4 className="font-medium mb-6 flex items-center gap-2">
                <Clock size={16} /> Available Slots
              </h4>

              {loadingSlots ? (
                <div className="animate-pulse flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-10 w-24 bg-white/10 rounded-md" />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-10 px-4 bg-black/20 rounded-lg">
                  <p className="text-muted-foreground">
                    No slots available on this date.
                  </p>
                  <p className="text-xs mt-2 text-white/40">
                    Try selecting a different day.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 mb-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-md text-sm font-medium transition-all ${
                        selectedSlot === slot
                          ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                          : 'bg-black/30 border border-white/5 hover:border-primary/50 hover:bg-black/50 text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

              {selectedSlot && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  {errorMsg && (
                    <div className="mb-4 p-3 bg-destructive/20 text-destructive-foreground border border-destructive/50 rounded-md text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <Button
                    className="w-full text-lg h-14 font-semibold"
                    disabled={bookingStatus === 'PROCESSING'}
                    onClick={handleBook}
                  >
                    {bookingStatus === 'PROCESSING'
                      ? 'Securing Slot...'
                      : `Book for ${selectedSlot}`}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Continue as guest to book instantly. No account required.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
