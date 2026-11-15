# Implementation verification

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
