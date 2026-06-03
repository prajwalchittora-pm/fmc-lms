// figma: 127:587 Desktop input field (4 variants)
const __variants = {
  "state=Error": { height: 97 },
};
const __vkey = (p) => "state=" + p.state;

export function DesktopInputField(_p = {}) {
  const props = { ..._p, state: _p.state ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 396,
      height: 69,
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
        width: 396,
        height: 17,
        fontFamily: "Inter",
        fontWeight: 700,
        fontSize: 14,
        lineHeight: 1.2000000476837158,
        color: "var(--text-text-primary)",
      }}>Label</span>
      <div style={{
        position: "absolute",
        left: 0,
        top: 25,
        width: 396,
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
          width: 80,
          height: 21,
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 1.5,
          color: "var(--text-text-tertiary)",
        }}>Placeholder</span>
      </div>
    </div>
  );
}
export default DesktopInputField;
