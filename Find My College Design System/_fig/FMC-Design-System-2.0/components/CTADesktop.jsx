// figma: 54:606 CTA Desktop (18 variants)
const __variants = {
  "type=Secondary|size=Large|icon=Right": { backgroundColor: "var(--text-text-cta-dark-bg)", border: "1px solid var(--blue-blue-700)" },
  "type=Tertiary|size=Large|icon=Right": { borderRadius: "revert", backgroundColor: "revert" },
  "type=Primary|size=Large|icon=Left": { padding: "0px 28px 0px 24px" },
  "type=Secondary|size=Large|icon=Left": { backgroundColor: "var(--text-text-cta-dark-bg)", padding: "0px 28px 0px 24px", border: "1px solid var(--blue-blue-700)" },
  "type=Tertiary|size=Large|icon=Left": { borderRadius: "revert", backgroundColor: "revert", padding: "0px 28px 0px 24px" },
  "type=Primary|size=Large|icon=No": { width: 218, padding: "0px 28px 0px 28px" },
  "type=Secondary|size=Large|icon=No": {
    width: 218,
    backgroundColor: "var(--text-text-cta-dark-bg)",
    padding: "0px 28px 0px 28px",
    border: "1px solid var(--blue-blue-700)",
  },
  "type=Tertiary|size=Large|icon=No": {
    width: 218,
    borderRadius: "revert",
    backgroundColor: "revert",
    padding: "0px 28px 0px 28px",
  },
  "type=Primary|size=Medium|icon=Right": { height: 44 },
  "type=Secondary|size=Medium|icon=Right": { height: 44, backgroundColor: "var(--text-text-cta-dark-bg)", border: "1px solid var(--blue-blue-700)" },
  "type=Tertiary|size=Medium|icon=Right": { height: 44, borderRadius: "revert", backgroundColor: "revert" },
  "type=Primary|size=Medium|icon=Left": { height: 44, padding: "0px 28px 0px 24px" },
  "type=Secondary|size=Medium|icon=Left": {
    height: 44,
    backgroundColor: "var(--text-text-cta-dark-bg)",
    padding: "0px 28px 0px 24px",
    border: "1px solid var(--blue-blue-700)",
  },
  "type=Tertiary|size=Medium|icon=Left": {
    height: 44,
    borderRadius: "revert",
    backgroundColor: "revert",
    padding: "0px 28px 0px 24px",
  },
  "type=Primary|size=Medium|icon=No": { width: 218, height: 44, padding: "0px 28px 0px 28px" },
  "type=Secondary|size=Medium|icon=No": {
    width: 218,
    height: 44,
    backgroundColor: "var(--text-text-cta-dark-bg)",
    padding: "0px 28px 0px 28px",
    border: "1px solid var(--blue-blue-700)",
  },
  "type=Tertiary|size=Medium|icon=No": {
    width: 218,
    height: 44,
    borderRadius: "revert",
    backgroundColor: "revert",
    padding: "0px 28px 0px 28px",
  },
};
const __vkey = (p) => "type=" + p.type + '|' + "size=" + p.size + '|' + "icon=" + p.icon;

export function CTADesktop(_p = {}) {
  const props = { ..._p, type: _p.type ?? "Primary", size: _p.size ?? "Large", icon: _p.icon ?? "Right" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 234,
      height: 50,
      overflow: "hidden",
      borderRadius: 12,
      backgroundColor: "var(--text-text-cta-light-bg)",
      display: "flex",
      flexDirection: "row",
      padding: "0px 24px 0px 28px",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 28,
        top: 14,
        width: 162,
        height: 22,
        fontFamily: "Inter",
        fontWeight: 700,
        fontSize: 16,
        lineHeight: 1.399999976158142,
        color: "var(--text-text-cta-dark-bg)",
      }}>Get Free Counselling</span>
      <div style={{
        position: "absolute",
        left: 190,
        top: 15,
        width: 20,
        height: 20,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 20,
          height: 20,
          backgroundColor: "rgb(217,217,217)",
        }} />
        <div style={{
          position: "absolute",
          left: 7.021,
          top: 5.354,
          width: 5.458,
          height: 9.292,
          backgroundColor: "var(--border-white-2)",
        }} />
      </div>
    </div>
  );
}
export default CTADesktop;
