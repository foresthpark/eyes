import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { PageTransition } from '../components/PageTransition'
import { defaultSiteMetadata, generateMetaTags, generateCanonicalUrl } from '../lib/seo'

import Header from '../components/Header'

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
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'canonical',
        href: generateCanonicalUrl('/'),
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center" role="alert">
      <h1 className="text-6xl font-light mb-4 dark:text-white">404</h1>
      <p className="text-xl text-gray-500 dark:text-gray-300 mb-8">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 rounded"
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
      <body className="antialiased text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-200">
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
        </ErrorBoundary>
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
        <Scripts />
      </body>
    </html>
  )
}
