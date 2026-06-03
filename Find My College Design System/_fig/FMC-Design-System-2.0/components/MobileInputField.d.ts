import * as React from 'react';
export interface MobileInputFieldProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "Default" | "Filled" | "Error" | "Clicked";
}
export declare const MobileInputField: React.FC<MobileInputFieldProps>;
export default MobileInputField;
