import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/styles.css";

import Loader from "../../components/Loader";
import { auth } from "../../services/api";

import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function Register() {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    medidor: "",
    password: "",
    confirm: ""
  });
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [esExito, setEsExito] = useState(false);

  useEffect(() => {
    firstInputRef.current?.focus();
    headingRef.current?.focus();
  }, []);

  const validar = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "Nombre obligatorio";
    }
    if (!form.email.includes("@")) {
      nuevosErrores.email = "Correo invalido";
    }
    if (!form.direccion.trim()) {
      nuevosErrores.direccion = "Direccion obligatoria";
    }
    if (!form.medidor.trim()) {
      nuevosErrores.medidor = "Numero de medidor obligatorio";
    }
    if (form.password.length < 8) {
      nuevosErrores.password = "Minimo 8 caracteres";
    }
    if (form.password !== form.confirm) {
      nuevosErrores.confirm = "Las contrasenas no coinciden";
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validacion = validar();

    if (Object.keys(validacion).length > 0) {
      setErrors(validacion);
      setEsExito(false);
      setMensaje("Revisa los errores del formulario.");
      return;
    }

    setErrors({});
    setMensaje("");
    setLoading(true);

    try {
      await auth.register({
        nombre: form.nombre,
        email: form.email,
        direccion: form.direccion,
        medidor: form.medidor,
        password: form.password
      });

      setEsExito(true);
      setMensaje("Registro exitoso. Redirigiendo...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      if (!window.navigator.onLine) {
        setMensaje("Sin conexion a internet. Verifica tu red.");
      } else {
        setMensaje(err.message || "Error al registrar la cuenta.");
      }

      setEsExito(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Button className="btn-inicio" onClick={() => navigate("/")}>
        Inicio
      </Button>
      <div className="register-card">
        <div className="register-header">
          <h2 ref={headingRef} tabIndex="-1">
            Registro
          </h2>
        </div>

        {mensaje && (
          <Alert
            message={mensaje}
            type={esExito ? "success" : "error"}
          />
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <Label htmlFor="nombre">Nombre:</Label>
            <Input
              ref={firstInputRef}
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              error={errors.nombre}
              aria-describedby={errors.nombre ? "nombre-error" : undefined}
            />

            {errors.nombre && (
              <p id="nombre-error" className="error-message" role="alert">
                {errors.nombre}
              </p>
            )}
          </div>
          <div className="form-group">
            <Label htmlFor="email">Correo electrónico:</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />

            {errors.email && (
              <p id="email-error" className="error-message" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div className="form-group">
            <Label htmlFor="direccion">Dirección:</Label>
            <Input
              id="direccion"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              error={errors.direccion}
              aria-describedby={errors.direccion ? "direccion-error" : undefined}
            />

            {errors.direccion && (
              <p id="direccion-error" className="error-message" role="alert">
                {errors.direccion}
              </p>
            )}
          </div>
          <div className="form-group">
            <Label htmlFor="medidor">Medidor:</Label>
            <Input
              id="medidor"
              value={form.medidor}
              onChange={(e) => setForm({ ...form, medidor: e.target.value })}
              error={errors.medidor}
              aria-describedby={errors.medidor ? "medidor-error" : undefined}
            />

            {errors.medidor && (
              <p id="medidor-error" className="error-message" role="alert">
                {errors.medidor}
              </p>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <Label htmlFor="password">Contraseña:</Label>

              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />

              {errors.password && (
                <p id="password-error" className="error-message" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="form-group">
              <Label htmlFor="confirm">Confirmar contraseña:</Label>
              <Input
                id="confirm"
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                error={errors.confirm}
                aria-describedby={errors.confirm ? "confirm-error" : undefined}
              />

              {errors.confirm && (
                <p id="confirm-error" className="error-message" role="alert">
                  {errors.confirm}
                </p>
              )}
            </div>
          </div>
          <div className="register-footer" aria-busy={loading ? "true" : "false"}>
            <span className="login-link">
              ¿Ya tienes una cuenta?
              <Button
                type="button"
                className="link-button"
                onClick={() => navigate("/")}
              >
                Inicia sesión
              </Button>
            </span>

            <Button type="submit" className="btn-register" disabled={loading}>
              {loading ? (
                <span aria-live="polite">
                  <Loader message="Registrando..." />
                </span>
              ) : (
                "Registrarse"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
