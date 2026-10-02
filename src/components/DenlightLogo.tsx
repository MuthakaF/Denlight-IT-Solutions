import React, { useState, useEffect } from 'react';
import { getSiteSettings, SiteGlobalSettings } from '../utils/superAdminManager';

interface DenlightLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'auto';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const DenlightLogo: React.FC<DenlightLogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtitle = true,
  size = 'md'
}) => {
  const [siteSettings, setSiteSettings] = useState<SiteGlobalSettings>(getSiteSettings);

  useEffect(() => {
    const handleUpdate = () => setSiteSettings(getSiteSettings());
    window.addEventListener('denlight-site-settings-updated', handleUpdate);
    window.addEventListener('denlight-content-updated', handleUpdate);
    return () => {
      window.removeEventListener('denlight-site-settings-updated', handleUpdate);
      window.removeEventListener('denlight-content-updated', handleUpdate);
    };
  }, []);

  const isLightVariant = variant === 'light';

  // Responsive scale dimensions
  const dimensions = {
    sm: { width: 160, height: 38 },
    md: { width: 220, height: 48 },
    lg: { width: 280, height: 60 },
    xl: { width: 340, height: 74 }
  }[size];

  const primaryTextColor = isLightVariant ? '#FFFFFF' : '#0F172A';
  const subtitleColor = isLightVariant ? '#94A3B8' : '#64748B';
  const accentRed = '#DC2626'; // Vibrant Tech Red

  // Derive brand words
  const siteName = siteSettings?.siteName || 'Denlight IT Solutions';
  const isDefaultDenlight = siteName.toLowerCase().startsWith('denlight');

  let firstPart = 'DEN';
  let secondPart = 'LIGHT';
  let subtitleText = `${siteSettings?.brandAccentWord || 'IT SOLUTIONS'} • NAIVASHA`;

  if (!isDefaultDenlight) {
    const words = siteName.trim().split(/\s+/);
    if (words.length === 1) {
      firstPart = words[0].toUpperCase();
      secondPart = '';
    } else {
      firstPart = words[0].toUpperCase();
      secondPart = words.slice(1).join(' ').toUpperCase();
    }
    subtitleText = (siteSettings?.brandAccentWord || 'STORE').toUpperCase();
  }

  const initialLetter = firstPart.charAt(0) || 'D';

  return (
    <div className={`inline-flex items-center select-none cursor-pointer group ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 300 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200 group-hover:scale-[1.02]"
      >
        {/* --- GEOMETRIC TECH EMBLEM / LOGOMARK --- */}
        <g className="brand-emblem">
          {/* Outer Rounded Tech Square / Shield */}
          <rect
            x="4"
            y="6"
            width="52"
            height="52"
            rx="14"
            fill={isLightVariant ? '#1E293B' : '#0F172A'}
            stroke={isLightVariant ? '#334155' : '#E2E8F0'}
            strokeWidth="2"
          />

          {isDefaultDenlight ? (
            /* Stylized Futuristic 'D' Shape */
            <path
              d="M 18 18 H 32 C 40.5 18 46 23.5 46 32 C 46 40.5 40.5 46 32 46 H 18 V 18 Z M 25 24 V 40 H 32 C 36.5 40 40 37 40 32 C 40 27 36.5 24 32 24 H 25 Z"
              fill="#FFFFFF"
            />
          ) : (
            <text
              x="30"
              y="42"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="26"
              fontWeight="900"
              fontFamily="'Plus Jakarta Sans', sans-serif"
            >
              {initialLetter}
            </text>
          )}

          {/* Dynamic Laser Beam Slash in Red */}
          <polygon
            points="14,44 48,16 52,22 18,50"
            fill={accentRed}
          />

          {/* Glowing Tech Circuit Node Dot */}
          <circle cx="48" cy="18" r="4" fill={accentRed} />
          <circle cx="48" cy="18" r="2" fill="#FFFFFF" />
        </g>

        {/* --- BRAND WORDMARK --- */}
        <g className="brand-wordmark">
          {/* First Word / Part */}
          <text
            x="68"
            y="38"
            fill={primaryTextColor}
            fontSize="24"
            fontWeight="900"
            fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
            letterSpacing="-0.03em"
          >
            {firstPart}
          </text>

          {/* Second Word / Accent Part */}
          {secondPart && (
            <text
              x={68 + firstPart.length * 15}
              y="38"
              fill={accentRed}
              fontSize="24"
              fontWeight="900"
              fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
              letterSpacing="-0.03em"
            >
              {' ' + secondPart}
            </text>
          )}

          {/* Red Accent Dot */}
          <circle
            cx={68 + (firstPart.length + (secondPart ? secondPart.length + 1 : 0)) * 14.5 + 8}
            cy="32"
            r="3.5"
            fill={accentRed}
          />
        </g>

        {/* --- SUBTITLE --- */}
        {showSubtitle && (
          <g className="brand-subtitle">
            <text
              x="69"
              y="54"
              fill={subtitleColor}
              fontSize="8.5"
              fontWeight="800"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              letterSpacing="0.22em"
            >
              {subtitleText}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
