export default function Footer() {
  return (
    <footer className="w-full mt-section bg-background border-t border-primary flex flex-col md:flex-row justify-between items-start md:items-center px-margin-mobile md:px-margin py-gutter gap-gutter">
      <div className="font-display text-4xl md:text-5xl uppercase tracking-tight text-primary">
        Eyes of Forest
      </div>

      <div className="flex flex-col md:flex-row gap-gutter md:gap-12">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary">Follow</span>
          <a
            href="https://instagram.com/eyes_of_forest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary hover:text-primary"
          >
            Instagram
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary">Inquiries</span>
          <a href="mailto:soop_lim@proton.me" className="text-base text-primary hover:underline">
            soop_lim@proton.me
          </a>
        </div>
      </div>

      <div className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
        © {new Date().getFullYear()} Eyes of Forest
      </div>
    </footer>
  )
}
