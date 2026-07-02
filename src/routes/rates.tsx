import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { JsonLd } from "../components/JsonLd";
import {
	generateCanonicalUrl,
	generateMetaTags,
	generateOgTags,
} from "../lib/seo";

export const Route = createFileRoute("/rates")({
	component: Rates,
	head: () => ({
		meta: [
			{
				title: "Rates | Eyes of Forest",
			},
			...generateMetaTags({
				description:
					"Portrait session rates with Eyes of Forest, a Vancouver-based photographer. Editorial, lifestyle, and personal-branding portraits shot on film and digital.",
			}),
			...generateOgTags({
				title: "Rates | Eyes of Forest",
				description:
					"Portrait session rates with Eyes of Forest, a Vancouver-based photographer. Editorial, lifestyle, and personal-branding portraits shot on film and digital.",
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

interface Tier {
	name: string;
	tagline: string;
	price: string;
	duration: string;
	features: string[];
	featured?: boolean;
}

const tiers: Tier[] = [
	{
		name: "Starter",
		tagline: "A quick, honest portrait.",
		price: "$180",
		duration: "45 min · one location",
		features: [
			"30-min pre-shoot consultation",
			"One outfit / look",
			"10–15 retouched images",
			"Online gallery delivery",
			"Personal print licence",
		],
		featured: true,
	},
	{
		name: "Film",
		tagline: "Grain, patience, and one keeper on paper.",
		price: "$400",
		duration: "90 min · shot on film",
		features: [
			"30-min pre-shoot consultation",
			"Two rolls: one 35mm, one medium format",
			"Developing & high-res scans included",
			'One 5" framed print included',
			"Online gallery of scans",
		],
	},
	{
		name: "Studio",
		tagline: "Controlled light, clean backdrops.",
		price: "$650",
		duration: "2 hrs · studio included",
		features: [
			"30-min pre-shoot consultation",
			"2 hours of studio rental included",
			"Up to two outfits / looks",
			"20–30 retouched images",
			"Backdrop & lighting setup",
			"Online gallery delivery",
			"Personal print licence",
		],
	},
	{
		name: "Editorial",
		tagline: "A full, considered story.",
		price: "$1050",
		duration: "3-3.5 hrs · multiple looks",
		features: [
			"60-min pre-shoot consultation",
			"Multiple outfits / looks",
			"Hair & makeup coordination",
			"30–50 retouched images",
			"Online gallery delivery",
			"Commercial licence available",
		],
	},
];

const addOns: { label: string; price: string }[] = [
	{ label: "Additional retouched image", price: "$10 each" },
	{ label: "Extra hour on location", price: "$150" },
	{
		label: "Studio rental (arranged separately)",
		price: "$160 / hr · 2 hr min",
	},
	{ label: "Rush delivery (48hr turnaround)", price: "+25%" },
	{ label: "Larger framed print", price: "On request" },
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
						name: "Eyes of Forest",
						address: {
							"@type": "PostalAddress",
							addressLocality: "Vancouver",
							addressCountry: "CA",
						},
					},
					areaServed: "Vancouver, BC",
					offers: tiers.map((tier) => ({
						"@type": "Offer",
						name: `${tier.name} Portrait Session`,
						price: tier.price.replace("$", ""),
						priceCurrency: "CAD",
						description: tier.duration,
					})),
				}}
			/>
			<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Rates" }]} />

			<header className="mb-section max-w-3xl">
				<h1 className="font-display text-5xl md:text-7xl uppercase leading-tight">
					Portrait <span className="italic normal-case">rates.</span>
				</h1>
				<p className="text-lg text-secondary mt-gutter max-w-md">
					Sessions for individuals, couples, and personal branding - shot on
					film and digital across Vancouver. All prices in CAD, GST not
					included.
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-section">
				{tiers.map((tier) => (
					<article
						key={tier.name}
						className={`flex flex-col border p-8 ${
							tier.featured
								? "border-primary bg-surface-container"
								: "border-outline"
						}`}
					>
						<div className="flex items-baseline justify-between">
							<h2 className="text-xs font-semibold uppercase tracking-widest text-secondary">
								{tier.name}
							</h2>
							{tier.featured && (
								<span className="text-[0.65rem] font-semibold uppercase tracking-widest text-primary border border-primary px-2 py-1">
									Most booked
								</span>
							)}
						</div>

						<p className="font-display text-3xl md:text-4xl italic mt-6 leading-tight">
							{tier.tagline}
						</p>

						<div className="mt-8 mb-6">
							<span className="font-display text-5xl">{tier.price}</span>
							<p className="text-xs font-semibold uppercase tracking-widest text-secondary mt-2">
								{tier.duration}
							</p>
						</div>

						<ul className="space-y-3 text-sm text-primary border-t border-outline pt-6 flex-1">
							{tier.features.map((feature) => (
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
								tier.featured
									? "bg-primary text-background hover:opacity-90"
									: "border border-primary text-primary hover:bg-primary hover:text-background"
							}`}
						>
							Book {tier.name} <ArrowRight size={16} aria-hidden="true" />
						</Link>
					</article>
				))}
			</div>

			<section className="mb-section border-t border-outline pt-section">
				<h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
					How your gallery works
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
					<div className="md:col-span-5 space-y-gutter text-lg leading-relaxed max-w-md">
						<p>
							When your photos are ready, you&apos;ll receive a private link and
							password — something like{" "}
							<span className="font-semibold">
								eyes.forestp.dev/deliver/your-session
							</span>
							. Only you can open it.
						</p>
						<p>
							Inside: full-resolution downloads, a download-all ZIP, favorites
							to mark your keepers, and optional print ordering. Galleries stay
							active for 60 days.
						</p>
					</div>
					<ul className="md:col-span-6 md:col-start-7 divide-y divide-outline text-primary">
						{[
							"Password-protected private gallery",
							"Full-res downloads + download-all ZIP",
							"Favorites to select your best shots",
							"Optional print store (Stripe checkout)",
							"Active for 60 days after delivery",
						].map((item) => (
							<li key={item} className="py-4 flex gap-3">
								<span className="text-secondary" aria-hidden="true">
									—
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
							Every session includes a 30-minute pre-shoot consultation to talk
							through the direction and any references you bring. A 30% deposit
							reserves your date; the balance is due on the day of the shoot.
						</p>
						<p>
							Retouched images arrive within two to three weeks via a private
							online gallery. Need something outside these packages - weddings,
							events, or a custom brief? Reach out and I'll put together a
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
