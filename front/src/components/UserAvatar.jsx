import React, { useState } from "react";

const UserAvatar = ({ imageUrl, label = "Пользователь", size = "small", className = "" }) => {
  const [failedUrl, setFailedUrl] = useState("");
  const source = imageUrl && failedUrl !== imageUrl ? imageUrl : "/default-user.svg";
  return (
    <span className={`user-avatar user-avatar--${size} ${className}`.trim()}>
      <img
        src={source}
        alt={imageUrl && source !== "/default-user.svg" ? `Аватар: ${label}` : "Аватар пользователя по умолчанию"}
        onError={() => { if (source !== "/default-user.svg") setFailedUrl(imageUrl); }}
      />
    </span>
  );
};
export default UserAvatar;
