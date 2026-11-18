# MaiaOfertas Web

Vitrine independente de produtos da Amazon Brasil. Você cadastra produtos pelo painel, cola seu link de associado, revisa e publica. O visitante consulta o conteúdo e escolhe clicar em **Ver na Amazon**. Não há checkout, pagamento ou redirecionamento automático.

Esta é a **versão 1, com cadastro manual**. A importação e a aba de produtos do Telegram ficam para a versão 2. O repositório do bot não é modificado.

## Começar localmente

Requisitos: Node.js 24 LTS e pnpm 12.14.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abra [localhost:3000](http://localhost:3000). Sem Supabase, o desenvolvimento local exibe os **dois produtos reais fornecidos pelo proprietário**, com links previamente expandidos e tag original `valneymaia05-20`. Essa carga não é um banco editável: o painel informa que precisa do Supabase.

Para dados fictícios de layout, crie `.env.local` com `DEMO_MODE=true`. A demonstração exibe um aviso e desativa links de compra. **DEMO_MODE é recusado em produção.**

## Conectar Supabase e ativar o painel

1. Crie um projeto Supabase sob sua conta.
2. Copie `.env.example` para `.env.local`. Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL` (local: `http://localhost:3000`). A chave é a pública `anon`, nunca `service_role`.
3. No SQL Editor, execute `supabase/migrations/202611180001_catalog.sql`. Alternativamente, com Supabase CLI instalada: `supabase link --project-ref SEU_PROJECT_REF` e `supabase db push`.
4. **Opcional:** execute `supabase/seed.sql` para publicar os dois produtos enviados nesta solicitação. As URLs completas mantêm os parâmetros e a tag originais. Não contém preços nem imagens copiadas.
5. Em Authentication → Users, crie manualmente seu usuário administrador com e-mail e senha. Desative cadastros públicos em Authentication → Providers → Email se não forem usados por outros serviços do projeto.
6. Copie o UUID desse usuário e conceda acesso no SQL Editor:

```sql
insert into public.admin_users(user_id) values ('UUID-DO-SEU-USUARIO');
```

7. Reinicie `pnpm dev` e entre em [admin/login](http://localhost:3000/admin/login).

Não existe cadastro público de administradores. Não há chave privilegiada na aplicação. Remova uma concessão com `delete from public.admin_users where user_id = 'UUID';`.

## Cadastrar seus próximos links

No painel, escolha **Produtos → Cadastrar produto**. Informe título, slug, resumo e descrição originais; cole o link oficial completo ou `https://link.amazon/...` / `https://amzn.to/...`; escolha uma categoria. Salve como rascunho ou publique.

O servidor verifica até cinco saltos de encurtadores permitidos, com timeout por requisição, e só aceita um destino de produto HTTPS na Amazon Brasil com tag de associado. A URL final completa fica no banco; o botão público leva diretamente a ela. Não há requisição para resolver links durante a visita ao catálogo.

Não é possível comprovar que a tag pertence a uma conta usando apenas a URL. Confira no seu painel de Associados a tag e o cadastro deste site. Links curtos que não possam ser verificados são recusados com orientação para usar o link longo.

Imagens: use apenas URL HTTPS de imagem própria/licenciada e selecione a origem. Sem imagem, há uma ilustração original identificada. Não há upload de arquivos nesta versão.

## Comandos

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
pnpm start
```

Para testes de banco local isolado, consulte [docs/TESTING.md](docs/TESTING.md). Os mesmos scripts podem ser executados com `npm run NOME` em ambientes que utilizem npm. O lockfile canônico é `pnpm-lock.yaml`.

## Deploy na Vercel

1. Importe este repositório como projeto Next.js na Vercel.
2. Configure as três variáveis obrigatórias de produção: `NEXT_PUBLIC_SITE_URL` (URL HTTPS real), `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Não ative `DEMO_MODE`. Configure opcionalmente `CONTACT_EMAIL` e `NEXT_PUBLIC_TELEGRAM_URL`.
4. Aplique a migration e, se desejar, a carga inicial no Supabase de produção. Provisione seu administrador.
5. Use `pnpm install --frozen-lockfile` e `pnpm build`. Revise o deploy de prévia e só então promova para produção.
6. Confira o domínio cadastrado no Programa de Associados e mantenha a divulgação publicitária visível.

Nenhum deploy de produção foi feito por esta entrega. As chaves e o projeto Supabase não foram fornecidos. A aplicação falha com erro de configuração se faltar configuração obrigatória em produção, em vez de publicar dados demonstrativos.

## Estrutura

- `src/app/(public)`: início, ofertas, categorias, produtos e páginas institucionais.
- `src/app/admin`: login, dashboard e gestão de produtos/categorias.
- `src/features`: serviços de catálogo e administração.
- `src/lib`: validação, configuração, autenticação, clientes Supabase e expansão segura de links.
- `src/components`: componentes públicos, formulários e ações de administração.
- `src/data`: links reais iniciais e fixtures explicitamente separadas.
- `supabase`: migration com RLS/constraints/triggers e carga inicial opcional.
- `tests`: unitários, integração com mocks, navegação e banco local.

## Documentação e limites

[Arquitetura](docs/ARCHITECTURE.md) · [Testes](docs/TESTING.md) · [Amazon](docs/AMAZON_COMPLIANCE.md) · [Telegram V2](docs/TELEGRAM_INTEGRATION.md) · [Relatório](docs/IMPLEMENTATION_REPORT.md)

Os objetivos Lighthouse/Web Vitals ainda precisam de medição no deploy real. A gestão lista os 200 produtos mais recentes; o catálogo público tem paginação no servidor. Não há métricas de vendas/comissões/visitantes, scraping de produtos, API de preços ou integração ativa com o bot.
