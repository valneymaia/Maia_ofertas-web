import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout';
import { getConfig } from '@/lib/config';

const pages: Record<
  string,
  { title: string; intro: string; sections: { title: string; text: string }[] }
> = {
  sobre: {
    title: 'Boas descobertas, com transparência.',
    intro:
      'O MaiaOfertas é uma plataforma independente de curadoria de produtos, inicialmente focada na Amazon Brasil.',
    sections: [
      {
        title: 'A gente seleciona. Você decide.',
        text: 'Organizamos produtos por categoria e publicamos descrições editoriais para ajudar na sua pesquisa. Não vendemos produtos, não temos carrinho e não recebemos pagamentos.',
      },
      {
        title: 'Como o site se mantém',
        text: 'Como associado da Amazon, eu ganho com compras qualificadas. Nossos botões de acesso à Amazon são links publicitários. A compra é concluída na Amazon, com o vendedor indicado por ela. Não somos o site oficial da Amazon.',
      },
      {
        title: 'Informações para a sua escolha',
        text: 'Preços, disponibilidade, condições, entrega e garantia devem ser consultados diretamente na página da Amazon. Não exibimos avaliações ou descontos sem uma fonte autorizada.',
      },
    ],
  },
  contato: {
    title: 'Vamos conversar.',
    intro: 'Tem uma dúvida sobre o MaiaOfertas ou encontrou um link com problema?',
    sections: [
      {
        title: 'Sobre uma compra',
        text: 'Para pedidos, pagamentos, entregas, trocas ou garantia, procure a Amazon e o vendedor indicado no seu pedido. O MaiaOfertas não acessa essas informações.',
      },
      {
        title: 'Sobre a plataforma',
        text: 'Você pode entrar em contato pelo e-mail ou canal público indicado abaixo, quando configurados pelo responsável.',
      },
    ],
  },
  'politica-de-privacidade': {
    title: 'Política de privacidade',
    intro:
      'Esta página descreve os recursos implementados no MaiaOfertas. Atualizada em 18 de novembro de 2026.',
    sections: [
      {
        title: 'Navegação e dados',
        text: 'Você pode consultar o catálogo sem criar uma conta. Não solicitamos CPF, endereço de entrega ou dados de pagamento. Não instalamos ferramentas de análise ou publicidade comportamental. O provedor de hospedagem poderá processar dados técnicos de requisições, como endereço IP, para operar e proteger o serviço.',
      },
      {
        title: 'Área administrativa',
        text: 'O Supabase processa as credenciais dos administradores. Cookies essenciais mantêm a sessão autenticada. Não existe cadastro público de compradores.',
      },
      {
        title: 'Links externos',
        text: 'Ao clicar explicitamente em um link de produto, você acessa a Amazon, que possui políticas e tecnologias próprias. A tag de associado identifica a origem do encaminhamento. O MaiaOfertas não recebe informações de pagamento nem detalhes do seu pedido.',
      },
      {
        title: 'Seus direitos e contato',
        text: 'Solicitações sobre dados eventualmente tratados pela plataforma podem ser enviadas pelo contato público. Dados de compras devem ser tratados com a Amazon. Esta política deve ser revisada pelo responsável conforme os fornecedores e operações do deploy efetivo.',
      },
    ],
  },
  'termos-de-uso': {
    title: 'Termos de uso',
    intro:
      'Ao utilizar o MaiaOfertas, considere as condições de funcionamento desta plataforma independente.',
    sections: [
      {
        title: 'Curadoria e compra',
        text: 'Nosso conteúdo é informativo e editorial. Todos os detalhes da compra, preço, vendedor, disponibilidade, frete, pagamento e devolução devem ser verificados na Amazon antes de contratar.',
      },
      {
        title: 'Links de associado',
        text: 'Os links de produtos são publicitários e podem gerar comissão em compras qualificadas. O acesso à Amazon acontece apenas por sua escolha, por um botão explícito.',
      },
      {
        title: 'Conteúdo e disponibilidade',
        text: 'As descrições podem ser corrigidas e os produtos retirados do catálogo. Não garantimos disponibilidade contínua dos links externos. Não copie conteúdos ou utilize a plataforma de forma a prejudicar seu funcionamento.',
      },
    ],
  },
};
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return {
    title: pages[page]?.title || 'Página não encontrada',
    alternates: { canonical: `/${page}` },
  };
}
export default async function EditorialPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const content = pages[page];
  if (!content) notFound();
  const { contact, telegram } = getConfig();
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: page === 'sobre' ? 'Sobre' : content.title }]} />
      <article className="prose">
        <span className="eyebrow">MAIAOFERTAS</span>
        <h1>{content.title}</h1>
        <p className="intro">{content.intro}</p>
        {content.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
        {page === 'contato' && (
          <div className="contact-box">
            {contact ? (
              <a className="text-link" href={`mailto:${contact}`}>
                {contact}
              </a>
            ) : (
              <p>O e-mail de contato ainda não foi configurado.</p>
            )}
            {telegram && (
              <a className="text-link" href={telegram} target="_blank" rel="noopener">
                Acessar o canal no Telegram ↗
              </a>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
