import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb } from "../components/Breadcrumb";
import { JsonLd } from "../components/JsonLd";
import {
	generateCanonicalUrl,
	generateMetaTags,
	generateOgTags,
} from "../lib/seo";

export const Route = createFileRoute("/about")({
	component: About,
	head: () => ({
		meta: [
			{
				title: "About | Double Tree",
			},
			...generateMetaTags({
				description:
					"Learn about Double Tree photography. Vancouver-based photographer capturing the world through film and digital photography using Hasselblad, Nikon, Pentax, and Fuji cameras.",
			}),
			...generateOgTags({
				title: "About | Double Tree",
				description:
					"Learn about Double Tree photography. Vancouver-based photographer capturing the world through film and digital photography using Hasselblad, Nikon, Pentax, and Fuji cameras.",
				url: generateCanonicalUrl("/about"),
				type: "website",
			}),
		],
		links: [
			{
				rel: "canonical",
				href: generateCanonicalUrl("/about"),
			},
		],
	}),
});

function About() {
	return (
		<div className="px-margin-mobile md:px-margin py-gutter md:py-16">
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "ProfilePage",
					url: generateCanonicalUrl("/about"),
					mainEntity: {
						"@type": "Person",
						name: "Double Tree",
						jobTitle: "Photographer",
						address: {
							"@type": "PostalAddress",
							addressLocality: "Vancouver",
							addressCountry: "CA",
						},
						sameAs: ["https://instagram.com/double_tree"],
					},
				}}
			/>
			<Breadcrumb />

			<h1 className="font-display text-5xl md:text-8xl leading-none uppercase mb-section max-w-4xl">
				The eye behind <span className="italic normal-case">the lens.</span>
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
				<div className="md:col-span-5 space-y-16">
					<article>
						<span className="text-xs font-semibold uppercase tracking-widest block mb-2 text-secondary">
							The Artist
						</span>
						<div className="text-lg leading-relaxed space-y-gutter max-w-md">
							<p>
								I'm a photographer based in Vancouver, Canada. This is a
								collection of my view of the world - the things I see and the
								things I feel.
							</p>
							<p>
								Through my work, shot on both film and digital, I hope to share
								how I see the world.
							</p>
						</div>
					</article>

					<article>
						<span className="text-xs font-semibold uppercase tracking-widest block mb-4 text-secondary">
							Equipment
						</span>
						<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
							<li>Hasselblad 501CM</li>
							<li>Nikon FM3A</li>
							<li>Pentax 645NII</li>
							<li>Fuji X100VI</li>
						</ul>
					</article>
				</div>

				<div className="md:col-span-6 md:col-start-7">
					<h2 className="font-display text-3xl md:text-4xl italic leading-tight">
						Capturing stillness, subtracting the superfluous.
					</h2>
				</div>
			</div>
		</div>
	);
}
