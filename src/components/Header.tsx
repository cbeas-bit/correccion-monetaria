export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <svg
            className="brand-icon"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="20" stroke="#D4956A" strokeWidth="2" fill="none" />
            <circle cx="24" cy="24" r="13" stroke="#B87333" strokeWidth="1.5" fill="none" strokeDasharray="5 2.5" />
            <circle cx="24" cy="24" r="7" stroke="#B87333" strokeWidth="1" fill="none" strokeDasharray="3 2" />
            <circle cx="24" cy="24" r="3" fill="#B87333" />
          </svg>
          <div>
            <h1 className="brand-title">Corrección Monetaria</h1>
            <p className="brand-subtitle">Mujer Cobra — Revalorización de Inventario</p>
          </div>
        </div>
        <div className="header-meta">
          <span className="badge badge-sii">Art. 41 LIR · SII Chile</span>
        </div>
      </div>
    </header>
  );
}
