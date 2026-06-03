import * as React from 'react';
export interface CheckBoxProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "Default" | "Selected";
}
export declare const CheckBox: React.FC<CheckBoxProps>;
export default CheckBox;
