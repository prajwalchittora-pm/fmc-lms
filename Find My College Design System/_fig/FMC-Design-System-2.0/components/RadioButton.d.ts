import * as React from 'react';
export interface RadioButtonProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "Default" | "Selected";
}
export declare const RadioButton: React.FC<RadioButtonProps>;
export default RadioButton;
