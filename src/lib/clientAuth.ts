const PBKDF2_ITERATIONS = 100_000;
const COOKIE_NAME = "cg_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface GallerySessionPayload {
	slug: string;
	exp: number;
}

function getSecret(): string {
	const secret = process.env.CLIENT_GALLERY_SECRET;
	if (!secret) {
		throw new Error("Missing CLIENT_GALLERY_SECRET environment variable");
	}
	return secret;
}

function bytesToBase64(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(base64: string): Uint8Array {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
	return bytesToBase64(bytes)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
	const padded = value.replace(/-/g, "+").replace(/_/g, "/");
	const padLength = (4 - (padded.length % 4)) % 4;
	return base64ToBytes(padded + "=".repeat(padLength));
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	return crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"],
	);
}

export async function hashPassword(
	password: string,
	saltBase64?: string,
): Promise<{ hash: string; salt: string }> {
	const saltBytes = saltBase64
		? base64ToBytes(saltBase64)
		: crypto.getRandomValues(new Uint8Array(16));
	const salt = saltBase64 ?? bytesToBase64(saltBytes);

	const saltCopy = new Uint8Array(saltBytes);

	const encoder = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);

	const derived = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: saltCopy,
			iterations: PBKDF2_ITERATIONS,
			hash: "SHA-256",
		},
		keyMaterial,
		256,
	);

	return {
		hash: bytesToBase64(new Uint8Array(derived)),
		salt,
	};
}

export async function verifyPassword(
	password: string,
	hash: string,
	salt: string,
): Promise<boolean> {
	const result = await hashPassword(password, salt);
	return timingSafeEqual(result.hash, hash);
}

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let mismatch = 0;
	for (let i = 0; i < a.length; i++) {
		mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return mismatch === 0;
}

export async function signSession(
	payload: GallerySessionPayload,
): Promise<string> {
	const secret = getSecret();
	const key = await importHmacKey(secret);
	const encoder = new TextEncoder();
	const payloadPart = base64UrlEncode(
		encoder.encode(JSON.stringify(payload)),
	);
	const signature = await crypto.subtle.sign(
		"HMAC",
		key,
		encoder.encode(payloadPart),
	);
	return `${payloadPart}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifySession(
	token: string,
): Promise<GallerySessionPayload | null> {
	try {
		const [payloadPart, signaturePart] = token.split(".");
		if (!payloadPart || !signaturePart) return null;

		const secret = getSecret();
		const key = await importHmacKey(secret);
		const encoder = new TextEncoder();
		const signatureBytes = new Uint8Array(base64UrlDecode(signaturePart));
		const valid = await crypto.subtle.verify(
			"HMAC",
			key,
			signatureBytes,
			encoder.encode(payloadPart),
		);
		if (!valid) return null;

		const payload = JSON.parse(
			new TextDecoder().decode(base64UrlDecode(payloadPart)),
		) as GallerySessionPayload;

		if (!payload.slug || !payload.exp) return null;
		if (payload.exp <= Date.now()) return null;

		return payload;
	} catch {
		return null;
	}
}

export function getGalleryCookieName(): string {
	return COOKIE_NAME;
}

export function getGalleryCookieMaxAge(): number {
	return COOKIE_MAX_AGE_SECONDS;
}

export async function createGallerySessionToken(
	slug: string,
	galleryExpiresAt: string,
): Promise<string> {
	const galleryExpiry = new Date(galleryExpiresAt).getTime();
	const sessionExpiry = Math.min(
		Date.now() + COOKIE_MAX_AGE_SECONDS * 1000,
		galleryExpiry,
	);

	return signSession({ slug, exp: sessionExpiry });
}
