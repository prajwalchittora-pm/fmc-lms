// figma: 223:366 Quick Filter (2 variants)
const __variants = {
  "property1=Variant2": {
    width: 95,
    backgroundColor: "var(--background-pastel-bg-beige-3)",
    border: "1px solid var(--border-orange)",
    padding: "0px 8px 0px 12px",
  },
};
const __vkey = (p) => "property1=" + p.property1;

export function QuickFilter(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 71,
      height: 36,
      borderRadius: 12,
      backgroundColor: "var(--background-bg-white)",
      border: "1px solid var(--neutral-neutral-100)",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      padding: "0px 12px 0px 12px",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 12,
        top: 9.5,
        width: 47,
        height: 17,
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: 1.2000000476837158,
        color: "var(--text-text-primary)",
      }}>Label 1</span>
    </div>
  );
}
export default QuickFilter;
