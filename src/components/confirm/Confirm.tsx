import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";

const Confirm = () => {
  const { me, confirmTrigger } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();



  useEffect(() => {
    if (confirmTrigger) {
      console.log("Підтвердження оновлено");
      // можливо оновити користувача з бекенду
    }
    console.log('me', me);
  }, [confirmTrigger, me]);

  const sendConfirmation = async () => {
    if (me?.id) {
      const isConfirmed = window.confirm(t('confirm rule'));

      if (isConfirmed) {
        await dispatch(authActions.confirm(me.id));
        dispatch(authActions.login({ firstName: me.first_name, lastName: me.last_name }));
        dispatch(authActions.setConfirmTrigger());
      }
    }
  };


  if (!me?.first_name || !me?.last_name) {
    return <p>{t('for confirm')}</p>;
  }

  if (me.isConfirmed === true) {
    return (
      <div style={{ maxWidth: 400, margin: "20px auto", textAlign: "center", backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
        <h3>{t('Your confirm')}</h3>
        <p>{t('Thanks for confirm')}</p>
      </div>
    );
  }

  if (me.isConfirmed === false) {
    return (
      <div className="confirm-container">
        <h3>{t('please confirm')}</h3>
        <p>
          Ім'я: <b>{me.first_name} {me.last_name}</b>
        </p>
        <button className="nav-button" onClick={sendConfirmation} style={{ padding: "8px 16px" }}>
          {t('confirm button')}
        </button>
      </div>
    )
  };
};

export default Confirm;



