import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import "../../styles/styles.css";
import Loader from "../../components/Loader";
import { auth } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const userRef = useRef(null)

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsuario, setErrorUsuario] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);

  const manejarLogin = async () => {
    // basic client validation
    let hayError = false;

    if (!usuario.trim()) {
      setErrorUsuario(true);
      userRef.current?.focus();
      hayError = true;
    } else {
      setErrorUsuario(false);
    }

    if (!password.trim()) {
      setErrorPassword(true);
      hayError = true;
    } else {
      setErrorPassword(false);
    }

    if (hayError) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    setMensajeError("");
    setLoading(true);

    try {
      const data = await auth.login({ email: usuario, password });
      // success: store token, user etc. backend returns user.name
      localStorage.setItem("user", data.user?.name || usuario);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setMensajeError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
          
      <button className="btn-inicio" onClick={() => navigate("/")}>
        Inicio
      </button>

      <div className="login-card">
        <div className="login-header">
          <h2>Inicio de sesión</h2>
        </div>
      
      <form
        onSubmit={(e) => {
        e.preventDefault();
        manejarLogin();
        }}
        noValidate> 
        {mensajeError && (
          <p className="error-message" role="alert">
            {mensajeError}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="usuario">Usuario:</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              if (e.target.value.trim() !== "") {
                setErrorUsuario(false);
                setMensajeError("");
              }
            }}
            className={errorUsuario ? "input-error" : ""}
            aria-invalid={errorUsuario ? "true" : "false"}
          />
          {errorUsuario && (
            <p className="error-message" role="alert">
              El usuario es obligatorio
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.trim() !== "") {
                setErrorPassword(false);
                setMensajeError("");
              }
            }}
            className={errorPassword ? "input-error" : ""}
            aria-invalid={errorPassword ? "true" : "false"}
          />
          {errorPassword && (
            <p className="error-message" role="alert">
              La contraseña es obligatoria
            </p>
          )}
        </div>

        <div className="login-actions" aria-busy={loading ? "true" : "false"}>
          <button
            className="btn-secondary"
            onClick={() => navigate("/register")}
            disabled={loading}
          >
            Registrarse
          </button>

          <button
            className="btn-primary"
            onClick={manejarLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader message="Iniciando sesión..." />
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
