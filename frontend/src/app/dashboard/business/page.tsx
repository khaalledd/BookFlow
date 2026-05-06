'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import {
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
    const url = `${window.location.origin}/book/${business.slug}`;
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
    <div className="max-w-3xl mx-auto">
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-h2 text-primary tracking-tight">
            {business ? 'Manage Your Business' : 'Create Business Profile'}
          </h1>
          <p className="font-label-sm text-on-surface-variant">
            {business
              ? 'Update your business details so customers can find you.'
              : "Let's set up your premium presence on BookFlow."}
          </p>
        </div>
        
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-label-sm text-on-surface-variant font-semibold">Business Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-label-sm text-on-surface-variant font-semibold">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="font-label-sm text-on-surface-variant font-semibold">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg input-focus-border font-body-md text-on-surface"
                >
                  {CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-surface-container-lowest text-on-surface"
                    >
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-label-sm text-on-surface-variant font-semibold">Contact Phone</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="font-label-sm text-on-surface-variant font-semibold">City</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="font-label-sm text-on-surface-variant font-semibold">Address</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
                />
              </div>
            </div>

            {business && (
              <div className="p-4 rounded-lg bg-surface-container border border-outline-variant">
                <p className="text-sm font-medium text-on-surface-variant">
                  Public Booking Link:
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={`/book/${business.slug}`}
                    target="_blank"
                    className="text-xs text-primary font-bold hover:underline break-all"
                  >
                    {typeof window !== 'undefined'
                      ? window.location.origin
                      : ''}
                    /book/{business.slug}
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs border-primary text-primary hover:bg-primary/10"
                    onClick={handleCopyPublicLink}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            )}

            {business && (
              <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant">
                <p className="text-sm font-medium text-on-surface-variant mb-2">Branding</p>
                <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary/5 px-5 text-sm font-semibold text-primary transition-all hover:bg-primary/10 shadow-sm">
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

            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-button py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
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
                className="w-full font-button py-2 rounded-lg"
              >
                Delete Business
              </Button>
            )}
          </form>

          {user?.role === 'ADMIN' && (
            <form
              onSubmit={handleCreateAdmin}
              className="mt-8 space-y-3 rounded-lg border border-outline-variant bg-surface-container p-4"
            >
              <p className="text-sm font-medium text-primary">Create Admin</p>
              <Input
                placeholder="Admin name"
                value={adminForm.name}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, name: e.target.value })
                }
                className="bg-surface-container-lowest border border-outline-variant input-focus-border text-on-surface"
              />
              <Input
                placeholder="admin@email.com"
                type="email"
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
                className="bg-surface-container-lowest border border-outline-variant input-focus-border text-on-surface"
              />
              <Input
                placeholder="Password"
                type="password"
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
                className="bg-surface-container-lowest border border-outline-variant input-focus-border text-on-surface"
              />
              <Button type="submit" disabled={adminLoading} className="w-full bg-primary text-on-primary">
                {adminLoading ? 'Creating...' : 'Create Admin'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
