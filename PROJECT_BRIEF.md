# Portfolio Website — Project Brief

## 1. Project Overview

Build a highly creative, cinematic, scroll-driven personal portfolio website representing a **multidisciplinary technologist**.

This is not intended to be a conventional software developer portfolio. It should showcase an interconnected body of work spanning software engineering, automation, infrastructure, web development, technical documentation, and data science.

The portfolio should communicate:

> I design, build, automate, operate, document, and explore technical systems.

The goal is to demonstrate versatility without appearing unfocused.

## 2. Design Vision

**Visual direction:** Cinematic scroll storytelling, experimental editorial design, sophisticated typography, immersive project presentations, and restrained animation.

Desired characteristics:
- Dark, premium visual identity.
- Smooth scroll-driven section transitions.
- Large typography and engaging visual storytelling.
- Interactive architectural diagrams where appropriate.
- Responsive layouts for desktop and mobile.
- Strong accessibility and reduced-motion support.
- Performance prioritized over unnecessary visual effects.

The experience should feel like an interactive story, but remain easy to navigate.

**Important:** Do not treat the previously discussed name "FRAMEWORK" as a finalized brand. Naming and personal identity are still undecided.

## 3. Primary Portfolio Sections

### A. Work — `/work`

Showcase personal and professional technical work.

Content includes:
- Personal software projects.
- Web applications and web design.
- Workflow automations.
- Systems integrations.
- Professional engineering case studies.

Personal and professional work should share a common project directory, with optional filters.

**Professional work is subject to confidentiality and NDA restrictions.**

Do not assume that company source code, screenshots, architecture, client details, or performance metrics can be published.

Professional entries should use permission-safe descriptions and, where appropriate, clearly labeled original demonstrations using fictional data.

### B. Homelab — `/homelab`

A flagship portfolio section dedicated to self-hosted infrastructure.

Potential content includes:
- Infrastructure architecture.
- Servers, virtualization, and containers.
- Networking and secure service exposure.
- Self-hosted services.
- Automations and monitoring.
- Backups, reliability, troubleshooting, and technical decisions.

The homelab should have an interactive overview with individual service entries and deeper technical case studies.

Actual homelab hardware and services have not yet been inventoried.

### C. Knowledge — `/knowledge`

A curated technical writing and documentation library.

Content includes:
- Markdown/MDX documentation.
- Deployment guides.
- Troubleshooting notes.
- Architecture decisions.
- Tutorials and technical references.

Use readable documentation layouts with metadata, categories, related articles, and links to source repositories where appropriate.

Not every private or rough note needs to be published.

### D. Explorations — `/lab`

A space for experiments and ongoing learning.

Content includes:
- Jupyter notebooks.
- Data science investigations.
- Prototypes and proofs of concept.
- Creative coding experiments.
- Small automation experiments.
- Other technical explorations.

Notebook entries should provide readable summaries, results, visualizations, methodology, and links to original notebooks when appropriate.

The site should not simply dump raw `.ipynb` files.

### Supporting Pages

- `/` — Cinematic homepage.
- `/about` — Professional identity, background, and multidisciplinary interests.
- `/contact` — Contact methods and professional links.

## 4. Homepage Storytelling

Use the following narrative as a starting point:

1. **Introduction** — Establish multidisciplinary identity.
2. **I Operate** — Feature the homelab and infrastructure.
3. **I Build** — Showcase personal and professional projects.
4. **I Document** — Feature published technical knowledge.
5. **I Explore** — Feature notebooks and experiments.
6. **Closing** — Invite visitors to connect.

The homepage should highlight selected work, not attempt to display the entire content library.

## 5. Content Architecture

Use a common metadata structure across portfolio entries.

Suggested fields:
- Title and slug.
- Content category.
- Description.
- Disciplines and technologies.
- Project status.
- Publication visibility.
- Featured status.
- Related content.
- Media assets.
- Relevant source links.

Allow cross-linking between projects, homelab services, documentation, and experiments.

Example: A homelab service may connect to its deployment documentation and a related automation project.

Initially, use local Markdown/MDX and structured metadata instead of introducing a database or CMS.

## 6. Proposed Technology Stack

- Next.js App Router.
- React and TypeScript.
- Tailwind CSS.
- GSAP and ScrollTrigger for cinematic interactions.
- MDX for technical content.
- React Three Fiber only if justified by a specific interaction.
- Playwright for essential browser tests.
- GitHub for version control.

Prioritize maintainability, component reuse, accessible interactions, and performance.

## 7. Hosting and Portability

**Initial hosting:** Personal home server.

**Potential future hosting:** Vercel.

Architecture requirements:
- Develop locally in VS Code or Codex.
- Maintain the source in GitHub.
- Self-host using Docker Compose.
- Use a standalone Next.js production build for the home server.
- Consider Cloudflare Tunnel for secure public exposure.
- Keep content and assets portable.
- Avoid persistent local storage dependencies.
- Avoid unnecessary platform-specific features.
- Support Vercel deployments from the same source repository.
- Preserve the ability to move the custom domain between hosting providers.

The website should not require an architectural rewrite when moving to Vercel.

## 8. Implementation Strategy

Build incrementally.

**Phase 1 — Foundation**
- Repository and framework setup.
- Design system.
- Navigation and layouts.
- Content schemas and routing.

**Phase 2 — Content**
- Homelab overview.
- Project case-study templates.
- Documentation rendering.
- Notebook presentation templates.

**Phase 3 — Cinematic Experience**
- Animated homepage.
- Scroll storytelling.
- Project transitions.
- Interactive diagrams where useful.

**Phase 4 — Polish**
- Responsive behavior.
- Accessibility.
- Reduced-motion alternatives.
- SEO and performance optimization.

**Phase 5 — Deployment**
- Dockerized home-server deployment.
- Public domain and HTTPS.
- Vercel deployment compatibility verification.

## 9. Current Unknowns

The following have not been finalized:

- Portfolio brand and personal identity.
- Actual homelab infrastructure and services.
- Personal project inventory.
- Professional case studies approved for public discussion.
- Published Markdown documents.
- Existing data science notebooks.
- Final visual identity and typography.
- Domain and home-server specifications.

Do not invent portfolio accomplishments, projects, professional metrics, or technical experience.

Use clearly labeled placeholders when genuine content is unavailable.

## 10. Instructions to Codex

Start by reviewing the brief and any existing repository files.

Before generating the complete website:

1. Propose the information architecture and reusable component system.
2. Define the content structure and metadata schemas.
3. Recommend an implementation sequence.
4. Identify decisions that require actual portfolio content.
5. Avoid filling the website with fictional achievements.
6. Keep home-server deployment and future Vercel migration as core architectural constraints.

Prioritize a strong, cohesive foundation before implementing complex animations.

**The immediate goal is to design a portfolio architecture that supports the user's real body of work—not to rush into building an aesthetically impressive but empty website.**
