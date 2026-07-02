# Client Gallery Delivery

Self-hosted, password-protected client galleries stored in Cloudflare R2.

## Create a gallery

1. Put final retouched JPEGs in a local folder.
2. Ensure R2 env vars and `CLIENT_GALLERY_SECRET` are set (see `.env.example`).
3. Run:

```bash
pnpm gallery:create -- \
  --slug jane-spring-2026 \
  --password "choose-a-strong-password" \
  --title "Spring Portraits" \
  --client "Jane Doe" \
  --photos ./deliveries/jane-spring-2026 \
  --days 90
```

Optional flags:

- `--no-download` - disable downloads
- `--no-store` - disable print store

The script uploads photos to `clients/<slug>/photos/`, builds `download-all.zip`, and writes `gallery.json` with a hashed password.

Share with your client:

- URL: `https://eyes.forestp.dev/deliver/<slug>`
- Password: the value you passed to `--password`

## Cloudflare secrets

Set these in your Cloudflare Workers/Pages project (in addition to R2 credentials):

| Secret                      | Purpose                                          |
| --------------------------- | ------------------------------------------------ |
| `CLIENT_GALLERY_SECRET`     | Signs gallery session cookies (32+ random chars) |
| `STRIPE_SECRET_KEY`         | Stripe Checkout                                  |
| `STRIPE_WEBHOOK_SECRET`     | Verifies `/api/stripe/webhook`                   |
| `PHOTOGRAPHER_NOTIFY_EMAIL` | Order notification recipient                     |
| `RESEND_API_KEY`            | Optional email notifications                     |

## Stripe webhook

Point Stripe to:

```
https://eyes.forestp.dev/api/stripe/webhook
```

Event: `checkout.session.completed`

Without Resend configured, orders are still saved to R2 at `clients/<slug>/orders` (via order JSON files) and visible in the Stripe dashboard.

## R2 layout

```
clients/<slug>/
  gallery.json          # manifest (password hash, expiry, print products)
  photos/*              # full-res deliverables
  download-all.zip      # pre-built ZIP for download-all
  favorites/<token>.json
  orders/<session-id>.json
```

## Privacy

- `/deliver/*` routes use `noindex, nofollow`
- `/deliver/*` is excluded from `sitemap.xml`
- `robots.txt` disallows `/deliver/`
