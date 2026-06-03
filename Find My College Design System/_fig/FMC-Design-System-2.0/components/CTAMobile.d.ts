import * as React from 'react';
export interface CTAMobileProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "Primary" | "Secondary" | "Tertiary";
  size?: "Large" | "Medium" | "Small";
  icon?: "Right" | "Left" | "No";
}
export declare const CTAMobile: React.FC<CTAMobileProps>;
export default CTAMobile;
