import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/authSlice";
import { authService } from "../../services/authService";
import { useTranslation } from "react-i18next";

const Header = () => {
  const dispatch = useAppDispatch();
  const { me, language } = useAppSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    dispatch(authActions.logout());
    authService.logout();
    dispatch(authActions.setLogoutTrigger());
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const toggleLanguage = () => {
    const newLang = language === "ua" ? "en" : "ua";
    dispatch(authActions.setLanguage(newLang));
    localStorage.setItem("language", newLang);
  };

  return (
    <header className="header-container">
      <h1 className="header-logo">
        💍 {t("love story")} 💍
        <span className="couple-names">{t("about names")}</span>
      </h1>

      <button className="burger-button" aria-label="Toggle menu" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <button className="nav-button" onClick={() => setMenuOpen(false)}>
          <Link to="about">{t("about us")}</Link>
        </button>
        <button className="nav-button" onClick={() => setMenuOpen(false)}>
          <Link to="maininfo">{t("main info")}</Link>
        </button>
        <button className="nav-button" onClick={() => setMenuOpen(false)}>
          <Link to="location">{t("location")}</Link>
        </button>
        <button className="nav-button" onClick={() => setMenuOpen(false)}>
          <Link to="confirm">{t("confirm presence")}</Link>
        </button>
        {me?.role === 'ADMIN' && <button className="nav-button" onClick={() => setMenuOpen(false)}>
          <Link to="admin">Admin</Link>
        </button>}
        {me && (
          <button
            className="nav-button logout-button"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            {t("logout")}
          </button>
        )}
      </nav>

      <button className="lang-button" onClick={toggleLanguage}>
        {language === "ua" ? "UA" : "EN"}
      </button>
    </header>
  );
};

export default Header;




