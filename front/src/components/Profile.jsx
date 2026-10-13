import React, { useEffect, useState } from "react";
import { getApiError, getReq, putReq, resolveMediaUrl } from "../Api";
import { useAuth } from "./AuthContext";
import { useSnackbar } from "notistack";
import Loading from "./Loading";
import UserAvatar from "./UserAvatar";

const Profile = () => {
  const { user, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [profile, setProfile] = useState({ first_name: "", last_name: "", patronymic: "", phone_number: "", image: null });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.user_id) { setLoading(false); return; }
    let active = true;
    getReq(`users/${user.user_id}/`)
      .then((data) => {
        if (!active) return;
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          patronymic: data.patronymic || "",
          phone_number: data.phone_number || "",
          image: null,
        });
        setPreview(resolveMediaUrl(data.image));
      })
      .catch((error) => enqueueSnackbar(getApiError(error, "Не удалось загрузить профиль"), { variant: "error" }))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, enqueueSnackbar]);

  useEffect(() => () => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Выберите файл изображения", { variant: "warning" });
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("Размер изображения не должен превышать 5 МБ", { variant: "warning" });
      event.target.value = "";
      return;
    }
    setProfile((current) => ({ ...current, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const data = new FormData();
    ["first_name", "last_name", "patronymic", "phone_number"].forEach((key) => data.append(key, profile[key] || ""));
    if (profile.image) data.append("image", profile.image);
    try {
      const updated = await putReq(`users/${user.user_id}/`, data);
      setProfile((current) => ({ ...current, image: null }));
      setPreview(resolveMediaUrl(updated.image));
      enqueueSnackbar("Профиль сохранён", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getApiError(error, "Не удалось сохранить профиль"), { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || user?.email || "Пользователь";

  return (
    <main className="account-page">
      <div className="account-head"><div><div className="section-kicker">АККАУНТ / НАСТРОЙКИ</div><h1>Личный кабинет</h1></div><button type="button" className="button button-ghost" onClick={logout}>Выйти</button></div>
      <form className="profile-card" onSubmit={submit}>
        <div className="profile-aside">
          <UserAvatar imageUrl={preview} label={displayName} size="large" className="profile-avatar" />
          <label className="button button-outline avatar-upload-button">Изменить фото<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={chooseImage} /></label>
          <span className="muted">JPG, PNG, WEBP · до 5 МБ</span>
          {profile.image && <span className="avatar-pending">Новое фото готово к сохранению</span>}
        </div>
        <div className="form-grid">
          {[
            ["last_name", "Фамилия", true],
            ["first_name", "Имя", true],
            ["patronymic", "Отчество", false],
            ["phone_number", "Телефон", false],
          ].map(([name, label, required]) => (
            <label className="field" key={name}><span>{label}</span><input name={name} value={profile[name]} required={required} onChange={(event) => setProfile((current) => ({ ...current, [name]: event.target.value }))} /></label>
          ))}
          <div className="form-actions"><button className="button button-primary" disabled={saving}>{saving ? "Сохраняем…" : "Сохранить изменения"}</button></div>
        </div>
      </form>
    </main>
  );
};
export default Profile;
