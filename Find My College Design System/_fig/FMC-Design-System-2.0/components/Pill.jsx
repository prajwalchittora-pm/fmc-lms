// figma: 173:22 Pill (2 variants)
const __variants = {
  "state=Selected": { backgroundColor: "var(--background-pastel-bg-beige-3)", border: "1px solid var(--border-orange)" },
};
const __vkey = (p) => "state=" + p.state;

export function Pill(_p = {}) {
  const props = { ..._p, state: _p.state ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 85,
      height: 44,
      borderRadius: 50,
      backgroundColor: "var(--background-bg-white)",
      border: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "0px 24px 0px 24px",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 24,
        top: 11.5,
        width: 37,
        height: 21,
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: 14,
        textAlign: "center",
        lineHeight: 1.5,
        color: "var(--text-text-primary)",
      }}>Label</span>
    </div>
  );
}
export default Pill;
