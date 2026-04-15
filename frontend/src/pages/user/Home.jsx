import { useRef, useEffect, useState } from "react";
import "../../styles/styles.css";
import { announcementsApi, tipsApi } from "../../services/api";
import Loader from "../../components/Loader";

export default function Home() {
  const buttonRef = useRef(null);

  const [tips, setTips] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buttonRef.current?.focus();

    Promise.all([
      announcementsApi.list(),
      tipsApi.list()
    ])
      .then(([annRes, tipsRes]) => {
        setAnnouncements(annRes.data.slice(0, 3));
        setTips(tipsRes.data.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Cargando inicio..." />;

  return (
    <div className="home-page">
    
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-left">
            <h1 tabIndex="-1">Sistema de Agua</h1>
            <p className="card-text">Esta solución digital ha sido diseñada como un ecosistema centralizado para la administración eficiente del recurso hídrico, optimizando la comunicación entre el organismo operador y el usuario final. El sistema integra herramientas avanzadas de información y participación ciudadana para garantizar la continuidad y calidad del servicio.
              Consulta avisos, horarios y reporta problemas fácilmente</p>

          </div>

          <div className="home-right">
            <div className="home-image-placeholder">      
              <img src="/img/image.jpg" alt="Imagen" width="400" />            
            </div>
          </div>
        </div>
      </section>

     <section className="home-section">
        <h2>Avisos Importantes</h2>
        <div className="home-section-content">
          {announcements.map(a => (
            <div key={a.id} className="card">
              <h3>{a.title}</h3>
              <p>{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>Consejos</h2>
        <div className="home-section-content">
          {tips.map(t => (
            <div key={t.id} className="card">
              <h3>{t.title}</h3>
              <p>{t.description}</p>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
