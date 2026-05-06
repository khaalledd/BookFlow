'use client';
import Image from 'next/image';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isHydrated, setUser } = useAuth();
  const [checked, setChecked] = useState(false);
  const meFetchedRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (
      !isAuthenticated ||
      (user?.role !== 'BUSINESS_OWNER' && user?.role !== 'ADMIN')
    ) {
      router.push('/login');
    } else {
      setChecked(true);

      if (!meFetchedRef.current) {
        meFetchedRef.current = true;
        api
          .get('/auth/me')
          .then((res) => {
            const me = res.data.data || res.data;
            if (me?.id) setUser(me);
          })
          .catch((err) => {
            console.error('Failed to refresh current user', err);
          });
      }
    }
  }, [isHydrated, isAuthenticated, user, router, setUser]);

  if (!isHydrated || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/dashboard/business', label: 'Business', icon: 'storefront' },
    { href: '/dashboard/bookings', label: 'Bookings', icon: 'event_note' },
    {
      href: '/dashboard/availability',
      label: 'Calendar',
      icon: 'calendar_month',
    },
    { href: '/dashboard/services', label: 'Services', icon: 'inventory_2' },
  ];

  return (
    <div className="flex h-screen bg-surface-container-low overflow-hidden">
      {/* SideNavBar Component */}
      <aside className="flex flex-col h-full py-6 px-4 fixed left-0 top-0 w-64 bg-white border-r border-outline-variant/40 shadow-sm z-50 transition-colors duration-200 ease-out">
        {/* Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-outline-variant/30">
            <Image width={40} height={40}
              alt="Business Owner"
              className="w-full h-full object-cover"
              src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBO0N69FtsBkCbiTZ0ftfa6e886BgpQ_jCL2VVBxdS-EcFDSaPwtPZtsBg62aYpcIHv-B_6MztyyONBdkcnP47tLWMuiwVnLmf_c7lRZmz-VlPk6nXMboj1E9uOI7r5firUn8gYvlS8yw1IQeHnopIPKHdt5YYTPk7iwICnHrSBqHdZiJgIntePfHFKZTtQlyj1AMvzPz8zlUqexSlSMAFxAlagdpsuEKTky6h7m6R2Qcy6hUX1cb7bVHkbZKjcq8w5VaorB9EhRXQ-"}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#35858E] leading-tight">
              Owner Portal
            </span>
            <span className="text-sm font-medium text-slate-500 leading-tight">
              Manage Bookings
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="px-2 mb-6">
          <button className="w-full bg-primary hover:bg-surface-tint text-on-primary font-button text-button py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Appointment
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? 'flex items-center gap-3 px-3 py-2.5 bg-[#35858E]/10 text-[#35858E] rounded-lg text-sm font-medium transition-all duration-200 ease-out'
                    : 'flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-[#35858E]/5 rounded-lg text-sm font-medium transition-all duration-200 ease-out'
                }
              >
                <span
                  className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div className="mt-auto pt-4 border-t border-[#35858E]/10 flex flex-col gap-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-[#35858E]/5 rounded-lg text-sm font-medium transition-all duration-200 ease-out"
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-error-container hover:text-error rounded-lg text-sm font-medium transition-all duration-200 ease-out"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-xl max-w-max-width mx-auto">{children}</div>
      </main>
    </div>
  );
}
