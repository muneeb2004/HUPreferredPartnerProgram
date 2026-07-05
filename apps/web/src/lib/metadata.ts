import { Metadata } from 'next'

export const siteConfig = {
  name: 'HU Preferred Partner',
  description: 'Habib University Preferred Partner Program.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/opengraph-image',
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    alternates: {
      canonical: siteConfig.url,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
      type: 'website',
      url: siteConfig.url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@habibuniversity',
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
