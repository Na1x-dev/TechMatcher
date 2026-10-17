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

      <button className="button general-button button-large" disabled={loading}>
        {loading ? "Создаём…" : "Зарегистрироваться"}
      </button>

      <button type="button" className="auth-switch" onClick={onToggleLogin}>
        Уже есть аккаунт? <strong>Войти</strong>
      </button>
    </form>
  );
};

export default RegistrationForm;
