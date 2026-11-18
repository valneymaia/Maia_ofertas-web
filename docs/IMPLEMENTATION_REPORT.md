# Entrega da versão 1 — 18/11/2026

## Resultado

Repositório inicialmente vazio. Implementadas vitrine responsiva, busca, filtros por categoria, ordenação, paginação, detalhes, links publicitários diretos, divulgação de associado, páginas institucionais, metadados, Open Graph, favicon, dados estruturados de WebSite, sitemap e robots.

Painel com login Supabase, concessão explícita de administrador, indicadores calculados no banco, criação/edição de produto, prévia de texto, rascunho, publicação, despublicação, arquivamento e gestão de categorias. Não há cadastro público de administrador. Não é necessário usar chave service_role na aplicação.

Os links enviados repetidamente foram deduplicados. Os dois destinos verificados são PS5 e Samsung WindFree, com tag `valneymaia05-20`. Há uma carga SQL opcional para eles e uma prévia local sem banco. A URL final completa é preservada. Não copiamos preços ou imagens Amazon.

A versão 2 poderá importar produtos do Telegram e oferecer aba exclusiva. Isso não foi ativado. **O repositório original do bot permaneceu intacto.**

## Tecnologias efetivas

| Tecnologia             | Versão           |
| ---------------------- | ---------------- |
| Node.js de verificação | 24.19.0          |
| pnpm                   | 12.14.0          |
| Next.js                | 16.4.6           |
| React / React DOM      | 19.3.1           |
| TypeScript             | 5.9.3            |
| Supabase JS / SSR      | 2.118.0 / 0.12.7 |
| Tailwind               | 4.3.5            |
| Zod                    | 4.6.7            |
| Lucide                 | 0.577.0          |
| Vitest                 | 5.1.1            |
| Playwright             | 1.65.1           |
| axe Playwright         | 4.14.0           |

O lockfile fixa as dependências transitivas. Supabase JS foi fixado na versão anterior à publicação do dia, respeitando a verificação de idade do pnpm.

## Verificações realizadas

- `pnpm install --frozen-lockfile`: concluído.
- `pnpm lint`: concluído sem erros ou avisos após os ajustes.
- `pnpm typecheck`: concluído.
- `pnpm test`: 48 testes passaram em 5 arquivos. Os 5 testes de componentes foram repetidos após o ajuste final das ilustrações e passaram.
- `pnpm build`: concluído com configuração fictícia explícita para build, sem credenciais de produção. Gerou as rotas públicas/administrativas e os recursos de SEO.
- `pnpm test:e2e`: 7 cenários passaram em 18 segundos, reutilizando o servidor local com `E2E_EXTERNAL_SERVER=true`. Cobrem navegação pública, busca, categoria, detalhes, links, ausência de navegação automática, 404, bloqueio de admin, menu mobile, overflow e axe nas quatro larguras. Os ajustes observados foram corrigidos: contraste do rodapé e streaming antecipado na página inexistente.
- Open Graph: resposta HTTP 200 com `image/png`.
- Revisão visual: capturas de desktop e celular inspecionadas.

## Pendências verificáveis

Não foi possível executar o fluxo com Supabase real ou RLS local: não foram fornecidos projeto/chaves e o daemon Docker local não está ativo. Há migration, harness de RLS e E2E administrativo completos para executar no banco isolado antes de publicar. Os testes com mocks não são apresentados como verificação real de Supabase.

Não foram medidos Lighthouse/Core Web Vitals nem feita revisão integral com leitor de tela. Não há domínio, configuração de contato real ou deploy Vercel provisionado. O README explica esses passos. Os textos de privacidade/termos devem refletir os fornecedores e dados reais do deploy.

O painel lista os 200 produtos mais recentes. A vitrine pública é paginada. Não há upload de imagens, processamento de preços, métricas de vendas/comissões, integração ativa com API Amazon ou com o bot.
