'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  address: string;
  logoUrl: string | null;
}

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Prisma Categories Map for Frontend matching
  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Barbers', value: 'BARBERSHOP' },
    { label: 'Salons', value: 'SALON' },
    { label: 'Wellness', value: 'YOGA_STUDIO' }, // Mapped YOGA_STUDIO to Wellness for simplicity
    { label: 'Education', value: 'TUTORING' },
    { label: 'Fitness', value: 'GYM' },
    { label: 'Sports', value: 'FOOTBALL_PITCH' },
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const res = await api.get('/businesses?limit=100');
        setBusinesses(res.data?.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch businesses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.description &&
        b.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const mappedCategory = categories.find(
      (c) => c.label === activeCategory,
    )?.value;
    const matchesCategory =
      activeCategory === 'All' || b.category === mappedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-xl shadow-[#35858E]/5 border-b border-[#35858E]/10 antialiased tracking-tight transition-all duration-300">
        <div className="flex justify-between items-center px-8 h-20 max-w-full">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <span className="material-symbols-outlined fill text-primary text-3xl group-hover:scale-110 transition-transform duration-300">
              forest
            </span>
            <span className="text-2xl font-extrabold text-[#35858E]">
              VerdantBook
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="nav-link text-[#475569] font-medium transition-colors hover:text-primary relative"
              href="/#features"
            >
              Features
            </Link>
            <Link
              className="nav-link text-primary font-bold border-b-2 border-primary pb-1"
              href="/explore"
            >
              Explore
            </Link>
            <Link
              className="nav-link text-[#475569] font-medium transition-colors hover:text-primary relative"
              href="/#pricing"
            >
              Pricing
            </Link>
            <Link
              className="nav-link text-[#475569] font-medium transition-colors hover:text-primary relative"
              href="/#faq"
            >
              FAQ
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block font-button text-button text-[#35858E] hover:text-primary-container transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="font-button text-button bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-full shadow-md shadow-primary/20 hover:shadow-[0_0_25px_rgba(190,234,204,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col w-full pt-20">
        {/* Hero Section */}
        <section className="w-full bg-surface-container-low py-16 md:py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-surface-bright/50 to-transparent pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center relative z-10">
            <h1 className="font-h1 text-h1 text-on-surface mb-6 max-w-3xl">
              Discover Your Next Experience
            </h1>

            {/* Search Bar */}
            <div className="w-full max-w-2xl bg-surface-container-lowest rounded-full shadow-sm border border-outline-variant/30 flex items-center p-2 mb-8 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
              <span className="material-symbols-outlined text-outline ml-4 mr-2">
                search
              </span>
              <input
                className="flex-grow bg-transparent border-none focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant/80 px-2 h-12 outline-none"
                placeholder="What are you looking for?"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-primary text-on-primary rounded-full px-8 py-3 font-button text-button hover:bg-primary-container transition-colors duration-200 h-full">
                Search
              </button>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`px-6 py-2 rounded-full font-label-sm text-label-sm transition-colors duration-200 border ${
                    activeCategory === cat.label
                      ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-outline-variant/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Browse Layout */}
        <section className="max-w-[1920px] mx-auto w-full px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-surface-container-lowest/60 backdrop-blur-md rounded-xl p-lg border border-outline-variant/20 shadow-[0_4px_24px_-4px_rgba(0,102,111,0.05)] sticky top-28">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">
                  tune
                </span>
                <h2 className="font-h3 text-h3 text-on-surface">Filters</h2>
              </div>

              {/* Availability Filter */}
              <div className="mb-8">
                <h3 className="font-label-sm text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">
                  Availability
                </h3>
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
                  <span className="font-body-md text-body-md text-on-surface">
                    Available Today
                  </span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                      defaultChecked
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-surface-container appearance-none cursor-pointer checked:right-0 checked:border-primary checked:bg-primary"
                      id="toggle1"
                      name="toggle"
                      type="checkbox"
                    />
                    <label
                      className="toggle-label block overflow-hidden h-5 rounded-full bg-outline-variant/30 cursor-pointer"
                      htmlFor="toggle1"
                    ></label>
                  </div>
                </label>
              </div>

              {/* Verified Badge Filter */}
              <div>
                <h3 className="font-label-sm text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">
                  Quality
                </h3>
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <input
                    defaultChecked
                    className="text-primary focus:ring-primary h-5 w-5 rounded border-primary/30"
                    type="checkbox"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      Platform Verified
                    </span>
                    <span className="text-xs text-on-surface-variant opacity-80">
                      Top rated businesses
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </aside>

          {/* Business Grid Area */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Showing{' '}
                <span className="font-semibold text-on-surface">
                  {filteredBusinesses.length}
                </span>{' '}
                results
              </p>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Sort by:
                </span>
                <select className="bg-transparent border-none font-label-sm text-label-sm text-primary font-semibold focus:ring-0 cursor-pointer p-0 pr-4">
                  <option>Recommended</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
                  search_off
                </span>
                <h3 className="font-h3 text-on-surface mb-2">
                  No businesses found
                </h3>
                <p className="text-on-surface-variant">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBusinesses.map((business) => (
                  <article
                    key={business.id}
                    className="glass-panel bg-surface-container-lowest/80 rounded-xl overflow-hidden border-outline-variant/20 hover:shadow-[0_8px_30px_-4px_rgba(0,102,111,0.12)] transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Link href={`/b/${business.slug}`}>
                        <Image
                          width={800}
                          height={600}
                          alt={business.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          src={
                            business.logoUrl ||
                            'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
                          }
                        />
                      </Link>
                      <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <span
                          className="material-symbols-outlined text-sm text-[#f59e0b]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-label-sm text-label-sm font-bold text-on-surface">
                          5.0
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 bg-primary text-on-primary p-1.5 rounded-full shadow-sm cursor-pointer hover:bg-primary-container transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          favorite
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-label-sm text-xs tracking-wider uppercase text-secondary mb-1 block">
                            {business.category.replace('_', ' ')}
                          </span>
                          <Link href={`/b/${business.slug}`}>
                            <h3 className="font-h3 text-h3 text-on-surface leading-tight group-hover:text-primary transition-colors cursor-pointer">
                              {business.name}
                            </h3>
                          </Link>
                        </div>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2">
                        {business.description || 'No description provided.'}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-outline-variant/20 pt-4">
                        <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[18px]">
                            location_on
                          </span>
                          <span>{business.city}</span>
                        </div>
                        <Link
                          href={`/b/${business.slug}`}
                          className="font-button text-button bg-primary text-on-primary px-8 py-2.5 rounded-lg hover:bg-primary-container transition-colors active:scale-95 shadow-sm text-center"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 w-full py-12 border-t border-slate-200 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="material-symbols-outlined fill text-primary group-hover:scale-110 transition-transform duration-300">
                forest
              </span>
              <span className="text-sm font-semibold text-slate-900">
                VerdantBook
              </span>
            </Link>
            <p className="font-sans text-xs uppercase tracking-widest text-[#35858E]">
              © 2024 VerdantBook. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end">
            <Link
              className="font-sans text-xs uppercase tracking-widest text-slate-400 hover:text-[#35858E] underline-offset-4 opacity-100 hover:opacity-80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#35858E] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right hover:after:origin-left"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="font-sans text-xs uppercase tracking-widest text-slate-400 hover:text-[#35858E] underline-offset-4 opacity-100 hover:opacity-80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#35858E] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right hover:after:origin-left"
              href="#"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
