import * as React from 'react';
export interface CTAAnimationProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "Default" | "Hover";
}
export declare const CTAAnimation: React.FC<CTAAnimationProps>;
export default CTAAnimation;
