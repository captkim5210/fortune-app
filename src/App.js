import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "love", label: "💕 연애운", color: "#FF6B9D" },
  { id: "money", label: "💰 금전운", color: "#FFB347" },
  { id: "work", label: "💼 직업운", color: "#6C8EBF" },
  { id: "health", label: "🌿 건강운", color: "#56C596" },
];

const ZODIAC = ["양자리","황소자리","쌍둥이자리","게자리","사자자리","처녀자리","천칭자리","전갈자리","사수자리","염소자리","물병자리","물고기자리"];

const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });

function LoadingDots() {
  const [d, setD] = useState("");
  useEffect(() => {
    const t = setInterval(() => setD(p => p.length >= 3 ? "" : p + "."), 400);
    return () => clearInterval(t);
  }, []);
  return <span>{d}</span>;
}

function StarRating({ value }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 18, color: i <= value ? "#FFD700" : "#333" }}>★</span>
      ))}
    </div>
  );
}

function AdBanner({ slot }) {
  return (
    <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)", border: "1px solid #2a2a4a", borderRadius: 10, padding: "10px 16px", textAlign: "center", color: "#888", fontSize: 11, letterSpacing: 1, margin: "10px 0" }}>
      📢 광고 [{slot}] — Google AdMob / Kakao AdFit 삽입 위치
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0f0c29,#1a1040,#0f0c29)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", fontFamily: "sans-serif", color: "#e8e0f7" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🔮</div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>오늘의 운세</div>
        <div style={{ fontSize: 13, color: "#a78bfa", marginTop: 6 }}>로그인하고 나만의 운세를 저장하세요</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: "32px 24px", width: "100%", maxWidth: 380 }}>
        <button onClick={() => onLogin({ id: "kakao", name: "카카오 사용자", avatar: "🟡", provider: "kakao" })} style={{ width: "100%", background: "#FEE500", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10, color: "#333" }}>
          🟡 카카오로 시작하기
        </button>
        <button onClick={() => onLogin({ id: "google", name: "구글 사용자", avatar: "🔵", provider: "google" })} style={{ width: "100%", background: "#4285F4", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10, color: "#fff" }}>
          🔵 Google로 시작하기
        </button>
        <button onClick={() => onLogin({ id: "guest", name: "게스트", avatar: "👤", provider: "guest" })} style={{ width: "100%", background: "transparent", border: "none", borderRadius: 12, padding: "12px", fontSize: 13, cursor: "pointer", color: "#666" }}>
          로그인 없이 둘러보기
        </button>
      </div>
    </div>
  );
}

function GunghapScreen() {
  const [mySign, setMySign] = useState(null);
  const [partnerSign, setPartnerSign] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchGunghap() {
    if (!mySign || !partnerSign) { setError("두 별자리를 모두 선택해주세요."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `${mySign}과 ${partnerSign}의 궁합을 분석해주세요. 반드시 JSON만 응답: {"score":점수(0-100),"grade":"최고/좋음/보통/아쉬움","title":"한줄요약","overall":"전체설명(3문장)","emoji":"이모지2개"}` }]
        })
      });
      const d = await res.json();
      const txt = d.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      setResult(JSON.parse(txt));
    } catch { setError("궁합 분석 중 오류가 발생했어요."); }
    setLoading(false);
  }

  const card = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "18px", marginBottom: 14 };

  return (
    <div style={{ padding: "0 16px", maxWidth: 480, margin: "0 auto" }}>
      <AdBanner slot="궁합-상단" />
      {[{ label: "👤 나의 별자리", val: mySign, set: setMySign }, { label: "💑 상대방 별자리", val: partnerSign, set: setPartnerSign }].map(({ label, val, set }) => (
        <div key={label} style={card}>
          <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600, marginBottom: 10 }}>{label}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ZODIAC.map(z => (
              <button key={z} onClick={() => set(z)} style={{ background: val === z ? "linear-gradient(135deg,#FF6B9D,#C026D3)" : "rgba(255,255,255,0.07)", border: val === z ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 10px", color: val === z ? "#fff" : "#c4b5fd", fontSize: 12, cursor: "pointer" }}>{z}</button>
            ))}
          </div>
        </div>
      ))}
      {error && <div style={{ color: "#f87171", fontSize: 12, marginBottom: 8, textAlign: "center" }}>{error}</div>}
      <button onClick={fetchGunghap} style={{ width: "100%", background: "linear-gradient(135deg,#FF6B9D,#C026D3)", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer", marginBottom: 14 }}>
        💑 궁합 분석하기
      </button>
      {loading && <div style={{ ...card, textAlign: "center", padding: 32 }}><div style={{ fontSize: 40, marginBottom: 12 }}>💑</div><div style={{ color: "#FF6B9D" }}>궁합을 분석하는 중<LoadingDots /></div></div>}
      {result && !loading && (
        <div style={{ ...card, background: "linear-gradient(135deg,rgba(255,107,157,0.2),rgba(192,38,211,0.2))", border: "1px solid rgba(255,107,157,0.3)", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{result.emoji}</div>
          <div style={{ fontSize: 60, fontWeight: 900, color: "#FFD700", lineHeight: 1 }}>{result.score}</div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>/ 100점</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#e9d5ff", marginBottom: 12 }}>{result.title}</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#c4b5fd" }}>{result.overall}</div>
        </div>
      )}
      <AdBanner slot="궁합-하단" />
    </div>
  );
}

export default function FortuneApp() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [sign, setSign] = useState(null);
  const [cat, setCat] = useState(null);
  const [fortune, setFortune] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const card = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "18px", marginBottom: 14 };
  const wrap = { background: "linear-gradient(160deg,#0f0c29,#1a1040,#0f0c29)", minHeight: "100vh", fontFamily: "sans-serif", color: "#e8e0f7", paddingBottom: 80 };

  async function fetchFortune() {
    if (!sign || !cat) return;
    setLoading(true); setError(null); setFortune(null);
    try {
      const catObj = CATEGORIES.find(c => c.id === cat);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `오늘(${today}) ${sign}의 ${catObj.label} 운세를 알려주세요. 반드시 JSON만 응답: {"summary":"한줄핵심(15자이내)","detail":"상세설명(3문장)","advice":"조언(1문장)","score":별점(1~5),"luckyColor":"행운색","luckyNumber":숫자,"luckyTime":"시간"}` }]
        })
      });
      const d = await res.json();
      const txt = d.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      setFortune(JSON.parse(txt));
    } catch { setError("운세를 불러오지 못했어요."); }
    setLoading(false);
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  const TABS = [
    { id: "home", icon: "🌟", label: "운세" },
    { id: "gunghap", icon: "💑", label: "궁합" },
    { id: "mypage", icon: "👤", label: "MY" },
  ];

  return (
    <div style={wrap}>
      <div style={{ background: "linear-gradient(135deg,#6C3FC5,#9B59B6)", padding: "18px 20px 14px", textAlign: "center", boxShadow: "0 4px 20px rgba(108,63,197,0.4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{today}</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>🔮 오늘의 운세</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", cursor: "pointer" }} onClick={() => setTab("mypage")}>
            {user.avatar} {user.name?.split(" ")[0]}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px", maxWidth: 480, margin: "0 auto" }}>
        {tab === "home" && (
          <>
            <AdBanner slot="상단" />
            <div style={card}>
              <div style={{ fontSize: 13, color: "#a78bfa", marginBottom: 10, fontWeight: 600 }}>⭐ 별자리 선택</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {ZODIAC.map(z => (
                  <button key={z} onClick={() => setSign(z)} style={{ background: sign === z ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "rgba(255,255,255,0.07)", border: sign === z ? "1px solid #A855F7" : "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 11px", color: sign === z ? "#fff" : "#c4b5fd", fontSize: 12, cursor: "pointer" }}>{z}</button>
                ))}
              </div>
            </div>
            <div style={card}>
              <div style={{ fontSize: 13, color: "#a78bfa", marginBottom: 10, fontWeight: 600 }}>🎯 운세 종류</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{ background: cat === c.id ? `linear-gradient(135deg,${c.color}44,${c.color}66)` : "rgba(255,255,255,0.05)", border: cat === c.id ? `1px solid ${c.color}` : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 8px", color: cat === c.id ? "#fff" : "#c4b5fd", fontSize: 14, cursor: "pointer" }}>{c.label}</button>
                ))}
              </div>
            </div>
            <button onClick={fetchFortune} disabled={!sign || !cat} style={{ width: "100%", background: sign && cat ? "linear-gradient(135deg,#7C3AED,#C026D3)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 700, color: sign && cat ? "#fff" : "#555", cursor: sign && cat ? "pointer" : "not-allowed", marginBottom: 14 }}>
              🔮 오늘의 운세 보기
            </button>
            {loading && <div style={{ ...card, textAlign: "center", padding: 32 }}><div style={{ fontSize: 36, marginBottom: 12 }}>🔮</div><div style={{ color: "#a78bfa" }}>운세를 읽는 중<LoadingDots /></div></div>}
            {error && <div style={{ ...card, textAlign: "center", color: "#f87171" }}>{error}</div>}
            {fortune && !loading && (
              <>
                <div style={{ ...card, background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(192,38,211,0.2))", border: "1px solid rgba(167,139,250,0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ color: "#a78bfa", fontSize: 12 }}>{sign} · {CATEGORIES.find(c => c.id === cat)?.label}</span>
                    <StarRating value={fortune.score} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#e9d5ff" }}>{fortune.summary}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: "#c4b5fd", marginBottom: 12 }}>{fortune.detail}</div>
                  <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#e9d5ff", borderLeft: "3px solid #a855f7" }}>💡 {fortune.advice}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {[{ label: "행운의 색", val: fortune.luckyColor, icon: "🎨" }, { label: "행운의 숫자", val: fortune.luckyNumber, icon: "🔢" }, { label: "행운의 시간", val: fortune.luckyTime, icon: "⏰" }].map(it => (
                    <div key={it.label} style={{ ...card, textAlign: "center", padding: 12, marginBottom: 0 }}>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{it.icon}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{it.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e9d5ff" }}>{it.val}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <AdBanner slot="하단" />
          </>
        )}

        {tab === "gunghap" && <GunghapScreen />}

        {tab === "mypage" && (
          <div style={{ marginTop: 16 }}>
            <div style={{ ...card, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{user.avatar}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#e9d5ff" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{user.provider} 로그인</div>
            </div>
            <div style={{ ...card, background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(192,38,211,0.1))", border: "1px solid rgba(167,139,250,0.2)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>💎 프리미엄 업그레이드</div>
              <div style={{ fontSize: 13, color: "#c4b5fd", lineHeight: 1.7, marginBottom: 12 }}>· 광고 없이 이용<br />· 매일 아침 맞춤 운세 알림<br />· 궁합 분석 무제한</div>
              <button style={{ width: "100%", background: "linear-gradient(135deg,#FFB347,#FF6B9D)", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>👑 월 4,900원으로 시작하기</button>
            </div>
            <button onClick={() => setUser(null)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "13px", color: "#9ca3af", fontSize: 14, cursor: "pointer" }}>🚪 로그아웃</button>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,12,41,0.96)", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", backdropFilter: "blur(12px)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? "#a78bfa" : "#555", fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}