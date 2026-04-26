'use client';

import React from 'react';

export default function ServicesBookingPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md selection:bg-primary/20 selection:text-primary">
      {/* Transactional Minimal Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-secondary-fixed/30 sticky top-0 z-50">
        <div className="max-w-max-width mx-auto px-gutter h-20 flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined fill">spa</span>
            </div>
            <span className="font-h3 text-h3 text-primary tracking-tight">
              Lumina
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-md">
            <div className="flex items-center gap-xs text-primary font-label-sm text-label-sm">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs">
                1
              </div>
              <span className="font-semibold">Services</span>
            </div>
            <div className="w-12 h-px bg-outline-variant/50"></div>
            <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
              <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs">
                2
              </div>
              <span>Time</span>
            </div>
            <div className="w-12 h-px bg-outline-variant/50"></div>
            <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
              <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs">
                3
              </div>
              <span>Details</span>
            </div>
          </div>

          <button className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-xs">
            <span>Cancel</span>
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow w-full max-w-max-width mx-auto px-gutter py-xl">
        <div className="mb-xl">
          <h1 className="font-h1 text-h1 text-on-surface mb-sm">
            Select a Service
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Choose from our range of holistic treatments designed to restore
            balance and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl relative items-start">
          {/* Left Column: Service Selection */}
          <div className="lg:col-span-8 flex flex-col gap-lg">
            {/* Category Filters */}
            <div className="flex items-center gap-sm overflow-x-auto pb-sm hide-scrollbar">
              <button className="px-6 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm whitespace-nowrap shadow-sm shadow-primary/10">
                All Services
              </button>
              <button className="px-6 py-2 rounded-full bg-surface-container-lowest/60 text-on-surface hover:bg-surface-container-highest transition-colors font-label-sm text-label-sm border border-outline-variant/30 whitespace-nowrap backdrop-blur-md">
                Massage Therapy
              </button>
              <button className="px-6 py-2 rounded-full bg-surface-container-lowest/60 text-on-surface hover:bg-surface-container-highest transition-colors font-label-sm text-label-sm border border-outline-variant/30 whitespace-nowrap backdrop-blur-md">
                Facials &amp; Skin
              </button>
              <button className="px-6 py-2 rounded-full bg-surface-container-lowest/60 text-on-surface hover:bg-surface-container-highest transition-colors font-label-sm text-label-sm border border-outline-variant/30 whitespace-nowrap backdrop-blur-md">
                Wellness Rituals
              </button>
            </div>

            {/* Services List (Glassmorphism Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {/* Service Card 1 */}
              <div className="bg-surface-container-lowest/60 backdrop-blur-[20px] rounded-2xl overflow-hidden border border-secondary-fixed/40 shadow-lg shadow-primary/5 flex flex-col transition-all duration-300 hover:shadow-primary/10 hover:border-primary/30 group">
                <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                  <img
                    alt="massage"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuL0Iahoeqqi0cITC_Y823ToYxaLX6EPevrfR1BbHoKYY_YUqEeIMJDHPNx0dGHk8LzrbioMA_g2NCwxZFSJRr0AFBO6HPIQwDfiJ9QcMld4ltxrBnmbt2oAJvGiw0INhSnD3EQUjMZhyCdwk5b_RVvrgPo4hhTnc0w2qPdlpCqvflOyrBygk1-J6BfEKvTqvoht0QIYX_LOjRQ3UveT1H2J9WT_ijhOVjCgeKHAAli_gMAgmrO8Z3WAJ-t8kRXQdWDS1Pbzt7Tkq7"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent"></div>
                </div>
                <div className="p-lg flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-sm">
                    <h3 className="font-h3 text-h3 text-on-surface">
                      Deep Tissue Restoration
                    </h3>
                    <span className="font-button text-button text-primary bg-primary-container/30 px-3 py-1 rounded-full">
                      $120
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">
                    A targeted massage focusing on the deepest layers of muscle
                    tissue, tendons, and fascia. Ideal for chronic tension.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>
                      <span>60 mins</span>
                    </div>
                    <button className="bg-surface-container text-primary font-button text-button rounded-full px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-colors border border-primary/20">
                      Select
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Card 2 */}
              <div className="bg-surface-container-lowest/60 backdrop-blur-[20px] rounded-2xl overflow-hidden border border-secondary-fixed/40 shadow-lg shadow-primary/5 flex flex-col transition-all duration-300 hover:shadow-primary/10 hover:border-primary/30 group">
                <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                  <img
                    alt="facial"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8Q_X1bT4jE2gTpZ_mg6cRR6fXzObr2cKAeRmjp3_DDZClcpBTO9MU_TE8XB-AdDw5BpsfZq9kHiHEU-YYjlTZnRsEhcblAzQtjPaFsaHaEZZeOphk9C6HDELG9mTdrTbYnLvlmjMKNe1-Vmw1W4-h_7xCk-gnxeaJqMxVwGNWsR9UjwKkdIC02jR3jS-VR8J7fdzk7fnmOes-C9TlcPhh5GBLq2lwtHjWFTNf5cDR6ucO7y-JcA8uwYZ0WQFhoCNm217VBt0BncQS"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent"></div>
                </div>
                <div className="p-lg flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-sm">
                    <h3 className="font-h3 text-h3 text-on-surface">
                      Botanical Radiance Facial
                    </h3>
                    <span className="font-button text-button text-primary bg-primary-container/30 px-3 py-1 rounded-full">
                      $95
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">
                    Revitalize your skin with organic, plant-based serums and a
                    gentle lymphatic drainage massage for a natural glow.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>
                      <span>45 mins</span>
                    </div>
                    <button className="bg-surface-container text-primary font-button text-button rounded-full px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-colors border border-primary/20">
                      Select
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Card 3 */}
              <div className="bg-surface-container-lowest/60 backdrop-blur-[20px] rounded-2xl overflow-hidden border border-secondary-fixed/40 shadow-lg shadow-primary/5 flex flex-col transition-all duration-300 hover:shadow-primary/10 hover:border-primary/30 group">
                <div className="p-lg flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-sm">
                    <h3 className="font-h3 text-h3 text-on-surface">
                      Swedish Relaxation
                    </h3>
                    <span className="font-button text-button text-primary bg-primary-container/30 px-3 py-1 rounded-full">
                      $105
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">
                    Long, flowing strokes encourage full-body relaxation,
                    improved circulation, and mental tranquility in a quiet
                    setting.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>
                      <span>60 mins</span>
                    </div>
                    <button className="bg-surface-container text-primary font-button text-button rounded-full px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-colors border border-primary/20">
                      Select
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Card 4 */}
              <div className="bg-surface-container-lowest/60 backdrop-blur-[20px] rounded-2xl overflow-hidden border border-secondary-fixed/40 shadow-lg shadow-primary/5 flex flex-col transition-all duration-300 hover:shadow-primary/10 hover:border-primary/30 group">
                <div className="p-lg flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-sm">
                    <h3 className="font-h3 text-h3 text-on-surface">
                      Hot Stone Harmony
                    </h3>
                    <span className="font-button text-button text-primary bg-primary-container/30 px-3 py-1 rounded-full">
                      $140
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">
                    Smooth, heated basalt stones are placed on key tension
                    points to melt away stress and deeply warm the musculature.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>
                      <span>90 mins</span>
                    </div>
                    <button className="bg-surface-container text-primary font-button text-button rounded-full px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-colors border border-primary/20">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Summary Sidebar */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl border border-secondary-fixed/50 shadow-xl shadow-primary/5 p-lg">
              <h2 className="font-h3 text-h3 text-on-surface mb-lg flex items-center gap-sm pb-sm border-b border-outline-variant/30">
                <span className="material-symbols-outlined text-primary">
                  shopping_bag
                </span>
                Your Booking
              </h2>

              {/* Empty State */}
              <div className="py-xl flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-md text-on-surface-variant/50">
                  <span className="material-symbols-outlined text-3xl">
                    spa
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-xs">
                  No services selected
                </p>
                <p className="font-body-md text-body-md text-outline">
                  Choose a treatment to begin your journey.
                </p>
              </div>

              {/* Summary Footer (Disabled State) */}
              <div className="mt-lg pt-lg border-t border-outline-variant/30 space-y-sm">
                <div className="flex justify-between items-center text-on-surface-variant font-body-md text-body-md">
                  <span>Subtotal</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between items-center text-on-surface font-h3 text-h3 pt-sm">
                  <span>Total</span>
                  <span>$0.00</span>
                </div>
                <button
                  className="w-full mt-md bg-surface-variant text-on-surface-variant font-button text-button rounded-full py-4 opacity-50 cursor-not-allowed flex items-center justify-center gap-xs transition-colors"
                  disabled
                >
                  Continue to Time
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
