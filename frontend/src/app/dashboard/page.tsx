'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getMyBusiness } from '@/lib/business';

export default function DashboardOverview() {
  const { user } = useAuth();
  const router = useRouter();

  const [business, setBusiness] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // 1. We need to find the business owned by this user
        const myBiz = await getMyBusiness(user?.id);

        if (!myBiz) {
          setLoading(false);
          return; // No business created yet
        }

        setBusiness(myBiz);

        // 2. Load Dashboard Stats
        const dashRes = await api.get(`/businesses/${myBiz.id}/dashboard`);
        setDashboardData(dashRes.data.data || dashRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadDashboard();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="h-4 bg-white/10 rounded w-1/4"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <Card className="bg-card/30 border-white/10 p-10 text-center">
        <CardTitle className="mb-4 text-2xl font-heading text-primary">
          Welcome to BookFlow
        </CardTitle>
        <p className="text-muted-foreground mb-6">
          Before you can manage bookings, you need to set up your business
          profile.
        </p>
        <Button onClick={() => router.push('/dashboard/business')}>
          Create My Business Profile
        </Button>
      </Card>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading tracking-tight mb-8">
        Hello, {user?.name.split(' ')[0]}
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/40 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today&apos;s Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.todayCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.thisWeekCount}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.thisMonthCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/40 border-white/10">
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.popularServices?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No bookings yet to determine popular services.
              </p>
            )}
            <ul className="space-y-4">
              {dashboardData.popularServices?.map((s: any) => (
                <li
                  key={s.serviceId}
                  className="flex justify-between items-center bg-black/20 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Scissors className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <span className="text-primary font-bold">
                    {s.count} bookings
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Today's Schedule preview could go here */}
        <Card className="bg-card/40 border-white/10">
          <CardHeader>
            <CardTitle>Upcoming Today</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.todaysBookings?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Break time! You have no upcoming bookings today.
              </p>
            ) : (
              <div className="space-y-4">
                {dashboardData.todaysBookings
                  ?.slice(0, 5)
                  .map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{booking.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.service.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">
                          {booking.startTime}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
