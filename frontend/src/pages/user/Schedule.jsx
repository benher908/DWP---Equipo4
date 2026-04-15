import { useRef, useEffect, useState } from "react";
import "../../styles/styles.css";
import Loader from "../../components/Loader";
import Label from "../../components/ui/Label";
import { schedulesApi } from "../../services/api";

export default function Schedule() {
  const headingRef = useRef(null);
  const [schedules, setSchedules] = useState([]);
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const res = await schedulesApi.list();
        setSchedules(res.data || []);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los horarios.");
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const zonas = [...new Set(schedules.map((s) => s.zone))];
  
  const normalize = (text) =>
    text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filtrados = zone
    ? schedules.filter((s) => normalize(s.zone) === normalize(zone))
    : [];

  const getHorario = (day, shift) => {
    const item = filtrados.find(
      (s) =>
        normalize(s.day) === normalize(day) &&
        normalize(s.shift) === normalize(shift)
    );
    return item ? item.hour : "";
  };

  const renderCelda = (day, shift) => {
    const hour = getHorario(day, shift);
    return hour ? <span className="time-box">{hour}</span> : null;
  };

  if (loading) {
    return <Loader message="Cargando horarios..." />;
  }

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h2 ref={headingRef} tabIndex="-1">Horarios</h2>
      </div>

      {error && <p role="alert">{error}</p>}

    <div className="schedule-filter">
        <Label htmlFor="zone">Colonia / zona:</Label>
        <select
          id="zone"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          <option value="">Selecciona una zona</option>

          {zonas.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>
      
      {!zone ? (
        <p className="no-data">Selecciona una zona para ver horarios</p>
      ) : filtrados.length === 0 ? (
        <p className="no-data">No hay horarios publicados para esta zona</p>
      ) : (
      <div className="schedule-table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th></th>
              <th>Lunes</th>
              <th>Martes</th>
              <th>Miércoles</th>
              <th>Jueves</th>
              <th>Viernes</th>
              <th>Sábado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="time-label">Antes del medio día</td>
              
              <td>{renderCelda("Lunes", "mañana")}</td>
              <td>{renderCelda("Martes", "mañana")}</td>
              <td>{renderCelda("Miércoles", "mañana")}</td>
              <td>{renderCelda("Jueves", "mañana")}</td>
              <td>{renderCelda("Viernes", "mañana")}</td>
              <td>{renderCelda("Sábado", "mañana")}</td>
            </tr>

            <tr>
              <td className="time-label">Después del medio día</td>
              <td>{renderCelda("Lunes", "tarde")}</td>
              <td>{renderCelda("Martes", "tarde")}</td>
              <td>{renderCelda("Miércoles", "tarde")}</td>
              <td>{renderCelda("Jueves", "tarde")}</td>
              <td>{renderCelda("Viernes", "tarde")}</td>
              <td>{renderCelda("Sábado", "tarde")}</td>
            </tr>
          </tbody>
        </table>
      </div>
  )}
      </div>
  );
}
