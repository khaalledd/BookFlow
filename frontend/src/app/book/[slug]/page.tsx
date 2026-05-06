'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import api from '@/lib/api';

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: string;
  currency: string;
  coverUrl: string | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  services: Service[];
  description: string;
}

export default function ServicesBookingPage() {
  const params = useParams();
  const router = useRouter();

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isHydrated } = useAuth();

  // Step Management
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Selection State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Guest Details State
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [bookingStatus, setBookingStatus] = useState<
    'IDLE' | 'PROCESSING' | 'ERROR'
  >('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await api.get(`/businesses/slug/${params.slug}`);
        setBusiness(res.data?.data);
      } catch (error) {
        console.error('Failed to fetch business', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) {
      fetchBusiness();
    }
  }, [params.slug]);

  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      setGuestData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isHydrated, isAuthenticated, user]);

  const fetchSlots = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    if (!selectedService || !business) return;

    setLoadingSlots(true);
    try {
      const res = await api.get(
        `/businesses/${business.id}/slots?serviceId=${selectedService.id}&date=${dateStr}`,
      );
      setAvailableSlots(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !selectedService || !selectedDate || !selectedSlot) return;
    if (!isHydrated) {
      setBookingStatus('ERROR');
      setErrorMsg('Please wait a moment and try again.');
      return;
    }

    setBookingStatus('PROCESSING');
    setErrorMsg('');

    try {
      if (isAuthenticated && user?.role === 'CUSTOMER') {
        await api.post('/bookings', {
          businessId: business.id,
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedSlot,
          notes: 'Booked via Authenticated Web Flow',
        });
      } else {
        await api.post('/bookings/public', {
          businessId: business.id,
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedSlot,
          notes: 'Booked via Public Web Flow',
          ...guestData,
        });
      }
      setCurrentStep(4); // Success Step
    } catch (err: any) {
      setBookingStatus('ERROR');
      const apiMessage = err.response?.data?.message;
      const normalizedMessage = Array.isArray(apiMessage)
        ? apiMessage[0]
        : apiMessage;
      setErrorMsg(
        normalizedMessage ||
          'Failed to secure your booking. The slot might be taken.',
      );
    }
  };

  const toggleService = (service: Service) => {
    if (selectedService?.id === service.id) {
      setSelectedService(null);
    } else {
      setSelectedService(service);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center font-body-md text-on-surface">
        <h1 className="font-h1 text-3xl mb-4">Business not found</h1>
        <button
          onClick={() => router.push('/explore')}
          className="text-primary hover:underline"
        >
          Return to explore
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Transactional Minimal Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-secondary-fixed/30 sticky top-0 z-50">
        <div className="max-w-max-width mx-auto px-gutter h-20 flex items-center justify-between">
          <div className="flex items-center gap-sm">
            {business.logoUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden relative shadow-sm">
                <Image
                  src={business.logoUrl}
                  alt={business.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
                <span className="material-symbols-outlined fill">store</span>
              </div>
            )}
            <span className="font-h3 text-h3 text-primary tracking-tight">
              {business.name}
            </span>
          </div>

          {/* Progress Indicator */}
          {currentStep < 4 && (
            <div className="hidden md:flex items-center gap-md">
              <div
                className={`flex items-center gap-xs font-label-sm text-label-sm ${currentStep >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-variant text-on-surface-variant'}`}
                >
                  1
                </div>
                <span className={currentStep >= 1 ? 'font-semibold' : ''}>
                  Services
                </span>
              </div>
              <div
                className={`w-12 h-px ${currentStep >= 2 ? 'bg-primary/50' : 'bg-outline-variant/50'}`}
              ></div>

              <div
                className={`flex items-center gap-xs font-label-sm text-label-sm ${currentStep >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-variant text-on-surface-variant'}`}
                >
                  2
                </div>
                <span className={currentStep >= 2 ? 'font-semibold' : ''}>
                  Time
                </span>
              </div>
              <div
                className={`w-12 h-px ${currentStep >= 3 ? 'bg-primary/50' : 'bg-outline-variant/50'}`}
              ></div>

              <div
                className={`flex items-center gap-xs font-label-sm text-label-sm ${currentStep >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-variant text-on-surface-variant'}`}
                >
                  3
                </div>
                <span className={currentStep >= 3 ? 'font-semibold' : ''}>
                  Details
                </span>
              </div>
            </div>
          )}

          {currentStep === 4 ? (
            <button
              onClick={() => router.push('/explore')}
              className="font-button text-button bg-surface-container text-on-surface px-4 py-2 rounded-full hover:bg-surface-container-high transition-colors"
            >
              Back to Explore
            </button>
          ) : (
            <button
              onClick={() => router.push('/explore')}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-xs"
            >
              <span>Cancel</span>
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow w-full max-w-max-width mx-auto px-gutter py-xl">
        {/* Step 4: Success Screen */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 relative animate-[pulse_3s_ease-in-out_infinite]">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50"></div>
              <span
                className="material-symbols-outlined text-5xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h1 className="font-h1 text-4xl text-on-surface mb-4">
              Booking Confirmed!
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
              You are all set for{' '}
              <span className="font-bold text-on-surface">
                {selectedService?.name}
              </span>{' '}
              on{' '}
              <span className="font-bold text-on-surface">{selectedDate}</span>{' '}
              at <span className="font-bold text-primary">{selectedSlot}</span>.
              We&apos;ve sent the details to {guestData.email}.
            </p>
            <button
              onClick={() => router.push('/explore')}
              className="font-button text-button bg-primary text-on-primary px-10 py-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Discover More Experiences
            </button>
          </div>
        )}

        {/* Steps 1-3 Layout */}
        {currentStep < 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl relative items-start">
            {/* Left Column: Dynamic Step Content */}
            <div className="lg:col-span-8 flex flex-col gap-lg min-h-[500px]">
              {/* === STEP 1: SERVICES === */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h1 className="font-h1 text-h1 text-on-surface mb-sm">
                      Select a Service
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                      {business.description ||
                        'Choose from our range of services.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    {business.services?.length > 0 ? (
                      business.services.map((service) => {
                        const isSelected = selectedService?.id === service.id;
                        return (
                          <div
                            key={service.id}
                            className={`glass-panel bg-surface-container-lowest/80 rounded-2xl overflow-hidden border shadow-sm flex flex-col transition-all duration-300 group cursor-pointer ${
                              isSelected
                                ? 'border-primary shadow-primary/20 ring-1 ring-primary scale-[1.02]'
                                : 'border-outline-variant/30 hover:shadow-primary/10 hover:border-primary/30'
                            }`}
                            onClick={() => toggleService(service)}
                          >
                            <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                              <Image
                                width={400}
                                height={200}
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                                src={
                                  service.coverUrl ||
                                  'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                                }
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80"></div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-h3 text-h3 text-on-surface leading-tight">
                                  {service.name}
                                </h3>
                                <span className="font-label-sm text-label-sm text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap font-bold">
                                  {service.currency} {service.price}
                                </span>
                              </div>
                              <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow">
                                {service.description ||
                                  'No description available.'}
                              </p>
                              <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
                                <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                                  <span className="material-symbols-outlined text-[18px]">
                                    schedule
                                  </span>
                                  <span>{service.durationMinutes} mins</span>
                                </div>
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-outline-variant group-hover:border-primary/50'}`}
                                >
                                  {isSelected && (
                                    <span
                                      className="material-symbols-outlined text-[14px] text-on-primary"
                                      style={{
                                        fontVariationSettings: "'FILL' 1",
                                      }}
                                    >
                                      check
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface-container/50 rounded-2xl border border-dashed border-outline-variant/50">
                        No services available for this business at the moment.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* === STEP 2: TIME SELECTION === */}
              {currentStep === 2 && selectedService && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="mb-8 flex items-center gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface"
                    >
                      <span className="material-symbols-outlined">
                        arrow_back
                      </span>
                    </button>
                    <div>
                      <h1 className="font-h1 text-h1 text-on-surface">
                        Select Date & Time
                      </h1>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        When would you like to experience {selectedService.name}
                        ?
                      </p>
                    </div>
                  </div>

                  <div className="glass-panel bg-surface-container-lowest/80 rounded-2xl p-8 border border-outline-variant/30 shadow-sm">
                    <div className="mb-8">
                      <h3 className="font-h3 text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                          calendar_month
                        </span>
                        Choose a Date
                      </h3>
                      <input
                        type="date"
                        className="w-full max-w-sm bg-surface text-on-surface border border-outline-variant/50 rounded-xl p-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-body-lg outline-none shadow-inner"
                        value={selectedDate}
                        onChange={(e) => fetchSlots(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <h3 className="font-h3 text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                          schedule
                        </span>
                        Available Time Slots
                      </h3>

                      {!selectedDate ? (
                        <div className="py-8 text-center border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface/50 text-on-surface-variant">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                            event_available
                          </span>
                          <p>Please select a date to see availability</p>
                        </div>
                      ) : loadingSlots ? (
                        <div className="flex flex-wrap gap-3">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                              key={i}
                              className="w-24 h-12 bg-surface-container animate-pulse rounded-lg"
                            ></div>
                          ))}
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="py-8 text-center border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface/50 text-on-surface-variant">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-50 text-error">
                            event_busy
                          </span>
                          <p>
                            No slots available on this date. Try another day.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-3 rounded-lg font-button text-button transition-all duration-200 border ${
                                selectedSlot === slot
                                  ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20 scale-105'
                                  : 'bg-surface text-on-surface border-outline-variant/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === STEP 3: GUEST DETAILS === */}
              {currentStep === 3 && selectedService && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="mb-8 flex items-center gap-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface"
                    >
                      <span className="material-symbols-outlined">
                        arrow_back
                      </span>
                    </button>
                    <div>
                      <h1 className="font-h1 text-h1 text-on-surface">
                        Your Details
                      </h1>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Just a few details to secure your booking.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={submitBooking}
                    className="glass-panel bg-surface-container-lowest/80 rounded-2xl p-8 border border-outline-variant/30 shadow-sm max-w-2xl"
                  >
                    {errorMsg && (
                      <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-start gap-3 text-error">
                        <span className="material-symbols-outlined shrink-0">
                          error
                        </span>
                        <p className="font-body-md text-sm pt-0.5">
                          {errorMsg}
                        </p>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface mb-2">
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="John Doe"
                          className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant"
                          value={guestData.name}
                          onChange={(e) =>
                            setGuestData({ ...guestData, name: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface mb-2">
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="john@example.com"
                          className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant"
                          value={guestData.email}
                          onChange={(e) =>
                            setGuestData({
                              ...guestData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface mb-2">
                          Phone Number
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant"
                          value={guestData.phone}
                          onChange={(e) =>
                            setGuestData({
                              ...guestData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={bookingStatus === 'PROCESSING'}
                          className="w-full bg-primary text-on-primary font-button text-button py-4 rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/40 hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {bookingStatus === 'PROCESSING' ? (
                            <>
                              <span className="material-symbols-outlined animate-spin">
                                progress_activity
                              </span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined">
                                lock
                              </span>
                              Confirm Booking
                            </>
                          )}
                        </button>
                        <p className="text-center font-label-sm text-xs text-on-surface-variant mt-4 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            shield
                          </span>
                          Your information is safe and secure.
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column: Booking Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="glass-panel bg-surface-container-lowest/80 rounded-2xl border border-outline-variant/30 shadow-lg shadow-[#35858E]/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>

                <h2 className="font-h3 text-h3 text-on-surface mb-6 flex items-center gap-2 pb-4 border-b border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary">
                    shopping_bag
                  </span>
                  Booking Summary
                </h2>

                {!selectedService ? (
                  /* Empty State */
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-70">
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-on-surface-variant">
                      <span className="material-symbols-outlined text-3xl">
                        spa
                      </span>
                    </div>
                    <p className="font-body-md text-on-surface-variant">
                      No service selected yet.
                    </p>
                  </div>
                ) : (
                  /* Selected Service details */
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-start gap-4">
                      {selectedService.coverUrl ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20">
                          <Image
                            src={selectedService.coverUrl}
                            alt={selectedService.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/20">
                          <span className="material-symbols-outlined text-on-surface-variant">
                            spa
                          </span>
                        </div>
                      )}
                      <div className="flex-grow">
                        <h4 className="font-semibold text-on-surface leading-tight">
                          {selectedService.name}
                        </h4>
                        <div className="flex items-center gap-1 text-on-surface-variant text-sm mt-1">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {selectedService.durationMinutes} mins
                        </div>
                      </div>
                      <div className="font-bold text-on-surface shrink-0">
                        {selectedService.price}
                      </div>
                    </div>

                    {selectedDate && selectedSlot && (
                      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              calendar_today
                            </span>{' '}
                            Date
                          </span>
                          <span className="font-semibold text-on-surface">
                            {selectedDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              schedule
                            </span>{' '}
                            Time
                          </span>
                          <span className="font-semibold text-primary">
                            {selectedSlot}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Summary Footer */}
                    <div className="pt-6 border-t border-outline-variant/30 space-y-3">
                      <div className="flex justify-between items-center text-on-surface-variant font-body-md text-sm">
                        <span>Subtotal</span>
                        <span>
                          {selectedService.currency} {selectedService.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-on-surface-variant font-body-md text-sm">
                        <span>Taxes & Fees</span>
                        <span>Calculated at location</span>
                      </div>
                      <div className="flex justify-between items-center text-on-surface font-h3 text-xl pt-2">
                        <span>Total Due Now</span>
                        <span className="text-primary">
                          {selectedService.currency} {selectedService.price}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant text-center pt-2">
                        Pay in person after your appointment.
                      </p>

                      {currentStep === 1 && (
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="w-full mt-4 font-button text-button bg-primary text-on-primary rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:bg-primary-container transition-colors active:scale-95"
                        >
                          Continue to Time
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </button>
                      )}

                      {currentStep === 2 && (
                        <button
                          onClick={() => setCurrentStep(3)}
                          disabled={!selectedSlot}
                          className={`w-full mt-4 font-button text-button rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all ${
                            selectedSlot
                              ? 'bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container active:scale-95 cursor-pointer'
                              : 'bg-surface-variant text-on-surface-variant opacity-60 cursor-not-allowed'
                          }`}
                        >
                          Continue to Details
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
