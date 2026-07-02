import { createServerFn } from "@tanstack/react-start";
import { getObjectMetadata, getPresignedUrl, listObjects } from "./r2";

// Only real image files - skips folder-marker objects and anything non-image
const isImageKey = (key: string) =>
	/\.(jpe?g|png|webp|avif|gif|tiff?)$/i.test(key);

// ponytail: in-memory TTL cache; move to KV/redis if this ever runs multi-instance.
// TTL must stay well under the 24h presigned-URL expiry.
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const ttlCache = new Map<string, { value: unknown; expires: number }>();
async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
	const hit = ttlCache.get(key);
	if (hit && hit.expires > Date.now()) return hit.value as T;
	const value = await fn();
	ttlCache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
	return value;
}

// One R2 round-trip per prefix per hour instead of per page view
const listImages = (prefix: string) =>
	cached(`list:${prefix}`, async () =>
		(await listObjects(prefix)).filter((obj) => isImageKey(obj.key)),
	);

// Metadata + presigned URL per object, cached so browsers see stable URLs
// (stable URLs = browser cache hits instead of re-downloading every visit)
const getPhotoData = (key: string) =>
	cached(`photo:${key}`, async () => {
		const [metadata, signedUrl] = await Promise.all([
			getObjectMetadata(key),
			getPresignedUrl(key),
		]);
		return { metadata, signedUrl };
	});

// Fisher-Yates shuffle (unbiased, unlike sort(() => Math.random() - 0.5))
function shuffle<T>(arr: T[]): T[] {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export interface GalleryPhoto {
	src: string;
	width: number;
	height: number;
	filename: string;
	title?: string;
	description?: string;
}

export interface GalleryCategory {
	name: string;
	slug: string;
	photoCount: number;
	coverPhoto: string;
	lastModified: string; // ISO date of the newest photo - sitemap <lastmod>
}

// Server function to get all gallery categories
export const getGalleryCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		const categories: GalleryCategory[] = [];

		// List all objects in the gallery prefix
		const objects = await listImages("gallery/");

		// Group objects by category (first folder after gallery/)
		const categoryMap = new Map<string, typeof objects>();

		for (const obj of objects) {
			const match = obj.key.match(/^gallery\/([^/]+)\/(.+)$/);
			if (match) {
				const [, categorySlug] = match;
				if (!categoryMap.has(categorySlug)) {
					categoryMap.set(categorySlug, []);
				}
				categoryMap.get(categorySlug)?.push(obj);
			}
		}

		// Create category objects - cover is the most recently modified photo
		for (const [slug, photos] of categoryMap.entries()) {
			if (photos.length > 0) {
				const newest = photos.reduce((a, b) =>
					b.lastModified > a.lastModified ? b : a,
				);
				const coverPhoto = (await getPhotoData(newest.key)).signedUrl;

				categories.push({
					name: slug.charAt(0).toUpperCase() + slug.slice(1),
					slug,
					photoCount: photos.length,
					coverPhoto,
					lastModified: new Date(newest.lastModified)
						.toISOString()
						.slice(0, 10),
				});
			}
		}

		return categories;
	},
);

// Server function to get photos for a specific category
export const getGalleryPhotos = createServerFn({ method: "GET" })
	.inputValidator((data: string) => data)
	.handler(async ({ data }) => {
		const category = data;
		const prefix = `gallery/${category}/`;

		// List all image objects in this category
		const objects = await listImages(prefix);

		// Resolve metadata + presigned URLs in parallel (sequential was seconds-slow)
		const results = await Promise.all(
			objects.map(async (obj): Promise<GalleryPhoto | null> => {
				try {
					const { metadata, signedUrl } = await getPhotoData(obj.key);

					return {
						src: signedUrl,
						width: parseInt(metadata.width || "1500", 10),
						height: parseInt(metadata.height || "1500", 10),
						filename: obj.key.split("/").pop() || "",
						title: metadata.title || metadata.caption || undefined,
						description: metadata.description || undefined,
					};
				} catch (error) {
					console.error(`Error processing ${obj.key}:`, error);
					return null; // Skip files we can't process
				}
			}),
		);

		const photos = shuffle(
			results.filter((p): p is GalleryPhoto => p !== null),
		);

		return {
			category,
			categoryName: category.charAt(0).toUpperCase() + category.slice(1),
			photos,
		};
	});

// Server function to get a random photo for homepage hero
export const getRandomHeroPhoto = createServerFn({ method: "GET" }).handler(
	async () => {
		// List all photos from all categories - images only, so we never pick a
		// folder-marker or non-image key (the cause of the hero failing to load)
		const objects = await listImages("gallery/");

		if (objects.length === 0) {
			return null;
		}

		// Pick a random photo
		const randomIndex = Math.floor(Math.random() * objects.length);
		const randomPhoto = objects[randomIndex];

		// Get metadata and presigned URL
		const { metadata, signedUrl } = await getPhotoData(randomPhoto.key);

		return {
			src: signedUrl,
			width: parseInt(metadata.width || "1920", 10),
			height: parseInt(metadata.height || "1080", 10),
		};
	},
);
