import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import Alert from "../../components/ui/Alert"
import { reportsApi } from "../../services/api";

export default function Status() {
  const headingRef = useRef(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const res = await reportsApi.mine();
        setReports(res.data || []);
      } catch (err) {
        setError(err.message || "No se pudo cargar el estado de tus reportes.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return <Loader message="Cargando estado de reportes..." />;
  }

  return (
    <div>
      <h1 ref={headingRef} tabIndex="-1">Estado de Reportes</h1>
      <Alert message={error} />

      {reports.length ? (
        <div style={{ display: "grid", gap: "12px", marginLeft: "50px" }}>
          {reports.map((r) => (
            <div key={r.id} className="card">
              <p><strong>Dirección:</strong> {r.address}</p>
              <p><strong>Descripción:</strong> {r.description}</p>
              <p><strong>Estado:</strong> {r.status}</p>
              <p><strong>Fecha:</strong> {new Date(r.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes reportes aún.</p>
      )}
    </div>
  );
}
