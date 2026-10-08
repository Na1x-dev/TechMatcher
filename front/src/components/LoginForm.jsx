import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { postReq, getApiError } from "../Api";
import { useAuth } from "./AuthContext";

const LoginForm = ({ onToggleRegister }) => {
  const navigate = useNavigate(); const { enqueueSnackbar } = useSnackbar(); const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" }); const [loading, setLoading] = useState(false);
  const submit = async (e) => { e.preventDefault(); if (!form.email || !form.password) return enqueueSnackbar("Заполните email и пароль", { variant: "warning" }); setLoading(true); try { const data = await postReq("token/", form); if (!data?.access) throw new Error("No token"); login(data.access, data.refresh); enqueueSnackbar("Добро пожаловать!", { variant: "success" }); navigate("/"); } catch (err) { enqueueSnackbar(getApiError(err, "Неверный email или пароль"), { variant: "error" }); } finally { setLoading(false); } };
  return <form className="auth-form" onSubmit={submit}><div className="auth-title"><span className="section-kicker">WELCOME BACK</span><h1>С возвращением.</h1><p>Войдите, чтобы синхронизировать корзину и открыть профиль.</p></div><label className="field"><span>Email</span><input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label className="field"><span>Пароль</span><input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></label><button className="button button-primary button-large" disabled={loading}>{loading ? "Входим…" : "Войти"}</button><button type="button" className="auth-switch" onClick={onToggleRegister}>Ещё нет аккаунта? <strong>Зарегистрироваться</strong></button></form>;
};
export default LoginForm;
