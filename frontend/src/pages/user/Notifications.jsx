import { useRef, useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { announcementsApi } from "../../services/api";

export default function Notifications() {
  const headingRef = useRef(null);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await announcementsApi.list();
        setAnnouncements(res.data || []);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los avisos.");
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="notifications-page" aria-busy="true">
        <Loader message="Cargando avisos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <p role="alert">Error al cargar avisos: {error}</p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2 ref={headingRef} tabIndex="-1">
          Avisos
        </h2>
      </div>

      <div className="notifications-grid">
        {announcements.length ? (
          announcements.map((item) => (
            <div key={item.id} className="notification-card">
              <div className="notification-image" />
              <div className="notification-content">
                <p><strong>{item.title}</strong></p>
                <p>{item.description}</p>
                <p>{new Date(item.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No hay avisos.</p>
        )}
      </div>
    </div>
  );
}
