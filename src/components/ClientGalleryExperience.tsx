import { useEffect, useMemo, useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "react-photo-album/masonry.css";
import "yet-another-react-lightbox/styles.css";
import {
	ArrowDownToLine,
	Download,
	Heart,
	Loader2,
	ShoppingBag,
} from "lucide-react";
import type { ClientGalleryView } from "../lib/clientGalleryTypes";
import {
	createClientCheckoutSession,
	getClientFavorites,
	getClientGalleryZipUrl,
	getClientPhotoDownloadUrl,
	toggleClientFavorite,
} from "../lib/clientGallery";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const VISITOR_TOKEN_KEY = "eof-gallery-visitor";

function getVisitorToken(): string {
	if (typeof window === "undefined") return "";
	const existing = localStorage.getItem(VISITOR_TOKEN_KEY);
	if (existing) return existing;
	const token = crypto.randomUUID();
	localStorage.setItem(VISITOR_TOKEN_KEY, token);
	return token;
}

interface ClientGalleryExperienceProps {
	slug: string;
	gallery: ClientGalleryView;
	checkoutStatus?: string | null;
}

export function ClientGalleryExperience({
	slug,
	gallery,
	checkoutStatus,
}: ClientGalleryExperienceProps) {
	const [index, setIndex] = useState(-1);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [visitorToken, setVisitorToken] = useState("");
	const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
	const [downloadingZip, setDownloadingZip] = useState(false);
	const [cart, setCart] = useState<Record<string, number>>({});
	const [checkoutEmail, setCheckoutEmail] = useState("");
	const [checkingOut, setCheckingOut] = useState(false);
	const [checkoutError, setCheckoutError] = useState<string | null>(null);

	useEffect(() => {
		const token = getVisitorToken();
		setVisitorToken(token);

		getClientFavorites({ data: { slug, visitorToken: token } }).then(
			(result) => {
				setFavorites(new Set(result.photoKeys));
			},
		);
	}, [slug]);

	const photos = useMemo(
		() =>
			gallery.photos.map((photo, i) => ({
				...photo,
				alt: photo.title ?? `${gallery.title} photograph ${i + 1}`,
				loading: "lazy" as const,
			})),
		[gallery.photos, gallery.title],
	);

	const favoriteCount = favorites.size;

	async function handleToggleFavorite(photoKey: string) {
		if (!visitorToken) return;
		const result = await toggleClientFavorite({
			data: { slug, visitorToken, photoKey },
		});
		if (result.ok) {
			setFavorites(new Set(result.photoKeys));
		}
	}

	async function handleDownload(photoKey: string) {
		setDownloadingKey(photoKey);
		try {
			const result = await getClientPhotoDownloadUrl({
				data: { slug, photoKey },
			});
			if (result.url) {
				window.open(result.url, "_blank", "noopener,noreferrer");
			}
		} finally {
			setDownloadingKey(null);
		}
	}

	async function handleDownloadAll() {
		setDownloadingZip(true);
		try {
			const result = await getClientGalleryZipUrl({ data: slug });
			if (result.url) {
				window.open(result.url, "_blank", "noopener,noreferrer");
			}
		} finally {
			setDownloadingZip(false);
		}
	}

	function updateCart(productId: string, quantity: number) {
		setCart((current) => {
			const next = { ...current };
			if (quantity <= 0) {
				delete next[productId];
			} else {
				next[productId] = quantity;
			}
			return next;
		});
	}

	async function handleCheckout() {
		setCheckingOut(true);
		setCheckoutError(null);
		try {
			const items = Object.entries(cart).map(([productId, quantity]) => ({
				productId,
				quantity,
			}));
			const result = await createClientCheckoutSession({
				data: {
					slug,
					items,
					email: checkoutEmail || undefined,
				},
			});
			if (result.url) {
				window.location.href = result.url;
				return;
			}
			setCheckoutError(result.error ?? "Unable to start checkout.");
		} finally {
			setCheckingOut(false);
		}
	}

	const cartTotalCents = gallery.printProducts.reduce((total, product) => {
		const quantity = cart[product.id] ?? 0;
		return total + product.priceCents * quantity;
	}, 0);

	return (
		<div className="w-full">
			<style>{`
        .react-photo-album--photo img {
          object-fit: cover !important;
          display: block !important;
        }
      `}</style>

			<div className="px-margin-mobile md:px-margin py-gutter md:py-16">
				<header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-gutter mb-gutter border-b border-primary pb-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
							Private gallery
						</p>
						<h1 className="font-display text-4xl md:text-6xl uppercase leading-tight">
							{gallery.title}
						</h1>
						<p className="text-lg text-secondary mt-2">{gallery.clientName}</p>
					</div>
					<div className="flex flex-col items-start md:items-end gap-2">
						<span className="text-xs font-semibold uppercase tracking-widest text-secondary">
							{photos.length} {photos.length === 1 ? "photo" : "photos"}
						</span>
						{favoriteCount > 0 && (
							<span className="text-xs font-semibold uppercase tracking-widest text-primary">
								{favoriteCount} favorited
							</span>
						)}
					</div>
				</header>

				{checkoutStatus === "success" && (
					<div className="mb-gutter border border-primary bg-surface-container px-6 py-4 text-sm">
						Thank you — your print order was received. I&apos;ll be in touch
						shortly.
					</div>
				)}

				{checkoutStatus === "cancelled" && (
					<div className="mb-gutter border border-outline px-6 py-4 text-sm text-secondary">
						Checkout was cancelled. Your gallery is still here whenever
						you&apos;re ready.
					</div>
				)}

				<div className="flex flex-wrap gap-3 mb-gutter">
					{gallery.downloadEnabled && (
						<Button
							type="button"
							variant="outline"
							onClick={handleDownloadAll}
							disabled={downloadingZip}
							className="uppercase tracking-widest text-xs"
						>
							{downloadingZip ? (
								<Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
							) : (
								<Download className="w-4 h-4" aria-hidden="true" />
							)}
							Download all
						</Button>
					)}
				</div>

				<section aria-label={`${gallery.title} photo gallery`}>
					<PhotoAlbum
						layout="masonry"
						photos={photos}
						onClick={({ index: photoIndex }) => setIndex(photoIndex)}
						columns={(containerWidth) => {
							if (containerWidth < 640) return 1;
							if (containerWidth < 1024) return 2;
							if (containerWidth < 1536) return 3;
							return 4;
						}}
						spacing={12}
						padding={0}
					/>
				</section>

				<Lightbox
					slides={photos.map((photo) => ({
						src: photo.src,
						width: photo.width,
						height: photo.height,
						alt: photo.alt,
						title: photo.title,
					}))}
					open={index >= 0}
					index={index < 0 ? 0 : index}
					close={() => setIndex(-1)}
					toolbar={{
						buttons: [
							...(gallery.downloadEnabled
								? [
										<button
											key="download"
											type="button"
											className="yarl__button"
											onClick={() => {
												const photo = photos[index];
												if (photo) handleDownload(photo.key);
											}}
											aria-label="Download photo"
										>
											{downloadingKey === photos[index]?.key ? (
												<Loader2 className="w-5 h-5 animate-spin" />
											) : (
												<ArrowDownToLine className="w-5 h-5" />
											)}
										</button>,
									]
								: []),
							<button
								key="favorite"
								type="button"
								className="yarl__button"
								onClick={() => {
									const photo = photos[index];
									if (photo) handleToggleFavorite(photo.key);
								}}
								aria-label="Toggle favorite"
							>
								<Heart
									className={`w-5 h-5 ${
										photos[index] && favorites.has(photos[index].key)
											? "fill-primary text-primary"
											: ""
									}`}
								/>
							</button>,
							"close",
						],
					}}
				/>

				{gallery.storeEnabled && gallery.printProducts.length > 0 && (
					<section className="mt-section border-t border-outline pt-section">
						<div className="flex items-center gap-3 mb-6">
							<ShoppingBag className="w-5 h-5" aria-hidden="true" />
							<h2 className="font-display text-3xl italic">Order prints</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-3xl">
							{gallery.printProducts.map((product) => (
								<article
									key={product.id}
									className="border border-outline p-6 flex flex-col gap-4"
								>
									<div>
										<h3 className="text-base font-semibold">{product.label}</h3>
										{product.description && (
											<p className="text-sm text-secondary mt-1">
												{product.description}
											</p>
										)}
									</div>
									<div className="flex items-center justify-between gap-4 mt-auto">
										<span className="font-display text-2xl">
											${(product.priceCents / 100).toFixed(0)} CAD
										</span>
										<div className="flex items-center gap-2">
											<Label htmlFor={`qty-${product.id}`} className="sr-only">
												Quantity for {product.label}
											</Label>
											<Input
												id={`qty-${product.id}`}
												type="number"
												min={0}
												max={20}
												value={cart[product.id] ?? 0}
												onChange={(event) =>
													updateCart(
														product.id,
														Number.parseInt(event.target.value, 10) || 0,
													)
												}
												className="w-20"
											/>
										</div>
									</div>
								</article>
							))}
						</div>

						{cartTotalCents > 0 && (
							<div className="mt-gutter max-w-md space-y-4">
								<div>
									<Label htmlFor="checkout-email">Email for order updates</Label>
									<Input
										id="checkout-email"
										type="email"
										value={checkoutEmail}
										onChange={(event) => setCheckoutEmail(event.target.value)}
										placeholder="you@example.com"
										className="mt-2"
									/>
								</div>
								<Button
									type="button"
									onClick={handleCheckout}
									disabled={checkingOut}
									className="uppercase tracking-widest text-xs"
								>
									{checkingOut ? (
										<>
											<Loader2
												className="w-4 h-4 animate-spin mr-2"
												aria-hidden="true"
											/>
											Redirecting...
										</>
									) : (
										`Checkout — $${(cartTotalCents / 100).toFixed(2)} CAD`
									)}
								</Button>
								{checkoutError && (
									<p className="text-sm text-secondary">{checkoutError}</p>
								)}
							</div>
						)}
					</section>
				)}
			</div>
		</div>
	);
}
