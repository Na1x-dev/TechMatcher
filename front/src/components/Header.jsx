import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getReq, resolveMediaUrl } from "../Api";
import { useAuth } from "./AuthContext";
import { useCart } from "../context/CartContext";
import UserAvatar from "./UserAvatar";
import { useCompare } from "../context/CompareContext";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { ids } = useCompare();
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user?.user_id) { setProfile(null); return; }
    let active = true;
    getReq(`users/${user.user_id}/`).then((data) => { if (active) setProfile(data); }).catch(() => { if (active) setProfile(null); });
    const handleProfileUpdate = (event) => setProfile((current) => ({ ...current, ...event.detail }));
    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => {
      active = false;
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [user]);

  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name[0]}.` : ""}`
    : user?.email || "Пользователь";
  const doLogout = () => { setMenuOpen(false); logout(); navigate("/"); };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate("/")} aria-label="TechMatcher">
          <span className="brand-mark">T</span><span>TechMatcher</span>
        </button>
        <nav className="main-nav">
          <NavLink to="/" end>Смартфоны</NavLink><NavLink to="/compare">Сравнение{ids.length ? ` · ${ids.length}` : ""}</NavLink>
        </nav>
        <div className="header-actions">
          <button className={`icon-button cart-button${pathname === "/basket" ? " is-active" : ""}`} onClick={() => navigate("/basket")} aria-label="Корзина" aria-current={pathname === "/basket" ? "page" : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>{itemCount > 0 && <b>{itemCount}</b>}
          </button>
          {user ? (
            <div className="profile-menu-wrap">
              <button className="profile-trigger" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen}>
                <UserAvatar imageUrl={resolveMediaUrl(profile?.image)} label={displayName} size="small" />
                <span className="profile-name">{displayName}</span>
              </button>
              {menuOpen && <>
                <button className="menu-backdrop" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />
                <div className="profile-menu">
                  <button onClick={() => { navigate("/profile"); setMenuOpen(false); }}>Профиль</button>
                  <button onClick={doLogout}>Выйти</button>
                </div>
              </>}
            </div>
          ) : <button className="header-login-button" onClick={() => navigate("/login")}>Войти</button>}
        </div>
      </div>
    </header>
  );
};
export default Header;
