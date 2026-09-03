'use client';

import React from 'react';

interface FlagProps {
  className?: string;
  size?: number;
}

export const FlagRU: React.FC<FlagProps> = ({ className = 'w-5 h-3.5', size }) => (
  <svg
    viewBox="0 0 640 480"
    className={`inline-block shrink-0 rounded-[3px] shadow-sm border border-white/10 ${className}`}
    style={size ? { width: size, height: (size * 3) / 4 } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#ffffff" d="M0 0h640v160H0z" />
      <path fill="#0039a6" d="M0 160h640v160H0z" />
      <path fill="#d52b1e" d="M0 320h640v160H0z" />
    </g>
  </svg>
);

export const FlagUS: React.FC<FlagProps> = ({ className = 'w-5 h-3.5', size }) => (
  <svg
    viewBox="0 0 640 480"
    className={`inline-block shrink-0 rounded-[3px] shadow-sm border border-white/10 ${className}`}
    style={size ? { width: size, height: (size * 3) / 4 } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fillRule="evenodd">
      <path fill="#bd3d44" d="M0 0h640v480H0z" />
      <path
        stroke="#fff"
        strokeWidth="37"
        d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"
      />
      <path fill="#192f5d" d="M0 0h260v260H0z" />
      {/* Crisp stars simplified for crisp mini display */}
      <g fill="#fff">
        <circle cx="45" cy="40" r="10" />
        <circle cx="105" cy="40" r="10" />
        <circle cx="165" cy="40" r="10" />
        <circle cx="225" cy="40" r="10" />

        <circle cx="75" cy="85" r="10" />
        <circle cx="135" cy="85" r="10" />
        <circle cx="195" cy="85" r="10" />

        <circle cx="45" cy="130" r="10" />
        <circle cx="105" cy="130" r="10" />
        <circle cx="165" cy="130" r="10" />
        <circle cx="225" cy="130" r="10" />

        <circle cx="75" cy="175" r="10" />
        <circle cx="135" cy="175" r="10" />
        <circle cx="195" cy="175" r="10" />

        <circle cx="45" cy="220" r="10" />
        <circle cx="105" cy="220" r="10" />
        <circle cx="165" cy="220" r="10" />
        <circle cx="225" cy="220" r="10" />
      </g>
    </g>
  </svg>
);
