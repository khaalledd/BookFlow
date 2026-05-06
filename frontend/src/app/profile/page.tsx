'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  status: string;
  service: {
    name: string;
    price: number;
    durationMinutes: number;
  };
  business: {
    name: string;
    slug: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/mine');
        const data = res.data?.data || res.data;
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [isHydrated, isAuthenticated, router]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-primary bg-primary-container/30 border-primary/20';
      case 'PENDING':
        return 'text-[#8a5b1f] bg-[#f8dfc8] border-[#e7ba91]';
      case 'CANCELLED':
        return 'text-error bg-error-container/30 border-error/20';
      case 'COMPLETED':
        return 'text-tertiary bg-tertiary-container/30 border-tertiary/20';
      default:
        return 'text-outline bg-surface-container-low border-outline-variant/30';
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
        )
      );
    } catch (err: any) {
      console.error('Failed to cancel booking', err);
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-[#35858E]/5 border-b border-[#35858E]/10">
        <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="material-symbols-outlined fill text-primary text-3xl">forest</span>
            <span className="text-2xl font-extrabold text-[#35858E]">VerdantBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 font-button text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20 hover:border-primary/40 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              Explore
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-button text-sm font-semibold text-error hover:bg-error/10 px-5 py-2.5 rounded-full border border-error/20 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Profile Header */}
        <section className="mb-10">
          <div className="glass-panel bg-white rounded-3xl p-8 border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-primary shrink-0 shadow-md border-2 border-primary/20">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-h2 text-3xl text-on-surface mb-1">{user?.name}</h1>
                <p className="font-body-md text-on-surface-variant">{user?.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            <h2 className="font-h3 text-2xl text-on-surface">My Bookings</h2>
            <span className="ml-auto bg-primary-container/50 text-primary font-label-sm text-xs px-3 py-1 rounded-full font-bold">
              {bookings.length} total
            </span>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-surface-container-low rounded-2xl animate-pulse border border-outline-variant/20" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-panel bg-surface-container-lowest/50 rounded-3xl p-12 text-center border-dashed border-2 border-outline-variant/40 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6 border border-outline-variant/50 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-outline-variant">calendar_today</span>
              </div>
              <h3 className="font-h3 text-2xl text-on-surface mb-3">No bookings yet</h3>
              <p className="font-body-md text-on-surface-variant mb-8 max-w-md">
                Looks like you haven&apos;t scheduled any appointments. Discover top-rated professionals and book your next experience.
              </p>
              <Link
                href="/explore"
                className="font-button text-button bg-primary text-on-primary px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:bg-surface-tint active:scale-95 transition-all duration-200 inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="glass-panel bg-white rounded-2xl p-6 border border-outline-variant/30 hover:border-primary/30 hover:shadow-[0_8px_30px_-4px_rgba(0,102,111,0.08)] transition-all duration-300 relative overflow-hidden group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full font-label-sm text-[11px] font-bold tracking-wide uppercase border ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-h3 text-xl text-on-surface">${booking.service.price}</p>
                      <p className="text-xs text-outline font-medium">{booking.service.durationMinutes} min</p>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-h3 text-xl text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight">
                      {booking.service.name}
                    </h3>
                    <Link href={`/book/${booking.business.slug}`} className="font-body-sm font-medium text-secondary hover:underline flex items-center gap-1.5 mb-6 w-fit hover:text-secondary-container">
                      <span className="material-symbols-outlined text-[16px]">storefront</span>
                      {booking.business.name}
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20 mt-auto">
                    <div className="flex-1 flex items-center justify-center gap-2 font-label-sm text-on-surface-variant bg-surface-container-lowest py-2 rounded-xl border border-outline-variant/40">
                      <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                      {booking.date}
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-2 font-label-sm text-on-surface-variant bg-surface-container-lowest py-2 rounded-xl border border-outline-variant/40">
                      <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                      {booking.startTime}
                    </div>
                  </div>
                  
                  {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="mt-4 w-full border border-error/30 text-error hover:bg-error/10 font-button text-button py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
