import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
}: {
  name: string;
  url: string;
  logo?: string;
}): React.JSX.Element {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        ...(logo && { logo }),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  itemListElements,
}: {
  itemListElements: { name: string; item: string }[];
}): React.JSX.Element {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: itemListElements.map((element, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: element.name,
          item: element.item,
        })),
      }}
    />
  );
}

export function OfferJsonLd({
  name,
  description,
  url,
  price,
  priceCurrency,
  validUntil,
  sellerName,
}: {
  name: string;
  description?: string;
  url: string;
  price?: number | string;
  priceCurrency?: string;
  validUntil?: string;
  sellerName?: string;
}): React.JSX.Element {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name,
        description,
        url,
        ...(price !== undefined && { price }),
        ...(priceCurrency && { priceCurrency }),
        ...(validUntil && { validUntil }),
        ...(sellerName && {
          seller: {
            '@type': 'Organization',
            name: sellerName,
          },
        }),
      }}
    />
  );
}

export function WebSiteJsonLd({
  name,
  url,
  potentialAction,
}: {
  name: string;
  url: string;
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}): React.JSX.Element {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url,
        ...(potentialAction && {
          potentialAction: {
            '@type': 'SearchAction',
            target: potentialAction.target,
            'query-input': potentialAction.queryInput,
          },
        }),
      }}
    />
  );
}
