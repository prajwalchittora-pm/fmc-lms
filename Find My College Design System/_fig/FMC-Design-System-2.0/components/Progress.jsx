// figma: 223:231 progress
export function Progress(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 402,
      height: 4,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 402,
        height: 4,
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 128.667,
          height: 4,
          borderRadius: 20,
          backgroundColor: "var(--orange-orange-600)",
        }} />
        <div style={{
          position: "absolute",
          left: 136.667,
          top: 0,
          width: 128.667,
          height: 4,
          borderRadius: 20,
          backgroundColor: "rgb(215,215,215)",
        }} />
        <div style={{
          position: "absolute",
          left: 273.333,
          top: 0,
          width: 128.667,
          height: 4,
          borderRadius: 20,
          backgroundColor: "rgb(215,215,215)",
        }} />
      </div>
    </div>
  );
}
export default Progress;
