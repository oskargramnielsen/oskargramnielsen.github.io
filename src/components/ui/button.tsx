import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'a'> & { size?: 'md' | 'lg' };

export default function Button({ className, size = 'lg', children, ...props }: Props) {
  return (
    <a
      className={cn(
        'group inline-flex items-center gap-3.5 rounded-full bg-accent font-medium text-paper transition-transform duration-300 ease-out-expo hover:scale-[1.03]',
        size === 'lg' ? 'px-7.5 py-5.5 text-lg' : 'px-5 py-3 text-base',
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
        →
      </span>
    </a>
  );
}
