'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { getMyBusiness } from '@/lib/business';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  };
}

export default function BookingsPage() {
  const { user } = useAuth();

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );

  useEffect(() => {
    async function init() {
      try {
        const myBiz = await getMyBusiness(user?.id);
        if (myBiz) {
          setBusinessId(myBiz.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user) init();
  }, [user]);

  useEffect(() => {
    async function fetchBookings() {
      if (!businessId) return;
      try {
        const res = await api.get(
          `/businesses/${businessId}/bookings?date=${selectedDate}`,
        );
        const bookingsData = res.data.data?.data || res.data.data || [];
        setBookings(bookingsData);
      } catch (err) {
        console.error(err);
      }
    }
    if (businessId) fetchBookings();
  }, [businessId, selectedDate]);

  const handleComplete = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/complete`);
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'COMPLETED' } : b,
        ),
      );
    } catch (err) {
      console.error(err);
      alert('Failed to mark as completed');
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b,
        ),
      );
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'CANCELLED':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'COMPLETED':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-muted-foreground bg-white/5 border-white/10';
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!businessId) {
    return (
      <div className="text-center p-10 bg-card/30 rounded-lg">
        Please create a business profile first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-heading text-primary">
                Bookings
              </CardTitle>
              <CardDescription>
                Manage your appointments and customer bookings.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-muted-foreground" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar
                size={48}
                className="mx-auto text-muted-foreground/30 mb-4"
              />
              <p className="text-muted-foreground">
                No bookings for {selectedDate}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">
                          {booking.service.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User size={14} />
                        <span>{booking.customer.name}</span>
                        <span className="text-white/30">|</span>
                        <span>{booking.customer.email}</span>
                        {booking.customer.phone && (
                          <>
                            <span className="text-white/30">|</span>
                            <span>{booking.customer.phone}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-primary">
                          <Clock size={14} />
                          {booking.startTime} - {booking.endTime}
                        </span>
                        <span className="text-muted-foreground">
                          {booking.service.durationMinutes} mins
                        </span>
                        <span className="font-medium text-primary">
                          {booking.service.price} EGP
                        </span>
                      </div>

                      {booking.notes && (
                        <p className="text-xs text-muted-foreground italic">
                          Note: {booking.notes}
                        </p>
                      )}
                    </div>

                    {booking.status !== 'CANCELLED' &&
                      booking.status !== 'COMPLETED' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                            onClick={() => handleComplete(booking.id)}
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleCancel(booking.id)}
                          >
                            <XCircle size={14} className="mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
