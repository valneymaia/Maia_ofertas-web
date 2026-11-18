import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard, EmptyState, AmazonOutboundLink } from '@/components/products';
import { initialProducts } from '@/data/initial-offers';
describe('vitrine', () => {
  it('renderiza produto sem imagem com ação explícita', () => {
    render(<ProductCard product={initialProducts[0]} />);
    const link = screen.getByRole('link', { name: /Ver na Amazon/ });
    expect(link).toHaveAttribute('href', initialProducts[0].affiliate_url);
    expect(link).toHaveAttribute('rel', 'sponsored nofollow noopener');
    expect(screen.getByText('Ilustração da categoria')).toBeVisible();
    expect(screen.getByText('Link publicitário')).toBeVisible();
  });
  it('desativa compra nas demonstrações', () => {
    render(<ProductCard product={initialProducts[0]} demo />);
    expect(screen.queryByRole('link', { name: /Ver na Amazon/ })).toBeNull();
    expect(screen.getByText(/Demonstração · sem compra/)).toHaveAttribute('aria-disabled', 'true');
  });
  it('não publica href malicioso', () => {
    render(<AmazonOutboundLink url="javascript:alert(1)" />);
    expect(screen.queryByRole('link')).toBeNull();
  });
  it('mostra estado vazio útil', () => {
    render(<EmptyState />);
    expect(screen.getByRole('link', { name: /Explorar o catálogo/ })).toHaveAttribute(
      'href',
      '/ofertas',
    );
  });
  it('renderiza texto malicioso como texto', () => {
    const { container } = render(
      <ProductCard product={{ ...initialProducts[0], title: '<script>alert(1)</script>' }} />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByRole('heading')).toHaveTextContent('<script>alert(1)</script>');
  });
});
