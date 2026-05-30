export default function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-label="Sin ítems en el inventario">
      <svg
        className="empty-icon"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="34" stroke="#B87333" strokeWidth="2" strokeDasharray="6 3" fill="none" opacity="0.35" />
        <circle cx="40" cy="40" r="24" stroke="#B87333" strokeWidth="1.5" fill="none" opacity="0.25" strokeDasharray="4 2" />
        <circle cx="40" cy="40" r="14" stroke="#B87333" strokeWidth="1" fill="none" opacity="0.15" />
        <circle cx="40" cy="40" r="5" fill="#B87333" opacity="0.25" />
        <line x1="40" y1="24" x2="40" y2="32" stroke="#B87333" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <line x1="40" y1="48" x2="40" y2="56" stroke="#B87333" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <line x1="24" y1="40" x2="32" y2="40" stroke="#B87333" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <line x1="48" y1="40" x2="56" y2="40" stroke="#B87333" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
      <p className="empty-title">Sin insumos registrados</p>
      <p className="empty-desc">
        Agrega tu primer insumo utilizando el formulario<br />
        para calcular su valor actualizado según las tablas SII.
      </p>
    </div>
  );
}
