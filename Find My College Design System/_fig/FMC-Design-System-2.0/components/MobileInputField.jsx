// figma: 127:671 Mobile Input field (4 variants)
const __variants = {
  "state=Error": { height: 93 },
};
const __vkey = (p) => "state=" + p.state;

export function MobileInputField(_p = {}) {
  const props = { ..._p, state: _p.state ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 318,
      height: 71,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 318,
        height: 17,
        fontFamily: "Inter",
        fontWeight: 700,
        fontSize: 16,
        lineHeight: 1.5,
        color: "var(--text-text-primary)",
      }}>Label</span>
      <div style={{
        position: "absolute",
        left: 0,
        top: 27,
        width: 318,
        height: 44,
        borderRadius: 12,
        backgroundColor: "var(--background-bg-white)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "row",
        gap: 2,
        padding: "0px 16px 0px 16px",
        alignItems: "center",
      }}>
        <span style={{
          position: "absolute",
          left: 16,
          top: 11.5,
          width: 112,
          height: 21,
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 1.5,
          color: "var(--text-text-tertiary)",
        }}>Placeholder Text</span>
      </div>
    </div>
  );
}
export default MobileInputField;
