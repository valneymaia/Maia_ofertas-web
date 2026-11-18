# Testes

## Verificações rápidas

`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

Vitest e React Testing Library verificam hosts falsos, protocolos, tags duplicadas/inválidas, ASIN, schemas, categorias, busca, limites de página, componentes, XSS por texto, bloqueio de compra em demonstração e autorização no servidor. O resolver usa fetch injetado e mocks; não faz cliques ou requisições à Amazon. Testes de catálogo com fixtures verificam rascunhos/arquivados. Mocks não substituem execução de RLS real.

## Navegador

```sh
pnpm exec playwright install chromium
pnpm test:e2e
```

O runner inicia desenvolvimento na porta 3100, sem credenciais de produção. Usa os dois produtos reais fornecidos como conteúdo determinístico e bloqueia requisições Amazon. Verifica início, busca, categoria, detalhes, atributos dos links, ausência de navegação automática, 404, proteção de admin, menu mobile, overflow e axe em 360, 390, 768 e 1440 px. Capturas ficam em `test-results`.

Se o servidor já estiver aberto com essa configuração na porta 3100, `E2E_EXTERNAL_SERVER=true` executa os mesmos testes sem iniciar/encerrar o processo. Foi usado no Windows para evitar espera na limpeza da árvore de processos do servidor; não altera as asserções nem pula cenários.

Não realiza compras nem abre páginas reais da Amazon. As varreduras axe não cobrem toda a acessibilidade: revisão manual com teclado, leitor de tela e contexto editorial continua necessária. Lighthouse, INP e métricas reais de tráfego não foram medidos nesta entrega.

## Banco local e RLS

É necessário Docker **com daemon ativo** e Supabase CLI. Inicie um projeto local de teste com a migration deste repositório, usando `supabase init`, `supabase start`, `supabase db reset`. Use apenas banco isolado: `db reset` apaga o banco local alvo.

Crie `.env.test` (ignorado pelo Git):

```dotenv
TEST_SUPABASE_URL=http://127.0.0.1:54321
TEST_SUPABASE_ANON_KEY=CHAVE_ANON_LOCAL
TEST_SUPABASE_SERVICE_ROLE_KEY=CHAVE_SERVICE_ROLE_LOCAL
```

Execute `pnpm test:rls`. O script exige host localhost/127.0.0.1. Cria usuários temporários, provisiona somente o usuário administrador e testa leitura pública, negação de escrita anônima/comum, publicação/arquivamento, constraints, categoria ocupada e bloqueio de autoatribuição de acesso. Faz limpeza ao terminar. A chave privilegiada é usada exclusivamente por esse harness isolado, nunca pela aplicação.

O fluxo administrativo E2E completo requer esse mesmo banco local e usa `pnpm test:e2e:admin`. Não configure chaves de produção para o teste. O navegador cadastra rascunho, publica e arquiva e verifica a visibilidade pública; o harness cria/limpa o usuário e os registros.

Nesta máquina, o executável Docker está instalado, porém o daemon não está ativo. Assim, RLS real e E2E administrativo com Supabase não podem ser declarados executados. Os testes com mocks e de navegação pública são registrados separadamente no relatório.

## CI

GitHub Actions instala com lockfile congelado e executa lint, TypeScript, Vitest, build e navegação pública. O build utiliza valores fictícios explícitos apenas para validar configuração, sem secrets de produção. O teste de RLS e o E2E administrativo são opt-in com Supabase local; não dependem de secrets em PRs não confiáveis.
