import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { JsonLd } from "../components/JsonLd";
import {
  generateCanonicalUrl,
  generateMetaTags,
  generateOgTags,
  getSiteUrl,
} from "../lib/seo";

export const Route = createFileRoute("/rates")({
  component: Rates,
  head: () => ({
    meta: [
      {
        title: "Rates | Double Tree",
      },
      ...generateMetaTags({
        description:
          "Headshot, portrait, and branding session rates in Vancouver. Session fees plus image collections for personal branding and professional portraits.",
      }),
      ...generateOgTags({
        title: "Rates | Double Tree",
        description:
          "Headshot, portrait, and branding session rates in Vancouver. Session fees plus image collections for personal branding and professional portraits.",
        url: generateCanonicalUrl("/rates"),
        type: "website",
      }),
    ],
    links: [
      {
        rel: "canonical",
        href: generateCanonicalUrl("/rates"),
      },
    ],
  }),
});

interface Session {
  name: string;
  tagline: string;
  price: string;
  priceLabel?: string;
  duration: string;
  features: string[];
  featured?: boolean;
}

const PORTRAIT_IMAGE_CREDIT = 150;

const sessions: Session[] = [
  {
    name: "Headshot",
    tagline: "A focused update for LinkedIn, casting, or your team page.",
    price: "$180",
    priceLabel: "all in",
    duration: "45–60 min · one location",
    features: [
      "30-min pre-shoot consultation",
      "One outfit / look",
      "5 retouched images included",
      "Online gallery delivery",
      "Personal print licence",
    ],
  },
  {
    name: "Portrait",
    tagline: "Headshots, branding, and portraits for a full refresh.",
    price: "$450",
    duration: "2–3 hrs · studio or location",
    features: [
      "60-min pre-shoot consultation",
      "Hair & makeup coordination",
      "3–5 looks, multiple backdrops",
      `$${PORTRAIT_IMAGE_CREDIT} image credit toward a collection`,
      "Online gallery delivery",
      "Personal print licence",
    ],
    featured: true,
  },
  {
    name: "Film",
    tagline: "Grain, patience, and one keeper on paper.",
    price: "$400",
    priceLabel: "all in",
    duration: "90 min · shot on film",
    features: [
      "30-min pre-shoot consultation",
      "Two rolls: one 35mm, one medium format",
      "Developing & high-res scans included",
      'One 5" framed print included',
      "Online gallery of scans",
    ],
  },
];

interface Collection {
  images: number;
  listed: string;
  afterCredit: string;
}

const collections: Collection[] = [
  { images: 6, listed: "$325", afterCredit: "$175" },
  { images: 12, listed: "$475", afterCredit: "$325" },
  { images: 18, listed: "$625", afterCredit: "$475" },
];

const addOns: { label: string; price: string }[] = [
  {
    label: "10-image pack (18-image collection only)",
    price: "$275",
  },
  { label: "Extra hour on location", price: "$100" },
  {
    label: "Studio rental (arranged separately)",
    price: "$160 / hr · 2 hr min",
  },
  { label: "Rush delivery (48hr turnaround)", price: "+25%" },
  { label: "Larger framed print", price: "On request" },
  {
    label: "Commercial day rate",
    price: "From $1,250 · usage quoted separately",
  },
];

const jsonLdOffers = [
  ...sessions.map((session) => ({
    "@type": "Offer" as const,
    name: `${session.name} Session`,
    price: session.price.replace("$", "").replace(",", ""),
    priceCurrency: "CAD",
    description: session.duration,
  })),
  ...collections.map((collection) => ({
    "@type": "Offer" as const,
    name: `${collection.images}-Image Collection`,
    price: collection.listed.replace("$", "").replace(",", ""),
    priceCurrency: "CAD",
    description: `${collection.images} retouched images`,
  })),
];

function Rates() {
  return (
    <div className="px-margin-mobile md:px-margin py-gutter md:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Portrait photography",
          provider: {
            "@type": "Person",
            name: "Double Tree",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Vancouver",
              addressCountry: "CA",
            },
          },
          areaServed: "Vancouver, BC",
          offers: jsonLdOffers,
        }}
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Rates" }]} />

      <header className="mb-section max-w-3xl">
        <h1 className="font-display text-5xl md:text-7xl uppercase leading-tight">
          Portrait <span className="italic normal-case">rates.</span>
        </h1>
        <p className="text-lg text-secondary mt-gutter max-w-md">
          Headshots, branding portraits, and film sessions across Vancouver.
          Session fees and image collections are priced separately. All prices
          in CAD, GST not included.
        </p>
      </header>

      <section className="mb-section">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
          Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {sessions.map((session) => (
            <article
              key={session.name}
              className={`flex flex-col border p-8 ${
                session.featured
                  ? "border-primary bg-surface-container"
                  : "border-outline"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary">
                  {session.name}
                </h3>
                {session.featured && (
                  <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-primary border border-primary px-2 py-1">
                    Most booked
                  </span>
                )}
              </div>

              <p className="font-display text-3xl md:text-4xl italic mt-6 leading-tight">
                {session.tagline}
              </p>

              <div className="mt-8 mb-6">
                <span className="font-display text-5xl">{session.price}</span>
                <p className="text-xs font-semibold uppercase tracking-widest text-secondary mt-2">
                  {session.priceLabel ?? "session fee"} · {session.duration}
                </p>
              </div>

              <ul className="space-y-3 text-sm text-primary border-t border-outline pt-6 flex-1">
                {session.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="text-secondary" aria-hidden="true">
                      -
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={`mt-8 inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  session.featured
                    ? "bg-primary text-background hover:opacity-90"
                    : "border border-primary text-primary hover:bg-primary hover:text-background"
                }`}
              >
                Book {session.name}{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-section border-t border-outline pt-section">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
          Image collections
        </h2>
        <p className="text-lg text-secondary max-w-2xl mb-3">
          Collections are for Portrait sessions. After your shoot, you choose how
          many retouched finals you want from the menu below. Your session
          includes a ${PORTRAIT_IMAGE_CREDIT} credit toward one collection. The
          credit applies to collections only and cannot be taken off the session
          fee or cashed out.
        </p>
        <p className="text-lg text-secondary max-w-2xl mb-6">
          Need a straightforward update? The Headshot session is $180 all in
          with 5 retouched images included. No collection required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {collections.map((collection) => (
            <article
              key={collection.images}
              className="flex flex-col border border-outline p-8"
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary">
                {collection.images} images
              </h3>
              <div className="mt-8 mb-4">
                <span className="font-display text-5xl">
                  {collection.listed}
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest text-secondary mt-2">
                  listed price
                </p>
              </div>
              <p className="text-sm text-primary border-t border-outline pt-6">
                <span className="font-semibold">{collection.afterCredit}</span>{" "}
                after ${PORTRAIT_IMAGE_CREDIT} Portrait session credit
              </p>
            </article>
          ))}
        </div>
        <div className="text-sm text-secondary mt-6 max-w-2xl space-y-2">
          <p>
            <span className="font-semibold text-primary">Headshot:</span> $180
            all in · 5 retouched images included.
          </p>
          <p>
            <span className="font-semibold text-primary">Portrait:</span> $450
            session + 18-image collection ($625) − ${PORTRAIT_IMAGE_CREDIT}{" "}
            credit = $925 all in.
          </p>
        </div>
      </section>

      <section className="mb-section border-t border-outline pt-section">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
          How your gallery works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          <div className="md:col-span-5 space-y-gutter text-lg leading-relaxed max-w-md">
            <p>
              When your retouched images are ready, I&apos;ll email you a
              private gallery link and password - something like{" "}
              <span className="font-semibold">
                {getSiteUrl().replace(/^https?:\/\//, "")}/deliver/your-session
              </span>
              . Only you can open it.
            </p>
            <p>
              Inside: full-resolution downloads of your final images, a
              download-all ZIP, and optional print ordering. Galleries stay
              active for 60 days, so download and back up while it&apos;s open.
            </p>
          </div>
          <ul className="md:col-span-6 md:col-start-7 divide-y divide-outline text-primary">
            {[
              "Password-protected, client-only access",
              "Full-resolution downloads of your retouched finals",
              "Download-all ZIP for easy backup",
              "Optional print ordering",
              "Active for 60 days after delivery",
            ].map((item) => (
              <li key={item} className="py-4 flex gap-3">
                <span className="text-secondary" aria-hidden="true">
                  -
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
            Add-ons
          </h2>
          <ul className="divide-y divide-outline">
            {addOns.map((addOn) => (
              <li
                key={addOn.label}
                className="flex items-center justify-between py-4 text-primary"
              >
                <span className="text-base">{addOn.label}</span>
                <span className="text-sm font-semibold uppercase tracking-widest text-secondary whitespace-nowrap ml-4">
                  {addOn.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
            How it works
          </h2>
          <div className="text-lg leading-relaxed space-y-gutter max-w-md">
            <p>
              Every session starts with a pre-shoot consultation to talk through
              direction and references. A 30% deposit on the session fee reserves
              your date; the balance is due on the day of the shoot. Image
              collections are invoiced at or after your viewing.
            </p>
            <p>
              Retouched images arrive within two to three weeks via a private
              online gallery. Need something outside these packages - weddings,
              events, or a custom brief? Reach out and I&apos;ll put together a
              quote.
            </p>
          </div>
          <Link
            to="/contact"
            className="mt-gutter self-start inline-flex items-center gap-3 border border-primary px-12 py-4 text-primary text-xs font-semibold uppercase tracking-widest hover:bg-primary hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Start an inquiry <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
