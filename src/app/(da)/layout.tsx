import RootHtml from '@/components/root-html';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('da');

export default function DanishLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="da">{children}</RootHtml>;
}
