'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
        const payload = res.data?.data || res.data;
        const bookingsData = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setBookings(bookingsData);
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
        return 'text-primary bg-primary-container/20 border-primary/30 shadow-[0_0_10px_rgba(0,102,111,0.2)]';
      case 'PENDING':
        return 'text-[#9A6A15] bg-[#FDECBF] border-[#E8B966] shadow-[0_0_10px_rgba(154,106,21,0.15)]';
      case 'CANCELLED':
        return 'text-error bg-error-container/30 border-error/30';
      case 'COMPLETED':
        return 'text-tertiary bg-tertiary-container/30 border-tertiary/30';
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
    <div className="min-h-screen bg-surface-container-lowest font-sans">
      {/* Header Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-[#35858E]/5 border-b border-[#35858E]/10">
        <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="material-symbols-outlined fill text-primary text-3xl group-hover:scale-110 transition-transform duration-300">forest</span>
            <span className="text-2xl font-extrabold text-[#35858E]">VerdantBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 font-button text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20 hover:border-primary/40 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              Explore
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-button text-sm font-semibold text-error hover:bg-error/10 px-5 py-2.5 rounded-full border border-error/20 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col gap-12">
        {/* Profile Banner & Header */}
        <section className="relative w-full rounded-[2.5rem] bg-white border border-outline-variant/30 shadow-[0_8px_30px_-4px_rgba(0,102,111,0.06)] overflow-hidden">
          {/* Vibrant Gradient Banner */}
          <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary via-[#1A8994] to-[#45B0A8] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="px-8 pb-10 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 -mt-20 md:-mt-24 relative z-10">
              {/* Overlapping Avatar */}
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-8 border-white bg-surface-container shadow-xl shrink-0 overflow-hidden relative group">
                <Image 
                  src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBO0N69FtsBkCbiTZ0ftfa6e886BgpQ_jCL2VVBxdS-EcFDSaPwtPZtsBg62aYpcIHv-B_6MztyyONBdkcnP47tLWMuiwVnLmf_c7lRZmz-VlPk6nXMboj1E9uOI7r5firUn8gYvlS8yw1IQeHnopIPKHdt5YYTPk7iwICnHrSBqHdZiJgIntePfHFKZTtQlyj1AMvzPz8zlUqexSlSMAFxAlagdpsuEKTky6h7m6R2Qcy6hUX1cb7bVHkbZKjcq8w5VaorB9EhRXQ-"}
                  alt="Profile Avatar"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1 mb-2">
                <h1 className="font-h1 text-4xl text-on-surface mb-1 tracking-tight">{user?.name}</h1>
                <p className="font-body-lg text-on-surface-variant flex items-center justify-center md:justify-start gap-2">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  {user?.email}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-2 w-full md:w-auto">
                {user?.role === 'BUSINESS_OWNER' && (
                  <Link href="/dashboard" className="flex-1 md:flex-none font-button bg-primary text-on-primary px-6 py-3 rounded-full hover:bg-surface-tint active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    Dashboard
                  </Link>
                )}
                <Link href="/dashboard/settings" className="flex-1 md:flex-none font-button bg-primary-container/10 text-primary border border-primary/20 px-6 py-3 rounded-full hover:bg-primary/10 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
              </div>
              <h2 className="font-h2 text-3xl text-on-surface tracking-tight">Your Schedule</h2>
            </div>
            <span className="bg-primary/10 text-primary font-label-sm text-sm px-4 py-1.5 rounded-full font-bold border border-primary/20 shadow-sm">
              {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-56 bg-surface-container-low rounded-[2rem] animate-pulse border border-outline-variant/20" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-surface-container-low to-surface-container-highest border border-outline-variant/30 p-16 flex flex-col items-center text-center shadow-inner">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 shadow-lg border border-outline-variant/20 relative z-10">
                <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
              </div>
              <h3 className="font-h2 text-3xl text-on-surface mb-4 relative z-10 tracking-tight">Your calendar is clear</h3>
              <p className="font-body-lg text-on-surface-variant mb-10 max-w-lg relative z-10 leading-relaxed">
                You haven&apos;t scheduled any appointments yet. Discover top-rated professionals in your area and book your next premium experience today.
              </p>
              <Link
                href="/explore"
                className="font-button text-lg bg-primary text-on-primary px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-surface-tint active:scale-95 transition-all duration-300 inline-flex items-center gap-3 relative z-10 group"
              >
                <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">search</span>
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-[2rem] p-8 border border-outline-variant/30 hover:border-primary/40 hover:shadow-[0_12px_40px_-10px_rgba(0,102,111,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden group"
                >
                  {/* Subtle Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className={`px-4 py-1.5 rounded-full font-label-sm text-xs font-bold tracking-widest uppercase border ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                    <div className="text-right">
                      <p className="font-h2 text-2xl text-on-surface leading-none mb-1">${booking.service.price}</p>
                      <p className="font-label-sm text-outline font-medium flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        {booking.service.durationMinutes} min
                      </p>
                    </div>
                  </div>

                  <div className="flex-grow mb-8 relative z-10">
                    <h3 className="font-h3 text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                      {booking.service.name}
                    </h3>
                    <Link href={`/book/${booking.business.slug}`} className="inline-flex items-center gap-2 font-body-md font-semibold text-secondary hover:text-primary hover:bg-primary/5 px-3 py-1.5 -ml-3 rounded-lg transition-colors">
                      <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[16px]">storefront</span>
                      </div>
                      {booking.business.name}
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
                    <div className="flex flex-col items-center justify-center gap-1 bg-surface-container-low py-4 rounded-2xl border border-outline-variant/20">
                      <span className="material-symbols-outlined text-[20px] text-primary mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                      <span className="font-label-sm text-on-surface font-semibold">{booking.date}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 bg-surface-container-low py-4 rounded-2xl border border-outline-variant/20">
                      <span className="material-symbols-outlined text-[20px] text-primary mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                      <span className="font-label-sm text-on-surface font-semibold">{booking.startTime}</span>
                    </div>
                  </div>
                  
                  {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="mt-6 w-full border-2 border-error/20 text-error hover:bg-error hover:text-white font-button py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative z-10 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">cancel</span>
                      Cancel Appointment
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
