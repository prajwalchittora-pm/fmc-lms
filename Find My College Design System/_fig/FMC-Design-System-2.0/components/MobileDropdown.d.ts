import * as React from 'react';
export interface MobileDropdownProps {
  className?: string;
  style?: React.CSSProperties;
  dropdown?: "Default" | "Open" | "Selected" | "Select" | "Dropdown6";
}
export declare const MobileDropdown: React.FC<MobileDropdownProps>;
export default MobileDropdown;
