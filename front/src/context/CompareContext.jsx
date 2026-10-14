import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "techmatcher_compare_ids";
const CompareContext = createContext(null);
const readIds = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map(Number).filter(Number.isFinite); }
  catch { return []; }
};

export const CompareProvider = ({ children }) => {
  const [ids, setIds] = useState(readIds);
  const save = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIds(next);
  }, []);
  const toggleCompare = useCallback((product) => {
    const id = Number(product.id);
    const current = readIds();
    if (current.includes(id)) save(current.filter((item) => item !== id));
    else save([...current, id]);
  }, [save]);
  const isCompared = useCallback((id) => ids.includes(Number(id)), [ids]);
  const value = useMemo(() => ({ ids, toggleCompare, isCompared, clearCompare: () => save([]) }), [ids, toggleCompare, isCompared, save]);
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare должен использоваться внутри CompareProvider");
  return context;
};
