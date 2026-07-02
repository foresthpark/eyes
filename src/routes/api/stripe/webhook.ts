import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import {
	notifyPhotographerOfOrder,
	recordClientGalleryOrder,
	resolvePrintProductsFromMetadata,
} from "../../../lib/clientGallery";
import type {
	ClientGalleryManifest,
	ClientGalleryOrder,
} from "../../../lib/clientGalleryTypes";
import { galleryManifestKey } from "../../../lib/clientGalleryTypes";
import { getJson } from "../../../lib/r2";

export const Route = createFileRoute("/api/stripe/webhook")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const stripeKey = process.env.STRIPE_SECRET_KEY;
				const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

				if (!stripeKey || !webhookSecret) {
					return new Response("Missing Stripe configuration", { status: 500 });
				}

				const stripe = new Stripe(stripeKey);
				const signature = request.headers.get("stripe-signature");
				if (!signature) {
					return new Response("Missing Stripe signature", { status: 400 });
				}

				const body = await request.text();
				let event: Stripe.Event;

				try {
					event = stripe.webhooks.constructEvent(
						body,
						signature,
						webhookSecret,
					);
				} catch {
					return new Response("Invalid Stripe signature", { status: 400 });
				}

				if (event.type === "checkout.session.completed") {
					const session = event.data.object as Stripe.Checkout.Session;
					const slug = session.metadata?.gallerySlug;
					const itemsJson = session.metadata?.items;

					if (slug && itemsJson) {
						const manifest = await getJson<ClientGalleryManifest>(
							galleryManifestKey(slug),
						);

						if (manifest) {
							const order: ClientGalleryOrder = {
								id: session.id,
								slug,
								email:
									session.customer_details?.email ??
									session.customer_email ??
									"unknown",
								items: resolvePrintProductsFromMetadata(manifest, itemsJson),
								status: "paid",
								createdAt: new Date().toISOString(),
								stripeSessionId: session.id,
							};

							await recordClientGalleryOrder(order);
							await notifyPhotographerOfOrder(order);
						}
					}
				}

				return new Response(JSON.stringify({ received: true }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			},
		},
	},
});
