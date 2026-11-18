export const metadata = { title: 'Administração', robots: { index: false, follow: false } };
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <main id="conteudo">{children}</main>;
}
