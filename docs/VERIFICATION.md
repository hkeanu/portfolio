# Implementation verification

## Systems Studio evolution — 21 November 2026

The site now uses a green-black/mint visual system, a contrasting light work gallery, a rounded procedural sculpture with accessible discipline selection, coordinated project entrances, and shared project artwork in case studies. Keyboard navigation bypasses route and entrance animations; reduced-motion and unsupported-WebGL paths retain static artwork and working links.

The standalone production build, TypeScript, and 5 content checks pass. Browser coverage expands to 36 cases (33 applicable cases, 3 device-specific skips), including real sculpture changes with playback paused, discipline links without WebGL, keyboard-instant updates, project snapshot readiness, article scroll position at snapshot time, and the existing route/filter/fallback checks. Desktop/mobile screenshots and a local motion recording are reviewed. The discipline panel retains stable height across selections at 320px, 390px, 768px, 1024px, and 1440px.

See [the motion timeline, review, and local performance sample](IMMERSIVE_DESIGN.md). The optional scene remains approximately 247 KiB of compressed JavaScript beyond the static path. These checks use Chromium desktop and mobile emulation; physical phones, Safari, deployment, and field Core Web Vitals remain outside this local verification.

## Connected Systems redesign — 21 November 2026

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| Content validation | 5 passed |
| Standalone production build | Passed using Webpack |
| Playwright Chromium desktop and mobile emulation | 27 passed; 3 cases skipped for the inapplicable device project |
| Responsive layout | No horizontal overflow on launch pages at 320px, 390px, 768px, 1024px, and 1440px |
| Browser review | Desktop and mobile rendered pages inspected |
| Development server | Homepage HTTP 200 on loopback |

The expanded browser coverage includes explicit 3D view changes, motion pausing, suspended offscreen WebGL drawing, context loss and unsupported canvas fallbacks, live reduced-motion changes, no-JavaScript navigation, local logo loading, interrupted route transitions, unsupported View Transitions, browser Back, existing content routes, filters, and keyboard navigation. Static screenshot comparison excludes overlaid controls and tolerates minor GPU antialiasing differences.

The scene uses a local poster for reduced motion and constrained devices, and lazy-loads its renderer. [Design and performance notes](IMMERSIVE_DESIGN.md) record asset sources, dependency choices, local throttled loading samples, and limitations. Physical mobile GPUs, Safari, production Core Web Vitals, and deployment on the actual host remain unverified. The existing deployment configuration was retained.

## Original release — 15 November 2026

Verified locally on 15 November 2026.

| Check | Result |
| --- | --- |
| TypeScript (`npm run typecheck`) | Passed |
| Publication and content validation (`npm run test:content`) | 5 passed |
| Optimized Next.js standalone production build | Passed on Windows and in Linux Docker |
| Playwright Chromium desktop and mobile-emulation checks | 10 passed, 2 device-inapplicable cases skipped |
| Responsive layout checks | Launch pages fit 320px, 390px, 768px, 1024px, and 1440px viewports |
| Rendered-page review | Desktop and mobile full-page images produced and reviewed |
| Compose configuration validation | Passed |
| Linux container HTTP smoke test | All 9 content routes, certificate image, font license, and generated social image returned HTTP 200 |
| Container privilege check | Runtime UID 1001 |

The temporary Docker smoke-test container had no network access or published ports and was stopped and automatically removed after the test. The locally built `keanu-portfolio:local` image remains available.

Browser checks include credential filtering, evidence-asset serving, homelab selection, all published MDX stack routes, unknown-slug 404 behavior, mobile navigation dismissal and focus restoration, skip-link keyboard access, reduced-motion content visibility, and absence of client exceptions on launch pages. They use Chromium desktop and device emulation, not a physical iPhone or Safari. This is not a complete manual accessibility audit.

The direct user-browser review timed out at application-access approval. Rendered-page review used artifacts produced by the portfolio’s Playwright tests instead. Images remain under the ignored `test-results/` directory.

## Not yet verified

- Deployment on the actual home server.
- A live Vercel deployment or provider-side domain configuration.
- Production metadata using the final domain (`SITE_URL` is not yet selected).
- Current validity and exact award classification of external credential evidence.
- Public email and LinkedIn details, which remain unset rather than using template values.

No public site was published, DNS changed, professional source code imported, or home-server configuration altered.
