import * as React from 'react';
export interface SideBarProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "Default" | "Selected";
}
export declare const SideBar: React.FC<SideBarProps>;
export default SideBar;
