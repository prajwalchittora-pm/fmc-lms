import * as React from 'react';
export interface PillProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "Default" | "Selected";
}
export declare const Pill: React.FC<PillProps>;
export default Pill;
