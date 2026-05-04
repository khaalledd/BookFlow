'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
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
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
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
        return 'text-primary bg-primary/10 border-primary/20';
      case 'PENDING':
        return 'text-amber-700 bg-amber-500/10 border-amber-500/20';
      case 'CANCELLED':
        return 'text-error bg-error/10 border-error/20';
      case 'COMPLETED':
        return 'text-blue-700 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-outline-variant bg-surface-container border-outline-variant/20';
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
          <div>
            <h1 className="text-3xl font-h2 text-primary tracking-tight">
              Bookings
            </h1>
            <p className="font-label-sm text-on-surface-variant">
              Manage your appointments and customer bookings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-outline" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-primary focus:border-primary shadow-sm"
            />
          </div>
        </div>
        <div>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar
                size={48}
                className="mx-auto text-outline/30 mb-4"
              />
              <p className="text-outline-variant font-medium">
                No bookings for {selectedDate}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 hover:border-primary/30 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-on-surface font-h3">
                          {booking.service.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                        <User size={14} />
                        <span>
                          {booking.customer?.name ||
                            booking.guestName ||
                            'Guest'}
                        </span>
                        <span className="text-outline-variant/50">|</span>
                        <span>
                          {booking.customer?.email || booking.guestEmail}
                        </span>
                        {(booking.customer?.phone || booking.guestPhone) && (
                          <>
                            <span className="text-outline-variant/50">|</span>
                            <span>
                              {booking.customer?.phone || booking.guestPhone}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-primary font-bold">
                          <Clock size={14} />
                          {booking.startTime} - {booking.endTime}
                        </span>
                        <span className="text-on-surface-variant">
                          {booking.service.durationMinutes} mins
                        </span>
                        <span className="font-bold text-primary">
                          {booking.service.price} EGP
                        </span>
                      </div>

                      {booking.notes && (
                        <p className="text-xs text-outline italic">
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
                            className="border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => handleComplete(booking.id)}
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-error/30 text-error hover:bg-error/10"
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
        </div>
      </div>
    </div>
  );
}
