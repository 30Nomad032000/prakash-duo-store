import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Prakash Duo - Elegant Handcrafted Bangles';
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
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #4a1a1a 50%, #1a1a1a 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Top border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          }}
        />

        {/* Bottom border */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          }}
        />

        {/* Corner accents */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            width: '80px',
            height: '80px',
            borderLeft: '3px solid #D4AF37',
            borderTop: '3px solid #D4AF37',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '80px',
            height: '80px',
            borderRight: '3px solid #D4AF37',
            borderTop: '3px solid #D4AF37',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '80px',
            height: '80px',
            borderLeft: '3px solid #D4AF37',
            borderBottom: '3px solid #D4AF37',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            width: '80px',
            height: '80px',
            borderRight: '3px solid #D4AF37',
            borderBottom: '3px solid #D4AF37',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '50px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#D4AF37',
              }}
            />
            <span
              style={{
                color: '#D4AF37',
                fontSize: '18px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Handcrafted with Love
            </span>
          </div>

          {/* Brand name */}
          <h1
            style={{
              fontSize: '90px',
              fontWeight: 400,
              color: 'white',
              margin: 0,
              letterSpacing: '-0.02em',
              fontFamily: 'Georgia, serif',
            }}
          >
            Prakash
            <span style={{ color: '#D4AF37' }}>Duo</span>
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '16px 0 0 0',
              fontWeight: 300,
              letterSpacing: '0.05em',
            }}
          >
            Elegant Bangles for Every Occasion
          </p>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #D4AF37)',
              }}
            />
            <div
              style={{
                width: '10px',
                height: '10px',
                background: '#D4AF37',
                transform: 'rotate(45deg)',
              }}
            />
            <div
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, #D4AF37, transparent)',
              }}
            />
          </div>

          {/* Location */}
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '24px',
              letterSpacing: '0.1em',
            }}
          >
            Thrissur, Kerala, India
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
