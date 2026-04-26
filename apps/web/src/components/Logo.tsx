import { useId } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 30, className }: LogoProps): React.ReactElement {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      aria-label="Farscry logo"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="512" y2="512">
          <stop offset="0%" stopColor="#110c1a" />
          <stop offset="100%" stopColor="#09060f" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill={`url(#${id}-bg)`} />
      <circle cx="256" cy="256" r="40" fill="#a78bfa" />
      <circle cx="256" cy="256" r="90" stroke="#a78bfa" strokeWidth="26" fill="none" opacity="0.45" />
      <circle cx="256" cy="256" r="148" stroke="#a78bfa" strokeWidth="22" fill="none" opacity="0.2" />
      <circle cx="256" cy="256" r="200" stroke="#a78bfa" strokeWidth="16" fill="none" opacity="0.08" />
    </svg>
  );
}
