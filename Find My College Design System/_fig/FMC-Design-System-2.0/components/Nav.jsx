// figma: 223:530 Nav (2 variants)
const __variants = {
  "property1=Selected": { height: 24 },
};
const __vkey = (p) => "property1=" + p.property1;

export function Nav(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 37,
      height: 14,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 37,
        height: 14,
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: 1,
        color: "var(--text-text-primary)",
      }}>Label</span>
    </div>
  );
}
export default Nav;
