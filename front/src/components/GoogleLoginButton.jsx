import React, { useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

const GoogleLoginButton = ({ onLogin }) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Не задан GOOGLE_CLIENT_ID");
      return undefined;
    }

    let cancelled = false;
    let hiddenContainer;

    const initialize = () => {
      if (
        cancelled ||
        initializedRef.current ||
        !window.google?.accounts?.id
      ) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (!response?.credential) return;
            try {
              await onLogin(response.credential);
            } catch {
              // The parent reports API errors through the snackbar.
            }
          },
          auto_select: false,
        });

        hiddenContainer = document.getElementById("techmatcher-google-render");
        if (!hiddenContainer) {
          hiddenContainer = document.createElement("div");
          hiddenContainer.id = "techmatcher-google-render";
          hiddenContainer.style.display = "none";
          document.body.appendChild(hiddenContainer);
        }

        window.google.accounts.id.renderButton(hiddenContainer, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
        });

        initializedRef.current = true;
        setReady(true);
      } catch {
        setError("Не удалось загрузить Google авторизацию");
      }
    };

    let script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    const createdScript = !script;
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
      script?.removeEventListener("load", initialize);
      if (createdScript && script?.parentNode) {
        // Keep the SDK script available for other auth components.
      }
    };
  }, [onLogin]);

  const handleClick = () => {
    if (!ready || !window.google?.accounts?.id) return;

    const hiddenContainer = document.getElementById("techmatcher-google-render");
    const googleButton = hiddenContainer?.querySelector('[role="button"]');
    if (googleButton) {
      googleButton.click();
    } else {
      window.google.accounts.id.prompt();
    }
  };

  if (error) {
    return (
      <p className="auth-google-hint">
        {error}. Добавьте GOOGLE_CLIENT_ID в корневой .env и пересоздайте frontend-контейнер.
      </p>
    );
  }

  return (
    <button
      type="button"
      className="auth-google-button"
      onClick={handleClick}
      disabled={!ready}
      style={{
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: "100%",
        minHeight: 48,
        padding: "12px 16px",
        background: "#fff",
        borderColor: "#202124",
        color: "#202124",
        border: "1px solid #d8d8d8",
        borderRadius: 0,
        boxShadow: "4px 4px 0 rgba(20, 20, 20, 0.16)",
        fontSize: 14,
        fontWeight: 600,
        cursor: ready ? "pointer" : "wait",
        opacity: ready ? 1 : 0.6,
        transition: "background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
      }}
      onMouseEnter={(event) => {
        if (!ready) return;
        event.currentTarget.style.background = "#f3f4f6";
        event.currentTarget.style.transform = "translate(-1px, -1px)";
        event.currentTarget.style.boxShadow = "5px 5px 0 rgba(20, 20, 20, 0.22)";
      }}
      onMouseDown={(event) => {
        event.currentTarget.style.transform = "translate(2px, 2px)";
        event.currentTarget.style.boxShadow = "2px 2px 0 rgba(20, 20, 20, 0.16)";
      }}
      onMouseUp={(event) => {
        event.currentTarget.style.transform = "translate(0, 0)";
        event.currentTarget.style.boxShadow = "4px 4px 0 rgba(20, 20, 20, 0.16)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = "#fff";
        event.currentTarget.style.transform = "translate(0, 0)";
        event.currentTarget.style.boxShadow = "4px 4px 0 rgba(20, 20, 20, 0.16)";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.054 14.982 0 12 0 7.354 0 3.307 2.67 1.242 6.554l4.024 3.211z" />
        <path fill="#4285F4" d="M23.605 12.3c0-.828-.074-1.625-.213-2.3H12v4.343h6.505a5.556 5.556 0 0 1-2.414 3.648l3.77 2.923c2.205-2.03 3.744-5.02 3.744-8.614z" />
        <path fill="#FBBC05" d="M5.266 14.235L1.242 17.446A11.947 11.947 0 0 0 12 24c2.937 0 5.645-1.012 7.645-2.733l-3.77-2.923a7.147 7.147 0 0 1-3.875 1.084 7.079 7.079 0 0 1-6.734-4.854z" />
        <path fill="#34A853" d="M5.266 9.765a7.03 7.03 0 0 1 0 4.47l-4.024 3.211a11.934 11.934 0 0 1 0-10.892l4.024 3.211z" />
      </svg>
      <span>Войти через Google</span>
    </button>
  );
};

export default GoogleLoginButton;
