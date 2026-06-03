// figma: 223:438 Search Bar
export function SearchBar(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 300,
      height: 36,
      overflow: "hidden",
      borderRadius: 12,
      backgroundColor: "var(--background-bg-white)",
      border: "1px solid var(--neutral-neutral-100)",
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "10px 16px 10px 12px",
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 12,
        top: 8,
        width: 127,
        height: 20,
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
      }}>
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 20,
            height: 20,
          }} data-external={"zoom/search"} />
        <span style={{
          position: "absolute",
          left: 28,
          top: 1.5,
          width: 99,
          height: 17,
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 14,
          lineHeight: 1.2000000476837158,
          color: "var(--text-text-tertiary)",
        }}>Search college</span>
      </div>
    </div>
  );
}
export default SearchBar;
