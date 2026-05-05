'use client';
import Image from 'next/image';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const faqs = [
  {
    question: 'Do I need my own website?',
    answer:
      'No. VerdantBook provides a polished booking page that you can link directly in your Instagram, TikTok, or Twitter bio.',
  },
  {
    question: 'Does it sync with my current calendar?',
    answer:
      'Yes. VerdantBook seamlessly syncs with Google Calendar, Apple Calendar, and Outlook to ensure you never get double-booked.',
  },
  {
    question: 'How do I collect payments?',
    answer:
      'You can securely accept payments upfront via Stripe, Apple Pay, and Google Pay. You keep 100% of your earnings minus standard credit card processing fees.',
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="glass-panel bg-surface-container-lowest/40 backdrop-blur-xl border border-outline-variant/30 rounded-2xl overflow-hidden transition-all duration-300"
        >
          <button
            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <span
              className={`font-h3 text-h3 text-lg transition-colors duration-300 ${openIndex === idx ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}
            >
              {faq.question}
            </span>
            <span
              className={`material-symbols-outlined transition-transform duration-300 ${openIndex === idx ? 'text-primary rotate-180' : 'text-on-surface-variant group-hover:text-primary'}`}
            >
              expand_more
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="px-6 pb-6 pt-0 text-on-surface-variant font-body-md">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
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

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .reveal-base {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 0.65s ease,
            transform 0.65s ease;
        }
        [data-reveal].reveal-in .reveal-base,
        [data-reveal].reveal-in.reveal-base {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-[#35858E]/5 border-b border-[#35858E]/10 antialiased tracking-tight transition-all duration-300">
        <div className="flex justify-between items-center px-8 h-20 max-w-full">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="material-symbols-outlined fill text-primary text-3xl">
              forest
            </span>
            <span className="text-2xl font-extrabold text-[#35858E]">
              VerdantBook
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="nav-link" href="#features">
              Features
            </a>
            <a className="nav-link" href="#pricing">
              Pricing
            </a>
            <a className="nav-link" href="#testimonials">
              Reviews
            </a>
            <a className="nav-link" href="#faq">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 font-button text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20 hover:border-primary/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                travel_explore
              </span>
              Explore
            </Link>
            <Link
              href="/login"
              className="hidden md:block font-button text-button text-[#35858E] hover:text-primary-container transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="font-button text-button bg-primary text-on-primary px-6 py-3 rounded-full shadow-sm hover:bg-surface-tint active:scale-95 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-y-28">
        <section
          id="hero"
          className="grid grid-cols-1 lg:grid-cols-[0.88fr_1.12fr] gap-10 lg:gap-14 items-center min-h-[calc(100vh-7rem)] pt-6"
          data-reveal
        >
          <div className="space-y-7 text-left">
            <div className="reveal-base inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-secondary-container/70 text-primary font-label-sm text-label-sm shadow-sm cursor-default">
              <span className="material-symbols-outlined text-sm">
                notifications_off
              </span>
              End the DM madness
            </div>
            <h1 className="reveal-base font-h1 text-h1 sm:text-5xl md:text-6xl text-on-background max-w-3xl leading-tight">
              Stop managing bookings{' '}
              <span className="text-gradient">in social chaos.</span>
            </h1>
            <p className="reveal-base font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Move clients from DMs to a structured booking experience.
              VerdantBook brings deep calm to your daily schedule and gives
              every business a polished page plus a focused dashboard.
            </p>
            <div className="reveal-base flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/register"
                className="bg-primary text-on-primary font-button text-button px-8 py-4 rounded-full hover:bg-surface-tint active:scale-95 transition-all flex items-center gap-2 w-full sm:w-auto justify-center duration-200 shadow-sm"
              >
                Claim your free page
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/explore"
                className="font-button text-button border border-secondary text-secondary px-8 py-4 rounded-full hover:bg-secondary-container transition-colors duration-200 w-full sm:w-auto text-center"
              >
                See it in action
              </Link>
            </div>

            <div className="reveal-base flex flex-wrap items-center gap-x-6 gap-y-3 text-on-surface-variant/70 font-label-sm text-label-sm pt-2">
              <span>Trusted by 10,000+ professionals</span>
              <div className="hidden sm:block h-4 w-px bg-outline-variant/40"></div>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d17842]"></span>
                Wellness, salons, coaching, fitness
              </span>
            </div>
          </div>

          <div className="reveal-base relative">
            <div className="rounded-2xl border border-outline-variant/40 bg-white shadow-xl shadow-[#00666f]/10 overflow-hidden">
              <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#d17842]"></span>
                  <span className="h-3 w-3 rounded-full bg-secondary"></span>
                  <span className="h-3 w-3 rounded-full bg-primary"></span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  verdantbook.com/b/luna-studio
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-[#f8fbf4] p-6 border-b md:border-b-0 md:border-r border-outline-variant/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined fill">
                        spa
                      </span>
                    </div>
                    <div>
                      <h3 className="font-h3 text-xl text-on-surface">
                        Luna Studio
                      </h3>
                      <p className="font-label-sm text-on-surface-variant">
                        Massage and recovery
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Deep Tissue Massage',
                      'Reset Facial',
                      'Coaching Call',
                    ].map((service, index) => (
                      <div
                        key={service}
                        className={`rounded-xl border p-4 ${
                          index === 0
                            ? 'border-primary/40 bg-white shadow-sm'
                            : 'border-outline-variant/30 bg-white/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-label-sm text-on-surface">
                              {service}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-1">
                              {index === 2 ? '45 min' : '60 min'}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              index === 1 ? 'text-[#8a5b1f]' : 'text-primary'
                            }`}
                          >
                            ${index === 1 ? '65' : index === 2 ? '90' : '80'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="font-label-sm text-on-surface-variant">
                        Dashboard
                      </p>
                      <h3 className="font-h3 text-xl text-on-surface">
                        Today&apos;s flow
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#f8dfc8] px-3 py-1 text-xs font-bold text-[#7a421d]">
                      8 booked
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      ['Bookings', '24'],
                      ['Revenue', '$840'],
                      ['Views', '1.2k'],
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        className={`rounded-xl border border-outline-variant/30 p-3 ${
                          index === 1
                            ? 'bg-[#f7fbeb]'
                            : 'bg-surface-container-low'
                        }`}
                      >
                        <p className="text-[11px] text-on-surface-variant">
                          {label}
                        </p>
                        <p className="font-h3 text-lg text-on-surface">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      ['09:00', 'Maya R.', 'Reset Facial'],
                      ['10:30', 'Jon Bell', 'Deep Tissue'],
                      ['13:00', 'Nora K.', 'Coaching Call'],
                    ].map(([time, name, service], index) => (
                      <div
                        key={`${time}-${name}`}
                        className="grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-xl border border-outline-variant/30 bg-white px-3 py-3"
                      >
                        <span className="text-xs font-bold text-primary">
                          {time}
                        </span>
                        <div>
                          <p className="font-label-sm text-on-surface">
                            {name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {service}
                          </p>
                        </div>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            index === 1 ? 'bg-[#d17842]' : 'bg-secondary'
                          }`}
                        ></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="space-y-16" data-reveal>
          <div className="reveal-base text-center max-w-2xl mx-auto">
            <h2 className="font-h2 text-h2 text-on-background mb-4">
              From Chaos to Clarity
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Transform a fragmented workflow into a seamless client journey.
            </p>
          </div>
          <div className="reveal-base grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#d17842]/40 transition-colors duration-300">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#f8dfc8] flex items-center justify-center mb-6 transition-colors duration-300">
                  <span className="material-symbols-outlined text-error">
                    forum
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-background mb-3">
                  The Old Way
                </h3>
                <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-error text-sm mt-1">
                      close
                    </span>
                    Losing track of requests in DMs.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-error text-sm mt-1">
                      close
                    </span>
                    Back-and-forth &quot;when are you free?&quot; texts.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-error text-sm mt-1">
                      close
                    </span>
                    No-shows because of missed reminders.
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 glass-panel rounded-2xl p-xl flex flex-col justify-between relative overflow-hidden group border-primary/20 hover:border-primary/40 transition-colors duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full relative z-10">
                <div className="flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center mb-6 transition-colors duration-300">
                    <span className="material-symbols-outlined text-primary fill">
                      hub
                    </span>
                  </div>
                  <h3 className="font-h3 text-h3 text-on-background mb-3">
                    The Social Hub
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    One link in your bio. All your services, availability, and
                    payments handled automatically.
                  </p>
                  <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                    <li className="flex items-center gap-2 group/item">
                      <span className="material-symbols-outlined text-primary text-sm">
                        check_circle
                      </span>
                      Unified inbox for all inquiries
                    </li>
                    <li className="flex items-center gap-2 group/item">
                      <span className="material-symbols-outlined text-primary text-sm">
                        check_circle
                      </span>
                      Automated SMS &amp; Email reminders
                    </li>
                    <li className="flex items-center gap-2 group/item">
                      <span className="material-symbols-outlined text-primary text-sm">
                        check_circle
                      </span>
                      Upfront deposits and payments
                    </li>
                  </ul>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/30 flex flex-col gap-4 shadow-sm relative z-10">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                    <div className="w-24 h-4 bg-outline-variant/30 rounded-full"></div>
                    <div className="w-8 h-8 bg-primary-container/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-12 bg-white rounded-lg shadow-sm border border-outline-variant/10 flex items-center px-4 gap-3 cursor-default">
                      <div className="w-6 h-6 rounded-full bg-tertiary-container/30"></div>
                      <div className="w-1/2 h-3 bg-outline-variant/20 rounded-full"></div>
                    </div>
                    <div className="w-full h-12 bg-white rounded-lg shadow-sm border border-outline-variant/10 flex items-center px-4 gap-3 cursor-default">
                      <div className="w-6 h-6 rounded-full bg-tertiary-container/30"></div>
                      <div className="w-2/3 h-3 bg-outline-variant/20 rounded-full"></div>
                    </div>
                    <div className="w-full h-12 bg-primary/5 rounded-lg shadow-sm border border-primary/20 flex items-center px-4 gap-3 cursor-default">
                      <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-[12px] text-on-primary-container fill">
                          check
                        </span>
                      </div>
                      <div className="w-1/3 h-3 bg-primary/40 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative z-10 py-24 bg-surface-container-low/50"
          id="solutions"
          data-reveal
        >
          <div className="reveal-base max-w-max-width mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="font-h2 text-h2 text-on-surface mb-4">
                Find your next appointment
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
                Discover top-rated professionals in your area who use
                VerdantBook for seamless booking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Category Card 1 */}
              <div className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-sm hover:border-primary/30 transition-colors duration-200 group cursor-pointer flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">
                    content_cut
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-2">
                  Barbers &amp; Salons
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                  Haircuts, coloring, styling, and treatments.
                </p>
                <div className="flex items-center text-primary font-label-sm text-label-sm group-hover:gap-2 transition-all mt-auto">
                  <span>Browse 2,400+ spots</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Category Card 2 */}
              <div className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-sm hover:border-primary/30 transition-colors duration-200 group cursor-pointer flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">
                    school
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-2">
                  Tutors &amp; Coaches
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                  Academic tutoring, life coaching, and skills.
                </p>
                <div className="flex items-center text-primary font-label-sm text-label-sm group-hover:gap-2 transition-all mt-auto">
                  <span>Browse 1,800+ experts</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Category Card 3 */}
              <div className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-sm hover:border-primary/30 transition-colors duration-200 group cursor-pointer flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">
                    self_improvement
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-2">
                  Wellness &amp; Health
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                  Therapy, massage, yoga, and personal training.
                </p>
                <div className="flex items-center text-primary font-label-sm text-label-sm group-hover:gap-2 transition-all mt-auto">
                  <span>Browse 3,100+ practitioners</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Category Card 4 - Gyms */}
              <div className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-sm hover:border-primary/30 transition-colors duration-200 group cursor-pointer flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-[#f8dfc8] text-[#7a421d] flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">
                    fitness_center
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-2">
                  Gyms &amp; Fitness
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                  Personal training, group classes, and gym access.
                </p>
                <div className="flex items-center text-primary font-label-sm text-label-sm group-hover:gap-2 transition-all mt-auto">
                  <span>Browse 1,200+ spots</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/explore"
                className="px-8 py-3 rounded-full bg-surface-container-highest text-on-surface font-button text-button hover:bg-surface-dim transition-colors inline-flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined">search</span>
                Explore all categories
              </Link>
            </div>
          </div>
        </section>

        <section id="pricing" className="space-y-16" data-reveal>
          <div className="reveal-base text-center max-w-2xl mx-auto">
            <h2 className="font-h2 text-h2 text-on-background mb-4">
              Simple &amp; Transparent Pricing
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              No hidden fees, no surprises. Grow your business on your terms.
            </p>
          </div>
          <div className="reveal-base grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Starter Tier */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center group hover:border-primary/30 transition-colors duration-200">
              <h4 className="font-h3 text-h3 text-on-surface-variant text-xl mb-2">
                Starter
              </h4>
              <div className="font-h1 text-h1 text-on-background mb-6">
                $0<span className="text-lg text-outline font-normal">/mo</span>
              </div>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant mb-8 text-left w-full">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">
                    check
                  </span>{' '}
                  50 bookings per month
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">
                    check
                  </span>{' '}
                  Basic booking link
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">
                    check
                  </span>{' '}
                  Standard support
                </li>
              </ul>
              <button className="w-full font-button text-button border-2 border-outline text-on-surface-variant px-6 py-3 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors duration-200 active:scale-95">
                Get Started
              </button>
            </div>

            {/* Professional Tier (Highlighted) */}
            <div className="glass-panel p-10 rounded-2xl flex flex-col items-center text-center group border-primary/50 bg-white relative md:scale-105 z-10">
              <div className="absolute top-0 transform -translate-y-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <h4 className="font-h3 text-h3 text-primary text-xl mb-2">
                Professional
              </h4>
              <div className="font-h1 text-h1 text-on-background mb-6">
                $15<span className="text-lg text-outline font-normal">/mo</span>
              </div>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant mb-8 text-left w-full">
                <li className="flex items-center gap-2 font-medium text-on-surface">
                  <span className="material-symbols-outlined text-primary text-sm font-bold">
                    check
                  </span>{' '}
                  Unlimited bookings
                </li>
                <li className="flex items-center gap-2 font-medium text-on-surface">
                  <span className="material-symbols-outlined text-primary text-sm font-bold">
                    check
                  </span>{' '}
                  Automated SMS &amp; Email
                </li>
                <li className="flex items-center gap-2 font-medium text-on-surface">
                  <span className="material-symbols-outlined text-primary text-sm font-bold">
                    check
                  </span>{' '}
                  Upfront deposits
                </li>
                <li className="flex items-center gap-2 font-medium text-on-surface">
                  <span className="material-symbols-outlined text-primary text-sm font-bold">
                    check
                  </span>{' '}
                  Custom domain
                </li>
              </ul>
              <button className="w-full font-button text-button bg-primary text-on-primary px-6 py-3 rounded-full hover:bg-surface-tint transition-colors duration-200 active:scale-95">
                Start 14-Day Trial
              </button>
            </div>

            {/* Studio Tier */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center group hover:border-primary/30 transition-colors duration-200">
              <h4 className="font-h3 text-h3 text-on-surface-variant text-xl mb-2">
                Studio
              </h4>
              <div className="font-h1 text-h1 text-on-background mb-6">
                $49<span className="text-lg text-outline font-normal">/mo</span>
              </div>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant mb-8 text-left w-full">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">
                    check
                  </span>{' '}
                  Everything in Professional
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">
                    check
                  </span>{' '}
                  Up to 10 staff members
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">
                    check
                  </span>{' '}
                  Advanced analytics
                </li>
              </ul>
              <button className="w-full font-button text-button border-2 border-outline text-on-surface-variant px-6 py-3 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors duration-200 active:scale-95">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        <section id="testimonials" className="space-y-16" data-reveal>
          <div className="reveal-base flex flex-col items-center text-center mb-8 gap-4 pb-6">
            <h2 className="font-h2 text-h2 text-on-background mb-2">
              Loved by Professionals
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              See how independent creators are saving hours each week and ending
              the back-and-forth messaging madness.
            </p>
          </div>

          <div className="reveal-base grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial Card 1 */}
            <div className="glass-panel bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm hover:border-primary/30 transition-colors duration-200 flex flex-col h-full">
              <div className="flex items-center gap-1 mb-6 text-[#FFB400]">
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
              </div>
              <p className="font-body-lg text-on-surface mb-8 flex-grow">
                &quot;VerdantBook completely eliminated the back-and-forth texts
                I used to have with clients. I just send my link and wake up to
                bookings!&quot;
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <Image
                  width={48}
                  height={48}
                  alt="Sarah"
                  src="https://i.pravatar.cc/150?u=sarah"
                  className="rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-label-lg text-on-surface font-bold">
                    Sarah Jenkins
                  </h4>
                  <p className="font-label-sm text-on-surface-variant">
                    Personal Trainer
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="glass-panel bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm hover:border-primary/30 transition-colors duration-200 flex flex-col h-full md:translate-y-8">
              <div className="flex items-center gap-1 mb-6 text-[#FFB400]">
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
              </div>
              <p className="font-body-lg text-on-surface mb-8 flex-grow">
                &quot;My booking page makes my photography business look
                polished. Clients constantly compliment how easy it is to book
                me.&quot;
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <Image
                  width={48}
                  height={48}
                  alt="Marcus"
                  src="https://i.pravatar.cc/150?u=marcus"
                  className="rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-label-lg text-on-surface font-bold">
                    Marcus Chen
                  </h4>
                  <p className="font-label-sm text-on-surface-variant">
                    Portrait Photographer
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 3 */}
            <div className="glass-panel bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm hover:border-primary/30 transition-colors duration-200 flex flex-col h-full">
              <div className="flex items-center gap-1 mb-6 text-[#FFB400]">
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
                <span className="material-symbols-outlined fill text-[20px]">
                  star
                </span>
              </div>
              <p className="font-body-lg text-on-surface mb-8 flex-grow">
                &quot;I used to lose track of DMs on Instagram. Now everything
                is in one dashboard, and my no-shows dropped by 80% thanks to
                the automated reminders.&quot;
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <Image
                  width={48}
                  height={48}
                  alt="Elena"
                  src="https://i.pravatar.cc/150?u=elena"
                  className="rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-label-lg text-on-surface font-bold">
                    Elena Rodriguez
                  </h4>
                  <p className="font-label-sm text-on-surface-variant">
                    Nail Technician
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="space-y-12" data-reveal>
          <div className="reveal-base flex flex-col items-center text-center mb-8 gap-4 pb-2">
            <h2 className="font-h2 text-h2 text-on-background mb-2">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="reveal-base w-full pb-16">
            <FAQAccordion />
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 w-full py-12 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col gap-4">
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="material-symbols-outlined fill text-primary">
                forest
              </span>
              <span className="text-sm font-semibold text-slate-900">
                VerdantBook
              </span>
            </div>
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
            <Link
              className="font-sans text-xs uppercase tracking-widest text-slate-400 hover:text-[#35858E] underline-offset-4 opacity-100 hover:opacity-80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#35858E] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right hover:after:origin-left"
              href="#"
            >
              Security
            </Link>
            <Link
              className="font-sans text-xs uppercase tracking-widest text-slate-400 hover:text-[#35858E] underline-offset-4 opacity-100 hover:opacity-80 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#35858E] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right hover:after:origin-left"
              href="#"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
