import React from 'react';

export default function Hero({
  background = '/hero.jpg',
  title = 'Enjoy the silence in our reading room.',
  subtitle = 'Come and join the reading club',
  ctaText = 'See More',
  onCta,
  height = '48vh',
}) {
  const style = {
    position: 'relative',
    height,
    minHeight: 320,
    borderRadius: 12,
    overflow: 'hidden',
    background: `url(${background}) center/cover no-repeat, linear-gradient(135deg,#e9eef5,#d9e2ec)`,
  };

  return (
    <section style={style}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25))',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          color: 'white',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
          padding: '2.5rem',
          gap: '0.5rem',
        }}
      >
        <div style={{ letterSpacing: 2, opacity: 0.9 }}>{subtitle.toUpperCase()}</div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: 1.1, margin: 0, maxWidth: 900 }}>{title}</h1>
        {ctaText && (
          <button
            onClick={onCta}
            style={{
              marginTop: '1rem',
              background: 'transparent',
              color: 'white',
              border: '1.5px solid white',
              padding: '0.6rem 1rem',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {ctaText}
          </button>
        )}
      </div>
    </section>
  );
}
