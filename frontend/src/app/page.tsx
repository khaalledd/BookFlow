import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-xl shadow-[#35858E]/5 border-b border-[#35858E]/10 antialiased tracking-tight">
        <div className="flex justify-between items-center px-8 h-20 max-w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-3xl">
              calendar_month
            </span>
            <span className="text-2xl font-extrabold text-[#35858E]">
              Scheduly
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="text-slate-600 font-medium hover:text-[#35858E] transition-colors"
              href="#"
            >
              Features
            </Link>
            <Link
              className="text-slate-600 font-medium hover:text-[#35858E] transition-colors"
              href="#"
            >
              Solutions
            </Link>
            <Link
              className="text-slate-600 font-medium hover:text-[#35858E] transition-colors"
              href="#"
            >
              Pricing
            </Link>
            <Link
              className="text-slate-600 font-medium hover:text-[#35858E] transition-colors"
              href="#"
            >
              Resources
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
              className="font-button text-button bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-full hover:shadow-[0_0_15px_rgba(190,234,204,0.5)] transition-all scale-95 active:opacity-80"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-y-32">
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/30 border border-secondary-container/50 text-primary font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm">
              notifications_off
            </span>
            End the DM madness
          </div>
          <h1 className="font-h1 text-h1 text-on-background max-w-3xl">
            Stop managing bookings in <br />
            <span className="text-gradient">WhatsApp &amp; Instagram.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Consolidate your chaotic social media messages into one elegant,
            professional scheduling hub. Regain your time and present a premium
            experience to your clients.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/register"
              className="font-button text-button bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-[0_0_20px_rgba(190,234,204,0.6)] transition-all w-full sm:w-auto"
            >
              Claim Your Booking Link
            </Link>
            <Link
              href="#how-it-works"
              className="font-button text-button border-2 border-secondary text-secondary px-8 py-4 rounded-full hover:bg-secondary/5 transition-all w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
        </section>

        <section className="space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-h2 text-h2 text-on-background mb-4">
              From Chaos to Clarity
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Transform a fragmented workflow into a seamless client journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-error-container/20 rounded-full blur-3xl group-hover:bg-error-container/40 transition-all"></div>
              <div>
                <div className="w-12 h-12 rounded-full bg-error-container/50 flex items-center justify-center mb-6">
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
                    Back-and-forth "when are you free?" texts.
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

            <div className="md:col-span-2 glass-panel rounded-2xl p-xl flex flex-col justify-between relative overflow-hidden group border-primary/20">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl group-hover:bg-primary-container/40 transition-all"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center mb-6">
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
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">
                        check_circle
                      </span>
                      Unified inbox for all inquiries
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">
                        check_circle
                      </span>
                      Automated SMS &amp; Email reminders
                    </li>
                    <li className="flex items-center gap-2">
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
                    <div className="w-8 h-8 bg-primary-container/20 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-12 bg-white rounded-lg shadow-sm border border-outline-variant/10 flex items-center px-4 gap-3">
                      <div className="w-6 h-6 rounded-full bg-tertiary-container/30"></div>
                      <div className="w-1/2 h-3 bg-outline-variant/20 rounded-full"></div>
                    </div>
                    <div className="w-full h-12 bg-white rounded-lg shadow-sm border border-outline-variant/10 flex items-center px-4 gap-3">
                      <div className="w-6 h-6 rounded-full bg-tertiary-container/30"></div>
                      <div className="w-2/3 h-3 bg-outline-variant/20 rounded-full"></div>
                    </div>
                    <div className="w-full h-12 bg-primary/5 rounded-lg shadow-sm border border-primary/20 flex items-center px-4 gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-container"></div>
                      <div className="w-1/3 h-3 bg-primary/40 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-h2 text-h2 text-on-background mb-4">
              Built for Independent Professionals
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Designed to elevate your brand, no matter your craft.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-lg rounded-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-secondary-container/40 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-2xl">
                  content_cut
                </span>
              </div>
              <h4 className="font-h3 text-h3 text-on-background text-lg mb-2">
                Barbers &amp; Salons
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Manage chairs, handle deposits, and keep the line moving without
                touching your phone.
              </p>
            </div>
            <div className="glass-panel p-lg rounded-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-tertiary text-2xl">
                  school
                </span>
              </div>
              <h4 className="font-h3 text-h3 text-on-background text-lg mb-2">
                Tutors &amp; Coaches
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Schedule sessions, share video links automatically, and collect
                payments upfront.
              </p>
            </div>
            <div className="glass-panel p-lg rounded-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">
                  spa
                </span>
              </div>
              <h4 className="font-h3 text-h3 text-on-background text-lg mb-2">
                Wellness Experts
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Create a calm, seamless booking experience that reflects your
                therapeutic brand.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 w-full py-12 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined fill text-primary">
                calendar_month
              </span>
              <span className="text-sm font-semibold text-slate-900">
                Scheduly
              </span>
            </div>
            <p className="font-sans text-xs uppercase tracking-widest text-[#35858E]">
              © 2024 Scheduly SaaS. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end">
            <Link
              className="font-sans text-xs uppercase tracking-widest text-slate-400 hover:text-[#35858E] underline underline-offset-4 opacity-100 hover:opacity-80 transition-opacity"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="font-sans text-xs uppercase tracking-widest text-slate-400 hover:text-[#35858E] underline underline-offset-4 opacity-100 hover:opacity-80 transition-opacity"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="font-sans text-xs uppercase tracking-widest text-slate-400 hover:text-[#35858E] underline underline-offset-4 opacity-100 hover:opacity-80 transition-opacity"
              href="#"
            >
              Security
            </Link>
            <Link
              className="font-sans text-xs uppercase tracking-widest text-slate-400 hover:text-[#35858E] underline underline-offset-4 opacity-100 hover:opacity-80 transition-opacity"
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
