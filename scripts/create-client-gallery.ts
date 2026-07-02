import "dotenv/config";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import sizeOf from "image-size";
import { hashPassword } from "../src/lib/clientAuth";
import type {
	ClientGalleryManifest,
	PrintProduct,
} from "../src/lib/clientGalleryTypes";
import {
	galleryManifestKey,
	galleryPhotosPrefix,
	galleryZipKey,
} from "../src/lib/clientGalleryTypes";
import { objectExists, putJson, uploadBuffer, uploadFile } from "../src/lib/r2";

const require = createRequire(import.meta.url);
// archiver is CJS; require avoids ESM default-export typing issues in scripts
const archiver = require("archiver") as (
	format: string,
	options?: { zlib?: { level?: number } },
) => import("stream").Duplex & {
	pipe: (destination: NodeJS.WritableStream) => unknown;
	file: (path: string, opts: { name: string }) => void;
	finalize: () => void;
	on: (event: string, listener: (...args: unknown[]) => void) => void;
};

const IMAGE_PATTERN = /\.(jpe?g|png|webp|avif|gif|tiff?)$/i;

interface CliArgs {
	slug: string;
	password: string;
	title: string;
	client: string;
	photosDir: string;
	days: number;
	downloadEnabled: boolean;
	storeEnabled: boolean;
}

function parseArgs(argv: string[]): CliArgs {
	const args: Record<string, string> = {};
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg.startsWith("--")) {
			const key = arg.slice(2);
			const value = argv[i + 1];
			if (value && !value.startsWith("--")) {
				args[key] = value;
				i++;
			} else {
				args[key] = "true";
			}
		}
	}

	const slug = args.slug;
	const password = args.password;
	const title = args.title;
	const client = args.client;
	const photosDir = args.photos;

	if (!slug || !password || !title || !client || !photosDir) {
		console.error(`
Usage:
  pnpm gallery:create -- \\
    --slug client-name \\
    --password secret \\
    --title "Spring Portraits" \\
    --client "Jane Doe" \\
    --photos ./path/to/photos \\
    [--days 90] \\
    [--no-download] \\
    [--no-store]
`);
		process.exit(1);
	}

	return {
		slug,
		password,
		title,
		client,
		photosDir: path.resolve(photosDir),
		days: Number.parseInt(args.days ?? "90", 10),
		downloadEnabled: args["no-download"] !== "true",
		storeEnabled: args["no-store"] !== "true",
	};
}

const DEFAULT_PRINT_PRODUCTS: PrintProduct[] = [
	{
		id: "print-5",
		label: '5" print',
		description: "Matte finish, unframed",
		priceCents: 2500,
	},
	{
		id: "print-8x10",
		label: '8" x 10" print',
		description: "Matte finish, unframed",
		priceCents: 4500,
	},
	{
		id: "print-11x14",
		label: '11" x 14" print',
		description: "Matte finish, unframed",
		priceCents: 7500,
	},
];

async function createZip(
	files: Array<{ filePath: string; filename: string }>,
	outputPath: string,
): Promise<void> {
	await new Promise<void>((resolve, reject) => {
		const output = fs.createWriteStream(outputPath);
		const archive = archiver("zip", { zlib: { level: 9 } });

		output.on("close", () => resolve());
		archive.on("error", reject);

		archive.pipe(output);
		for (const file of files) {
			archive.file(file.filePath, { name: file.filename });
		}
		archive.finalize();
	});
}

async function main() {
	const options = parseArgs(process.argv.slice(2));

	if (!fs.existsSync(options.photosDir)) {
		console.error(`Photos directory not found: ${options.photosDir}`);
		process.exit(1);
	}

	const photoFiles = fs
		.readdirSync(options.photosDir)
		.filter((file) => IMAGE_PATTERN.test(file))
		.sort();

	if (photoFiles.length === 0) {
		console.error("No image files found in photos directory.");
		process.exit(1);
	}

	console.log(`Creating gallery "${options.slug}" with ${photoFiles.length} photos...`);

	const tempZipPath = path.join(
		process.cwd(),
		".tmp",
		`${options.slug}-gallery.zip`,
	);
	fs.mkdirSync(path.dirname(tempZipPath), { recursive: true });

	const zipEntries = photoFiles.map((file) => ({
		filePath: path.join(options.photosDir, file),
		filename: file,
	}));

	await createZip(zipEntries, tempZipPath);

	let coverKey: string | undefined;
	for (const file of photoFiles) {
		const filePath = path.join(options.photosDir, file);
		const r2Key = `${galleryPhotosPrefix(options.slug)}${file}`;

		if (await objectExists(r2Key)) {
			console.log(`Skipping existing photo: ${file}`);
			continue;
		}

		const buffer = fs.readFileSync(filePath);
		const dimensions = sizeOf(buffer);
		await uploadFile(r2Key, filePath, {
			width: String(dimensions.width || 0),
			height: String(dimensions.height || 0),
			originalName: file,
		});

		if (!coverKey) coverKey = r2Key;
		console.log(`Uploaded ${file}`);
	}

	const zipKey = galleryZipKey(options.slug);
	await uploadBuffer(zipKey, fs.readFileSync(tempZipPath), {
		contentType: "application/zip",
	});
	fs.unlinkSync(tempZipPath);
	console.log("Uploaded download-all.zip");

	const { hash, salt } = await hashPassword(options.password);
	const createdAt = new Date();
	const expiresAt = new Date(createdAt);
	expiresAt.setDate(expiresAt.getDate() + options.days);

	const manifest: ClientGalleryManifest = {
		title: options.title,
		clientName: options.client,
		passwordHash: hash,
		passwordSalt: salt,
		createdAt: createdAt.toISOString(),
		expiresAt: expiresAt.toISOString(),
		downloadEnabled: options.downloadEnabled,
		storeEnabled: options.storeEnabled,
		coverKey,
		printProducts: DEFAULT_PRINT_PRODUCTS,
	};

	await putJson(galleryManifestKey(options.slug), manifest);

	console.log("\nGallery ready:");
	console.log(`  URL: /deliver/${options.slug}`);
	console.log(`  Password: ${options.password}`);
	console.log(`  Expires: ${expiresAt.toISOString().slice(0, 10)}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
