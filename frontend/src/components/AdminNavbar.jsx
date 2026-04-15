import { useLocation, NavLink } from "react-router-dom";
import { useRef } from "react";
import { navLinkStyle } from "../styles/navLinkStyle";
import { useAuth } from "../hooks/useAuth";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function AdminNavbar() {
  const location = useLocation();
  const navRef = useRef(null);

  const {logout} = useAuth()
  const isOnline = useOnlineStatus();

  const handleKeyboard = (e) => {
    const links = navRef.current?.querySelectorAll("a");
    if (!links || links.length === 0) return;

  const currentIndex = Array.from(links).indexOf(document.activeElement);
  if (currentIndex === -1) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % links.length;
      links[nextIndex].focus();
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex =
        (currentIndex - 1 + links.length) % links.length;
      links[prevIndex].focus();
    }
  };

  return (
  <> 
    {!isOnline && (
      <div className="offline-message">
          Sin conexión a internet ⚠️
      </div>
    )}
    <nav
      ref={navRef}
      aria-label="Navegación principal del administrador"
      onKeyDown={handleKeyboard}
      role="navigation"
      style={{ display: "flex", gap: "0px", marginLeft: "900px" }}
    >

      <NavLink
        to="/admin/dashboard"
        style={navLinkStyle}
        aria-current={
          location.pathname.startsWith("/admin/dashboard") ? "page" : undefined
        }
      >
        Panel
      </NavLink>

      <NavLink
        to="/admin/users"
        style={navLinkStyle}
        aria-current={
          location.pathname.startsWith("/admin/users") ? "page" : undefined
        }
      >
        Usuarios
      </NavLink>

      <NavLink
        to="/admin/reports"
        style={navLinkStyle}
        aria-current={
          location.pathname.startsWith("/admin/reports") ? "page" : undefined
        }
      >
        Reportes
      </NavLink>

      <NavLink
        to="/admin/announcements"
        style={navLinkStyle}
        aria-current={
          location.pathname.startsWith("/admin/announcements")
            ? "page"
            : undefined
        }
      >
        Avisos
      </NavLink>

      <NavLink
        to="/admin/schedules"
        style={navLinkStyle}
        aria-current={
          location.pathname.startsWith("/admin/schedules")
            ? "page"
            : undefined
        }
      >
        Horarios
      </NavLink>

      <NavLink
        to="/admin/tips"
        style={navLinkStyle}
        aria-current={
          location.pathname.startsWith("/admin/tips") ? "page" : undefined
        }
      >
        Consejos
      </NavLink>

      <button onClick={logout} disabled={!isOnline}>
        Cerrar sesión
      </button>
    </nav>
  </>
  );
}
