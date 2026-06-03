import * as React from 'react';
export interface CTADesktopProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "Primary" | "Secondary" | "Tertiary";
  size?: "Large" | "Medium";
  icon?: "Right" | "Left" | "No";
}
export declare const CTADesktop: React.FC<CTADesktopProps>;
export default CTADesktop;
