import Logo from './Logo';

interface WordmarkProps {
  logoSize?: number;
  fontSize?: string;
  className?: string;
}

export default function Wordmark({
  logoSize = 26,
  fontSize = '15px',
  className = '',
}: WordmarkProps): React.ReactElement {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={logoSize} />
      <span
        className="font-mono font-semibold tracking-tight text-text-primary"
        style={{ fontSize }}
      >
        far<span className="text-violet">scry</span>
      </span>
    </div>
  );
}
