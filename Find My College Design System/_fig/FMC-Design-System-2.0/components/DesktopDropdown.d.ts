import * as React from 'react';
export interface DesktopDropdownProps {
  className?: string;
  style?: React.CSSProperties;
  dropdown?: "Default" | "Open" | "Selected" | "Select" | "Dropdown6";
}
export declare const DesktopDropdown: React.FC<DesktopDropdownProps>;
export default DesktopDropdown;
