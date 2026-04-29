'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';

// Simple helper to fetch the business ID since it might not be cached correctly in some setups
async function getMyBusiness(userId: string) {
  const res = await api.get('/businesses?limit=100');
  const businesses = res.data.data?.data || res.data.data || [];
  return businesses.find((b: any) => b.ownerId === userId) || null;
}

export default function DashboardOverview() {

  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [businessSlug, setBusinessSlug] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    
    async function loadData() {
      try {
        const business = await getMyBusiness(user!.id);
        if (business && mounted) {
          setBusinessSlug(business.slug);
          const res = await api.get(`/businesses/${business.id}/dashboard`);
          setStats(res.data.data || res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    loadData();
    return () => { mounted = false };
  }, [user]);

  const hoursBooked = stats ? (stats.todaysBookings?.reduce((acc: number, b: any) => acc + (b.service?.duration || 0), 0) / 60).toFixed(1) : '0.0';
  const todayCount = stats?.todayCount || 0;
  const thisWeekCount = stats?.thisWeekCount || 0;
  const popularCount = stats?.popularServices?.reduce((acc: number, s: any) => acc + s.count, 0) || 0;

  return (
    <>
      {/* Page Header */}
      <header className="mb-lg flex justify-between items-end">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface mb-xs">Overview</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Here is what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-[10px] rounded-full border border-outline-variant/30 text-primary font-label-sm text-label-sm shadow-sm">
          <span className="material-symbols-outlined text-[18px]">
            calendar_today
          </span>
          Today, {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Stat Cards (Top Row) */}
        {/* Card 1: Revenue */}
        <div className="col-span-12 md:col-span-4 bg-white/60 backdrop-blur-[20px] rounded-xl p-lg border border-outline-variant/30 shadow-[0_8px_24px_rgba(0,102,111,0.04)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>
              Hours Booked
            </span>
            <span className="px-2 py-1 bg-secondary-container/50 text-secondary font-label-sm text-[12px] rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                trending_up
              </span>
              +12%
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-h2 text-h2 text-on-surface">{loading ? "..." : `${hoursBooked}h`}</h3>
            <p className="font-label-sm text-[12px] text-outline mt-1">
              vs. yesterday
            </p>
          </div>
        </div>

        {/* Card 2: Appointments */}
        <div className="col-span-12 md:col-span-4 bg-white/60 backdrop-blur-[20px] rounded-xl p-lg border border-outline-variant/30 shadow-[0_8px_24px_rgba(0,102,111,0.04)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary-container/20 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                event_available
              </span>
              Total Appointments
            </span>
            <span className="px-2 py-1 bg-surface-container-highest text-on-surface font-label-sm text-[12px] rounded-full">
              Today
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-h2 text-h2 text-on-surface">{loading ? "..." : todayCount}</h3>
            <p className="font-label-sm text-[12px] text-outline mt-1">{loading ? "..." : `${thisWeekCount} this week`}</p>
          </div>
        </div>

        {/* Card 3: New Leads */}
        <div className="col-span-12 md:col-span-4 bg-primary text-on-primary rounded-xl p-lg shadow-[0_8px_24px_rgba(0,102,111,0.15)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(45deg,transparent_20%,rgba(255,255,255,0.1)_50%,transparent_80%)] opacity-50"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-label-sm text-label-sm text-on-primary/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                visibility
              </span>
              Profile Views
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-h2 text-h2 text-on-primary">{loading ? "..." : popularCount}</h3>
            <p className="font-label-sm text-[12px] text-on-primary/70 mt-1">
              From social channels
            </p>
          </div>
        </div>

        {/* Middle Row: Social Hub & Today's Schedule */}
        {/* Your Booking Link */}
        <div className="col-span-12 lg:col-span-8 bg-white/60 backdrop-blur-[20px] rounded-xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,102,111,0.06)] flex flex-col overflow-hidden h-[400px]">
          <div className="px-lg py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest/50">
            <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined fill text-primary">
                link
              </span>
              Your Booking Link
            </h3>
          </div>
          <div className="flex-1 p-lg flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">
                public
              </span>
            </div>
            <h4 className="font-h2 text-h2 text-on-surface mb-2">Share your link to get booked</h4>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-8">
              Post this link in your Instagram bio, send it in DMs, or add it to your website to let clients book you instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mx-auto">
              <div className="flex-1 bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface font-body-md truncate w-full text-left select-all">
                {businessSlug ? `scheduly.com/b/${businessSlug}` : "scheduly.com/b/your-business"}
              </div>
              <button className="bg-primary hover:bg-primary-container text-on-primary font-button px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform active:scale-95 flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                Copy Link
              </button>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button className="text-outline hover:text-primary transition-colors flex flex-col items-center gap-1">
                <span className="material-symbols-outlined">qr_code_2</span>
                <span className="text-[12px] font-medium">Get QR Code</span>
              </button>
              <button className="text-outline hover:text-primary transition-colors flex flex-col items-center gap-1">
                <span className="material-symbols-outlined">open_in_new</span>
                <span className="text-[12px] font-medium">Preview Page</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="col-span-12 lg:col-span-4 bg-white/60 backdrop-blur-[20px] rounded-xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,102,111,0.06)] flex flex-col h-[400px]">
          <div className="px-lg py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest/50">
            <h3 className="font-h3 text-h3 text-on-surface">Schedule</h3>
            <button className="text-primary hover:bg-primary/10 p-1 rounded-full transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
                    <div className="flex-1 overflow-y-auto p-lg relative">
            <div className="absolute left-[39px] top-lg bottom-lg w-px bg-outline-variant/30"></div>
            <div className="flex flex-col gap-6 relative">
              {loading ? (
                <div className="text-center text-outline-variant py-8">Loading schedule...</div>
              ) : stats?.todaysBookings?.length === 0 ? (
                <div className="text-center text-outline-variant py-8">No appointments scheduled for today.</div>
              ) : (
                stats?.todaysBookings?.map((booking: any, i: number) => {
                  const startTime = booking.startTime.substring(0, 5); // Format HH:MM from HH:MM:SS
                  
                  // Alternate styling slightly for variety just like the static template
                  const isPrimary = i % 2 === 0;
                  
                  return (
                    <div key={booking.id} className="flex gap-4 relative">
                      <div className={`w-14 shrink-0 text-right font-label-sm text-label-sm pt-1 ${isPrimary ? 'text-primary' : 'text-outline'}`}>
                        {startTime}
                      </div>
                      <div className={`w-3 h-3 rounded-full absolute left-[34px] top-2 outline outline-4 outline-surface-container-lowest shadow-sm z-10 ${isPrimary ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                      
                      <div className={`flex-1 p-3 rounded-lg border transition-colors ${isPrimary ? 'bg-surface-container-low border-primary/20 shadow-sm relative overflow-hidden' : 'border-transparent hover:bg-surface-container-lowest/50'}`}>
                        {isPrimary && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                        
                        <h4 className={`font-label-sm text-label-sm mb-1 ${isPrimary ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {booking.service?.name || 'Service'}
                        </h4>
                        <p className={`text-[12px] flex items-center gap-1 ${isPrimary ? 'text-on-surface-variant mb-2' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            person
                          </span>
                          {booking.customer?.name || 'Client'}
                        </p>
                        
                        {isPrimary && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-medium tracking-wide uppercase">
                            Confirmed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Lead Growth Chart */}
        <div className="col-span-12 bg-white/60 backdrop-blur-[20px] rounded-xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,102,111,0.06)] p-lg flex flex-col h-[300px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-h3 text-h3 text-on-surface mb-1">Bookings & Views</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Past 30 Days across all channels
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-[12px] text-outline font-medium">Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                <span className="text-[12px] text-outline font-medium">Profile Views</span>
              </div>
            </div>
          </div>
          {/* Chart Area */}
          <div className="flex-1 relative w-full h-full border-b border-l border-outline-variant/30">
            <div className="absolute -left-8 bottom-0 text-[10px] text-outline">
              0
            </div>
            <div className="absolute -left-8 top-1/2 text-[10px] text-outline">
              50
            </div>
            <div className="absolute -left-8 top-0 text-[10px] text-outline">
              100
            </div>
            <div className="absolute left-0 w-full top-1/2 h-px bg-outline-variant/10 border-dashed border-t"></div>
            <div className="absolute left-0 w-full top-0 h-px bg-outline-variant/10 border-dashed border-t"></div>
            <svg
              className="absolute bottom-0 left-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient
                  id="gradientPrimary"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--tw-colors-primary)"
                    stopOpacity="0.2"
                  ></stop>
                  <stop
                    offset="100%"
                    stopColor="var(--tw-colors-primary)"
                    stopOpacity="0"
                  ></stop>
                </linearGradient>
              </defs>
              <path
                d="M0,80 Q20,70 40,50 T80,30 T100,10 L100,100 L0,100 Z"
                fill="url(#gradientPrimary)"
              ></path>
              <path
                d="M0,80 Q20,70 40,50 T80,30 T100,10"
                fill="none"
                stroke="var(--tw-colors-primary)"
                strokeLinecap="round"
                strokeWidth="2"
              ></path>
              <path
                d="M0,90 Q30,85 50,60 T90,50 T100,40"
                fill="none"
                stroke="var(--tw-colors-tertiary)"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeWidth="2"
              ></path>
              <circle
                cx="80"
                cy="30"
                r="3"
                fill="white"
                stroke="var(--tw-colors-primary)"
                strokeWidth="2"
              ></circle>
            </svg>
            <div className="absolute left-[80%] top-[20%] -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded text-[10px] font-medium shadow-md">Oct 18: 12 Bookings</div>
          </div>
        </div>
      </div>
    </>
  );
}
