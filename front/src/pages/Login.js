import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";

const Login = () => { const [register, setRegister] = useState(false); const navigate = useNavigate(); return <main className="auth-page"><div className="auth-brand"><svg className="auth-art" viewBox="0 0 900 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="authGlow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffbd00" stopOpacity=".9" /><stop offset="100%" stopColor="#e7a6c3" stopOpacity=".12" /></linearGradient></defs><circle cx="690" cy="190" r="155" fill="none" stroke="#ffbd00" strokeWidth="2" opacity=".65" /><circle cx="690" cy="190" r="112" fill="url(#authGlow)" opacity=".28" /><path d="M520 40 C650 95 730 230 860 260" fill="none" stroke="#f4c5dc" strokeWidth="2" opacity=".65" /><path d="M470 0 C580 140 590 270 760 360 S850 540 900 560" fill="none" stroke="#ffbd00" strokeWidth="3" opacity=".7" /><rect x="600" y="430" width="190" height="190" rx="34" fill="none" stroke="#e7a6c3" strokeWidth="2" transform="rotate(18 695 525)" /><rect x="640" y="470" width="110" height="110" rx="24" fill="#ffbd00" opacity=".16" transform="rotate(18 695 525)" /><path d="M40 620 C180 560 240 680 380 620 S510 590 570 660" fill="none" stroke="#e7a6c3" strokeWidth="2" opacity=".6" /><circle cx="160" cy="710" r="7" fill="#ffbd00" /><circle cx="198" cy="730" r="4" fill="#e7a6c3" /><circle cx="235" cy="748" r="3" fill="#ffbd00" /><g fill="none" stroke="#803e6c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".58">
  <g transform="translate(95 170) rotate(-12)">
    <rect x="0" y="0" width="105" height="190" rx="16" fill="#fff8f7" fillOpacity=".58" />
    <rect x="9" y="22" width="87" height="145" rx="5" stroke="#ffbd00" />
    <path d="M40 10h25 M43 178h19" />
    <circle cx="52" cy="94" r="19" stroke="#e7a6c3" /><path d="M52 83v22m-11-11h22" stroke="#ffbd00"/>
  </g>
  <g transform="translate(650 105) rotate(13)">
    <path d="M0 42 Q0 0 42 0 H115 Q157 0 157 42 V70 H0Z" fill="#fff8f7" fillOpacity=".58"/>
    <rect x="15" y="15" width="127" height="40" rx="8" stroke="#ffbd00"/>
    <path d="M22 70v14m20-14v14m20-14v14m20-14v14m20-14v14m20-14v14"/>
    <circle cx="126" cy="35" r="5" fill="#ffbd00"/><path d="M40 28h47m-47 13h31"/>
  </g>
  <g transform="translate(680 600) rotate(-10)">
    <path d="M10 70V48a48 48 0 0 1 96 0v22" stroke="#ffbd00" strokeWidth="9"/>
    <rect x="0" y="55" width="28" height="57" rx="12" fill="#fff8f7" />
    <rect x="88" y="55" width="28" height="57" rx="12" fill="#fff8f7" />
    <path d="M14 72v21m88-21v21" stroke="#e7a6c3"/>
  </g>
  <g transform="translate(350 680) rotate(8)">
    <rect x="0" y="0" width="145" height="92" rx="10" fill="#fff8f7" fillOpacity=".58"/>
    <rect x="12" y="12" width="121" height="68" rx="5" stroke="#ffbd00"/>
    <circle cx="72" cy="46" r="22" stroke="#e7a6c3"/><circle cx="72" cy="46" r="10" stroke="#ffbd00"/>
    <path d="M-13 93h171"/>
  </g>
  <g transform="translate(260 250)" opacity=".8">
    <path d="M0 0h60v60H0z" stroke="#ffbd00" strokeDasharray="5 6"/>
    <path d="M15 15h30v30H15zM30 5v10m0 30v10M5 30h10m30 0h10" />
  </g>
</g></svg><button className="brand" onClick={() => navigate("/")}><span className="brand-mark">T</span><span>TechMatcher</span></button><div className="auth-poster"><span>SMART</span><strong>CHOICE</strong><small>find your device</small></div></div><div className="auth-panel">{register ? <RegistrationForm onToggleLogin={() => setRegister(false)} /> : <LoginForm onToggleRegister={() => setRegister(true)} />}</div></main>; };
export default Login;
