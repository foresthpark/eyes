interface PageSectionProps {
  title: string
  children: React.ReactNode
}

export default function PageSection({ title, children }: PageSectionProps) {
  return (
    <>
      <h1 className="text-4xl font-semibold mb-8 dark:text-white">{title}</h1>
      <div className="space-y-6 text-gray-600 dark:text-gray-200 leading-relaxed text-lg">{children}</div>
    </>
  )
}
