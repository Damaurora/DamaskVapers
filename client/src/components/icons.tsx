import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const logoVariants = cva(
  "transition-transform hover:scale-105",
  {
    variants: {
      size: {
        default: "w-10 h-10",
        sm: "w-8 h-8",
        lg: "w-12 h-12"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

interface IconProps extends VariantProps<typeof logoVariants> {
  className?: string;
}

export const LogoIcon: React.FC<IconProps> = ({ className, size }) => {
  return (
    <svg 
      className={cn(logoVariants({ size }), className)}
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feFlood floodColor="#FF5500" floodOpacity="0.5" result="flood" />
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="mask" />
          <feGaussianBlur in="mask" stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#neon-glow)">
        <path d="M255.998 64C247.747 118.947 219.403 164.127 175.997 192C219.403 219.873 247.747 265.053 255.998 320C264.25 265.053 292.594 219.873 336 192C292.594 164.127 264.25 118.947 255.998 64Z" fill="#FF7700" />
        <path d="M256 128C251.2 160.32 235.2 186.88 208 204.8C235.2 222.72 251.2 249.28 256 281.6C260.8 249.28 276.8 222.72 304 204.8C276.8 186.88 260.8 160.32 256 128Z" fill="#FF9900" />
        <path d="M192 256C192 155.5 236.5 81.2 256 48C275.5 81.2 320 155.5 320 256C320 330.1 293.3 388.5 256 448C218.7 388.5 192 330.1 192 256Z" fill="#FF5500" />
      </g>
    </svg>
  );
};

export const PodIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M9 4C7.89543 4 7 4.89543 7 6V18C7 19.1046 7.89543 20 9 20H15C16.1046 20 17 19.1046 17 18V6C17 4.89543 16.1046 4 15 4H9Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 7V10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M10 17H14" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PodModIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect 
        x="6" 
        y="3" 
        width="12" 
        height="18" 
        rx="2" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M10 7H14" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle 
        cx="12" 
        cy="14" 
        r="2" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DisposableIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M8 5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19V5Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M10 6L14 6" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 3V21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeDasharray="1 3"
      />
    </svg>
  );
};

export const LiquidIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M7 9.5V17C7 19.2091 8.79086 21 11 21H13C15.2091 21 17 19.2091 17 17V9.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M11 3C9.89543 3 9 3.89543 9 5V9.5H15V5C15 3.89543 14.1046 3 13 3H11Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 9.5V15.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeDasharray="1 2"
      />
    </svg>
  );
};

export const TobaccoIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M5 12C5 12 7 8 12 8C17 8 19 12 19 12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 4V8" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 4.5C8 4.5 9 6 12 6C15 6 16 4.5 16 4.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M3 18H21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M5 14H19" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChewingTobaccoIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M7 8H17V16C17 18.2091 15.2091 20 13 20H11C8.79086 20 7 18.2091 7 16V8Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M7 8V6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V8" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9 14H15" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const getCategoryIcon = (icon: string, className?: string) => {
  switch (icon) {
    case 'pod':
      return <PodIcon className={className} />;
    case 'pod-mod':
      return <PodModIcon className={className} />;
    case 'disposable':
      return <DisposableIcon className={className} />;
    case 'liquid':
      return <LiquidIcon className={className} />;
    case 'tobacco':
      return <TobaccoIcon className={className} />;
    case 'chewing-tobacco':
      return <ChewingTobaccoIcon className={className} />;
    default:
      return <PodIcon className={className} />;
  }
};
