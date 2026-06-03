// figma: 223:404 Side Bar (2 variants)
const __variants = {

};
const __vkey = (p) => "property1=" + p.property1;

export function SideBar(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 120,
      height: 56,
      overflow: "hidden",
      backgroundColor: "var(--background-bg-white)",
      border: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 1,
        top: 0,
        width: 118,
        height: 56,
        display: "flex",
        flexDirection: "row",
        gap: 20,
        padding: "16px 16px 16px 16px",
      }}>
        <div style={{
          position: "absolute",
          left: 16,
          top: 16,
          width: 86,
          height: 24,
          display: "flex",
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
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
              left: 2,
              top: 2,
              width: 20,
              height: 20,
              backgroundColor: "var(--border-black)",
            }} />
          </div>
          <span style={{
            position: "absolute",
            left: 36,
            top: 2.5,
            width: 50,
            height: 19,
            fontFamily: "Bricolage Grotesque",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.2000000476837158,
            color: "var(--text-text-primary)",
          }}>Label 1</span>
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: -64,
        top: 56,
        width: 248,
        height: 0,
        border: "1px solid var(--border-subtle)",
      }} />
      <div style={{
        position: "absolute",
        left: -64,
        top: 56,
        width: 248,
        height: 0,
        border: "1px solid var(--border-subtle)",
      }} />
      <div style={{
        position: "absolute",
        left: -64,
        top: 56,
        width: 248,
        height: 0,
        border: "1px solid var(--border-subtle)",
      }} />
      <div style={{
        position: "absolute",
        left: -64,
        top: 56,
        width: 248,
        height: 0,
        border: "1px solid var(--border-subtle)",
      }} />
      <div style={{
        position: "absolute",
        left: -64,
        top: 56,
        width: 248,
        height: 0,
        border: "1px solid var(--border-subtle)",
      }} />
      <div style={{
        position: "absolute",
        left: -64,
        top: 56,
        width: 248,
        height: 0,
        border: "1px solid var(--border-subtle)",
      }} />
      <div style={{
        position: "absolute",
        left: -64,
        top: 56,
        width: 248,
        height: 0,
        border: "1px solid var(--border-subtle)",
      }} />
      <div style={{
        position: "absolute",
        left: -64,
        top: 56,
        width: 248,
        height: 0,
        border: "1px solid var(--border-subtle)",
      }} />
    </div>
  );
}
export default SideBar;
