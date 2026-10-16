import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { getApiError, postReq } from "../Api";

const FIELDS = [
  ["email", "Email", "email", true],
  ["last_name", "Фамилия", "text", true],
  ["first_name", "Имя", "text", true],
  ["patronymic", "Отчество", "text", false],
  ["phone_number", "Телефон", "tel", false],
  ["password", "Пароль", "password", true],
];

const INITIAL_FORM = {
  email: "",
  first_name: "",
  last_name: "",
  patronymic: "",
  password: "",
  phone_number: "",
};

const RegistrationForm = ({ onToggleLogin }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const submit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.first_name || !form.last_name || !form.password) {
      enqueueSnackbar("Заполните обязательные поля", { variant: "warning" });
      return;
    }

    setLoading(true);

    try {
      await postReq("register/", form);
      enqueueSnackbar("Аккаунт создан. Теперь войдите.", { variant: "success" });
      onToggleLogin();
    } catch (err) {
      enqueueSnackbar(getApiError(err, "Не удалось зарегистрироваться"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-title">
        <span className="section-kicker">CREATE ACCOUNT</span>
        <h1>Создайте аккаунт.</h1>
        <p>
          Ваши данные и корзина будут доступны после входа с любого сеанса.
        </p>
      </div>

      {FIELDS.map(([name, label, type, required]) => (
        <label className="field" key={name}>
          <span>{label}</span>
          <input
            type={type}
            required={required}
            value={form[name]}
            onChange={(event) =>
              setForm({ ...form, [name]: event.target.value })
            }
          />
        </label>
      ))}

      <button className="button general-button button-large" disabled={loading}
        onMouseEnter={(event) => {
          if (loading) return;
          event.currentTarget.style.transform = "translate(-1px, -1px)";
          event.currentTarget.style.boxShadow = "5px 5px 0 rgba(20, 20, 20, 0.22)";
          event.currentTarget.style.filter = "brightness(1.06)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translate(0, 0)";
          event.currentTarget.style.boxShadow = "";
          event.currentTarget.style.filter = "";
        }}
        onMouseDown={(event) => {
          if (loading) return;
          event.currentTarget.style.transform = "translate(2px, 2px)";
          event.currentTarget.style.boxShadow = "1px 1px 0 rgba(20, 20, 20, 0.18)";
        }}
        onMouseUp={(event) => {
          event.currentTarget.style.transform = "translate(-1px, -1px)";
          event.currentTarget.style.boxShadow = "5px 5px 0 rgba(20, 20, 20, 0.22)";
        }}>
        {loading ? "Создаём…" : "Зарегистрироваться"}
      </button>

      <button
        type="button"
        className="auth-switch"
        onClick={onToggleLogin}
        onMouseEnter={(event) => {
          event.currentTarget.style.color = "#2563eb";
          event.currentTarget.style.textDecoration = "underline";
          event.currentTarget.style.textUnderlineOffset = "4px";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.color = "";
          event.currentTarget.style.textDecoration = "";
          event.currentTarget.style.textUnderlineOffset = "";
        }
      >
        Уже есть аккаунт? <strong>Войти</strong>
      </button>
    </form>
  );
};

export default RegistrationForm;
