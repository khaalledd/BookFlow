'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getMyBusiness } from '@/lib/business';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const myBiz = await getMyBusiness(user?.id);

        if (myBiz) {
          setBusinessId(myBiz.id);
          const availRes = await api.get(
            `/businesses/${myBiz.id}/availability`,
          );
          const availabilities = availRes.data.data || availRes.data || [];

          // Map DB to UI state
          const mappedSchedule = DAYS_OF_WEEK.map((day) => {
            const existing = availabilities.find(
              (a: any) => a.dayOfWeek === day.id,
            );
            if (existing) {
              return {
                dayOfWeek: day.id,
                name: day.name,
                active: true,
                startTime: existing.startTime,
                endTime: existing.endTime,
              };
            }
            return {
              dayOfWeek: day.id,
              name: day.name,
              active: false,
              startTime: '09:00',
              endTime: '17:00',
            };
          });

          setSchedule(mappedSchedule);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user) init();
  }, [user]);

  const handleToggleDay = (idx: number) => {
    const newSch = [...schedule];
    newSch[idx].active = !newSch[idx].active;
    setSchedule(newSch);
  };

  const handleTimeChange = (
    idx: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    const newSch = [...schedule];
    newSch[idx][field] = value;
    setSchedule(newSch);
  };

  const handleSave = async () => {
    if (!businessId) return;
    setSaving(true);
    try {
      const payload = schedule
        .filter((s) => s.active)
        .map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
        }));

      await api.put(`/businesses/${businessId}/availability`, {
        schedule: payload,
      });
      alert('Schedule saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save schedule');
    } finally {
      setSaving(false);
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-h2 text-primary tracking-tight">
            Master Schedule
          </h1>
          <p className="font-label-sm text-on-surface-variant">
            Define your generic weekly working hours. Slots will be
            auto-generated from this.
          </p>
        </div>
        <div>
          <div className="space-y-4">
            {schedule.map((day, idx) => (
              <div
                key={day.dayOfWeek}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-colors shadow-sm ${
                  day.active
                    ? 'bg-surface-container-low border-primary/30'
                    : 'bg-surface-container border-outline-variant/50 opacity-80'
                }`}
              >
                <div className="w-40 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={day.active}
                    onChange={() => handleToggleDay(idx)}
                    className="w-4 h-4 accent-primary"
                  />
                  <Label
                    className={`font-semibold ${day.active ? 'text-on-surface' : 'text-on-surface-variant'}`}
                  >
                    {day.name}
                  </Label>
                </div>

                {day.active ? (
                  <div className="flex flex-1 items-center gap-4">
                    <div className="space-y-1 flex-1">
                      <Input
                        type="time"
                        required
                        value={day.startTime}
                        onChange={(e) =>
                          handleTimeChange(idx, 'startTime', e.target.value)
                        }
                        className="bg-surface-container-lowest border border-outline-variant/50 px-3 py-2 rounded-lg input-focus-border font-body-md text-on-surface"
                      />
                    </div>
                    <span className="text-outline-variant font-medium">to</span>
                    <div className="space-y-1 flex-1">
                      <Input
                        type="time"
                        required
                        value={day.endTime}
                        onChange={(e) =>
                          handleTimeChange(idx, 'endTime', e.target.value)
                        }
                        className="bg-surface-container-lowest border border-outline-variant/50 px-3 py-2 rounded-lg input-focus-border font-body-md text-on-surface"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-sm text-outline-variant italic font-medium">
                    Closed
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={saving}
              className="px-8 font-button bg-primary hover:bg-primary-container text-on-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
