import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/authSlice";
import MainInfo from "../mainInfo/MainInfo";
import { useTranslation } from "react-i18next";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { me, error } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [inputError, setInputError] = useState("");

  // Функція для перевірки, чи є в рядку кирилиця
  const containsCyrillic = (text: string) => /[а-яА-ЯёЁіІїЇєЄґҐ]/.test(text);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    if (containsCyrillic(value)) {
      setInputError(t('latinonic error'));
    } else {
      setInputError("");
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    if (containsCyrillic(value)) {
      setInputError(t('latinonic error'));
    } else {
      setInputError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Перевірка перед відправкою
    if (containsCyrillic(firstName) || containsCyrillic(lastName)) {
      setInputError(t('latinonic error'));
      return;
    }

    setInputError("");
    dispatch(authActions.login({ firstName, lastName }));
  };

  useEffect(() => {
    // Тут можна автоматично підтягнути guest, якщо потрібно
  }, [me]);

  return (
    <div className="login-container">
      {!me && (
        <form onSubmit={handleSubmit}>
          <h2>{t("submit in system")}</h2>
          <div>
            <label>{t("first name")}:</label>
            <input
              type="text"
              value={firstName}
              onChange={handleFirstNameChange}
              required
            />
          </div>
          <div>
            <label>{t("last name")}:</label>
            <input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              required
            />
          </div>

          {inputError && (
            <p style={{ color: "red", marginTop: "5px" }}>{inputError}</p>
          )}

          <button type="submit">{t("submit")}</button>
        </form>
      )}

      {!me && error && (
        <div style={{ color: "red" }}>
          {error === "Користувача не знайдено"
            ? "Користувача з такими даними не знайдено. Спробуйте ще раз."
            : "Сталася помилка. Спробуйте пізніше."}
        </div>
      )}

      {me && (
        <>
          <p className="welcome-name">
            {t("welcome")} {me?.first_name}!
          </p>
          <MainInfo />
        </>
      )}
    </div>
  );
};
export default LoginForm;