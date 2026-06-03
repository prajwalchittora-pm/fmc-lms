// figma: 223:619 Radio Button (2 variants)
const __variants = {
  "property1=Selected": { border: "revert", overflow: "hidden", backgroundColor: "var(--orange-orange-600)" },
};
const __vkey = (p) => "property1=" + p.property1;

export function RadioButton(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 20,
      border: "1px solid rgb(215,215,215)",
      position: "relative",
      ...__vs, ...props.style,
    }} />
  );
}
export default RadioButton;
