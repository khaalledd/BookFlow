'use client';
import Image from 'next/image';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<'CUSTOMER' | 'BUSINESS_OWNER'>('CUSTOMER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Register
      await api.post('/auth/register', {
        ...formData,
        role,
      });

      // 2. Auto Login after register
      const loginRes = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // 3. Store Auth state
      const { user, accessToken, refreshToken } = loginRes.data.data;
      login(user, accessToken, refreshToken);

      // 4. Redirect
      if (role === 'BUSINESS_OWNER') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred during registration.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-soft font-body-md text-on-surface min-h-screen flex flex-col overflow-x-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row min-h-screen">
        {/* Left Form Section */}
        <main className="flex-1 flex flex-col px-margin py-4 lg:py-6 justify-center items-center z-10">
          {/* Logo */}
          <header className="w-full max-w-lg mb-6 flex items-center gap-2 justify-center lg:justify-start">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
            <span className="font-h3 text-primary tracking-tighter text-xl">VerdantBook</span>
          </header>

          <div className="w-full max-w-lg">
            {/* Registration Card */}
            <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
              <div className="text-center lg:text-left space-y-2 relative">
                <h1 className="font-h2 text-primary">Create your account</h1>
                <div className="inline-flex items-center gap-2 bg-secondary-container/50 px-3 py-1 rounded-full mt-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                  <span className="font-label-sm text-secondary font-bold">Start your 14-day free trial</span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Role Toggle */}
                <div className="flex gap-2 p-1 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setRole('CUSTOMER')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      role === 'CUSTOMER'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('BUSINESS_OWNER')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      role === 'BUSINESS_OWNER'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Business Owner
                  </button>
                </div>

                {error && (
                  <div className="p-3 text-sm text-on-error-container bg-error-container/90 rounded-md border border-error/20">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className="font-label-sm text-on-surface-variant font-semibold">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-surface-container-lowest border border-outline-variant/50 px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone" className="font-label-sm text-on-surface-variant font-semibold">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="01012345678"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-surface-container-lowest border border-outline-variant/50 px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="font-label-sm text-on-surface-variant font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-surface-container-lowest border border-outline-variant/50 px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="font-label-sm text-on-surface-variant font-semibold">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant pr-10"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant cursor-pointer text-[20px] transition-colors">visibility</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-button py-md rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform active:scale-[0.98] border border-primary/20"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outline-variant/50"></div>
                <span className="flex-shrink mx-md font-label-sm text-outline">Or continue with</span>
                <div className="flex-grow border-t border-outline-variant/50"></div>
              </div>

              {/* Social Sign-Up */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/50 px-4 py-2 rounded-lg font-button text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/50 px-4 py-2 rounded-lg font-button text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.039 2.48-4.5 2.597-4.571-1.428-2.09-3.623-2.325-4.402-2.376-1.844-.156-3.415.896-4.194.896zm2.844-4.532c.818-1.003 1.363-2.389 1.22-3.778-1.182.052-2.61.792-3.467 1.792-.766.883-1.441 2.3-1.259 3.662 1.312.104 2.65-.675 3.506-1.676z"></path>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="font-body-md text-outline">
                  Already have an account? 
                  <button 
                    type="button"
                    onClick={() => router.push('/login')} 
                    className="text-primary font-bold hover:underline ml-1"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <footer className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-2 pb-4">
              <span className="font-label-sm text-outline text-xs">© 2024 VerdantBook.</span>
              <div className="flex gap-4">
                <a href="#" className="font-label-sm text-outline hover:text-primary transition-colors text-xs">Privacy Policy</a>
                <a href="#" className="font-label-sm text-outline hover:text-primary transition-colors text-xs">Terms of Service</a>
              </div>
            </footer>
          </div>
        </main>

        {/* Right Graphic & Social Proof (Desktop Only) */}
        <aside className="hidden lg:block lg:w-2/5 xl:w-1/3 relative bg-surface-container-high/30 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtg3bs4Owor_Q56ig5KwK04__jlk7FYpCJzbUDbdcZG84AOZE-r0BEt-AaI4NpR5G491EcrRT6fNOK2BG6tM8zt352O5HdVf3vA3QzoD8mNcVTmjk70uoCcZlUDM5gBkk1NQtiiq_cFeX-p7-HGmbVnA87Z_WVawkCKjCtjCATVkdw1ixW6kjBDJL2BeNIXKb9rkJqz8waHBjfvImdej5aIM8vQCNwSj_uUzFadQ2vgSMRDegS4nzPE3LJE6mRZ3Zmjkm8yjsGEC0c" 
              alt="misty deep forest" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent opacity-50"></div>
          </div>
          <div className="relative h-full w-full flex flex-col items-start justify-center p-xl pl-2xl max-w-2xl">
            <div className="inline-flex items-center px-md py-sm bg-tertiary-fixed rounded-full text-on-tertiary-fixed-variant gap-2 shadow-sm mb-lg">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span className="font-label-sm">Peaceful Management</span>
            </div>
            <h3 className="font-h1 text-primary-container leading-tight mb-md">Bring serenity to your bookings.</h3>
            <p className="font-body-lg text-secondary mb-xl">Join 5,000+ service providers who reclaimed their mental space with VerdantBook&apos;s focused interface.</p>
            
            <div className="grid grid-cols-2 gap-lg w-full">
              <div className="glass-panel p-lg rounded-xl border-t border-l border-white/60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-2xl">sentiment_very_satisfied</span>
                </div>
                <span className="block font-h2 text-primary">98%</span>
                <span className="text-sm text-on-surface-variant font-medium mt-1 block">User Happiness Score</span>
              </div>
              <div className="glass-panel p-lg rounded-xl border-t border-l border-white/60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-2xl">timer</span>
                </div>
                <span className="block font-h2 text-primary">15h</span>
                <span className="text-sm text-on-surface-variant font-medium mt-1 block">Saved Weekly on Admin</span>
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
