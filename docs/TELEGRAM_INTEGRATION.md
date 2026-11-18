# Telegram — somente versão 2

A primeira versão recebe produtos manualmente. **Não foi criada importação, aba Telegram ou endpoint de ingestão público**, conforme a delimitação do proprietário. Nenhum arquivo do repositório MaiaOfertas/Telethon foi alterado.

## Fluxo futuro

Bot Python → endpoint autenticado → validação de URL e conteúdo → rascunho → revisão do administrador → publicação. Uma aba futura filtrará a origem `telegram`. O catálogo manual continua disponível.

Contrato conceitual: `POST /api/integrations/telegram/offers` com `source`, `external_message_id`, `product_title`, `product_url`, `affiliate_url`, `asin`, `category_hint`, `received_at`. As credenciais nunca devem ir para o navegador.

Antes de ativar: assinatura HMAC sobre corpo bruto e timestamp; tolerância de tempo; proteção contra replay; chave idempotente por origem/mensagem; deduplicação; limites de requisição em armazenamento compartilhado; validação Zod; logs sem segredos; nenhuma publicação automática. Campos `source` e `external_message_id` serão adicionados por migration nessa fase, com índice único composto. Não presumir licença de imagens recebidas do Telegram.

Os links compartilhados podem levar a uma página real do MaiaOfertas com conteúdo editorial. Somente o clique explícito do visitante leva à Amazon. Não haverá ocultação de origem nem mecanismo para simular tráfego ou cliques.
