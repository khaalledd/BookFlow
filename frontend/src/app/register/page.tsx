'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-heading text-center tracking-tight">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join BookFlow to manage or book premium services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Toggle */}
            <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'CUSTOMER'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('BUSINESS_OWNER')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'BUSINESS_OWNER'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                Business Owner
              </button>
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-black/20 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-black/20 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="01012345678"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-black/20 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-black/20 focus-visible:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
