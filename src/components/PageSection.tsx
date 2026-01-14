interface PageSectionProps {
  title: string
  children: React.ReactNode
}

export default function PageSection({ title, children }: PageSectionProps) {
  return (
    <>
      <h1 className="text-4xl font-semibold mb-8">{title}</h1>
      <div className="space-y-6 text-gray-600 leading-relaxed text-lg">{children}</div>
    </>
  )
}
