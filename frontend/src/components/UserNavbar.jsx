import { NavLink } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import "../styles/styles.css";

export default function UserNavbar() {
  const navRef = useRef(null);
  const { isAuthenticated, logout } = useAuth();
  const isOnline = useOnlineStatus();

  const manejarTeclado = (e) => {
    const items = navRef.current?.querySelectorAll(".nav-pill");
    if (!items || items.length === 0) return;

    const currentIndex = Array.from(items).indexOf(document.activeElement);
    if (currentIndex === -1) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      items[nextIndex].focus();
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
    }
  };

  return (
    <header className="home-navbar">
      {!isOnline && (
        <div className="offline-message">
          Sin conexion a internet
        </div>
      )}

      <div className="home-navbar-left">
        <div className="user-avatar"></div>
        {!isAuthenticated ? (
          <NavLink to="/" className="login-pill">
            Iniciar sesion
          </NavLink>
        ) : (
          <button className="btn btn-primary" onClick={logout} disabled={!isOnline}>
            Cerrar sesion
          </button>
        )}
      </div>

      <nav
        className="home-navbar-menu"
        aria-label="Menu de usuario"
        ref={navRef}
        onKeyDown={manejarTeclado}
      >
        <NavLink to="/user/home" className="nav-pill">
          Inicio
        </NavLink>

        <NavLink to="/user/reports" className="nav-pill">
          Reportes
        </NavLink>

        <NavLink to="/user/notifications" className="nav-pill">
          Avisos
        </NavLink>

        <NavLink to="/user/schedule" className="nav-pill">
          Horarios
        </NavLink>

        <NavLink to="/user/tips" className="nav-pill">
          Consejos
        </NavLink>
      </nav>
    </header>
  );
}
