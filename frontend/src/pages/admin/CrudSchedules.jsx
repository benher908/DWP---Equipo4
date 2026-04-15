import "../../styles/styles.css";
import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Loader from "../../components/Loader";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { schedulesApi } from "../../services/api";

const emptyForm = { zone: "", day: "", shift: "", hour: "" };

export default function CrudSchedules() {
  const [form, setForm] = useState(emptyForm);
  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const res = await schedulesApi.list();
      setSchedules(res.data || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    loadSchedules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await schedulesApi.update(editingId, form);
        setMessage("Horario actualizado");
      } else {
        await schedulesApi.create(form);
        setMessage("Horario creado");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadSchedules();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await schedulesApi.remove(id);
      setMessage("Horario eliminado correctamente.");
      await loadSchedules();
    } catch (err) {
      setMessage(err.message || "No se pudo eliminar el horario.");
    }
  };

  if (loading) {
    return <Loader message="Cargando horarios..." />;
  }

  return (
    <div className="admin-schedule-page">
      <div className="admin-schedule-card">
        <h2 className="admin-schedule-title">
          Gestion de horarios
        </h2>

      <Alert message={message} type="success" />

        <form className="admin-schedule-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Label htmlFor="zone">Zona</Label>
            <Input value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} />
          </div>
          <div className="form-group">
            <Label htmlFor="day">Día</Label>
            <Input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
          </div>
          <div className="form-group">
            <Label htmlFor="shift">Turno</Label>
            <Input value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} />
          </div>
          <div className="form-group">
            <Label htmlFor="hour">Hora</Label>
            <Input value={form.hour} onChange={(e) => setForm({ ...form, hour: e.target.value })} />
          </div>

          <div className="admin-schedule-actions">
            <Button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setContent("");
                setEditingId(null);
              }}
            >
              Cancelar
            </Button>

            <Button type="submit" className="btn-save">
              {editingId ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>

        <div style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
          {schedules.map((schedule) => (
            <div key={schedule.id} className="admin-report-card">
              <p>{schedule.zone} - {schedule.day} - {schedule.shift} - {schedule.hour}</p>
              <p>{new Date(schedule.created_at).toLocaleString()}</p>
              <div className="admin-schedule-actions">
                <Button
                  className="btn-cancel"
                  onClick={() => {
                    setEditingId(schedule.id);
                    setForm(schedule);
                  }}
                >
                  Editar
                </Button>
                <Button
                  className="btn-delete"
                  onClick={() => handleDelete(schedule.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
          {!schedules.length && <p>No hay horarios registrados.</p>}
        </div>
      </div>
    </div>
  );
}
