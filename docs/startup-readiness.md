# Website audit and startup readiness

Review date: 2026-10-10. This is a website review, not proof of program eligibility.

## Initial audit

- Clean working tree at the start. Next.js 15 App Router, React 19, TypeScript, npm/package-lock, Tailwind 4 global CSS. Existing reusable Container, Button, form fields and section components; Chakra Petch is self-hosted.
- Static export (`output: export`, trailing slashes) deployed by `.github/workflows/pages.yml` to GitHub Pages; `public/CNAME` points to bgirgin.dev. No server-side contact endpoint.
- Home contained hardware inspection, three source-linked projects, process, capabilities, about and contact sections. CAD assets and the 3D/mobile fallback are retained.
- Dark engineering identity uses charcoal, cyan and gold. Preserve these established tokens; use a restrained muted purple accent for the venture material.
- Existing contact used React Hook Form + Zod and a `mailto:` draft. It could not establish delivery and cleared the user's input after a handoff. No remote message storage or API keys were found in this flow. CAPTCHA/rate limiting is not applicable to a client-only draft; add server validation and spam protection if a submission service is introduced.
- Home metadata, Person JSON-LD, sitemap and robots existed. Dedicated routes and per-route canonicals were missing; social previews referenced SVG. Generic LinkedIn URL did not identify the developer.
- Mobile menu already supported focus trapping and Escape. Existing browser checks covered responsive home and hardware behavior. `npm run lint` was interactive because no ESLint configuration existed.
- No evidence of a registered company or Claude API integration in this repository. Existing content and public GitHub evidence identify Bora Girgin's engineering work; degree, institution, employment and venture-founder title remain unverified.

## Implementation

- Added `/venture/`, `/products/`, `/projects/`, `/about/`, `/contact/`; retained all home sections and hardware assets, adding a venture introduction and project statuses.
- `src/content/business.json` is the editable public information source. `src/content/business.ts` validates it with the existing Zod dependency. Unknown business facts remain empty with `needs_verification`; only `verified` facts render as claims. Evidence is a review record, not automated factual certification.
- Quadropod is the main product; Pi Control Panel supports the engineering work. Product descriptions link real architecture/source or local CAD evidence, and distinguish prototypes from physical validation and commercial launch.
- Claude status supports planned/prototype/integrated. The current status is planned. Promotion requires verified implementation evidence and an evidence link. Potential documentation/workflow/robotics use cases and the proposed deterministic safety boundary are explicit; no AI motor control or implemented safety system is claimed.
- Navigation includes all six routes. Existing engineering sections remain on Home. Added a keyboard skip link, retained mobile focus handling, accessible validation errors and live draft feedback.
- Mailto success wording describes a requested handoff, not confirmed sending or delivery. Inputs stay available after handoff. Email length is bounded; the form still has no server submission.
- Route-specific titles, canonical/OG URLs, Person identity/profile data, all-route sitemap, robots and a PNG version of the existing OG artwork. No Organization/LocalBusiness markup.
- Added non-interactive ESLint configuration and a meaningful schema/browser regression script without changing dependency versions or the lockfile.

## Editing and verification

Edit business.json, supply a value and evidence, then mark a fact `verified` only after the founder verifies it. `planned` fields are proposals, never historical facts. Do not put credentials, registration documents or private business records in this configuration: the website and client bundles are public.

The company contact address is contact@bgirgin.dev, confirmed by the user on 2026-10-10. It takes precedence through `domainContactEmail`; the existing founder-confirmed girginbora30@gmail.com address remains in configuration as the fallback. Mailbox delivery has not been independently tested. Social URLs must identify a real verified profile; blank LinkedIn stays hidden.

Run:

```sh
npm run typecheck
npm run lint
npm run build
npm run verify:preview
npm run verify:readiness
# Browser regressions require the local static preview:
npm run preview
npm run verify:theme
npm run verify:hardware
```

`verify:readiness` starts its own isolated local server and tests configuration failures, unverified-field omission, contact boundaries, six routes, metadata, internal links/anchors, 320/390/768/1440px layouts, accessible names/errors, retained email input, mobile navigation and runtime errors. External URLs are listed for separate review; HTTP success alone does not prove ownership or product performance. Browser captures are under ignored `output/playwright/readiness/`.

## Founder verification required

- Legal entity name and registration status, if an entity exists. No assumption of incorporation.
- Verified founding date, founder role and public professional details. Brand name and engineering focus are user-confirmed.
- Concrete customer problem, proposed solution and intended customer segment. The confirmed mission centres on hardware, embedded systems and Quadropod.
- Intended users, accepted product scope, milestones and dated validation evidence.
- Individual LinkedIn URL, education/institution and professional experience if they should be published. The company mailbox is user-confirmed; delivery remains untested.
- Claude prototype/integration proof before increasing the status; program application/account information and any funding/traction must be checked privately. No customers, investors, funding or partnerships are claimed here.

## Claude Startups readiness checklist

- [x] Consistent developer identity and verified GitHub profile.
- [x] BGirgin Donanım company presentation with Quadropod as the main project; supporting engineering evidence retained.
- [x] Existing technical work and evidence links; status and validation limits explicit.
- [x] Contact route and truthful email-draft behavior.
- [x] Canonical URLs, sitemap, robots, OG and Person structured data.
- [x] Claude uses labelled planned, with a future deterministic hardware safety boundary.
- [x] User-confirmed brand, engineering focus and main project.
- [ ] Founder-approved customer problem, intended users and commercial scope.
- [ ] Verify legal/business identity and applicable application eligibility.
- [ ] Verify required account, program terms and current benefits in Claude Console.
- [ ] Establish a genuine prototype or integrated use case if required by the application.
- [ ] Obtain explicit publication approval, deploy, and validate the live routes.

## Program facts and blockers beyond the website

Official sources reviewed on 2026-10-10:
- https://claude.com/programs/startups
- https://www.anthropic.com/startup-program-official-terms

The current program FAQ says VC funding is not required. It also says the Claude Team and $1,000 API credit offers are over capacity and applications are being re-reviewed. Do not base an application on older cached four-year/VC-only rules or assume a credit award. Eligibility and current offers must be confirmed in the actual application; acceptance is Anthropic's decision.

A credible website cannot establish a real customer need, business eligibility, account ownership, founding date, hardware performance, funding, Claude usage or program acceptance. Missing facts remain a founder verification task. Changes are local only: no commit, push, application submission or deployment is authorized by this request.

### Local browser setup used for this review

The machine had no default Playwright Chromium or Google Chrome. Test browsers were installed into ignored project output, not into the production dependency tree:

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/output/playwright/browsers" npx playwright install chromium
```

The full Chrome for Testing executable was used through `PLAYWRIGHT_CHROMIUM_EXECUTABLE` for the hardware regression because the headless-shell run did not provide the WebGL canvas required by that test. This is browser rendering verification, not physical hardware validation.

For the optional axe-core 4.10.3 scan (no production dependency):

```sh
mkdir -p output/playwright
curl -fsSL https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js -o output/playwright/axe.min.js
ACCESSIBILITY_AXE_PATH="$PWD/output/playwright/axe.min.js" npm run verify:readiness
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to the installed browser executable when using the isolated installation above. Without `ACCESSIBILITY_AXE_PATH`, the regression still checks control names and form errors, but reports the axe scan as skipped. Automated checks do not replace a full assistive-technology audit.

Additional accessibility corrections: form labels keep a stable accessible name while errors are described separately; hardware-tab numbers now meet text contrast requirements. Page changes transfer keyboard focus from the closed mobile menu into the new page heading. The home section rail retains its own anchor navigation independently of the new route menu.

## New and modified files

- `package.json`
- `scripts/verify-theme.mjs`
- `scripts/verify-hardware.mjs`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/components/sections/About.tsx`
- `src/components/sections/Contact.tsx`
- `src/components/sections/Header.tsx`
- `src/components/sections/ProgressIndicator.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/Signature.tsx`
- `src/components/company/ProductShowcase.tsx`
- `src/components/company/ProductDrawing.tsx`
- `src/components/company/PlatformArchitecture.tsx`
- `src/components/sections/Work.tsx`
- `src/components/ui/FormField.tsx`
- `src/content/site.ts`
- `src/lib/contact-schema.ts`
- `docs/startup-readiness.md`
- `eslint.config.mjs`
- `public/og-image.svg`
- `public/og-image.png`
- `scripts/verify-readiness.mjs`
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/products/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/venture/page.tsx`
- `src/components/sections/VenturePreview.tsx`
- `src/components/ui/DetailPage.tsx`
- `src/components/ui/DevelopmentRoadmap.tsx`
- `src/components/ui/NavigationFocus.tsx`
- `src/content/business.json`
- `src/content/business.ts`
- `src/lib/page-metadata.ts`

## Observed validation results

- TypeScript typecheck: passed.
- ESLint: passed with 0 errors and 3 pre-existing warnings (two raw hardware images and one Three.js effect cleanup ref).
- Production build/static export: passed; all six public routes generated.
- `verify:preview`: passed HTTP methods/path handling, cache behavior and static assets.
- `verify:readiness`: passed configuration and contact regressions, six route canonicals/OG/Person metadata, internal links/anchors, 320/390/768/1440px layouts, error labelling, retained form input, mobile navigation and heading focus; no page exceptions or failed resource responses.
- axe-core WCAG 2 A/AA and 2.1 A/AA scans: 12 page/viewport combinations passed with 0 violations (390px and 1440px, all six pages).
- `verify:theme`: passed existing visual identity, home section navigation, 320–1600px layouts, short-viewport contact fit, resized textarea/error growth, mobile focus trapping and route-heading focus, reduced motion and runtime/assets.
- `verify:hardware`: passed original geometry hashes, 57-instance covered-spider assembly, CAD/PCB loading, line/solid controls, idle rendering, orbit/reset, desktop/mobile keyboard/touch behavior, reduced motion and WebGL fallback.
- Public GitHub profile and five repository/document URLs: HTTP 200 observed. This verifies reachability, not customer traction or physical results.
- Desktop and mobile screenshots visually inspected; final diff and whitespace check reviewed.

Not performed: deployment/live-route verification, email delivery or inbox access, physical hardware testing, manual VoiceOver audit, account/application eligibility checks or application submission. No commit or push was made.

## Corporate presentation revision

The follow-up request asked for a company-style website. The presentation now leads with BGirgin Donanım, Quadropod development and contact, while retaining the real engineering work:

- Brand name in header/footer and page metadata; founder identity remains separately attributed to Bora Girgin.
- Product showcase before the hardware explorer on Home, with real product descriptions and development statuses.
- Product page with a responsive Pi Control Panel architecture diagram based on existing public repository evidence.
- Approach, About and Contact copy rewritten around the engineering brand; internal verification/audit language is removed from primary introductions.
- Contact action replaces CV in the header; the original CV remains available through the About page and footer.
- Original hardware CTA, projects, CAD explorer, contact form and keyboard navigation retained.
- Added `src/components/company/ProductShowcase.tsx` and `src/components/company/PlatformArchitecture.tsx`; updated `Hero.tsx`, brand content, route copy, shared metadata and SVG/PNG preview artwork.

On 2026-10-10 the user confirmed the brand BGirgin Donanım, the hardware and embedded systems focus, and Quadropod as the main project. These facts are now in `business.json`, with Quadropod first in product order and `primaryProductId` checked against the configured products. Home, Products, Approach, About, Contact and sharing metadata use this identity. The main product includes the existing CAD-derived drawing and an explicit link selecting its interactive model. Pi Control Panel remains supporting software work.

Legal registration/name, founding date, target customers and physical robot validation remain unconfirmed and are not invented. The current Quadropod V0 evidence establishes an articulated leg CAD prototype, not a tested complete robot. Embedded control and Claude integration remain planned. Person structured data attributes Bora Girgin; it does not assert incorporation.

Added `src/components/company/ProductDrawing.tsx`; modified `Signature.tsx` to accept the supported hardware query parameter and `public/og-image.svg` plus its PNG derivative for the confirmed brand.

Hardware regression selector is scoped to `.explorer-static` because the main-product card also displays the original Quadropod drawing. The visibility, image loading, mobile layout and interactive activation assertions remain in place.

The confirmed-brand revision also passed all six route checks, the four responsive widths, product order and loaded CAD drawing checks, supported hardware query selection and unknown-value handling, and the same twelve zero-violation axe scans. Desktop and mobile views were inspected using the exported build.

## BGirgin Hardware company website expansion

The user requested the English brand name BGirgin Hardware and the content expected of a hardware company website. The public brand has been updated in configuration, route content, metadata and SVG/PNG sharing artwork. The earlier BGirgin Donanım references above record the preceding revision, not the current public name.

The site now includes:

- `/services/`: four engineering disciplines, typical scopes, deliverables to agree, links to existing technical work and contextual contact actions.
- `/about/`: engineering principles, brand and lead information, verified business details, professional background and next steps.
- `/resources/`: CAD/documentation/project/roadmap links, eight keyboard-operable native FAQ disclosures and technical enquiry guidance.
- `/privacy/`: a description of the implemented email-draft flow, hosting, optional analytics, external links, confidential enquiries and technical material/product status. Analytics wording follows the same build-time `VERCEL` condition as the root layout. This is a description of the current site, not a claim of legal certification or a substitute for verified business terms.
- Home: a company introduction and editorial service overview, while retaining Quadropod as the main project and all existing engineering sections.
- Contact: a briefing checklist, the selected service context and a prefilled editable enquiry. Unsupported service IDs are ignored. Client-side query changes clear stale context while retaining an edited message when navigating back to general Contact.
- Footer: company/development/enquiry navigation on detail pages, with Resources and Privacy links in the compact home footer. The existing final-viewport contact fit is preserved.

Company content, services, proposed engagement steps, enquiry checklist, FAQ and resources are editable in `business.json` and validated by `business.ts`. Service identifiers must be unique, and resource/evidence links follow the existing HTTPS/local-path validation. The service scopes and engagement model describe work to discuss and agree; they are not invented past contracts or customer deliveries.

Additional files: `src/app/services/page.tsx`, `src/app/resources/page.tsx`, `src/app/privacy/page.tsx`, `src/components/company/ServiceOverview.tsx`, `src/components/company/EngagementProcess.tsx`. Related changes include `Footer.tsx`, `DetailPage.tsx`, About, Contact, Home, sitemap, business configuration/schema, navigation, sharing artwork and `verify-readiness.mjs`.

Observed checks for this expansion: production build generated all nine public pages; readiness regression passed all routes and local links, 320/390/768/1440px layouts, schema rejection cases, FAQ keyboard open/close, service-to-contact navigation, unknown query handling, retained message input, metadata and sitemap. Eighteen axe page/viewport scans found zero violations. Static preview and existing theme/contact-fit/mobile-navigation checks passed. Desktop and mobile screenshots were inspected.

Registered address and phone now have verified-only configuration slots alongside legal registration and founding date. None have been provided, so they are omitted from the public company details. No client logos, customer quotes, certification badges, invented team members, office locations, support guarantees, pricing, commercial robot availability or tested physical results are added. Actual contracts, legal particulars and commercial terms require real information before publication. No commit, push, deployment, email sending or application submission was performed.

The final hardware regression also passed: original CAD/STL geometry hashes, covered-spider assembly, Quadropod controls and mobile fallback, PCB loading, orbit/reset, appearance switching, reduced motion and WebGL fallback. Final typecheck and lint passed with the same three pre-existing warnings; whitespace/diff review passed. Physical hardware testing, delivery to an inbox, manual VoiceOver testing and live deployment remain outside the observed checks.

## Industrial LoRa Platform as a second main product

The user supplied `bora_girgin_projesi.docx.pdf` (11 pages) and instructed that its project be presented as a completed company project alongside Quadropod, without the funding-program framing. The source PDF remains unchanged in the repository root and is not copied to `public/` or exposed as a download.

Technical scope was extracted and visually checked from the document:

- Pages 2-4: factory monitoring and automation, distributed sensor data and operational history.
- Pages 4-5: main system, field nodes and equipment-specific interfaces; I2C/UART integration, node identities, UUID notification types, donor/subscriber registry and event journal.
- Page 6: SBC main system, ESP32 nodes, Go management software and C firmware; button-event and temperature-reading examples.

The PDF is a research proposal rather than an implementation acceptance or measurement report. The `completed` product status records the user's requested company-project status through `completionEvidence`; it is not an independently observed completion or physical validation result. Numerical savings, efficiency, range, delivery accuracy, measured outcomes, patents, grant awards, customer installations and third-party partnerships are not inferred from the document. Institution, adviser, research-team and programme information are not used as company references.

Implementation:

- Added Industrial LoRa Platform with a company description, intended users, stack, capabilities, workflow and outcome in `business.json`.
- `featuredProductIds` identifies Quadropod and the industrial platform as main products; Pi Control Panel remains supporting work. Featured IDs must be unique, reference existing products and include the retained primary product. Completed products require recorded verified completion evidence.
- Home displays both main products at equal prominence, with the real Quadropod CAD drawing and a semantic industrial architecture diagram. Existing geometry and the 3D explorer are preserved.
- Added `/products/industrial-lora/` with the engineering problem, layered architecture, notification flow and completed company-project status. The page contains no artificial live readings, fake repository link or invented dashboard demonstration.
- Updated Products, Projects, company mission/introduction, roadmap, Resources/FAQ, Hero links, expanded footer, root metadata and sharing artwork. Added the product route to the sitemap.
- Added `src/components/company/ProductArchitecture.tsx` and `src/app/products/industrial-lora/page.tsx`; updated business schema/configuration, showcase, route copy, CSS and readiness regression.

Observed validation: typecheck, lint and production static build passed; lint retains the same three pre-existing warnings. `verify:preview`, `verify:readiness`, `verify:theme` and `verify:hardware` passed. Readiness covers ten public routes, four responsive widths, both main product designations, completed status, architecture/workflow counts, rejected unconfirmed completion and invalid/duplicate featured IDs, and omission of funding-program names and percentage claims from the new product page. Twenty axe page/viewport scans found zero violations. Desktop product cards and mobile product/architecture views were visually inspected. Nested route screenshot filenames now include the complete path to avoid overwriting the Products page captures.

No production deployment, commit, push, industrial hardware measurement, customer-installation verification or email delivery was performed.

## Company contact mailbox

The user confirmed contact@bgirgin.dev. Setting the verified domain address updates visible Contact, footer Email, Resources, Approach, Privacy, the email-draft recipient and Person structured data through the existing shared `publicEmail` source. The founder Gmail address remains as a configuration fallback. Browser regressions now validate the selected company address and structured data, and reject malformed verified domain addresses. No email was sent and no mailbox/delivery test was performed.
