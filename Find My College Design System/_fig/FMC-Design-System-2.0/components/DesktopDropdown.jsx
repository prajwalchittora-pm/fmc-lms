// figma: 127:601 Desktop dropdown (5 variants)
const __variants = {
  "dropdown=Dropdown6": { height: 91 },
};
const __vkey = (p) => "dropdown=" + p.dropdown;

export function DesktopDropdown(_p = {}) {
  const props = { ..._p, dropdown: _p.dropdown ?? "Default" };
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
        fontWeight: 500,
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
        padding: "0px 12px 0px 16px",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          position: "absolute",
          left: 16,
          top: 11.5,
          width: 89,
          height: 21,
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 1.5,
          color: "var(--text-text-tertiary)",
        }}>Select option</span>
        <div style={{
          position: "absolute",
          left: 360,
          top: 10,
          width: 24,
          height: 24,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 24,
            height: 24,
            backgroundColor: "rgb(217,217,217)",
          }} />
          <div style={{
            position: "absolute",
            left: 6,
            top: 9,
            width: 11.15,
            height: 6.55,
            backgroundColor: "var(--border-black)",
          }} />
        </div>
      </div>
    </div>
  );
}
export default DesktopDropdown;
