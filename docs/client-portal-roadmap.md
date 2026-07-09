# Client Portal - Feature Roadmap

Ranked by value-per-effort. Scope notes call out which surface each item applies to.

## Current state

### Legacy gallery (`eyes` - `/deliver/$slug`)

Password-gated gallery with signed-cookie sessions, favorites (per-visitor token in R2), single + zip downloads, Stripe print store, order email notification, gallery expiry.

### Full client portal (`client-portal` + `api`)

Magic-link auth, inquiry → booking → mood board → delivery lifecycle, proofing workflow (`selectionLimit`, preview/final phases), DB-backed favorites visible to admin, public share links (`/g/{token}`), print store, shoot reminders (24h before session).

| Gap                                        | Legacy                     | Client portal                           |
| ------------------------------------------ | -------------------------- | --------------------------------------- |
| Favorites visible to photographer          | ❌ R2, anonymous token     | ✅ Admin view + DB `favorites`          |
| Proofing / selection submit                | ❌                         | ✅                                      |
| Expiry warning + extension                 | ❌ Silent expiry page only | ❌ Same gap                             |
| Direct link to single photo (`?photo=key`) | ❌                         | ❌                                      |
| Expiry reminder emails                     | ❌                         | ❌ (shoot reminders exist, not gallery) |

---

## Phase 1 - High value, cheap

Do these first.

### 1. Favorites visible to the photographer `[legacy]`

Clients already mark favorites, but they're keyed by anonymous visitor token in R2 - the photographer can't see them. A **"Share my selects with the photographer"** button (or email-the-list action reusing the existing order-notification email path) turns favorites into proofing: album selection, retouch picks, blog permission.

**Scope:** one server fn + one button + one email.

> **Start here for legacy.** This is the single biggest gap - the data exists, nobody sees it.

### 2. Expiry warning + extension request `[both]`

Galleries silently die at `expiresAt`. Add:

- In-gallery banner: _"Expires in 5 days - download everything now"_
- Extension path: mailto link (cheap) or one-field form that emails the photographer (better UX)

Saves the inevitable _"my gallery is gone"_ support email.

### 3. Direct-share links to a single photo `[both]`

`?photo=key` on gallery URLs - scroll to photo and open lightbox. Clients share with family; family becomes bookings.

**Scope:** query param + scroll/lightbox open. Basically free.

### 4. Download favorites / selections only `[both]`

ZIP (or batch download) of favorited or selected photos only - not the full gallery. Natural follow-on once favorites are surfaced (#1). High value on mobile where storage and patience are limited.

**Scope:** same zip pipeline as "download all," filtered by favorite/selection keys.

### 5. Proactive gallery expiry emails `[both]`

Automated email at 7 days and 1 day before `expiresAt`. Reuses existing email infra and the shoot-reminder cron pattern (`reminderSentAt` in `booking.ts`).

**Scope:** new `galleryReminderSentAt` field (or similar) + cron branch.

### 6. Open Graph preview on public share links `[client-portal]`

When someone pastes `/g/{token}` or `?photo=key` into iMessage or social, show cover image + title (_"Sarah & James - Family Session"_). Makes shared links feel intentional, not suspicious.

**Scope:** OG meta tags from first gallery photo + shoot title.

### 7. Post-delivery rebook CTA `[both]`

On delivered/expired gallery: **"Book your next session"** → `/book?email=…`. No backend. Converts the emotional peak into the next booking.

### 8. Add-to-calendar for booked shoots `[client-portal]`

After scheduling confirms, offer `.ics` download. Reduces no-shows. Data already exists: `scheduledAt`, `location`, `durationMin`.

---

## Phase 2 - Medium (worth it if clients ask)

### 9. Photo comments / retouch notes `[legacy]`

Same storage pattern as favorites (JSON per visitor in R2). Only add if the workflow includes revisions; for pure delivery it's noise.

### 10. Web-size vs full-res download choice `[both]`

Clients want phone-friendly versions for Instagram. If the R2 pipeline already generates display variants, offering them for download is small. Consider **4:5 / 1:1 "Instagram crop"** as a named export - more specific than generic web size.

### 11. Digital-download purchase tier `[both]`

Stripe is wired for prints; a "buy full-res download" product is another `PrintProduct` plus flipping `downloadEnabled` per purchaser. Cheapest revenue feature available. Optional bundle: full gallery download + one 8×10.

### 12. Compare mode (2-up in lightbox) `[both]`

Side-by-side view of two photos in lightbox. Helps clients choose between near-identical frames without toggling back and forth. More useful than comments for most portrait workflows.

### 13. Hide from guest view `[client-portal]`

Public share links show a subset; favorites/selections stay private. Per-photo "include in share link" flag. Common wedding/family ask.

### 14. Client activity summary (admin) `[client-portal]`

Lightweight analytics: gallery first opened, last viewed, download-all clicked, favorites submitted. Enough to know _"they haven't looked yet"_ vs _"start editing."_

### 15. Print store: order from favorites `[both]`

Pre-populate cart with favorited photos. Removes friction between picking and ordering prints.

### 16. Mood board → shot list export `[client-portal]`

Export mood board images + comments as PDF or email to photographer. Turns pre-shoot collaboration into a day-of checklist.

### 17. Gift print purchase link `[both]`

Family member buys a print without gallery password - single shared photo or curated subset. Common wedding ask.

### 18. Referral credit `[both]`

Post-delivery: _"Give a friend $50 off, get $50 off your next session."_ Simple coupon codes or manual tracking. Clients as acquisition channel.

---

## Skip for now (YAGNI)

| Idea                                            | Why skip                                                                                                                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client accounts/logins (legacy)                 | Password-per-gallery is industry norm (Pixieset, etc.); accounts add auth surface for zero client benefit. Client-portal already uses magic links where accounts add value. |
| Admin dashboard for creating galleries (legacy) | One-person operation; manifest JSON + upload script works until it doesn't. Client-portal admin already covers this.                                                        |
| Slideshow modes, music                          | Portfolio candy, not portal value                                                                                                                                           |
| AI auto-curation / "best shots"                 | Subjective; erodes trust if it misses                                                                                                                                       |
| Full in-app messaging/chat                      | Email + mood board comments cover 95%                                                                                                                                       |
| RAW file delivery                               | Niche, huge files, support nightmare                                                                                                                                        |
| Face recognition / auto-albums                  | Complexity, privacy concerns                                                                                                                                                |
| Native mobile app                               | Responsive gallery + PWA is enough                                                                                                                                          |

---

## Recommendation

| Surface                       | Start with                                                                                                                                                                                                                    |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Legacy** (`/deliver/$slug`) | **#1 - surface favorites to the photographer.** Converts a dead-end feature into the proofing loop that's the whole reason client portals exist.                                                                              |
| **Client portal**             | **#2 + #5 - expiry banner and proactive emails.** Proofing and favorites are done; the biggest remaining client pain is silent gallery death. Then **#4** (download selections only) and **#6** (OG previews on share links). |
