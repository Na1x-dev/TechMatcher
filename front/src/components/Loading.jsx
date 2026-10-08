import React from "react";

const Loading = ({ label = "Загрузка…" }) => (
  <div className="state-screen" role="status">
    <div className="spinner" />
    <span>{label}</span>
  </div>
);
export default Loading;
