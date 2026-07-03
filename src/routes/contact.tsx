import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb } from "../components/Breadcrumb";
import {
  generateMetaTags,
  generateCanonicalUrl,
  generateOgTags,
} from "../lib/seo";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      {
        title: "Contact | Double Tree",
      },
      ...generateMetaTags({
        description:
          "Get in touch with Double Tree photography. Interested in prints, collaborations, or just want to say hello? Contact me via email or Instagram.",
      }),
      ...generateOgTags({
        title: "Contact | Double Tree",
        description:
          "Get in touch with Double Tree photography. Interested in prints, collaborations, or just want to say hello? Contact me via email or Instagram.",
        url: generateCanonicalUrl("/contact"),
        type: "website",
      }),
    ],
    links: [
      {
        rel: "canonical",
        href: generateCanonicalUrl("/contact"),
      },
    ],
  }),
});

function Contact() {
  return (
    <div className="px-margin-mobile md:px-margin py-gutter md:py-16">
      <Breadcrumb />

      <header className="mb-section max-w-3xl">
        <h1 className="font-display text-5xl md:text-7xl uppercase leading-tight">
          Let's get <span className="italic normal-case">in touch.</span>
        </h1>
        <p className="text-lg text-secondary mt-gutter max-w-md">
          Whether you're interested in a print, a collaboration, or just want to
          say hello, I'd love to hear from you.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
            Direct
          </h2>
          <a
            href="mailto:soop_lim@proton.me"
            className="block text-lg hover:italic"
          >
            soop_lim@proton.me
          </a>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
            Connect
          </h2>
          <a
            href="https://instagram.com/eyes_of_forest"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-lg hover:line-through"
          >
            @eyes_of_forest
          </a>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
            Based in
          </h2>
          <p className="text-lg">Vancouver, Canada</p>
        </div>
      </div>
    </div>
  );
}
