import * as React from 'react';
export interface NavProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "Default" | "Selected";
}
export declare const Nav: React.FC<NavProps>;
export default Nav;
