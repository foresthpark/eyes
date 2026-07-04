import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useId, useState } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
	generateCanonicalUrl,
	generateMetaTags,
	generateOgTags,
} from "../lib/seo";

const sendContactMessage = createServerFn({ method: "POST" })
	.inputValidator((data: { name: string; email: string; message: string }) => {
		const name = data.name?.trim();
		const email = data.email?.trim();
		const message = data.message?.trim() ?? "";
		if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw new Error("Name and a valid email are required.");
		}
		return { name, email, message };
	})
	.handler(async ({ data }) => {
		// ponytail: raw fetch to Resend's REST API — no SDK needed for one call.
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from: "Double Tree Contact <onboarding@resend.dev>",
				to: ["soop_lim@proton.me"],
				reply_to: [data.email],
				subject: `Contact from ${data.name}`,
				text: `${data.message}\n\nFrom: ${data.name} <${data.email}>`,
			}),
		});
		if (!res.ok) {
			console.error("Resend error:", res.status, await res.text());
			throw new Error("Failed to send message.");
		}
		return { ok: true };
	});

export const Route = createFileRoute("/contact")({
	component: Contact,
	head: () => ({
		meta: [
			{
				title: "Contact | Double Tree",
			},
			...generateMetaTags({
				description:
					"Get in touch with Double Tree photography. Interested in prints, collaborations, or just want to say hello? Contact me via email or Instagram.",
			}),
			...generateOgTags({
				title: "Contact | Double Tree",
				description:
					"Get in touch with Double Tree photography. Interested in prints, collaborations, or just want to say hello? Contact me via email or Instagram.",
				url: generateCanonicalUrl("/contact"),
				type: "website",
			}),
		],
		links: [
			{
				rel: "canonical",
				href: generateCanonicalUrl("/contact"),
			},
		],
	}),
});

function Contact() {
	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
		"idle",
	);
	const id = useId();

	return (
		<div className="px-margin-mobile md:px-margin py-gutter md:py-16">
			<Breadcrumb />

			<header className="mb-section max-w-3xl">
				<h1 className="font-display text-5xl md:text-7xl uppercase leading-tight">
					Let's get <span className="italic normal-case">in touch.</span>
				</h1>
				<p className="text-lg text-secondary mt-gutter max-w-md">
					Whether you're interested in a print, a collaboration, or just want to
					say hello, I'd love to hear from you.
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
				<form
					className="md:col-span-4 space-y-6"
					onSubmit={async (e) => {
						e.preventDefault();
						const form = e.currentTarget;
						const data = new FormData(form);
						setStatus("sending");
						try {
							await sendContactMessage({
								data: {
									name: String(data.get("name") ?? ""),
									email: String(data.get("email") ?? ""),
									message: String(data.get("message") ?? ""),
								},
							});
							form.reset();
							setStatus("sent");
						} catch {
							setStatus("error");
						}
					}}
				>
					<h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
						Send a message
					</h2>
					<div className="space-y-2">
						<Label htmlFor={`${id}-name`}>Name</Label>
						<Input id={`${id}-name`} name="name" required autoComplete="name" />
					</div>
					<div className="space-y-2">
						<Label htmlFor={`${id}-email`}>Email</Label>
						<Input
							id={`${id}-email`}
							name="email"
							type="email"
							required
							autoComplete="email"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor={`${id}-message`}>Message</Label>
						<Textarea id={`${id}-message`} name="message" rows={6} />
					</div>
					<Button
						variant="outline"
						type="submit"
						disabled={status === "sending"}
					>
						{status === "sending" ? "Sending…" : "Send message"}
					</Button>
					{status === "sent" && (
						<p className="text-sm text-secondary">Message sent — thank you.</p>
					)}
					{status === "error" && (
						<p className="text-sm text-secondary">
							Something went wrong. Please email me directly instead.
						</p>
					)}
				</form>

				<div className="md:col-span-5 grid grid-cols-1 gap-gutter content-start">
					<div>
						<h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
							Direct
						</h2>
						<a
							href="mailto:soop_lim@proton.me"
							className="block text-lg hover:italic"
						>
							soop_lim@proton.me
						</a>
					</div>

					<div>
						<h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
							Connect
						</h2>
						<a
							href="https://instagram.com/eyes_of_forest"
							target="_blank"
							rel="noopener noreferrer"
							className="block text-lg hover:line-through"
						>
							@eyes_of_forest
						</a>
					</div>

					<div>
						<h2 className="text-xs font-semibold uppercase tracking-widest text-secondary border-b border-outline pb-2 mb-6">
							Based in
						</h2>
						<p className="text-lg">Vancouver, Canada</p>
					</div>
				</div>
			</div>
		</div>
	);
}
