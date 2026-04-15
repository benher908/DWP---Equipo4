import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reportsApi } from "../../services/api";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Loader from "../../components/Loader";

export default function Reports() {
  const headingRef = useRef(null);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  const [hasReports, setHasReports] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await reportsApi.mine();
      const data = res.data || [];
      setReports(data);

      if (data.length > 0) {
        setHasReports(true);
      }
    } catch (err) {
      setError(err.message || "No se pudieron cargar tus reportes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    headingRef.current?.focus();

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.address) setAddress(user.address);

    loadReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address || !priority || !description) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await reportsApi.create({ address, priority, description });

      setDescription("");
      setPriority("");
      setMessage("Reporte enviado correctamente.");

      setHasReports(true);
      await loadReports();

    } catch (err) {
      setError(err.message || "No se pudo enviar el reporte.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Cargando reportes..." />;
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2 ref={headingRef} tabIndex="-1">Reportes de Agua</h2>
      </div>

      <p className="reports-description">
        Describe el problema relacionado con el servicio de agua. Tu reporte quedara asociado
        a tu cuenta y podras seguir su estado desde esta misma vista.
      </p>

      <Alert message={error} />
      <Alert message={message} type="success" />

      {hasReports && (
        <div >
          <Button className=" btn btn-primary" onClick={() => navigate("/user/status")}>
            Ver mis reportes
          </Button>
        </div>
      )}


      <form className="reports-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <Label htmlFor="address">Dirección:</Label>
          <Input             
          id="address"
          value={address} 
          onChange={(e) => setAddress(e.target.value)} />

          <Label htmlFor="priority" >Urgencia:</Label>
          <select 
          id="priority"
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}>
            <option value="">Selecciona</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <Label htmlFor="description">Descripcion del reporte:</Label>
          <textarea
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="reports-actions">
          <Button className="btn-report" type="submit" disabled={saving}>
            {saving ? "Enviando..." : "Realizar Reporte"}
          </Button>
        </div>
      </form>

    </div>
  );
}
