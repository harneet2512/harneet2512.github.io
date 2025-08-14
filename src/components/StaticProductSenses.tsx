import React from 'react';

export default function StaticProductSenses() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <svg
        viewBox="0 0 768 768"
        width="768"
        height="768"
        style={{ display: 'block' }}
      >
        {/* PRODUCT SENSES Title */}
        <text x="500" y="110" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="44" letterSpacing="2" textAnchor="start">
          PRODUCT
        </text>
        <text x="500" y="160" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="44" letterSpacing="2" textAnchor="start">
          SENSES
        </text>

        {/* Jagged Spider-Sense Lines */}
        {/* Top Left */}
        <polyline points="260,220 210,170 230,200 180,140 250,180" fill="none" stroke="#fff" strokeWidth="6" />
        {/* Top Right */}
        <polyline points="508,220 558,170 538,200 588,140 518,180" fill="none" stroke="#fff" strokeWidth="6" />
        {/* Middle Left */}
        <polyline points="180,400 100,390 170,410 120,420 200,420" fill="none" stroke="#fff" strokeWidth="6" />
        {/* Middle Right */}
        <polyline points="588,400 668,390 598,410 648,420 568,420" fill="none" stroke="#fff" strokeWidth="6" />
        {/* Bottom Left */}
        <polyline points="260,548 210,598 230,568 180,628 250,588" fill="none" stroke="#fff" strokeWidth="6" />
        {/* Bottom Right */}
        <polyline points="508,548 558,598 538,568 588,628 518,588" fill="none" stroke="#fff" strokeWidth="6" />

        {/* Brain (SVG polygonal approximation) */}
        <polygon points="384,260 350,300 330,340 340,390 384,410 428,390 438,340 418,300" fill="#fff" stroke="#bbb" strokeWidth="3" />
        <polygon points="384,410 340,390 330,440 350,480 384,490 418,480 438,440 428,390" fill="#f4f4f4" stroke="#bbb" strokeWidth="3" />
        <polygon points="350,480 330,540 384,570 438,540 418,480 384,490" fill="#e0e0e0" stroke="#bbb" strokeWidth="3" />
        <polygon points="330,340 300,370 330,440 340,390" fill="#eaeaea" stroke="#bbb" strokeWidth="3" />
        <polygon points="438,340 468,370 438,440 428,390" fill="#eaeaea" stroke="#bbb" strokeWidth="3" />
        <polygon points="330,540 320,600 384,610 384,570" fill="#d0d0d0" stroke="#bbb" strokeWidth="3" />
        <polygon points="438,540 448,600 384,610 384,570" fill="#d0d0d0" stroke="#bbb" strokeWidth="3" />

        {/* Labels */}
        <text x="120" y="120" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="36" letterSpacing="1" textAnchor="middle">
          USER
        </text>
        <text x="120" y="160" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="36" letterSpacing="1" textAnchor="middle">
          PAIN
        </text>
        <text x="648" y="120" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="36" letterSpacing="1" textAnchor="middle">
          SIGNAL
        </text>
        <text x="648" y="160" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="36" letterSpacing="1" textAnchor="middle">
          DETECTION
        </text>
        <text x="120" y="400" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="30" letterSpacing="1" textAnchor="middle">
          BUILD ×
        </text>
        <text x="120" y="440" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="30" letterSpacing="1" textAnchor="middle">
          IMPACT SENSE
        </text>
        <text x="648" y="400" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="30" letterSpacing="1" textAnchor="middle">
          TRADEOFF
        </text>
        <text x="648" y="440" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="30" letterSpacing="1" textAnchor="middle">
          RADAR
        </text>
        <text x="200" y="700" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="36" letterSpacing="1" textAnchor="middle">
          NARRATIVE
        </text>
        <text x="200" y="740" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="36" letterSpacing="1" textAnchor="middle">
          FIT
        </text>
        <text x="568" y="700" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="36" letterSpacing="1" textAnchor="middle">
          TIMING
        </text>
        <text x="568" y="740" fill="#fff" fontFamily="monospace, Comic Sans MS, monospace" fontWeight="bold" fontSize="36" letterSpacing="1" textAnchor="middle">
          INSTINCT
        </text>
      </svg>
    </div>
  );
} 