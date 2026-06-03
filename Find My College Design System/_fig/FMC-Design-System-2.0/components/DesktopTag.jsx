// figma: 210:21 Desktop Tag
export function DesktopTag(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 369,
      height: 38,
      overflow: "hidden",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 4.715,
        top: 0,
        width: 359.429,
        height: 38,
        backgroundColor: "rgb(230,249,237)",
      }} />
      <div style={{
        position: "absolute",
        left: 149.215,
        top: 8,
        width: 71,
        height: 22,
        display: "flex",
        flexDirection: "row",
        gap: 4,
        padding: "0px 8px 0px 0px",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 22,
          height: 22,
        }}>
          <div style={{
            position: "absolute",
            left: 7,
            top: 5,
            width: 8.8,
            height: 12.582,
            backgroundColor: "rgb(0,117,40)",
          }} />
        </div>
        <span style={{
          position: "absolute",
          left: 26,
          top: 2.5,
          width: 37,
          height: 17,
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 1.2000000476837158,
          color: "rgb(0,117,40)",
        }}>Label</span>
      </div>
    </div>
  );
}
export default DesktopTag;
