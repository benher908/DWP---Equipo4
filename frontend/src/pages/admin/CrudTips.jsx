import "../../styles/styles.css";
import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Loader from "../../components/Loader";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { tipsApi } from "../../services/api";

const emptyForm = { title: "", description: "" };

export default function CrudTips() {
  const [form, setForm] = useState(emptyForm);
  const [tips, setTips] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadTips = async () => {
    try {
      setLoading(true);
      const res = await tipsApi.list();
      setTips(res.data || []);
    } catch (err) {
      setMessage(err.message || "No se pudieron cargar los consejos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTips();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await tipsApi.update(editingId, form);
      setMessage("Actualizado");
    } else {
      await tipsApi.create(form);
      setMessage("Creado");
    }

    setForm(emptyForm);
    setEditingId(null);
    loadTips();
  };

  const handleDelete = async (id) => {
    try {
      await tipsApi.remove(id);
      setMessage("Consejo eliminado correctamente.");
      await loadTips();
    } catch (err) {
      setMessage(err.message || "No se pudo eliminar el consejo.");
    }
  };

  if (loading) {
    return <Loader message="Cargando consejos..." />;
  }

  return (
    <div className="admin-tips-page">
      <div className="admin-tips-card">
        <h2 className="admin-tips-title">Consejos de ahorro</h2>

        <Alert message={message} type="success" />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Label htmlFor="tip-tittle">Título</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <Label htmlFor="tip-description">Contenido del consejo:</Label>
            <Input 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="admin-tips-actions">
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

            <Button type="submit" className="btn-publish">
              {editingId ? "Actualizar" : "Publicar"}
            </Button>
          </div>
        </form>

        <div style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
          {tips.map((tip) => (
            <div key={tip.id} className="tip-item">
            <p>{tip.title}</p>
            <p>{tip.description}</p>              
            <p>{new Date(tip.created_at).toLocaleString()}</p>
              <div className="admin-tips-actions">
                <Button
                  className="btn-cancel"
                  onClick={() => {
                    setEditingId(tip.id);
                    setForm(tip);
                  }}
                >
                  Editar
                </Button>
                <Button
                  className="btn-publish"
                  onClick={() => handleDelete(tip.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
          {!tips.length && <p>No hay consejos registrados.</p>}
        </div>
      </div>
    </div>
  );
}
