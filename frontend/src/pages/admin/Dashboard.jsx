import { useEffect, useState } from "react";
import { adminUsersApi, announcementsApi, reportsApi } from "../../services/api";
import Loader from "../../components/Loader";
import Alert from "../../components/ui/Alert";
import "../../styles/styles.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#ec7643", "#ffc658", "#82ca9d"];

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, reportsRes, announcementsRes] = await Promise.all([
        adminUsersApi.list(),
        reportsApi.adminList(),
        announcementsApi.list()
      ]);

      setUsers(usersRes.data || []);
      setReports(reportsRes.data || []);
      setAnnouncements(announcementsRes.data || []);
    } catch (err) {
      setError(err.message || "No se pudo cargar el panel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const reportStats = {
    Pendiente: 0,
    "En Proceso": 0,
    Atendido: 0
  };

  reports.forEach((r) => {
    if (reportStats[r.status] !== undefined) {
      reportStats[r.status]++;
    }
  });

  const barData = Object.keys(reportStats).map((key) => ({
    name: key,
    total: reportStats[key]
  }));

  const pieData = barData.map((item) => ({
    name: item.name,
    value: item.total
  }));


  if (loading) {
    return <Loader message="Cargando panel de control..." />;
  }

  return (
    <div className="admin-dashboard-page">
      <h1 className="admin-dashboard-title">Panel de Control</h1>

      <Alert message={error} />

            <div className="admin-dashboard-cards">
        <div className="admin-card">
          <h3>Reportes</h3>
          <p>{reports.length}</p>
        </div>

        <div className="admin-card">
          <h3>Usuarios</h3>
          <p>{users.length}</p>
        </div>

        <div className="admin-card">
          <h3>Avisos</h3>
          <p>{announcements.length}</p>
        </div>
      </div>

      <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
        <h2>Reportes por Estado</h2>

        <ResponsiveContainer>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
        <h2>Distribución de Reportes</h2>

        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* <section style={{ marginTop: "24px" }}>
        <h2>Usuarios</h2>
        {!users.length ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {users.map((user) => (
              <div key={user.id} className="admin-report-card">
                <p><strong>{user.name}</strong> ({user.email})</p>
                <p>Rol: {user.role}</p>
                <p>Estado: {user.status}</p>
                <div className="admin-report-actions">
                  <Button
                    className="btn-review"
                    onClick={() =>
                      handleUserStatus(user.id, user.status === "banned" ? "active" : "banned")
                    }
                  >
                    {user.status === "banned" ? "Reactivar" : "Banear"}
                  </Button>
                  <Button
                    className="btn-accept"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
} */}
      <section style={{ marginTop: "24px" }}>
        <h2>Ultimos avisos</h2>
        {!announcements.length ? (
          <p>No hay avisos publicados.</p>
        ) : (
          <ul className="alerts-list">
            {announcements.slice(0, 5).map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong> - {item.description}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
