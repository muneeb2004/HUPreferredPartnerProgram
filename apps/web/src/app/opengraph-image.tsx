import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'HU Preferred Partner';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #111827, #1f2937)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            width: '120px',
            height: '120px',
          }}
        >
          <span style={{ color: '#111827', fontSize: 60, fontWeight: 'bold' }}>HU</span>
        </div>
        <h1 style={{ fontSize: 72, fontWeight: 'bold', margin: 0, textAlign: 'center' }}>
          Preferred Partner
        </h1>
        <p style={{ fontSize: 36, color: '#9ca3af', marginTop: 20, textAlign: 'center', maxWidth: '800px' }}>
          Exclusive brand partnerships and offers for Habib University students.
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
