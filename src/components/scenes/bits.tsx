import { cn } from '@/lib/utils';

/** Fades and lifts children in when `on` becomes true. Keeps layout space. */
export function Appear({ on, className, children }: { on: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'transition-[opacity,translate] duration-500 ease-out-expo',
        on ? 'translate-y-0 opacity-100' : 'translate-y-2.5 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A message card written by a program (blue) or a person (neutral). */
export function Note({ label, bot, className, children }: { label: string; bot?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('border p-3.5 text-sm leading-relaxed md:p-4', bot ? 'border-bot bg-bot-soft' : 'border-hair bg-card', className)}>
      <p className={cn('mb-1.5 font-mono text-[11px]', bot ? 'text-bot' : 'text-muted')}>{label}</p>
      {children}
    </div>
  );
}
