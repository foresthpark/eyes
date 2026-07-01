import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation()
  
  // Auto-generate breadcrumbs from route if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const pathname = location.pathname
    const crumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
    ]

    if (pathname === '/') {
      return crumbs.slice(0, 1) // Just home on home page
    }

    if (pathname.startsWith('/gallery')) {
      crumbs.push({ label: 'Gallery', href: '/gallery' })
      
      // If it's a category page, add the category name
      const categoryMatch = pathname.match(/^\/gallery\/([^/]+)$/)
      if (categoryMatch) {
        const categorySlug = categoryMatch[1]
        const categoryName = categorySlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        crumbs.push({ label: categoryName })
      }
    } else if (pathname === '/about') {
      crumbs.push({ label: 'About' })
    } else if (pathname === '/contact') {
      crumbs.push({ label: 'Contact' })
    }

    return crumbs
  })()

  // Don't show breadcrumb if only one item (home page)
  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const key = `${item.label}-${index}`
          
          return (
            <li
              key={key}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index === 0 ? (
                <Home className="w-4 h-4 text-secondary" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4 text-secondary" aria-hidden="true" />
              )}

              {isLast ? (
                <span
                  className="text-primary"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  to={item.href as '/' | '/gallery' | '/about' | '/contact'}
                  className="text-secondary hover:text-primary hover:line-through focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span className="text-secondary" itemProp="name">
                  {item.label}
                </span>
              )}
              
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
