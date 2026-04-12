'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
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
import {
  clearMyBusinessId,
  getMyBusiness,
  setMyBusinessId,
} from '@/lib/business';

const CATEGORIES = [
  'BARBERSHOP',
  'SALON',
  'GYM',
  'TUTORING',
  'CLINIC',
  'OTHER',
];

export default function BusinessPage() {
  const { user } = useAuth();

  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'BARBERSHOP',
    city: '',
    address: '',
    phone: '',
  });

  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    async function loadBusiness() {
      try {
        const myBiz = await getMyBusiness(user?.id);
        if (myBiz) {
          setBusiness(myBiz);
          setFormData({
            name: myBiz.name,
            description: myBiz.description || '',
            category: myBiz.category,
            city: myBiz.city,
            address: myBiz.address,
            phone: myBiz.phone,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user) loadBusiness();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (business) {
        // Update
        const res = await api.patch(`/businesses/${business.id}`, formData);
        const updated = res.data.data || res.data;
        setBusiness(updated);
        if (updated?.id) setMyBusinessId(updated.id);
        setFormData({
          name: updated.name,
          description: updated.description || '',
          category: updated.category,
          city: updated.city,
          address: updated.address,
          phone: updated.phone,
        });
      } else {
        // Create
        const res = await api.post('/businesses', formData);
        const created = res.data.data || res.data;
        setBusiness(created);
        if (created?.id) setMyBusinessId(created.id);
        setFormData({
          name: created.name,
          description: created.description || '',
          category: created.category,
          city: created.city,
          address: created.address,
          phone: created.phone,
        });
      }
      alert('Business saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save business.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!business?.id) return;
    const form = new FormData();
    form.append('file', file);
    form.append('businessId', business.id);

    try {
      const res = await api.post('/uploads/business-logo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const logoUrl = res.data.data?.url || res.data.url;
      if (logoUrl) {
        setBusiness({ ...business, logoUrl });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload business logo');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    try {
      await api.post('/auth/create-admin', adminForm);
      alert('Admin created successfully');
      setAdminForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteBusiness = async () => {
    if (!business?.id) return;
    if (!confirm('Delete this business permanently?')) return;
    try {
      await api.delete(`/businesses/${business.id}`);
      clearMyBusinessId();
      setBusiness(null);
      setFormData({
        name: '',
        description: '',
        category: 'BARBERSHOP',
        city: '',
        address: '',
        phone: '',
      });
      alert('Business deleted');
    } catch (err) {
      console.error(err);
      alert('Failed to delete business');
    }
  };

  const handleCopyPublicLink = async () => {
    if (!business?.slug || typeof window === 'undefined') return;
    const url = `${window.location.origin}/b/${business.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert('Failed to copy link');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-primary">
            {business ? 'Manage Your Business' : 'Create Business Profile'}
          </CardTitle>
          <CardDescription>
            {business
              ? 'Update your business details so customers can find you.'
              : "Let's set up your premium presence on BookFlow."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-black/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-black/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-background text-foreground"
                    >
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-black/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="bg-black/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="bg-black/20"
                />
              </div>
            </div>

            {business && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  Public Booking Link:
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={`/b/${business.slug}`}
                    target="_blank"
                    className="text-xs hover:underline text-white/80 break-all"
                  >
                    {typeof window !== 'undefined'
                      ? window.location.origin
                      : ''}
                    /b/{business.slug}
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs border-primary/35"
                    onClick={handleCopyPublicLink}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            )}

            {business && (
              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <p className="text-sm font-medium text-white mb-2">Branding</p>
                <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-primary/40 bg-primary/15 px-5 text-sm font-semibold text-primary transition-all hover:bg-primary/25">
                  Upload Business Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                  />
                </label>
              </div>
            )}

            <Button type="submit" disabled={saving}>
              {saving
                ? 'Saving...'
                : business
                  ? 'Update Profile'
                  : 'Create Business'}
            </Button>

            {business && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteBusiness}
              >
                Delete Business
              </Button>
            )}
          </form>

          {user?.role === 'ADMIN' && (
            <form
              onSubmit={handleCreateAdmin}
              className="mt-8 space-y-3 rounded-lg border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm font-medium text-primary">Create Admin</p>
              <Input
                placeholder="Admin name"
                value={adminForm.name}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, name: e.target.value })
                }
                className="bg-black/40"
              />
              <Input
                placeholder="admin@email.com"
                type="email"
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
                className="bg-black/40"
              />
              <Input
                placeholder="Password"
                type="password"
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
                className="bg-black/40"
              />
              <Button type="submit" disabled={adminLoading}>
                {adminLoading ? 'Creating...' : 'Create Admin'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
