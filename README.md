# Keanu’s portfolio

A growing portfolio for Keanu Holgado: data, automation, and self-hosted systems. The first release includes Home, About, Homelab, Certifications, and Contact, plus four concise homelab stack notes.

## Run locally

Use Node.js 22 or newer (Node 24 is used in Docker).

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`. Development and preview bind to loopback by default.

For the actual standalone production build:

```sh
npm run build
npm run preview
```

The preview helper copies public assets and static chunks into the standalone output before starting its Node server. Stop it with Ctrl+C. Vercel builds the same repository directly with `npm run build`; it does not need this helper or Docker.

## Content and identity

| Location | Purpose |
| --- | --- |
| `src/lib/site.ts` | Name, description, contact links, and navigation |
| `content/certifications.json` | Nine existing credential records and evidence links |
| `content/homelab/entries.json` | Homelab metadata, relationships, and publication controls |
| `content/homelab/*.mdx` | Curated stack notes |
| `src/lib/content-schema.ts` | Shared validated entry schema for future content types |
| `src/lib/content.ts` | Server-only public-content selection and MDX registry |
| `public/media/` | Reviewed public assets, including the existing Snowflake certificate |
| `docs/CONTENT_PLAN.md` | Launch inventory, editorial boundaries, and growth path |

Email and LinkedIn are intentionally empty in `site.ts`. Add genuine details there to enable their Contact-page links. The GitHub link follows the `hkeanu.github.io` repository identity. Sample CVs, sample projects, and generic notebook links from the old site were not migrated.

To add a homelab note:

1. Add its metadata record, using a stable ID and slug.
2. Add a trusted local MDX body and register it in `src/lib/content.ts`.
3. Review the public copy and any assets. Only entries with `publicationState: "published"` and `disclosureStatus: "approved"` receive public routes or appear in the diagram, directory, related links, or sitemap.
4. Run content checks and rebuild. Updating a local content file requires a new build/deployment.

Keep confidential and private source material **outside this repository**. MDX is executable, trusted author content; do not accept or compile visitor submissions. Files in `public/` are public regardless of metadata. Avoid publishing real credentials, private endpoints, internal addresses, raw configuration, or unreviewed screenshots.

## Verification

```sh
npm run typecheck
npm run test:content
npm run build
npx playwright install chromium
npm test
```

Browser tests use the production preview. They cover launch routes, responsive overflow, credential filtering and local evidence, homelab selection and MDX routes, unknown slugs, keyboard access, reduced motion, and mobile navigation. Full-page images of launch pages are written into the ignored `test-results/` folder. The desktop-only and mobile-only cases are intentionally skipped on the other device project.

In a restricted environment, browsers can live inside the repository’s ignored artifacts directory:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.artifacts/browsers'
npx playwright install chromium
npm test
```

## Home-server deployment

Copy `.env.example` to `.env` and set `SITE_URL` to the actual production origin, such as your chosen HTTPS domain. This is a **build-time** setting for social-image URLs, robots, and the sitemap. Rebuild when the origin changes. Without it, local metadata uses localhost and the sitemap is empty.

```sh
docker compose up -d --build
docker compose ps
```

The app is exposed only on `127.0.0.1:3100` on the host. A host-installed reverse proxy or Cloudflare Tunnel can target `http://127.0.0.1:3100`. If the tunnel runs in another container, put it and the portfolio on a shared Docker network and target `http://portfolio:3000`; do not use that container’s own localhost.

The runtime image uses a non-root user, a health check, and rotated logs. The app has no database, user uploads, persistent-volume requirement, or runtime connection to the showcased homelab services. Deploy a previously built image to roll back. Deployment files are prepared; the running server has not been modified.

## Vercel

Import this repository as a Next.js project, use the root directory and the default `npm run build`, and set `SITE_URL` before the first production build. No database or provider-specific storage is required. Configure the custom domain on the selected provider and update DNS separately. The standalone output supports the home server while the source remains compatible with a normal Vercel build; a live Vercel deployment has not yet been performed.

## Design and accessibility

The visual system uses local Manrope variable fonts, charcoal surfaces, warm ivory, muted green, and custom SVG system illustrations. GSAP enhances scroll reveals without scroll hijacking. Content is rendered in HTML; a reduced-motion preference disables reveals and illustration animation. The architecture explorer uses native buttons with pressed states, and the mobile menu supports Escape with focus restoration. No 3D engine, remote font request, analytics, fake metrics, or live service-status dependency is included.

Manrope is by the Manrope Project Authors, distributed under the SIL Open Font License. Its license is retained at `public/licenses/manrope.txt`.
