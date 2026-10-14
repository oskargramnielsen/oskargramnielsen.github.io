import RootHtml from '@/components/root-html';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('en');

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
