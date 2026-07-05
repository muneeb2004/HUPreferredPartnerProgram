import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Partner OpenGraph Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #ffffff, #f3f4f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111827',
          border: '12px solid #111827',
        }}
      >
        <h1 style={{ fontSize: 80, fontWeight: 'bold', margin: 0, textTransform: 'capitalize' }}>
          {slug}
        </h1>
        <p style={{ fontSize: 36, color: '#4b5563', marginTop: 30 }}>
          View exclusive offers on HU Preferred Partner
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
