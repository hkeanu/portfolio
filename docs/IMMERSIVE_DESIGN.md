# Systems Studio

The studio direction evolves Connected Systems into a deep green-black and mint identity, with a light work gallery, larger editorial typography, a prominent featured project, and matching illustrations in case-study headers. The sculpture connects data, automation, and infrastructure: selecting a discipline emphasizes its rounded metallic loop and updates an HTML explanation and evidence link. Existing approved content, routes, credential evidence, and MDX notes are retained.

## Implementation

- `src/components/connected-scene.tsx`: isolated procedural Three.js scene through React Three Fiber 9 (compatible with React 19). Three meshes share one closed, rounded ribbon geometry; 17,280 triangles, one generated room environment, capped device pixel ratio of 1.5. Damped pointer movement and material/scale changes retarget without per-frame React updates. No textures downloaded from external hosts, postprocessing, shadows, model files, or additional animation libraries.
- `src/components/afterimage-hero.tsx`: lazy scene loading, static poster, capability check, pointer and scroll input, visibility tracking, accessible motion and perspective controls, error boundary, and context-loss recovery. It retains the existing component name to minimize import churn.
- `src/components/page-transitions.tsx` and `transition-link.tsx`: the previously untracked transition work is integrated into the root layout and internal links. Native View Transitions enhance eligible route changes. Ordinary Next.js links handle unsupported browsers, modified clicks, and reduced motion. Back, interruption, and a slow-route timeout are handled.
- `src/components/motion.tsx`: GSAP reveals use a shared CustomEase, with a single coordinated entrance per project card. Visible route content avoids a second entrance during a page transition. No smooth-scroll dependency or scroll hijacking is introduced.
- `src/components/project-art.tsx`: original SVG illustrations for workflow, source control, media storage, and conceptual monitoring. Stable View Transition names carry the same artwork from cards to article headers. The chart is illustrative, not live telemetry or measured results.
- `src/components/tool-logo.tsx`: locally served tool logos with visible names, including Python, R, n8n, Alteryx, PostgreSQL, Docker, and Gitea.
- `src/app/globals.css`: shared structure, article primitives, keyboard focus, and reduced-motion foundations. `studio.css` supplies the art direction, responsive gallery, discipline controls, interaction timing, and overrides.

## Motion and fallbacks

The sculpture gently changes orientation and responds to pointer movement and native scroll; it does not rotate continuously. The demand frame loop runs only while the artwork is visible in the foreground and either playing or settling after an explicit interaction. Pausing resolves remaining motion immediately. Keyboard and reduced-motion selections use immediate scene changes. The perspective control also works with keyboard and touch.

## Motion timeline

These are occasional portfolio interactions. The purposes are explanation, spatial consistency, state indication, feedback, and bridging scene loading. Timing reuses the existing system and adds the animation skills' exact `cubic-bezier(.23,1,.32,1)` ease-out token.

| Element | Role | Starts | Duration | Motion | Relationship |
| --- | --- | --- | --- | --- | --- |
| Hero context label | Decoration | 0ms | 400ms | Opacity only | Establishes context |
| Headline | Lead | 30ms | 600ms | Opacity and 15px rise | Starts with context |
| Supporting sentence | Support | 110ms | 500ms | Opacity and rise | Overlaps headline |
| Actions | Support | 170ms | 400ms | Opacity and rise | Overlaps supporting sentence |
| Sculpture labels | Decoration | 320ms | 500ms | Opacity only | Background and sculpture container stay still |
| Poster to canvas | Support | First rendered frame | 180ms | Simultaneous opacity crossfade | Same fixed artwork bounds; 80ms under reduced motion |
| Discipline explanation | Lead | Pointer/touch selection | 220ms | Opacity and 4px rise | Starts with sculpture emphasis; 80ms opacity-only reduced motion; immediate keyboard |
| Project cards | Lead/support | Gallery intersection; offsets 0/70/120ms | 600/500/500ms | Opacity and 24/16/16px rise | One entrance per card, shrinking stagger gaps |
| Workflow nodes | Explanation | Card settles; offsets 0/70/120ms | 480ms | Opacity .55 to 1 | One-shot cause-to-effect emphasis; no loop |
| Shared project illustration | Lead | Route commits | 260ms | Native shared bounds transition | Text changes concurrently; keyboard and reduced motion bypass it |
| Button press | Feedback | Press | 120ms | Scale .98 | Immediate action; transform omitted for reduced motion and keyboard focus |

Article prose, credential-filter results, and homelab detail text stay still. No logo marquee, perpetual graph drawing, or drifting labels are introduced. Existing loops remain pausable. Selections cancel the current text animation before starting another, and 3D retargets its current pose. Pointer hover transforms are limited to fine hover-capable devices.

Reduced motion starts with the static poster and does not import the 3D scene. Users may explicitly enable a still 3D view and independently opt into playback. Changing the system preference to reduced motion removes an active canvas. Data-saving connections and devices reporting at most two CPU threads also start static. Unsupported WebGL2, failed imports, render errors, and context loss retain the poster and HTML content. An explicit no-JavaScript navigation row supports mobile browsing.

Geometries, the environment render target, PMREM generator, room resources, observers, and listeners are cleaned up. React state is not updated per frame. The actual Three.js renderer is still a substantial optional JavaScript download and uses GPU resources while playing; physical-device and production Core Web Vitals measurements remain necessary before making performance claims.

## Asset sources

Assets are downloaded at development time and served locally; visitors do not contact these sources.

| Assets | Source |
| --- | --- |
| Python, R, PostgreSQL, Docker, Gitea SVGs | [Devicon](https://github.com/devicons/devicon/tree/master/icons); license in `public/licenses/devicon.txt` |
| n8n SVG, pink brand color | [Simple Icons v13.21.0](https://github.com/simple-icons/simple-icons/blob/13.21.0/icons/n8n.svg); license in `public/licenses/simple-icons.txt` |
| Alteryx circular “a” PNG | [Alteryx website icon](https://www.alteryx.com/wp-content/themes/trifacta/assets/favicon/android-icon-192x192.png) |
| `connected-sculpture.webp` | Transparent still captured from the current rounded procedural scene, stored losslessly; approximately 58 KiB |

Brand marks remain the property of their respective owners and identify tools in the portfolio. Names are rendered alongside each mark rather than relying on icon recognition.

References: [React Three Fiber compatibility](https://r3f.docs.pmnd.rs/getting-started/introduction), [demand rendering](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [Three.js](https://threejs.org/docs/).

## Local verification

Run `npm run typecheck`, `npm run test:content`, `npm run build`, and `npm test`. On this checkout, Playwright browsers live in `.artifacts/browsers`; set `PLAYWRIGHT_BROWSERS_PATH` accordingly. Browser tests launch the production standalone preview and cover desktop and Chromium mobile emulation, narrow widths, native navigation, filters, keyboard access, no JavaScript, reduced motion, WebGL absence and context loss, pause/offscreen behavior, view changes, and local logo loading. This is not a physical-device or full accessibility audit.

### Systems Studio performance sample — 21 November 2026

One headless Chromium sample used a 390px viewport, 100ms network latency, a 4 Mbit/s download limit, and 4x CPU slowdown against the standalone production server. With reduced motion, the observed JavaScript transfers totaled about 194 KiB compressed; with 3D enabled, about 441 KiB. The optional scene therefore adds roughly 247 KiB compressed (approximately 922 KiB decoded) in this build. The heading was available within about 0.7 seconds in both runs; the interactive scene became ready in about 2.7 seconds. These are individual local samples, not field Core Web Vitals or service guarantees.

A separate unthrottled desktop sample recorded a median and 95th-percentile animation-frame interval near 16.7ms over 120 frames. This measures browser frame scheduling on the test host and does not establish physical mobile GPU performance. Browser tests additionally count real WebGL draw calls to verify that offscreen and paused artwork stops drawing.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| Poster disappeared through visibility | Fixed-bounds 180ms opacity handoff after a rendered frame | Bridges loading without a layout change |
| View changes and pointer updates assigned a pose directly | Reversible damping for pointer input and direct updates for keyboard/reduced motion | Continuity without delaying keyboard actions |
| General navigation lasted 550ms | 180ms exit and 260ms entrance, with a persistent header | Keeps occasional navigation responsive |
| A document-height page snapshot could inherit the gallery scroll offset | Viewport snapshot; article scroll reset inside the update callback, before snapshot completion | Prevents the destination from appearing clipped or moving as a giant document |
| Differently sized old/new SVG snapshots could ghost during a shared transition | Selected illustration uses a single new snapshot moving between shared bounds | One readable object throughout the transition |
| Cards entered independently; nested route entrances could overlap | One entrance per card, shrinking stagger offsets, no nested entrance during route transitions | Hierarchy without repeated movement |
| No button press state | Subtle scale .98 with 120ms transition, omitted for keyboard focus/reduced motion | Feedback without delaying activation |

Browser review includes stills during project transitions, a local WebM recording of discipline changes and route navigation, and rapid input checks. The discipline panel maintained the same height across all four selections at 320, 390, 768, 1024, and 1440px. The reviewed motion is approved for local handoff; physical touch-device feel, Safari rendering, and production performance remain unverified.
