import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";

const Login = () => { const [register, setRegister] = useState(false); const navigate = useNavigate(); return <main className="auth-page"><div className="auth-brand"><button className="brand" onClick={() => navigate("/")}><span className="brand-mark">T</span><span>TechMatcher</span></button><div className="auth-poster"><span>SMART</span><strong>CHOICE</strong><small>find your device</small></div></div><div className="auth-panel">{register ? <RegistrationForm onToggleLogin={() => setRegister(false)} /> : <LoginForm onToggleRegister={() => setRegister(true)} />}</div></main>; };
export default Login;
