// figma: 223:216 toggle (2 variants)
const __variants = {
  "property1=On": { backgroundColor: "var(--orange-orange-500)" },
};
const __vkey = (p) => "property1=" + p.property1;

export function Toggle2(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 48,
      height: 24,
      overflow: "hidden",
      borderRadius: 20,
      backgroundColor: "var(--neutral-neutral-100)",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 28,
        height: 20,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.8)",
        border: "0.500px solid var(--border-white-2)",
      }} />
    </div>
  );
}
export default Toggle2;
