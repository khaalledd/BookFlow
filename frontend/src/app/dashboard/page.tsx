'use client';
import Image from 'next/image';

export default function DashboardOverview() {
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
          Today, Oct 24
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
                payments
              </span>
              Daily Revenue
            </span>
            <span className="px-2 py-1 bg-secondary-container/50 text-secondary font-label-sm text-[12px] rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                trending_up
              </span>
              +12%
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-h2 text-h2 text-on-surface">$1,240</h3>
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
            <h3 className="font-h2 text-h2 text-on-surface">14</h3>
            <p className="font-label-sm text-[12px] text-outline mt-1">
              3 new bookings
            </p>
          </div>
        </div>

        {/* Card 3: New Leads */}
        <div className="col-span-12 md:col-span-4 bg-primary text-on-primary rounded-xl p-lg shadow-[0_8px_24px_rgba(0,102,111,0.15)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(45deg,transparent_20%,rgba(255,255,255,0.1)_50%,transparent_80%)] opacity-50"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-label-sm text-label-sm text-on-primary/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                person_add
              </span>
              New Leads
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-h2 text-h2 text-on-primary">28</h3>
            <p className="font-label-sm text-[12px] text-on-primary/70 mt-1">
              From social channels
            </p>
          </div>
        </div>

        {/* Middle Row: Social Hub & Today's Schedule */}
        {/* Unified Social Hub */}
        <div className="col-span-12 lg:col-span-8 bg-white/60 backdrop-blur-[20px] rounded-xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,102,111,0.06)] flex flex-col overflow-hidden h-[400px]">
          <div className="px-lg py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest/50">
            <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined fill text-primary">
                forum
              </span>
              Social Hub
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant font-label-sm text-[12px] rounded-full border border-outline-variant/30 cursor-pointer hover:bg-surface-variant transition-colors">
                All
              </span>
              <span className="px-3 py-1 text-outline font-label-sm text-[12px] rounded-full cursor-pointer hover:bg-surface-variant/50 transition-colors">
                WhatsApp
              </span>
              <span className="px-3 py-1 text-outline font-label-sm text-[12px] rounded-full cursor-pointer hover:bg-surface-variant/50 transition-colors">
                Instagram
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {/* Message Item 1 */}
            <div className="group flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container-lowest/80 border border-transparent hover:border-outline-variant/20 transition-all cursor-pointer">
              <div className="relative w-10 h-10 shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-dim">
                  <Image width={40} height={40}
                    alt="Client Avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuzrthd5B1oov1K_EHgCizWj2ewPCLpGCD8lNkWK0489FbHy2bcLDUW9nX3hoW1jq4E6ldW_BT9BwQv2YRAmccHOm5tMlHkjQkxU56RmQX66tNKW-68yIO7K_tV94SnoPJCOY9qpLImFmrSbHXvBmt_lzS70qLRVYFUqXXSVhG9g3erFpo1tap6dHdtoFux76x7oFd77ob_4FFN9igDDTsASmDsCL2g8G8jmbFTtueZYJc50_ngc_E55rtMnh-XOxxeRZ5NOvsuqGC"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                  <span className="material-symbols-outlined fill text-white text-[12px]">
                    chat
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-label-sm text-label-sm text-on-surface truncate">
                    Emma Thompson
                  </h4>
                  <span className="text-[12px] text-outline shrink-0">
                    10:42 AM
                  </span>
                </div>
                <p className="text-[14px] text-on-surface-variant truncate">
                  Hi, do you have any availability for a consultation tomorrow
                  afternoon?
                </p>
              </div>
            </div>

            {/* Message Item 2 */}
            <div className="group flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container-lowest/80 border border-transparent hover:border-outline-variant/20 transition-all cursor-pointer bg-surface-container-lowest/40">
              <div className="relative w-10 h-10 shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-dim flex items-center justify-center text-primary font-h3">
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#E1306C] rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                  <span className="material-symbols-outlined fill text-white text-[12px]">
                    photo_camera
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-label-sm text-label-sm text-on-surface truncate font-semibold">
                    Michael Chen
                  </h4>
                  <span className="text-[12px] text-primary font-medium shrink-0">
                    New
                  </span>
                </div>
                <p className="text-[14px] text-on-surface truncate font-medium">
                  Replied to your story: &quot;Looks amazing! How much
                  for...&quot;
                </p>
              </div>
            </div>

            {/* Message Item 3 */}
            <div className="group flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container-lowest/80 border border-transparent hover:border-outline-variant/20 transition-all cursor-pointer">
              <div className="relative w-10 h-10 shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-dim">
                  <Image width={40} height={40}
                    alt="Client Avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRITWvTNa1Q1vkn3HHTk7_-eqgXsn3mseX5ayRZKB3-W-HlK5LokGonUQHOTlAuuuSp9bRV5qhIJiTXYmgF8va6lRmB1C-noGFYZqtg78QZbFEWyChgzCvdtZCLzquUIp3uJDXPm2jBytw4whFVgkFQmI5z0JCjfh0blxDvUdlr2AFA08RP0GpE7ocF6V31xIP3LLcO1kiU3RJgT43RCYd5cDkQo08UBK4u-xX7NzCasxQn9e0qlCuwWAUJ_5pJchLbJE7Ys68Zb0G"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                  <span className="material-symbols-outlined fill text-white text-[12px]">
                    chat
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-label-sm text-label-sm text-on-surface truncate">
                    David Wilson
                  </h4>
                  <span className="text-[12px] text-outline shrink-0">
                    Yesterday
                  </span>
                </div>
                <p className="text-[14px] text-on-surface-variant truncate">
                  Thanks for the update, see you on Friday.
                </p>
              </div>
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
              {/* Appointment 1 */}
              <div className="flex gap-4 relative">
                <div className="w-14 shrink-0 text-right font-label-sm text-label-sm text-primary pt-1">
                  11:30
                </div>
                <div className="w-3 h-3 rounded-full bg-primary absolute left-[34px] top-2 outline outline-4 outline-surface-container-lowest shadow-sm z-10"></div>
                <div className="flex-1 bg-surface-container-low p-4 rounded-lg border border-primary/20 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <h4 className="font-label-sm text-label-sm text-on-surface mb-1">
                    Initial Consultation
                  </h4>
                  <p className="text-[12px] text-on-surface-variant flex items-center gap-1 mb-2">
                    <span className="material-symbols-outlined text-[14px]">
                      person
                    </span>
                    Sarah Jenkins
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-medium tracking-wide uppercase">
                    In Person
                  </span>
                </div>
              </div>

              {/* Appointment 2 */}
              <div className="flex gap-4 relative">
                <div className="w-14 shrink-0 text-right font-label-sm text-label-sm text-outline pt-1">
                  13:00
                </div>
                <div className="w-3 h-3 rounded-full bg-outline-variant absolute left-[34px] top-2 outline outline-4 outline-surface-container-lowest shadow-sm z-10"></div>
                <div className="flex-1 p-3 rounded-lg border border-transparent hover:bg-surface-container-lowest/50 transition-colors">
                  <h4 className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Follow-up Review
                  </h4>
                  <p className="text-[12px] text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      videocam
                    </span>
                    Mark D. (Zoom)
                  </p>
                </div>
              </div>

              {/* Appointment 3 */}
              <div className="flex gap-4 relative">
                <div className="w-14 shrink-0 text-right font-label-sm text-label-sm text-outline pt-1">
                  15:45
                </div>
                <div className="w-3 h-3 rounded-full bg-outline-variant absolute left-[34px] top-2 outline outline-4 outline-surface-container-lowest shadow-sm z-10"></div>
                <div className="flex-1 p-3 rounded-lg border border-transparent hover:bg-surface-container-lowest/50 transition-colors">
                  <h4 className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Project Sync
                  </h4>
                  <p className="text-[12px] text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      person
                    </span>
                    Design Team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Lead Growth Chart */}
        <div className="col-span-12 bg-white/60 backdrop-blur-[20px] rounded-xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,102,111,0.06)] p-lg flex flex-col h-[300px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-h3 text-h3 text-on-surface mb-1">
                Lead Generation Growth
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Past 30 Days across all channels
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-[12px] text-outline font-medium">
                  Organic
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                <span className="text-[12px] text-outline font-medium">
                  Social
                </span>
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
            <div className="absolute left-[80%] top-[20%] -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded text-[10px] font-medium shadow-md">
              Oct 18: 84 Leads
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
