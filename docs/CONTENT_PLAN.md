# Launch content and growth plan

## Agreed scope

Launch with `/`, `/about`, `/homelab`, `/certifications`, and `/contact`. Four homelab service notes support the overview. Work, Knowledge, and Explorations remain planned content families; they enter navigation when real public entries are ready.

The portfolio is allowed to be small. New projects are not a launch prerequisite. Do not fill space with fictional achievements, sample notebook results, employers, client names, metrics, or sample credentials.

## Sources reviewed

- Existing Jekyll portfolio: `C:/Users/Keanu/Documents/Git/hkeanu.github.io`
- Credential inventory: `_data/certifications.yml`
- Existing identity and description: `_config.yml` and `_pages/about.md`
- Home-server notes: `C:/Users/Keanu/Documents/Git/self-hosting-docs`
- Monitoring notes: `C:/Users/Keanu/Documents/Git/self-hosting-docs-work`

These sources inform the public summaries. They were not copied wholesale. No authenticated inspection of the running home server was performed, and no service availability or uptime is claimed.

## Included

- Name: Keanu Holgado; existing location: Pasay, Philippines.
- Data, analytics, automation, and self-hosting interests, grounded in the old About page and home-server notes.
- Nine credential records, sorted newest first, with their original evidence links. The Google entry separates Google as issuer from Coursera as platform; its existing title identifies the Google program. Credential types are editorial classifications rather than independent verification. Review issuer, exact title, award type, and any expiry against evidence before public launch.
- Existing Snowflake certificate image. No other images or sample CV were imported.
- High-level automation, Git, monitoring, and personal-media summaries. Internal addresses, network ports, raw Compose files, tokens, private repositories, and monitoring screenshots are excluded.
- GitHub profile inferred from the existing GitHub Pages repository identity.

## Excluded

- al-folio template projects and Einstein sample CV.
- Placeholder email, sample CV PDF, template scholarly profiles, and example social links.
- Notebook outline linking to the generic nbviewer homepage.
- Financial-statement parser outline: not developed enough for publication; professional disclosure remains unresolved.
- Private workflow contents, data, and raw infrastructure configuration.

## Content model

Shared entries have stable IDs, slugs, types, summaries, disciplines, technologies, lifecycle status, publication state, disclosure status, featured flags, relationships, and source links. Metadata is validated with Zod. IDs and routes must be unique and references must resolve. Public listings and relationships use only published entries approved for disclosure.

Certifications use their own compact schema because they do not need a case-study body: title, issuer, optional platform, award type, issue month, optional expiry, category, evidence URL, featured flag. The collection is public-only; private credential files should not be placed in it.

## Growth, one useful item at a time

1. Write one actual workflow demonstration or project: question, contribution, approach, evidence, limitations. Introduce `/work` and `/work/[slug]` when ready.
2. Curate one reusable technical guide from the home-server notes. Introduce `/knowledge` and `/knowledge/[slug]`, with prerequisite metadata and article navigation when the writing warrants it.
3. Complete an experiment with a readable question, method, result, and limitations. Introduce `/lab` and `/lab/[slug]`. Link to a reviewed notebook; do not execute visitor notebooks or dump raw outputs.
4. Cross-link those entries to homelab services and relevant learning milestones. Use stable content IDs, not duplicated hand-written URLs.
5. Expand the homepage’s Build, Document, and Explore chapters in proportion to available content.

No fixed entry count, fictional example, or exhaustive infrastructure inventory is required to take the next step.

## Before a public deployment

Confirm contact channels and the custom domain. Review the credential evidence and the personal wording. The homelab pages are curated public summaries, not a direct mirror of the private documentation. Validate the deployment on the actual host before switching DNS. No public publishing or server changes have been performed as part of local implementation.
