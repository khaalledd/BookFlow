'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Scissors, Trash2 } from 'lucide-react';
import { getMyBusiness } from '@/lib/business';

export default function ServicesPage() {
  const { user } = useAuth();

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 30,
    price: 0,
  });

  useEffect(() => {
    async function init() {
      try {
        const myBiz = await getMyBusiness(user?.id);
        if (myBiz) {
          setBusinessId(myBiz.id);
          const svcRes = await api.get(
            `/businesses/${myBiz.id}/services?includeInactive=true`,
          );
          setServices(svcRes.data.data || svcRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user) init();
  }, [user]);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return alert('You need to create a business first!');

    setSaving(true);
    try {
      const res = await api.post(`/businesses/${businessId}/services`, {
        ...formData,
        durationMinutes: Number(formData.durationMinutes),
        price: Number(formData.price),
        currency: 'EGP',
      });
      const newService = res.data.data || res.data;
      setServices([...services, newService]);
      setFormData({ name: '', description: '', durationMinutes: 30, price: 0 });
    } catch (err) {
      console.error(err);
      alert('Failed to add service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!businessId || !confirm('Delete this service?')) return;
    setDeletingId(serviceId);
    try {
      await api.delete(`/services/${serviceId}`);
      setServices(services.filter((s) => s.id !== serviceId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete service');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (serviceId: string, isActive: boolean) => {
    try {
      await api.patch(`/services/${serviceId}`, { isActive: !isActive });
      setServices(
        services.map((s) =>
          s.id === serviceId ? { ...s, isActive: !isActive } : s,
        ),
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update service status');
    }
  };

  const handleQuickPriceUpdate = async (serviceId: string, price: number) => {
    try {
      await api.patch(`/services/${serviceId}`, { price: Number(price) });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update price');
    }
  };

  const handleCoverUpload = async (serviceId: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    form.append('serviceId', serviceId);

    try {
      const res = await api.post('/uploads/service-cover', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const coverUrl = res.data.data?.url || res.data.url;
      setServices(
        services.map((s) => (s.id === serviceId ? { ...s, coverUrl } : s)),
      );
    } catch (err) {
      console.error(err);
      alert('Failed to upload cover image');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!businessId) {
    return (
      <div className="text-center p-10 bg-card/30 rounded-lg">
        Please create a business profile first.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-h2 text-primary tracking-tight">
            Manage Services
          </h1>
          <p className="font-label-sm text-on-surface-variant">
            Add the services you offer to clients.
          </p>
        </div>
        
        <div>
          <form
            onSubmit={handleAddService}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-surface-container border border-outline-variant/30 p-6 rounded-xl mb-8"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="font-label-sm text-on-surface-variant font-semibold">Service Name</Label>
              <Input
                id="name"
                required
                placeholder="e.g. Premium Haircut"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-surface-container-lowest border border-outline-variant/50 px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-label-sm text-on-surface-variant font-semibold">Description</Label>
              <Input
                id="description"
                placeholder="Short detail"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-surface-container-lowest border border-outline-variant/50 px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="font-label-sm text-on-surface-variant font-semibold">Duration (Minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                step="5"
                required
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMinutes: Number(e.target.value),
                  })
                }
                className="bg-surface-container-lowest border border-outline-variant/50 px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface placeholder:text-outline-variant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="font-label-sm text-on-surface-variant font-semibold">Price (EGP)</Label>
              <div className="flex gap-2">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="bg-surface-container-lowest border border-outline-variant/50 px-md py-sm rounded-lg input-focus-border font-body-md text-on-surface flex-1"
                />
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary-container text-on-primary font-button">
                  {saving ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>
          </form>

          <div className="space-y-4">
            <h3 className="text-lg font-h3 text-on-surface border-b border-outline-variant/30 pb-2">
              Active Services
            </h3>
            {services.length === 0 ? (
              <p className="text-sm text-outline-variant text-center py-4">
                No services added yet.
              </p>
            ) : (
              <div className="grid gap-3">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 shadow-sm"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
                        <Scissors className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-on-surface">{svc.name}</h4>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">
                          {svc.durationMinutes} mins • {svc.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-2">
                        {editingId === svc.id ? (
                          <Input
                            type="number"
                            defaultValue={svc.price}
                            className="h-8 w-28 bg-surface-container-lowest border-outline-variant/50 text-sm text-on-surface"
                            onBlur={(e) =>
                              handleQuickPriceUpdate(
                                svc.id,
                                Number(e.target.value),
                              )
                            }
                          />
                        ) : (
                          <span
                            className="font-h3 text-lg text-primary cursor-pointer hover:underline"
                            onClick={() => setEditingId(svc.id)}
                          >
                            {svc.price} EGP
                          </span>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="inline-flex h-8 min-w-[90px] items-center justify-center rounded-lg border border-primary bg-primary/5 px-3 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                            onClick={() =>
                              handleToggleActive(svc.id, !!svc.isActive)
                            }
                          >
                            {svc.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <label className="inline-flex h-8 min-w-[90px] cursor-pointer items-center justify-center rounded-lg border border-outline-variant/50 bg-surface-container px-3 text-xs font-semibold text-on-surface-variant transition-all hover:border-primary/40 hover:text-primary hover:bg-surface-container-high shadow-sm">
                            Upload cover
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleCoverUpload(svc.id, file);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(svc.id)}
                        disabled={deletingId === svc.id}
                        className="text-outline hover:text-error transition-colors p-2 disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
