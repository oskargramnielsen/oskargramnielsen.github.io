export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-left text-muted-foreground max-w-3xl">
        <p className="text-xs">
          &copy; {currentYear} Oskar Gram Nielsen. All rights reserved.
        </p>
        {/* 
        <p className="text-xs mt-1">
          Minimalist Portfolio.
        </p>
        */}
      </div>
    </footer>
  );
}
