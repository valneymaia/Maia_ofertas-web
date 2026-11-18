'use client';
import { useActionState, useState } from 'react';
import { loginAction, productAction, categoryAction, type ActionState } from '@/app/admin/actions';
import type { Product, Category } from '@/types/domain';

const initial: ActionState = {};
export function FormMessage({ state }: { state: ActionState }) {
  return (
    <>
      {state.error && (
        <p className="message error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="message success" role="status">
          {state.success}
        </p>
      )}
    </>
  );
}
export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="form-stack">
      <label htmlFor="email">E-mail de administrador</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
        maxLength={254}
        disabled={!configured}
      />
      <label htmlFor="password">Senha</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={8}
        maxLength={200}
        required
        disabled={!configured}
      />
      <FormMessage state={state} />
      <button type="submit" className="button navy" disabled={pending || !configured}>
        {pending ? 'Entrando…' : 'Entrar no painel'}
      </button>
    </form>
  );
}
export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const [state, action, pending] = useActionState(productAction.bind(null, product?.id), initial);
  const [preview, setPreview] = useState<{
    title: string;
    summary: string;
    description: string;
  } | null>(null);
  return (
    <form
      action={action}
      className="form-stack panel"
      onChange={(e) => {
        const data = new FormData(e.currentTarget);
        setPreview({
          title: String(data.get('title') || ''),
          summary: String(data.get('summary') || ''),
          description: String(data.get('description') || ''),
        });
      }}
    >
      <div className="form-grid">
        <div>
          <label htmlFor="title">Nome do produto</label>
          <input
            id="title"
            name="title"
            required
            minLength={3}
            maxLength={180}
            defaultValue={product?.title}
          />
        </div>
        <div>
          <label htmlFor="slug">Endereço amigável (slug)</label>
          <input
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={160}
            placeholder="nome-do-produto"
            defaultValue={product?.slug}
          />
        </div>
      </div>
      <label htmlFor="summary">Resumo original</label>
      <textarea
        id="summary"
        name="summary"
        required
        minLength={10}
        maxLength={320}
        rows={2}
        defaultValue={product?.summary}
      />
      <label htmlFor="description">Descrição editorial</label>
      <textarea
        id="description"
        name="description"
        required
        minLength={20}
        maxLength={10000}
        rows={6}
        defaultValue={product?.description}
      />
      <label htmlFor="affiliate_url">Seu link de afiliado da Amazon</label>
      <input
        id="affiliate_url"
        name="affiliate_url"
        type="url"
        required
        maxLength={2048}
        placeholder="https://link.amazon/... ou https://www.amazon.com.br/dp/...?tag=..."
        defaultValue={product?.affiliate_url}
        aria-describedby="affiliate-help"
      />
      <small id="affiliate-help">
        Links link.amazon e amzn.to são verificados no servidor. A tag original é preservada. Não
        incluímos preços ou descontos.
      </small>
      <div className="form-grid">
        <div>
          <label htmlFor="category_id">Categoria</label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={product?.category_id || ''}
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories
              .filter((c) => c.is_active)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="asin">ASIN (opcional)</label>
          <input
            id="asin"
            name="asin"
            pattern="[A-Z0-9]{10}"
            maxLength={10}
            defaultValue={product?.asin || ''}
          />
        </div>
      </div>
      <div className="form-grid">
        <div>
          <label htmlFor="image_url">Imagem do produto (URL HTTPS, opcional)</label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            defaultValue={product?.image_url || ''}
          />
          <small>Informe uma imagem permitida ou deixe vazio para buscar a imagem no link.</small>
        </div>
        <div>
          <label htmlFor="image_source">Origem da imagem</label>
          <select
            id="image_source"
            name="image_source"
            defaultValue={product?.image_source || 'placeholder'}
          >
            <option value="placeholder">Ilustração padrão (sem URL)</option>
            <option value="own">Imagem própria</option>
            <option value="licensed">Imagem licenciada</option>
            <option value="amazon_metadata">Imagem encontrada na página Amazon</option>
          </select>
        </div>
      </div>
      <label className="checkbox">
        <input type="checkbox" name="fetch_image" defaultChecked={!product || !product.image_url} />{' '}
        Buscar a imagem do produto no link quando o campo estiver vazio
      </label>
      <small>
        Se a página não permitir a leitura ou não tiver imagem, usamos a ilustração padrão.
      </small>
      <div className="form-grid">
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={product?.status || 'draft'}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </div>
        <label className="checkbox">
          <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured} />{' '}
          Destacar na página inicial
        </label>
      </div>
      <FormMessage state={state} />
      <button
        type="submit"
        className="button orange"
        disabled={pending || !categories.some((c) => c.is_active)}
      >
        {pending ? 'Verificando link e salvando…' : 'Salvar produto'}
      </button>
      <details className="preview">
        <summary>Prévia do conteúdo</summary>
        <h2>{preview?.title || product?.title || 'Nome do produto'}</h2>
        <p>{preview?.summary || product?.summary}</p>
        <div className="description">{preview?.description || product?.description}</div>
        <small>O botão Amazon será disponibilizado após a validação do link e publicação.</small>
      </details>
    </form>
  );
}
export function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState(categoryAction.bind(null, category?.id), initial);
  return (
    <form action={action} className="form-stack panel">
      <h2>{category ? category.name : 'Nova categoria'}</h2>
      <div className="form-grid">
        <div>
          <label htmlFor={`name-${category?.id || 'new'}`}>Nome</label>
          <input
            id={`name-${category?.id || 'new'}`}
            name="name"
            required
            minLength={2}
            maxLength={80}
            defaultValue={category?.name}
          />
        </div>
        <div>
          <label htmlFor={`slug-${category?.id || 'new'}`}>Slug</label>
          <input
            id={`slug-${category?.id || 'new'}`}
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={160}
            defaultValue={category?.slug}
          />
        </div>
      </div>
      <label htmlFor={`description-${category?.id || 'new'}`}>Descrição</label>
      <textarea
        id={`description-${category?.id || 'new'}`}
        name="description"
        rows={2}
        maxLength={1000}
        defaultValue={category?.description}
      />
      <label htmlFor={`order-${category?.id || 'new'}`}>Ordem de exibição</label>
      <input
        id={`order-${category?.id || 'new'}`}
        name="display_order"
        type="number"
        min={0}
        max={999}
        required
        defaultValue={category?.display_order || 0}
      />
      <label className="checkbox">
        <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} />{' '}
        Categoria ativa
      </label>
      <FormMessage state={state} />
      <button type="submit" className="button navy" disabled={pending}>
        {pending ? 'Salvando…' : 'Salvar categoria'}
      </button>
    </form>
  );
}
export function ConfirmButton({
  children,
  message,
  className = 'small-button',
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
