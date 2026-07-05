import { type MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  let partnerRoutes: MetadataRoute.Sitemap = [];
  let offerRoutes: MetadataRoute.Sitemap = [];

  try {
    // Fetch partners
    const partnersRes = await fetch(`${apiUrl}/api/v1/partners`, { next: { revalidate: 3600 } });
    if (partnersRes.ok) {
      const data = await partnersRes.json();
      const partners = data.data || [];
      partnerRoutes = partners.map((partner: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/partners/${partner.slug}`,
        lastModified: partner.updatedAt ? new Date(partner.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }

    // Fetch offers
    const offersRes = await fetch(`${apiUrl}/api/v1/offers`, { next: { revalidate: 3600 } });
    if (offersRes.ok) {
      const data = await offersRes.json();
      const offers = data.data || [];
      offerRoutes = offers.map((offer: { id: string; updatedAt?: string }) => ({
        url: `${baseUrl}/offers/${offer.id}`,
        lastModified: offer.updatedAt ? new Date(offer.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
  }

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...partnerRoutes,
    ...offerRoutes,
  ]
}
