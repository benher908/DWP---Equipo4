import "../styles/styles.css"; 

export default function Loader({ message = "Cargando..." }) {
  return (
    <div
      className="loader"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="spinner" aria-hidden="true"></div>
      <span className="sr-only">{message}</span>
    </div>
  );
}
