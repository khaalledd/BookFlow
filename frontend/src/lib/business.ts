import { api } from '@/lib/api';

const STORAGE_KEY = 'my_business_id';

export function setMyBusinessId(businessId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, businessId);
}

export function clearMyBusinessId() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export async function getMyBusiness(userId?: string | null) {
  if (!userId) return null;

  if (typeof window !== 'undefined') {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      try {
        const byIdRes = await api.get(`/businesses/${storedId}`);
        const byId = byIdRes.data.data || byIdRes.data;
        if (byId?.id && byId?.ownerId === userId) {
          return byId;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  const res = await api.get('/businesses?limit=100');
  const businesses = res.data.data?.data || res.data.data || [];
  const found = businesses.find((b: any) => b.ownerId === userId) || null;
  if (found?.id) {
    setMyBusinessId(found.id);
  }
  return found;
}
