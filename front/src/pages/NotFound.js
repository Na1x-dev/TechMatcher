import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
const NotFound = () => { const navigate = useNavigate(); return <div className="app-shell"><Header /><main className="not-found"><span>404</span><h1>Страница не найдена</h1><p>Похоже, такой страницы в TechMatcher больше нет.</p><button className="button button-primary" onClick={() => navigate("/")}>Вернуться в каталог</button></main><Footer /></div>; };
export default NotFound;
