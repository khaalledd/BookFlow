'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Scissors,
  Dumbbell,
  GraduationCap,
  Flower2,
  BarChart3,
  Globe,
  ShieldCheck,
  Search,
  MapPin,
} from 'lucide-react';

type BusinessCategory =
  | 'BARBERSHOP'
  | 'SALON'
  | 'GYM'
  | 'FOOTBALL_PITCH'
  | 'TUTORING'
  | 'YOGA_STUDIO'
  | 'OTHER';

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: BusinessCategory;
  city: string;
  address: string;
  phone: string;
  logoUrl?: string;
}

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Features', href: '#features' },
  { label: 'Browse', href: '#browse' },
];

const chaosItems = [
  'Double bookings from simultaneous WhatsApp messages.',
  'Losing client context across long chat threads.',
  'Spending evenings replying to repetitive scheduling questions.',
];

const orderItems = [
  'Real-time availability synchronized across devices.',
  'Automated reminders that reduce no-shows.',
  'A polished booking link for your social profile and website.',
];

const featureCards = [
  {
    icon: CalendarDays,
    title: 'Unified Calendar',
    body: 'A scheduling experience that stays fast and clear even on busy weeks.',
  },
  {
    icon: Globe,
    title: 'Multi-Link Booking',
    body: 'One URL for Instagram, TikTok, and Facebook where clients book instantly.',
  },
  {
    icon: BarChart3,
    title: 'Growth Insights',
    body: 'Track your top services and peak days with actionable analytics.',
  },
  {
    icon: ShieldCheck,
    title: 'Atomic Booking Engine',
    body: 'Concurrency-safe booking logic protects your calendar from conflicts.',
  },
];

const useCases = [
  { icon: Scissors, label: 'Barbershops' },
  { icon: Dumbbell, label: 'Gyms' },
  { icon: GraduationCap, label: 'Tutors' },
  { icon: Flower2, label: 'Studios' },
];

const categoryOptions: { label: string; value: '' | BusinessCategory }[] = [
  { label: 'All Categories', value: '' },
  { label: 'Barbershop', value: 'BARBERSHOP' },
  { label: 'Salon', value: 'SALON' },
  { label: 'Gym', value: 'GYM' },
  { label: 'Football Pitch', value: 'FOOTBALL_PITCH' },
  { label: 'Tutoring', value: 'TUTORING' },
  { label: 'Yoga Studio', value: 'YOGA_STUDIO' },
  { label: 'Other', value: 'OTHER' },
];

const cityOptions = ['All Cities', 'Cairo', 'Giza', 'Alexandria', 'Mansoura'];

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [category, setCategory] = useState<'' | BusinessCategory>('');
  const [city, setCity] = useState('All Cities');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchBusinesses = useCallback(
    async (nextPage = 1) => {
      setLoadingBusinesses(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(nextPage));
        params.set('limit', '6');
        if (city && city !== 'All Cities') {
          params.set('city', city);
        }
        if (category) {
          params.set('category', category);
        }

        const res = await api.get(`/businesses?${params.toString()}`);
        const payload = res.data.data || res.data;
        const list: Business[] = payload?.data || [];
        const incomingMeta = payload?.meta || {
          page: 1,
          totalPages: 1,
          total: list.length,
        };

        setBusinesses(list);
        setMeta(incomingMeta);
        setPage(incomingMeta.page || nextPage);
      } catch (err) {
        console.error('Failed to fetch businesses', err);
        setBusinesses([]);
        setMeta({ page: 1, totalPages: 1, total: 0 });
      } finally {
        setLoadingBusinesses(false);
      }
    },
    [category, city],
  );

  useEffect(() => {
    fetchBusinesses(1);
  }, [fetchBusinesses]);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const visibleBusinesses = useMemo(() => {
    if (!search.trim()) return businesses;
    const q = search.toLowerCase();
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q),
    );
  }, [businesses, search]);

  return (
    <main className="min-h-screen text-foreground">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .reveal-base {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        [data-reveal].reveal-in .reveal-base,
        [data-reveal].reveal-in.reveal-base {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className="font-heading text-lg font-extrabold uppercase tracking-tight text-foreground md:text-xl"
          >
            BookFlow
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold tracking-tight text-muted-foreground md:flex">
            {navLinks.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                className={
                  idx === 0
                    ? 'relative pb-1 text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary'
                    : 'transition-colors hover:text-primary'
                }
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
                <Button
                  asChild
                  className="h-10 px-5 font-bold text-primary-foreground"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                className="border-white/20 bg-transparent"
              >
                <Link
                  href={
                    user?.role === 'BUSINESS_OWNER' ? '/dashboard' : '/profile'
                  }
                >
                  Go to{' '}
                  {user?.role === 'BUSINESS_OWNER'
                    ? 'Dashboard'
                    : 'My Bookings'}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <section
        id="platform"
        className="relative overflow-hidden px-5 pb-32 pt-32 md:px-8 md:pt-44"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_30%,rgba(82,242,245,0.13)_0%,transparent_100%)]" />
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/10 blur-[110px]" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-accent/10 blur-[110px]" />

        <div className="mx-auto w-full max-w-5xl text-center" data-reveal>
          <div className="reveal-base">
            <span className="mb-7 inline-flex rounded-full border border-primary/25 bg-[#1d2539]/45 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              Efficiency Redefined
            </span>
            <h1 className="mb-8 font-heading text-5xl font-extrabold leading-[0.98] tracking-tight text-foreground md:text-8xl">
              End the booking chaos.
              <br />
              <span className="text-primary italic">Architect</span> your
              growth.
            </h1>
            <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Transition from fragmented chats and missed calls to an elegant,
              automated scheduling system built for modern service teams.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="xl"
                className="h-14 w-full max-w-xs px-8 text-xs font-extrabold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(82,242,245,0.35)] transition-all hover:shadow-[0_0_45px_rgba(82,242,245,0.55)]"
              >
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="h-14 w-full max-w-xs border-white/20 bg-[#1d2539]/50 px-8 text-xs font-extrabold uppercase tracking-[0.2em] transition-all hover:border-primary/35 hover:bg-[#1d2539]/75"
              >
                <a href="#browse">Browse Businesses</a>
              </Button>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  No-Shows
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-primary">
                  -80%
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Bookings
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-primary">
                  24/Day
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Client Return
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-primary">
                  +38%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="solutions"
        className="border-y border-white/10 bg-card/25 px-5 py-20 md:px-8 md:py-24"
      >
        <div className="mx-auto w-full max-w-7xl" data-reveal>
          <div className="mb-14 text-center md:mb-20 reveal-base">
            <h2 className="mb-4 font-heading text-3xl font-extrabold uppercase tracking-tight">
              The Evolution of Scheduling
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
              Why service businesses are moving from chat-based bookings to a
              proper operations platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-10 reveal-base">
            <div className="rounded-lg border border-red-400/20 bg-[#12192a]/55 p-8 md:p-10">
              <h3 className="mb-8 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-red-300">
                <CircleAlert className="h-4 w-4" />
                The Chaos
              </h3>
              <ul className="space-y-5 text-sm text-muted-foreground">
                {chaosItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-primary/30 bg-[#1d2539]/65 p-8 shadow-[inset_0_1px_1px_rgba(82,242,245,0.12)] md:p-10">
              <h3 className="mb-8 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-primary">
                <CheckCircle2 className="h-4 w-4" />
                The Fluid Order
              </h3>
              <ul className="space-y-5 text-sm text-foreground/90">
                {orderItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-7xl" data-reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end reveal-base">
            <div className="max-w-xl">
              <h2 className="mb-3 font-heading text-4xl font-extrabold uppercase tracking-tight">
                Precision Tools
              </h2>
              <p className="text-sm text-muted-foreground">
                Everything needed to run scheduling, customer flow, and daily
                operations in one place.
              </p>
            </div>
            <a
              href="#browse"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary transition-all hover:gap-3"
            >
              Browse Live Businesses <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 reveal-base">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group rounded-lg border border-white/10 bg-card/50 p-7 transition-all hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 bg-[#1d2539] transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-bold uppercase tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="browse"
        className="border-y border-white/10 bg-card/25 px-5 py-20 md:px-8 md:py-24"
      >
        <div className="mx-auto w-full max-w-7xl" data-reveal>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between reveal-base">
            <div>
              <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                Browse Businesses
              </h2>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              {meta.total} result{meta.total === 1 ? '' : 's'}
            </p>
          </div>

          <div className="mb-8 grid gap-3 md:grid-cols-4 reveal-base">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by business name, city, or description"
                className="h-12 border-white/15 bg-black/30 pl-10 text-sm md:text-base"
              />
            </div>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as '' | BusinessCategory)
              }
              className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {categoryOptions.map((opt) => (
                <option
                  key={opt.label}
                  value={opt.value}
                  className="bg-background"
                >
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {cityOptions.map((c) => (
                <option key={c} value={c} className="bg-background">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {loadingBusinesses ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-lg border border-white/10 bg-black/20"
                />
              ))}
            </div>
          ) : visibleBusinesses.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-black/20 p-10 text-center">
              <p className="text-muted-foreground">
                No businesses found for your current filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 reveal-base">
              {visibleBusinesses.map((business) => (
                <Link
                  key={business.id}
                  href={`/b/${business.slug}`}
                  className="group rounded-lg border border-white/10 bg-black/25 p-5 transition-all hover:-translate-y-1 hover:border-primary/45 hover:bg-black/35"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-heading text-xl font-bold text-foreground">
                        {business.name}
                      </h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.13em] text-primary">
                        {business.category.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/10 bg-card text-primary">
                      <Scissors className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {business.description ||
                      'Premium service business on BookFlow.'}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {business.city}
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-primary">
                    Open Booking Page <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3 reveal-base">
            <Button
              variant="outline"
              className="border-white/20"
              disabled={page <= 1 || loadingBusinesses}
              onClick={() => fetchBusinesses(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {meta.page} / {Math.max(meta.totalPages, 1)}
            </span>
            <Button
              variant="outline"
              className="border-white/20"
              disabled={page >= meta.totalPages || loadingBusinesses}
              onClick={() => fetchBusinesses(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#1d2539]/20 px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-7xl text-center" data-reveal>
          <h2 className="mb-14 font-heading text-2xl font-extrabold uppercase tracking-[0.2em] text-muted-foreground reveal-base">
            Built for your specific craft
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 reveal-base">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group flex flex-col items-center gap-4"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-card/60 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-primary">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-8 md:py-28">
        <div
          className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-card/70 p-10 text-center shadow-[0_0_80px_rgba(82,242,245,0.08)] md:p-16"
          data-reveal
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,242,245,0.15)_0%,transparent_70%)]" />
          <div className="relative z-10 reveal-base">
            <h2 className="mb-6 font-heading text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
              Ready to reclaim your time?
            </h2>
            <p className="mx-auto mb-9 max-w-2xl text-base text-muted-foreground md:text-lg">
              Join growing service teams using BookFlow to automate bookings and
              deliver a premium client experience.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="h-12 px-8 text-xs font-black uppercase tracking-[0.2em]"
              >
                <Link href="/register">Get Started Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 border-white/20 bg-[#1d2539]/45 px-8 text-xs font-black uppercase tracking-[0.2em]"
              >
                <a href="#browse">Browse Businesses</a>
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> No credit card
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> 14-day free
                trial
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-background px-5 py-12 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <div className="mb-1 font-heading text-lg font-bold uppercase tracking-tight text-foreground">
              BookFlow
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 BookFlow. Built for precision service teams.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Security
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Status
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
