# Arquitetura

## Decisões

Next.js App Router com React e TypeScript strict. CSS com tokens e Tailwind via PostCSS; Lucide para ilustrações e ícones. Server Components renderizam catálogo, busca e metadados. Client Components ficam restritos aos formulários administrativos, estados de erro e confirmações. Zod valida as entradas no servidor. Supabase PostgreSQL/Auth fornece persistência, identidade e RLS.

Nenhuma API da Amazon é necessária. Não há checkout, carrinho nem coleta de pagamento. shadcn/ui não foi adicionado: os controles nativos usados nesta versão atendem aos fluxos sem mais dependências.

## Dados

`Product` relaciona categoria, conteúdo editorial, ASIN opcional, URL de associado, origem da imagem, destaque e status. Categorias têm slug único, ordem e ativação. Timestamps são `timestamptz`/UTC; a administração apresenta as datas em America/Fortaleza.

O catálogo público usa cliente `anon` sem sessão administrativa, filtro explícito de publicação e RLS. A busca usa coluna normalizada mantida por trigger; a paginação usa `range` e limite máximo 24. A leitura de detalhes valida status e RLS. Produtos arquivados ou inexistentes retornam página 404. O sitemap busca somente produtos públicos em lotes.

O estado local sem banco exibe os dois links reais do proprietário, nunca fixtures fictícias. `DEMO_MODE=true` é apenas de desenvolvimento, possui banner e não gera links de compra. Em produção o Supabase e a URL HTTPS são obrigatórios.

## Administração

Login por Supabase Auth com senha, sessão em cookie HttpOnly/SameSite=Lax/Secure em produção. `proxy.ts` renova sessões administrativas. `requireAdmin` usa `auth.getUser()` e verifica a tabela `admin_users` nas páginas e operações. Uma sessão válida sem concessão não permite administrar. A aplicação não usa `service_role`.

Server Actions tratam mutações, incluindo a verificação nativa de origem/CSRF do Next.js. O banco reforça invariantes em triggers, checks, chaves estrangeiras e RLS. O usuário não pode inserir a própria concessão em `admin_users`. A política de escrita depende de `is_admin`, security definer com search_path vazio. Categorias com produtos não podem ser excluídas/desativadas.

O Supabase Auth aplica limites de autenticação. Configure seus limites e CAPTCHA no provedor conforme exposição e tráfego. Não foi inventado um limitador em memória que ofereça uma falsa garantia em múltiplas instâncias.

## URLs e conteúdo

O validador exige HTTPS, hosts exatos, caminho de produto, uma tag Brasil, ausência de credenciais, portas e parâmetros de redirecionamento. Não troca a tag. O resolver só faz GET manual de encurtadores explicitamente permitidos, cancela o corpo, valida cada destino antes de segui-lo e para antes de fazer requisição à Amazon. Até cinco saltos e cinco segundos por requisição. Não há endpoint público para resolver endereços.

As descrições são renderizadas como texto React, sem HTML arbitrário. Imagens HTTPS próprias/licenciadas usam `next/image` sem otimização para não transformar conteúdo sem autorização. Nenhum conteúdo é raspado da Amazon. CSP, no-sniff, anti-iframe, política de referência e HSTS são configurados. A CSP usa unsafe-inline para os scripts de hidratação do Next.js; uma evolução possível é CSP com nonce por resposta. Não reivindicamos que isso equivale a uma auditoria de segurança completa.

## Cache e atualização

Renderização dinâmica evita cache compartilhado de sessões/dados privados e simplifica a visibilidade de alterações. `cache()` do React apenas deduplica consultas no mesmo render. As mutações chamam `revalidatePath('/', 'layout')` para invalidar a árvore pública. Nenhuma resposta administrativa deve ir para cache compartilhado. Um cache público com tags pode ser introduzido se o volume justificar.

## Extensão futura

A origem Telegram e a aba exclusiva ficam para V2, conforme solicitado. O bot original permanece independente. Uma futura entrada autenticada chamará a mesma validação e criará rascunhos. Adaptadores de Creators API/preços/imagens dependem de autorização e políticas aplicáveis.
