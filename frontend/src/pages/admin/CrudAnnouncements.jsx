import "../../styles/styles.css";
import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Loader from "../../components/Loader";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { announcementsApi } from "../../services/api";

const emptyForm = { title: "", description: "" };

export default function CrudAnnouncements() {
  const [form, setForm] = useState(emptyForm);
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementsApi.list();
      setAnnouncements(res.data || []);
    } catch (err) {
      setMessage(err.message || "No se pudieron cargar los avisos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      if (editingId) {
        await announcementsApi.update(editingId, form);
        setMessage("Aviso actualizado correctamente.");
      } else {
        await announcementsApi.create(form);
        setMessage("Aviso creado correctamente.");
      }

      resetForm();
      await loadAnnouncements();
    } catch (err) {
      setMessage(err.message || "No se pudo guardar el aviso.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await announcementsApi.remove(id);
      setMessage("Aviso eliminado correctamente.");
      await loadAnnouncements();
    } catch (err) {
      setMessage(err.message || "No se pudo eliminar el aviso.");
    }
  };

  if (loading) {
    return <Loader message="Cargando avisos..." />;
  }

  return (
    <div className="admin-announcements-page">
      <div className="admin-announcements-card">
        <h2 className="admin-announcements-title">
          Gestion de avisos
        </h2>

        <Alert message={message} type="success" />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Label htmlFor="title">Titulo del mensaje:</Label>
            <Input
              id="title"
              value={form.title}
              type="text"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <Label htmlFor="description">Mensaje:</Label>
            <textarea
              id="description"
              rows="5"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="admin-announcements-actions">
            <Button type="button" className="btn-cancel" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-publish" disabled={saving}>
              {editingId ? "Actualizar" : "Publicar"}
            </Button>
          </div>
        </form>

        <div style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
          {announcements.map((item) => (
            <div key={item.id} className="notification-card">
              <div className="notification-content">
                <p><strong>{item.title}</strong></p>
                <p>{item.description}</p>
                <p>{new Date(item.created_at).toLocaleString()}</p>
                <div className="admin-announcements-actions">
                  <Button
                    className="btn-cancel"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({ title: item.title, description: item.description });
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    className="btn-publish"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {!announcements.length && <p>No hay avisos registrados.</p>}
        </div>
      </div>
    </div>
  );
}
