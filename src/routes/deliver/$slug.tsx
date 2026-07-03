import { createFileRoute, notFound } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ClientGalleryExperience } from "../../components/ClientGalleryExperience";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
	authenticateClientGallery,
	getClientGallery,
} from "../../lib/clientGallery";
import { generateMetaTags } from "../../lib/seo";

export const Route = createFileRoute("/deliver/$slug")({
	component: DeliverGallery,
	validateSearch: (search: Record<string, unknown>) => ({
		checkout:
			typeof search.checkout === "string" ? search.checkout : undefined,
	}),
	loader: async ({ params }) => {
		return getClientGallery({ data: params.slug });
	},
	head: () => ({
		meta: [
			{ title: "Private Gallery | Double Tree" },
			...generateMetaTags({
				description: "Private client photo gallery.",
			}),
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
});

function DeliverGallery() {
	const { slug } = Route.useParams();
	const loaderData = Route.useLoaderData();
	const search = Route.useSearch();
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	if (!loaderData.exists) {
		throw notFound();
	}

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		setSubmitting(true);
		setError(null);

		const result = await authenticateClientGallery({
			data: { slug, password },
		});

		if (result.ok) {
			window.location.reload();
			return;
		}

		setError(result.error ?? "Unable to sign in.");
		setSubmitting(false);
	}

	if (loaderData.authenticated && loaderData.expired) {
		return (
			<div className="px-margin-mobile md:px-margin py-gutter md:py-16 max-w-xl">
				<h1 className="font-display text-4xl md:text-5xl uppercase mb-gutter">
					Gallery <span className="italic normal-case">expired.</span>
				</h1>
				<p className="text-lg text-secondary">
					This gallery for {loaderData.public.clientName} is no longer
					available. If you need your photos again, please get in touch.
				</p>
			</div>
		);
	}

	if (!loaderData.authenticated) {
		return (
			<div className="px-margin-mobile md:px-margin py-gutter md:py-16 max-w-md">
				<p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
					Private gallery
				</p>
				<h1 className="font-display text-4xl md:text-5xl uppercase leading-tight mb-2">
					{loaderData.public.title}
				</h1>
				<p className="text-lg text-secondary mb-gutter">
					{loaderData.public.clientName}
				</p>

				{loaderData.public.expired ? (
					<p className="text-secondary">
						This gallery has expired. Please contact me if you need access
						again.
					</p>
				) : (
					<form onSubmit={handleSubmit} className="space-y-gutter">
						<div>
							<Label htmlFor="gallery-password">Gallery password</Label>
							<Input
								id="gallery-password"
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								autoComplete="current-password"
								required
								className="mt-2"
							/>
						</div>
						{error && <p className="text-sm text-secondary">{error}</p>}
						<Button
							type="submit"
							disabled={submitting}
							className="uppercase tracking-widest text-xs"
						>
							{submitting ? (
								<>
									<Loader2
										className="w-4 h-4 animate-spin mr-2"
										aria-hidden="true"
									/>
									Opening...
								</>
							) : (
								"Enter gallery"
							)}
						</Button>
					</form>
				)}
			</div>
		);
	}

	return (
		<ClientGalleryExperience
			slug={slug}
			gallery={loaderData.gallery}
			checkoutStatus={search.checkout}
		/>
	);
}
