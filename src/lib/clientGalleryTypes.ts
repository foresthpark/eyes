export interface PrintProduct {
	id: string;
	label: string;
	priceCents: number;
	description?: string;
}

export interface ClientGalleryManifest {
	title: string;
	clientName: string;
	passwordHash: string;
	passwordSalt: string;
	createdAt: string;
	expiresAt: string;
	downloadEnabled: boolean;
	storeEnabled: boolean;
	coverKey?: string;
	printProducts: PrintProduct[];
}

export interface ClientGalleryPhoto {
	key: string;
	src: string;
	width: number;
	height: number;
	filename: string;
	title?: string;
}

export interface ClientGalleryPublic {
	slug: string;
	title: string;
	clientName: string;
	expired: boolean;
	downloadEnabled: boolean;
	storeEnabled: boolean;
	expiresAt: string;
}

export interface ClientGalleryView extends ClientGalleryPublic {
	photos: ClientGalleryPhoto[];
	printProducts: PrintProduct[];
}

export interface ClientGalleryOrder {
	id: string;
	slug: string;
	email: string;
	items: Array<{
		productId: string;
		label: string;
		quantity: number;
		priceCents: number;
	}>;
	status: "paid" | "pending";
	createdAt: string;
	stripeSessionId: string;
}

export interface ClientGalleryFavorites {
	photoKeys: string[];
}

export function galleryManifestKey(slug: string): string {
	return `clients/${slug}/gallery.json`;
}

export function galleryPhotosPrefix(slug: string): string {
	return `clients/${slug}/photos/`;
}

export function galleryZipKey(slug: string): string {
	return `clients/${slug}/download-all.zip`;
}

export function galleryFavoritesKey(
	slug: string,
	visitorToken: string,
): string {
	return `clients/${slug}/favorites/${visitorToken}.json`;
}

export function galleryOrderKey(slug: string, orderId: string): string {
	return `clients/${slug}/orders/${orderId}.json`;
}

export function isGalleryExpired(expiresAt: string): boolean {
	return new Date(expiresAt).getTime() <= Date.now();
}
