export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative mt-20 border-t border-border/40 py-12">
      <div className="container mx-auto flex max-w-5xl flex-col gap-6 px-4 text-sm text-muted-foreground/80 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground/70">OGN Studio</p>
          <p className="mt-2 text-xs text-muted-foreground/60">Automation, computational design, and digital products for the built world.</p>
        </div>
        <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground/70">
          Copyright {currentYear} Oskar Gram Nielsen.
        </div>
      </div>
    </footer>
  );
}
