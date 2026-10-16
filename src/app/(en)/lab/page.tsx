import type { Metadata } from 'next';
import BenefitOptions from '@/components/lab/benefit-options';

// Design options to pick from. Not linked anywhere and kept out of search engines.
export const metadata: Metadata = { title: 'Design options', robots: { index: false, follow: false } };

export default function Page() {
  return <BenefitOptions />;
}
