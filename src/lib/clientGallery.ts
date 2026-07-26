import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type Stripe from "stripe";
import {
  createGallerySessionToken,
  getGalleryCookieMaxAge,
  getGalleryCookieName,
  verifyPassword,
  verifySession,
} from "./clientAuth";
import type {
  ClientGalleryFavorites,
  ClientGalleryManifest,
  ClientGalleryOrder,
  ClientGalleryPhoto,
  ClientGalleryPublic,
  ClientGalleryView,
  PrintProduct,
} from "./clientGalleryTypes";
import { PRINTS_ENABLED } from "./print-flag";
import {
  galleryFavoritesKey,
  galleryManifestKey,
  galleryOrderKey,
  galleryPhotosPrefix,
  galleryZipKey,
  isGalleryExpired,
} from "./clientGalleryTypes";
import {
  getJson,
  getObjectMetadata,
  getPresignedUrl,
  listObjects,
  objectExists,
  putJson,
} from "./r2";
import { getSiteUrl } from "./seo";

const isImageKey = (key: string) =>
  /\.(jpe?g|png|webp|avif|gif|tiff?)$/i.test(key);

const CACHE_TTL_MS = 60 * 60 * 1000;
const ttlCache = new Map<string, { value: unknown; expires: number }>();

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = ttlCache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  const value = await fn();
  ttlCache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

async function loadManifest(
  slug: string,
): Promise<ClientGalleryManifest | null> {
  return cached(`client-manifest:${slug}`, () =>
    getJson<ClientGalleryManifest>(galleryManifestKey(slug)),
  );
}

async function requireSession(slug: string) {
  const token = getCookie(getGalleryCookieName());
  if (!token) return null;
  const session = await verifySession(token);
  if (!session || session.slug !== slug) return null;
  return session;
}

function toPublic(
  slug: string,
  manifest: ClientGalleryManifest,
): ClientGalleryPublic {
  return {
    slug,
    title: manifest.title,
    clientName: manifest.clientName,
    expired: isGalleryExpired(manifest.expiresAt),
    downloadEnabled: manifest.downloadEnabled,
    storeEnabled: manifest.storeEnabled,
    expiresAt: manifest.expiresAt,
  };
}

async function listGalleryPhotos(slug: string): Promise<ClientGalleryPhoto[]> {
  const prefix = galleryPhotosPrefix(slug);
  const objects = (await listObjects(prefix)).filter((obj) =>
    isImageKey(obj.key),
  );

  const results = await Promise.all(
    objects.map(async (obj): Promise<ClientGalleryPhoto | null> => {
      try {
        const [metadata, signedUrl] = await Promise.all([
          getObjectMetadata(obj.key),
          cached(`client-photo:${obj.key}`, () => getPresignedUrl(obj.key)),
        ]);

        return {
          key: obj.key,
          src: signedUrl,
          width: Number.parseInt(metadata.width || "1500", 10),
          height: Number.parseInt(metadata.height || "1500", 10),
          filename: obj.key.split("/").pop() || "",
          title: metadata.title || metadata.caption || undefined,
        };
      } catch {
        return null;
      }
    }),
  );

  return results
    .filter((photo): photo is ClientGalleryPhoto => photo !== null)
    .sort((a, b) => a.filename.localeCompare(b.filename));
}

async function getStripe(): Promise<Stripe> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  const { default: StripeCtor } = await import("stripe");
  return new StripeCtor(key);
}

export const getClientGalleryPublic = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: slug }) => {
    const manifest = await loadManifest(slug);
    if (!manifest) {
      return { exists: false as const };
    }

    return {
      exists: true as const,
      public: toPublic(slug, manifest),
    };
  });

export const getClientGallery = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: slug }) => {
    const manifest = await loadManifest(slug);
    if (!manifest) {
      return { exists: false as const };
    }

    const publicInfo = toPublic(slug, manifest);
    const session = await requireSession(slug);

    if (!session) {
      return {
        exists: true as const,
        authenticated: false as const,
        public: publicInfo,
      };
    }

    if (publicInfo.expired) {
      return {
        exists: true as const,
        authenticated: true as const,
        expired: true as const,
        public: publicInfo,
      };
    }

    const photos = await listGalleryPhotos(slug);
    const gallery: ClientGalleryView = {
      ...publicInfo,
      photos,
      printProducts: manifest.printProducts,
    };

    return {
      exists: true as const,
      authenticated: true as const,
      expired: false as const,
      gallery,
    };
  });

export const authenticateClientGallery = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string; password: string }) => data)
  .handler(async ({ data }) => {
    const manifest = await loadManifest(data.slug);
    if (!manifest) {
      return { ok: false as const, error: "Gallery not found." };
    }

    if (isGalleryExpired(manifest.expiresAt)) {
      return { ok: false as const, error: "This gallery has expired." };
    }

    const valid = await verifyPassword(
      data.password,
      manifest.passwordHash,
      manifest.passwordSalt,
    );

    if (!valid) {
      return { ok: false as const, error: "Incorrect password." };
    }

    const token = await createGallerySessionToken(
      data.slug,
      manifest.expiresAt,
    );

    setCookie(getGalleryCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getGalleryCookieMaxAge(),
    });

    return { ok: true as const };
  });

export const getClientFavorites = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; visitorToken: string }) => data)
  .handler(async ({ data }) => {
    if (!(await requireSession(data.slug))) {
      return { photoKeys: [] as string[] };
    }

    const favorites = await getJson<ClientGalleryFavorites>(
      galleryFavoritesKey(data.slug, data.visitorToken),
    );

    return { photoKeys: favorites?.photoKeys ?? [] };
  });

export const toggleClientFavorite = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { slug: string; visitorToken: string; photoKey: string }) => data,
  )
  .handler(async ({ data }) => {
    if (!(await requireSession(data.slug))) {
      return { ok: false as const, photoKeys: [] as string[] };
    }

    const key = galleryFavoritesKey(data.slug, data.visitorToken);
    const existing = (await getJson<ClientGalleryFavorites>(key)) ?? {
      photoKeys: [],
    };
    const set = new Set(existing.photoKeys);

    if (set.has(data.photoKey)) {
      set.delete(data.photoKey);
    } else {
      set.add(data.photoKey);
    }

    const photoKeys = [...set];
    await putJson(key, { photoKeys } satisfies ClientGalleryFavorites);

    return { ok: true as const, photoKeys };
  });

export const getClientPhotoDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string; photoKey: string }) => data)
  .handler(async ({ data }) => {
    if (!(await requireSession(data.slug))) {
      return { url: null as string | null };
    }

    const manifest = await loadManifest(data.slug);
    if (!manifest?.downloadEnabled || isGalleryExpired(manifest.expiresAt)) {
      return { url: null as string | null };
    }

    if (!data.photoKey.startsWith(galleryPhotosPrefix(data.slug))) {
      return { url: null as string | null };
    }

    const filename = data.photoKey.split("/").pop() || "photo.jpg";
    const url = await getPresignedUrl(data.photoKey, {
      responseContentDisposition: `attachment; filename="${filename}"`,
    });

    return { url };
  });

export const getClientGalleryZipUrl = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: slug }) => {
    if (!(await requireSession(slug))) {
      return { url: null as string | null };
    }

    const manifest = await loadManifest(slug);
    if (!manifest?.downloadEnabled || isGalleryExpired(manifest.expiresAt)) {
      return { url: null as string | null };
    }

    const zipKey = galleryZipKey(slug);
    if (!(await objectExists(zipKey))) {
      return { url: null as string | null };
    }

    const url = await getPresignedUrl(zipKey, {
      responseContentDisposition: `attachment; filename="${slug}-gallery.zip"`,
    });

    return { url };
  });

export const createClientCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      slug: string;
      items: Array<{ productId: string; quantity: number }>;
      email?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    if (!(await requireSession(data.slug))) {
      return { url: null as string | null, error: "Unauthorized" };
    }
    if (!PRINTS_ENABLED) {
      return { url: null as string | null, error: "Prints are coming soon." };
    }

    const manifest = await loadManifest(data.slug);
    if (
      !manifest?.storeEnabled ||
      isGalleryExpired(manifest.expiresAt) ||
      data.items.length === 0
    ) {
      return { url: null as string | null, error: "Store unavailable" };
    }

    const productMap = new Map(
      manifest.printProducts.map((product) => [product.id, product]),
    );

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product || item.quantity < 1) continue;
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: product.label,
            description: product.description,
          },
          unit_amount: product.priceCents,
        },
        quantity: item.quantity,
      });
    }

    if (lineItems.length === 0) {
      return { url: null as string | null, error: "No valid items" };
    }

    const stripe = await getStripe();
    const siteUrl = getSiteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      line_items: lineItems,
      success_url: `${siteUrl}/deliver/${data.slug}?checkout=success`,
      cancel_url: `${siteUrl}/deliver/${data.slug}?checkout=cancelled`,
      metadata: {
        gallerySlug: data.slug,
        items: JSON.stringify(data.items),
      },
    });

    return { url: session.url, error: null };
  });

export async function recordClientGalleryOrder(order: ClientGalleryOrder) {
  await putJson(galleryOrderKey(order.slug, order.id), order);
}

export async function notifyPhotographerOfOrder(order: ClientGalleryOrder) {
  const email = process.env.PHOTOGRAPHER_NOTIFY_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!email || !resendKey) return;

  const itemLines = order.items
    .map(
      (item) =>
        `${item.quantity}x ${item.label} ($${(item.priceCents / 100).toFixed(2)} CAD)`,
    )
    .join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Double Tree <orders@grainissue.com>",
      to: [email],
      subject: `New print order - ${order.slug}`,
      text: [
        `Gallery: ${order.slug}`,
        `Customer: ${order.email}`,
        `Order ID: ${order.id}`,
        "",
        itemLines,
      ].join("\n"),
    }),
  });
}

export function resolvePrintProductsFromMetadata(
  manifest: ClientGalleryManifest,
  itemsJson: string,
): ClientGalleryOrder["items"] {
  let requested: Array<{ productId: string; quantity: number }> = [];
  try {
    requested = JSON.parse(itemsJson) as Array<{
      productId: string;
      quantity: number;
    }>;
  } catch {
    return [];
  }

  const productMap = new Map(
    manifest.printProducts.map((product: PrintProduct) => [
      product.id,
      product,
    ]),
  );

  return requested
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        label: product.label,
        quantity: item.quantity,
        priceCents: product.priceCents,
      };
    })
    .filter(
      (item): item is ClientGalleryOrder["items"][number] => item !== null,
    );
}
