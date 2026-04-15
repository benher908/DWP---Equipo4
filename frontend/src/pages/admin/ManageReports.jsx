import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { reportsApi } from "../../services/api";
import "../../styles/styles.css";

const STATUSES = ["Pendiente", "En Proceso", "Atendido"];

export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await reportsApi.adminList();
      setReports(res.data || []);
    } catch (err) {
      setMessage(err.message || "No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await reportsApi.adminUpdateStatus(id, status);
      setMessage("Estado actualizado correctamente.");
      await loadReports();
    } catch (err) {
      setMessage(err.message || "No se pudo actualizar el reporte.");
    }
  };

  const deleteReport = async (id) => {
    try {
      await reportsApi.adminRemove(id);
      setMessage("Reporte eliminado correctamente.");
      await loadReports();
    } catch (err) {
      setMessage(err.message || "No se pudo eliminar el reporte.");
    }
  };

  if (loading) {
    return <Loader message="Cargando reportes..." />;
  }

  return (
    <div className="admin-reports-page">
      <h2 className="admin-reports-title">Reportes</h2>
      
      <Alert message={message} />

      {!reports.length ? (
        <p>No hay reportes registrados.</p>
      ) : (
        <table className="admin-reports-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.user_name}</td>
                <td>{report.user_email}</td>
                <td>{report.user_address}</td>
                <td>{report.description}</td>
                <td>
                  <strong>{report.status}</strong>
                </td>

                <td className="admin-report-actions">
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {STATUSES.map((status) => (
                      <Button
                        key={status}
                        className="btn-review"
                        onClick={() => updateStatus(report.id, status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>

                  <Button
                    className="btn-accept"
                    onClick={() => deleteReport(report.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
