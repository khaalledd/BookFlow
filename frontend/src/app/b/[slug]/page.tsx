import { Metadata } from 'next';
import BookingWizard from './BookingWizard';

async function getBusinessBySlug(slug: string) {
  // SSR fetch to backend API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/businesses/slug/${slug}`,
    {
      next: { revalidate: 60 }, // Revalidate cache every 60 seconds
      cache: 'no-store', // Disable cache during development
    },
  );

  if (!res.ok) {
    return null;
  }
  const json = await res.json();
  // Unwrap the response - API returns { data: {...}, statusCode, timestamp }
  return json.data || json;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug);
  if (!business) {
    return { title: 'Business Not Found' };
  }
  return {
    title: `${business.name} | BookFlow`,
    description:
      business.description || `Book your appointment at ${business.name}`,
  };
}

export default async function PublicBusinessPage({
  params,
}: {
  params: { slug: string };
}) {
  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading text-primary mb-4">404</h1>
          <p className="text-muted-foreground">
            This business could not be found.
          </p>
        </div>
      </div>
    );
  }

  // business should contain { id, name, description, address, category, services: [] }
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative w-full h-[30vh] md:h-[40vh] bg-black/50 overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          {/* A luxury gradient placeholder instead of an image until they upload one */}
          <div className="w-full h-full bg-gradient-to-tr from-black via-card to-primary/20 opacity-80" />
        </div>
        <div className="relative z-10 p-8 md:p-16 w-full max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight">
            {business.name}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mt-2 max-w-2xl">
            {business.description}
          </p>
          <div className="flex gap-4 mt-4 text-sm text-white/60">
            <span>
              {business.address}, {business.city}
            </span>
            <span>•</span>
            <span className="uppercase tracking-widest">
              {business.category}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Booking Wizard */}
      <main className="max-w-5xl mx-auto px-4 py-12 -mt-10 relative z-20">
        <BookingWizard business={business} />
      </main>
    </div>
  );
}
