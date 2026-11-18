import { ImageResponse } from 'next/og';
export const alt = 'MaiaOfertas — Menos procura. Mais boas escolhas.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#152a3a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 90,
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 35, color: '#ffab78', marginBottom: 55 }}>maiaofertas.</div>
      <div style={{ fontSize: 78, letterSpacing: -4, fontWeight: 700 }}>Menos procura.</div>
      <div style={{ fontSize: 78, letterSpacing: -4, fontWeight: 700, color: '#ffab78' }}>
        Mais boas escolhas.
      </div>
      <div style={{ fontSize: 24, color: '#d2dfdb', marginTop: 45 }}>
        Curadoria independente · Descubra e escolha na Amazon.
      </div>
    </div>,
    size,
  );
}
