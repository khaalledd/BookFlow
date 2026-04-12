'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import {
  Store,
  Calendar,
  Clock,
  LogOut,
  Scissors,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    // Wait for hydration before checking auth
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

  // Show loading while hydrating or checking auth
  if (!isHydrated || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/business', label: 'My Business', icon: Store },
    { href: '/dashboard/services', label: 'Services', icon: Scissors },
    { href: '/dashboard/availability', label: 'Schedule', icon: Clock },
    { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-card/30 backdrop-blur-md flex flex-col p-4">
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-heading font-semibold text-primary">
            BookFlow
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Owner Portal</p>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-black/40">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
