import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function MenuAdmin() {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();
  const toggleButtonRef = useRef(null);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  const cerrarSesion = async () => {
    await logout();
    setMostrarMenu(false);
    navigate("/login");
  };

  useEffect(() => {
    if (!mostrarMenu) return;

    const firstItem = menuRef.current?.querySelector("button");
    firstItem?.focus();

    const handleKeyDown = (e) => {
      const items = menuRef.current?.querySelectorAll("button");
      if (!items || items.length === 0) return;

      const currentIndex = Array.from(items).indexOf(document.activeElement);

      if (e.key === "Escape") {
        setMostrarMenu(false);
        toggleButtonRef.current?.focus();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (currentIndex + 1) % items.length;
        items[next].focus();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (currentIndex - 1 + items.length) % items.length;
        items[prev].focus();
      }
    };

    menuRef.current?.addEventListener("keydown", handleKeyDown);

    return () => {
      menuRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, [mostrarMenu]);

  return (
    <div style={{ position: "relative" }}>
      <button
        id="admin-toggle"
        aria-haspopup="menu"
        aria-expanded={mostrarMenu}
        aria-controls="admin-menu"
        onClick={() => setMostrarMenu((prev) => !prev)}
        ref={toggleButtonRef}
      >
        ADMIN
      </button>

      {mostrarMenu && (
        <div
          id="admin-menu"
          role="menu"
          aria-labelledby="admin-toggle"
          ref={menuRef}
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: "230px",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 1000
          }}
        >
          <p>
            <strong>{user?.name || "Administrador"}</strong>
          </p>
          <p style={{ fontSize: "14px", color: "gray" }}>
            {user?.email || "admin@email.com"}
          </p>

          <hr />

          <button style={{ width: "100%" }} onClick={() => navigate("/admin/dashboard")}>
            Panel
          </button>

          <button style={{ width: "100%", marginTop: "5px" }} onClick={() => navigate("/admin/reports")}>
            Reportes
          </button>

          <button
            style={{
              width: "100%",
              marginTop: "10px",
              background: "#ff4d4d",
              color: "#fff"
            }}
            onClick={cerrarSesion}
          >
            Cerrar sesion
          </button>
        </div>
      )}
    </div>
  );
}
