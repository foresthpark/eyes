import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { PageTransition } from '../components/PageTransition'
import { JsonLd } from '../components/JsonLd'
import { defaultSiteMetadata, generateMetaTags, getSiteUrl } from '../lib/seo'

import Header from '../components/Header'
import Footer from '../components/Footer'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Eyes of Forest::林 | How I See the World',
      },
      ...generateMetaTags({
        description: defaultSiteMetadata.description,
        keywords: defaultSiteMetadata.keywords,
        author: defaultSiteMetadata.author,
      }),
      {
        name: 'theme-color',
        content: '#000000',
      },
      {
        // Let Google show large image previews in search results/Discover
        name: 'robots',
        content: 'max-image-preview:large',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400..700;1,400..700&family=Inter:wght@300;400;600;700&display=swap',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.png',
      },
      {
        rel: 'apple-touch-icon',
        href: '/logo192.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-margin-mobile text-center" role="alert">
      <h1 className="font-display text-[120px] leading-none mb-gutter">404</h1>
      <p className="text-lg text-secondary mb-gutter">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="border border-primary px-12 py-4 text-xs font-semibold uppercase tracking-[0.1em] hover:bg-primary hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Go to home page"
      >
        Go Home
      </Link>
    </div>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased font-body bg-background text-foreground overflow-x-hidden">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Eyes of Forest',
            url: getSiteUrl(),
            description: defaultSiteMetadata.description,
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Eyes of Forest',
            url: getSiteUrl(),
            logo: `${getSiteUrl()}/logo512.png`,
            sameAs: ['https://instagram.com/eyes_of_forest'],
            location: {
              '@type': 'Place',
              name: 'Vancouver, Canada',
            },
          }}
        />
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <Header />
          <main id="main-content" className="min-h-[calc(100vh-64px)]">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </ErrorBoundary>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
