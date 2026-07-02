import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const router = createRouter({
		routeTree,
		context: {},

		scrollRestoration: true,
		// Preload a route's loader data on hover/touch so clicking a gallery is
		// instant instead of showing a pending/reload-looking flash.
		defaultPreload: "intent",
		defaultPreloadDelay: 50,
		// Reuse loader data (incl. just-preloaded) instead of re-running on every
		// navigation. Without this, defaultStaleTime=0 re-runs the loader on click,
		// minting fresh presigned URLs so every <img> re-fetches - the "loads then
		// reloads" flash. Presigned URLs are valid 24h, so a short cache is safe.
		defaultPreloadStaleTime: 60_000,
		defaultStaleTime: 60_000,
		defaultPendingMinMs: 100,
	});

	return router;
};
