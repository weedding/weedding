import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/authSlice";
import MainInfo from "../mainInfo/MainInfo";
import { useTranslation } from "react-i18next";


export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { me, error } = useAppSelector((state) => state.auth);
 const { t, i18n } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authActions.login({ firstName, lastName }));
  };



  // Якщо auth.me оновлюється після login — підтягуй guest автоматично
  useEffect(() => {
  }, [me]);

  return (
    <div className="login-container">
      {!me &&  (
        <form onSubmit={handleSubmit}>
          <h2>{ t('submit in system')}</h2>
          <div>
            <label>{t('first name')}:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>{t('last name')}:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <button type="submit">{t('submit')}</button>
        </form>
      )}

      {!me && error && (
        <div style={{ color: "red" }}>
          {error === 'Користувача не знайдено'
            ? 'Користувача з такими даними не знайдено. Спробуйте ще раз.'
            : 'Сталася помилка. Спробуйте пізніше.'
          }
        </div>
      )}


      {me  && (
        <>
          <p className="welcome-name">
            {t('welcome')} {(me?.first_name)}!
          </p>
   
        </>
      )}
    </div>
  );
};
