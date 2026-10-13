import React, { useEffect, useRef, useState } from "react";

const AnimatedSelect = ({ value, options, onChange, placeholder = "Выберите вариант", label }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={`animated-select ${open ? "is-open" : ""}`} ref={rootRef}>
      <button type="button" className="animated-select-trigger" aria-label={label} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span className={selected ? "" : "select-placeholder"}>{selected?.label || placeholder}</span>
        <svg className="select-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 5.75 4.5 4.5 4.5-4.5" /></svg>
      </button>
      <div className="animated-select-popover" aria-hidden={!open}>
        <div className="animated-select-options" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button type="button" role="option" aria-selected={String(option.value) === String(value)} className={`animated-select-option ${String(option.value) === String(value) ? "selected" : ""}`} key={String(option.value)} onClick={() => { onChange(option.value); setOpen(false); }}>
              <span>{option.label}</span>{String(option.value) === String(value) && <span className="select-check" aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AnimatedSelect;
