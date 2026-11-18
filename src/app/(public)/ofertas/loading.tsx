export default function Loading() {
  return (
    <div className="container page-content" role="status" aria-label="Carregando produtos">
      <div className="loading-skeleton" />
      <div className="product-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="loading-skeleton tall" />
        ))}
      </div>
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
