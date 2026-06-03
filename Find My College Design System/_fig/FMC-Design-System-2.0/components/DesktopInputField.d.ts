import * as React from 'react';
export interface DesktopInputFieldProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "Default" | "Filled" | "Error" | "Clicked";
}
export declare const DesktopInputField: React.FC<DesktopInputFieldProps>;
export default DesktopInputField;
