// figma: 52:567 CTA animation (2 variants)
const __variants = {
  "state=Hover": { backgroundColor: "var(--blue-blue-800)" },
};
const __vkey = (p) => "state=" + p.state;

export function CTAAnimation(_p = {}) {
  const props = { ..._p, state: _p.state ?? "Default" };
  const __vs = __variants[__vkey(props)] ?? {};
  return (
    <div className={props.className} style={{
      width: 215,
      height: 50,
      overflow: "hidden",
      borderRadius: 12,
      backgroundColor: "var(--text-text-cta-light-bg)",
      position: "relative",
      ...__vs, ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 20,
        top: 14,
        width: 175,
        height: 22,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 175,
          height: 22,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            left: 162,
            top: 1,
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
          <span style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 162,
            height: 22,
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.399999976158142,
            color: "var(--text-text-cta-dark-bg)",
          }}>Get Free Counselling</span>
        </div>
        <div style={{
          position: "absolute",
          left: 19,
          top: 39,
          width: 135,
          height: 14,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            left: 119,
            top: -2,
            width: 16,
            height: 16,
            opacity: 0.5,
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 16,
              height: 16,
              backgroundColor: "rgb(217,217,217)",
            }} />
            <div style={{
              position: "absolute",
              left: 5.617,
              top: 4.283,
              width: 4.367,
              height: 7.433,
              backgroundColor: "rgb(255,255,255)",
            }} />
          </div>
          <span style={{
            position: "absolute",
            left: 0,
            top: -3,
            width: 119,
            height: 17,
            opacity: 0.5,
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 12,
            textAlign: "right",
            lineHeight: 1.399999976158142,
            color: "rgb(255,255,255)",
          }}>Get free Counselling</span>
        </div>
      </div>
    </div>
  );
}
export default CTAAnimation;
