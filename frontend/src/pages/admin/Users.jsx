import "../../styles/styles.css";
import { useEffect, useState } from "react";
import { adminUsersApi } from "../../services/api";
import Modal from "../../components/ui/Modal";
import RoleGuard from "../../components/RoleGuard";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const res = await adminUsersApi.list();
    setUsers(res.data || []);
  };

  const handleStatus = async (user) => {
    try {
      const newStatus = user.status === "banned" ? "active" : "banned";

      await adminUsersApi.updateStatus(user.id, newStatus);
      setMessage("Estado actualizado");
      cargar();
    } catch (err) {
      setMessage("Error al actualizar");
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminUsersApi.remove(id);
      setMessage("Usuario eliminado");
      cargar();
    } catch (err) {
      setMessage("Error al eliminar");
    }
  };

  return (
    <div className="admin-users-page">
      <h2 className="admin-users-title">Usuarios</h2>

      <Alert message={message} type="success" />

      <Button onClick={() => setShowModal(true)}>
        Nuevo Usuario
      </Button>

      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>

              <td className="admin-users-actions">
                <RoleGuard>
                  <Button
                    className="admin-btn-edit"
                    onClick={() => handleStatus(u)}
                  >
                    {u.status === "banned" ? "Reactivar" : "Banear"}
                  </Button>

                  <Button
                    className="admin-btn-delete"
                    onClick={() => handleDelete(u.id)}
                  >
                    Eliminar
                  </Button>
                </RoleGuard>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal title="Crear Usuario" onClose={() => setShowModal(false)}>
          <input placeholder="Nombre" />
          <input placeholder="Email" />
          <Button>Guardar</Button>
        </Modal>
      )}
    </div>
  );
}