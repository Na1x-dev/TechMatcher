import React, { useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

const GoogleLoginButton = ({ onLogin }) => {
  console.info("[GoogleLoginButton] rendered; client ID present:", Boolean(GOOGLE_CLIENT_ID));
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Не задан GOOGLE_CLIENT_ID");
      return undefined;
    }

    let cancelled = false;
    const initialize = () => {
      if (cancelled || !window.google?.accounts?.id || !containerRef.current)
        return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response?.credential) return;
          try {
            await onLogin(response.credential);
          } catch (err) {
            // The parent reports API errors through the snackbar.
          }
        },
        auto_select: false,
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 320,
      });
      setReady(true);
    };

    let script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", initialize);
    if (window.google?.accounts?.id) initialize();

    return () => {
      cancelled = true;
      script.removeEventListener("load", initialize);
    };
  }, [onLogin]);

  if (error)
    return (
      <p className="auth-google-hint">
        {error}. Добавьте GOOGLE_CLIENT_ID в корневой .env и пересоздайте frontend-контейнер.
      </p>
    );
  return (
    <div className="auth-google-wrap">
      <div ref={containerRef} />
      {!ready && <span className="auth-google-hint">Загрузка Google…</span>}
    </div>
  );
};

export default GoogleLoginButton;
