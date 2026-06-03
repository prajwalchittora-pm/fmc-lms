// figma: 223:191 Segmented Buttons
export function SegmentedButtons(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 178,
      height: 56,
      overflow: "hidden",
      borderRadius: 40,
      backgroundColor: "rgb(234,234,234)",
      display: "flex",
      flexDirection: "row",
      padding: "1px 1px 1px 1px",
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 1,
        top: 1,
        width: 87,
        height: 54,
        borderRadius: 50,
        backgroundColor: "var(--background-bg-white)",
        display: "flex",
        flexDirection: "row",
        gap: 4,
        padding: "0px 20px 0px 20px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <span style={{
          position: "absolute",
          left: 20,
          top: 18.5,
          width: 47,
          height: 17,
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 1,
          color: "var(--text-heading-hghlights)",
        }}>Label 1</span>
      </div>
      <div style={{
        position: "absolute",
        left: 88,
        top: 1,
        width: 89,
        height: 54,
        borderRadius: 50,
        display: "flex",
        flexDirection: "row",
        gap: 4,
        padding: "0px 20px 0px 20px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <span style={{
          position: "absolute",
          left: 20,
          top: 18.5,
          width: 49,
          height: 17,
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 14,
          lineHeight: 1,
          color: "var(--text-text-primary)",
        }}>Label 2</span>
      </div>
    </div>
  );
}
export default SegmentedButtons;
