'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, LogOut, User } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  status: string;
  service: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  };
  business: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout, setUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect business owners to dashboard
    if (user?.role === 'BUSINESS_OWNER') {
      router.push('/dashboard');
      return;
    }

    // Fetch customer bookings
    async function fetchBookings() {
      try {
        const res = await api.get('/bookings/mine');
        // Response: { data: { data: [...], meta: {...} }, statusCode }
        const bookingsData =
          res.data.data?.data || res.data.data || res.data || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [isHydrated, isAuthenticated, user, router]);

  const handleAvatarUpload = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await api.post('/uploads/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const avatarUrl = res.data.data?.url || res.data.url;
      if (avatarUrl && user) {
        setUser({ ...user, avatarUrl });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload avatar');
    }
  };

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-400 bg-green-400/10';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'CANCELLED':
        return 'text-red-400 bg-red-400/10';
      case 'COMPLETED':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-muted-foreground bg-white/5';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-card/30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">
              Welcome, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            <div className="mt-3 flex items-center gap-3">
              <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-primary/40 bg-primary/15 px-5 text-sm font-semibold text-primary transition-all hover:bg-primary/25">
                Upload Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                  }}
                />
              </label>
              {user?.avatarUrl && (
                <a
                  href={user.avatarUrl}
                  target="_blank"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  View Avatar
                </a>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              logout();
              router.push('/');
            }}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card className="bg-card/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-primary flex items-center gap-2">
              <Calendar size={20} />
              My Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-white/5 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <User
                  size={48}
                  className="mx-auto text-muted-foreground/30 mb-4"
                />
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t made any bookings yet.
                </p>
                <Button onClick={() => router.push('/')}>
                  Explore Businesses
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">
                          {booking.service.name}
                        </h3>
                        <p className="text-sm text-primary font-medium mt-1">
                          {booking.business.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {booking.startTime}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
