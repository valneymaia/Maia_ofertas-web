'use client';

import { useActionState, useState } from 'react';
import { productAction, type ActionState } from '@/app/admin/actions';
import { FormMessage } from '@/components/admin-forms';
import type { Category } from '@/types/domain';

const initial: ActionState = {};

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 160)
    .replace(/-$/g, '');
}

function getAsin(link: string) {
  try {
    const url = new URL(link);
    if (!['amazon.com.br', 'www.amazon.com.br'].includes(url.hostname)) return '';
    return url.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i)?.[1]?.toUpperCase() || '';
  } catch {
    return '';
  }
}

function makeSummary(title: string) {
  return `${title}: confira os detalhes, as especificações e as condições disponíveis na Amazon antes de decidir.`;
}

function makeDescription(title: string) {
  return `Conheça ${title} e consulte na Amazon as informações completas do produto.\n\nAntes de comprar, confirme o modelo, os itens incluídos, a compatibilidade, o vendedor, a garantia e as condições atualizadas na página do produto.`;
}

export function AdGenerator({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(productAction.bind(null, undefined), initial);
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [generated, setGenerated] = useState(false);
  const [generatorError, setGeneratorError] = useState('');

  function generate() {
    if (!affiliateUrl.trim() || !title.trim() || !categoryId) {
      setGeneratorError('Informe o link, o nome do produto e a categoria para gerar o anúncio.');
      setGenerated(false);
      return;
    }
    setGeneratorError('');
    setSlug(slugify(title));
    setSummary(makeSummary(title.trim()));
    setDescription(makeDescription(title.trim()));
    setGenerated(true);
  }

  return (
    <form action={action} className="form-stack panel">
      <div className="form-grid">
        <div>
          <label htmlFor="ad-affiliate-url">Link de afiliado da Amazon</label>
          <input
            id="ad-affiliate-url"
            name="affiliate_url"
            type="url"
            required
            maxLength={2048}
            placeholder="https://link.amazon/... ou link completo da Amazon"
            value={affiliateUrl}
            onChange={(event) => {
              setAffiliateUrl(event.target.value);
              setGenerated(false);
            }}
          />
          <small>Links curtos permitidos são verificados no servidor ao salvar.</small>
        </div>
        <div>
          <label htmlFor="ad-title">Nome do produto</label>
          <input
            id="ad-title"
            name="title"
            required
            minLength={3}
            maxLength={180}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setGenerated(false);
            }}
          />
        </div>
      </div>

      <div className="form-grid">
        <div>
          <label htmlFor="ad-category">Categoria</label>
          <select
            id="ad-category"
            name="category_id"
            required
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setGenerated(false);
            }}
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ad-slug">Endereço amigável</label>
          <input
            id="ad-slug"
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={160}
            placeholder="nome-do-produto"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
        </div>
      </div>

      <button type="button" className="button navy" onClick={generate}>
        Gerar texto do anúncio
      </button>
      {generatorError && (
        <p className="message error" role="alert">
          {generatorError}
        </p>
      )}

      {generated && (
        <>
          <label htmlFor="ad-summary">Resumo sugerido (você pode editar)</label>
          <textarea
            id="ad-summary"
            name="summary"
            required
            minLength={10}
            maxLength={320}
            rows={3}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
          <label htmlFor="ad-description">Descrição sugerida (você pode editar)</label>
          <textarea
            id="ad-description"
            name="description"
            required
            minLength={20}
            maxLength={10000}
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <details className="preview" open>
            <summary>Prévia do anúncio</summary>
            <h2>{title}</h2>
            <p>{summary}</p>
            <div className="description">{description}</div>
            <small>O botão de compra encaminhará para o link de afiliado informado.</small>
          </details>
        </>
      )}

      <input type="hidden" name="asin" value={getAsin(affiliateUrl)} />
      <input type="hidden" name="image_url" value="" />
      <input type="hidden" name="image_source" value="placeholder" />
      <input type="hidden" name="status" value="draft" />
      <input type="hidden" name="fetch_image" value="on" />
      {generated && <FormMessage state={state} />}
      <button
        type="submit"
        className="button orange"
        disabled={!generated || pending || categories.length === 0}
      >
        {pending ? 'Validando link e salvando rascunho…' : 'Salvar rascunho no site'}
      </button>
      {categories.length === 0 && (
        <p className="message error">Cadastre uma categoria ativa antes de gerar anúncios.</p>
      )}
    </form>
  );
}
