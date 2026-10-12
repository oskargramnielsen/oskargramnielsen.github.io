import { cn } from '@/lib/utils';

export default function SectionLabel({ index, label, className }: { index: number; label: string; className?: string }) {
  return (
    <div className={cn('mb-[5vw] flex justify-between border-t border-ink pt-3.5 text-[13px] text-muted', className)}>
      <span>({String(index).padStart(2, '0')})</span>
      <span>{label}</span>
    </div>
  );
}
