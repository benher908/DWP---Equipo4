import { useRef, useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Alert from "../../components/ui/Alert";
import { tipsApi } from "../../services/api";

export default function Tips() {
  const headingRef = useRef(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    const loadTips = async () => {
      try {
        setLoading(true);
        const res = await tipsApi.list();
        setTips(res.data || []);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los consejos.");
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  if (loading) {
    return <Loader message="Cargando consejos..." />;
  }

  return (
    <div className="tips-page">
      <div className="tips-header">
        <h2 ref={headingRef} tabIndex="-1">Consejos de cuidado del agua</h2>
      </div>

      <Alert message={error} />

      <div className="tips-list">
        {tips.map((tip, index) => (
          <div key={tip.id} className="tip-item">
            <h4>{index + 1}. Consejo</h4>
            <p>{tip.content}</p>
          </div>
        ))}

        {!tips.length && <p className="no-data">No hay consejos publicados.</p>}
      </div>
    </div>
  );
}
