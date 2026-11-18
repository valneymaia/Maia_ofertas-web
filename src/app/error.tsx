'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page-content empty-state" role="alert">
      <h1>Não foi possível carregar esta página.</h1>
      <p>
        Tente novamente em alguns instantes. Se o problema continuar, confira a configuração da
        plataforma.
      </p>
      <button className="button navy" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
