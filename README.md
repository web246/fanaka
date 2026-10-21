# Fanaka Noblewealth Advisory

A static multi-page website prototype for Fanaka Noblewealth Advisory, designed for Nairobi, Kenya. **Legal pages are working drafts and must be reviewed by a qualified Kenyan lawyer before launch.** Confirm regulatory status and scope with qualified counsel before offering services.

## Run locally

Use VS Code Live Server and open `index.html` through its local server URL. The shared header and footer are fetched as HTML partials, so opening pages directly with `file://` will not work reliably. No build step or package installation is required. The optional Three.js hero particles are loaded from jsDelivr at a pinned version; if the CDN or WebGL is unavailable, the page remains usable.

## Structure

- `index.html` and root pages: home, about, contact, insights, resources, careers, 404 and thank-you.
- `services/`: services overview, Corporate Trustee and Financial Trainings pages.
- `legal/`: privacy, terms, cookie, risk, complaints and disclaimer drafts.
- `partials/`: shared header and footer markup.
- `assets/css/`: design tokens, base styles, shared components, layout and page styles.
- `assets/js/`: page rendering, includes, navigation, language, consent, forms, calculator and animation modules.
- `assets/i18n/`: English and Kiswahili dictionaries.

## Design system

The palette is defined in `assets/css/tokens.css`: deep forest greens, restrained gold, warm ivory, charcoal and white. Cinzel is used consistently across headings, body copy, navigation, buttons and form controls to echo the logo wordmark throughout the site. Shared components include gold and outline actions, service cards, accordions, forms, consent preferences, process timelines and CTA bands. The layout is mobile-first and honors reduced-motion preferences.

## Replace before launch

- Homepage hero and difference videos play muted and loop continuously. The Contact page uses `assets/video/contact.mp4` as an autoplaying, looping Nairobi card video. Videos request eager preload for faster playback; actual start time still depends on the browser and network. An optimised WebM source can be added if needed.
- The supplied `assets/img/logo.png` is used throughout the site; `assets/img/favicon.png` uses its matching crest. Replace them only with approved brand artwork.
- Confirm actual services offered and that each statement matches the firm's authorised scope.
- Replace `[CLIENT COUNT]`, `[YEARS]`, `[KES X]B` and `[X]%` with substantiated figures, or remove the stats.
- Remove the example testimonial or replace it with an approved, verifiable testimonial and required disclosures.
- Add actual team names, roles, biographies and approved portraits.
- Replace `[NAIROBI OFFICE ADDRESS]`, `[PHONE]`, `[EMAIL]`, `[WHATSAPP]`, `[WHATSAPP_NUMBER]` and `[DAYS AND HOURS]` everywhere, including links.
- Replace `[DPO EMAIL]`, `[COMPLAINTS EMAIL]`, `[POSTAL ADDRESS]`, and confirm complaint timelines and escalation routes.
- Confirm and accurately state all licences, approvals, legal entity details and regulators. No licence is asserted in this prototype.
- Set `[CANONICAL URL]` in canonical, hreflang, sitemap and robots references.
- Connect contact, newsletter and career forms to a secure endpoint (for example Netlify Forms or a reviewed Formspree setup); add server-side validation, spam mitigation, retention rules and privacy disclosures. Current forms are demo-only and do not submit data.
- Set up a real booking provider and client portal only after privacy and security review.
- Replace placeholder insight copy and publish only researched, reviewed articles.
- Have every legal draft and all Kiswahili copy reviewed by qualified Kenyan legal counsel and a native Kiswahili reviewer before launch.

## Translation

The interface dictionaries are in `assets/i18n/en.json` and `assets/i18n/sw.json`. Language choice is stored in local storage and the HTML `lang` attribute updates without reloading. Some long-form generated page content currently has English copy with translated page titles and introductions; complete a professional Kiswahili translation review before presenting the full site as bilingual. For fixed markup use `data-i18n`, `data-i18n-placeholder`, `data-i18n-title` and `data-i18n-aria`.

## Forms and consent

Forms use browser-side required-field validation only. They display a demonstration success state and do not transmit or store submission data. Connect a production form service before collecting personal information. Cookie choices store a version, timestamp and categories in local storage and a first-party cookie. Analytics and marketing scripts are not included or loaded. Do not add either without a reviewed consent design and consent-gated loading.

## Video compression

Install FFmpeg, then create a web-optimised MP4 and WebM from your source. Adjust bitrate and dimensions to meet the chosen quality target and aim for a combined transfer appropriate to the performance budget.

```bash
ffmpeg -i source.mov -vf "scale='min(1920,iw)':-2,fps=24" -c:v libx264 -preset slow -crf 29 -movflags +faststart -an assets/video/hero.mp4
ffmpeg -i source.mov -vf "scale='min(1920,iw)':-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 36 -an assets/video/hero.webm
ffmpeg -i source.mov -vf "scale='min(1280,iw)':-2" -frames:v 1 -q:v 2 assets/video/hero-poster.jpg
```

## Deployment and security

Deploy the folder as static files to Netlify, Vercel, GitHub Pages or ordinary
static hosting. Configure the deployed site root as the canonical URL before
publishing. Use HTTPS and configure response headers at the host: a restrictive
Content-Security-Policy (allow only necessary self-hosted assets and the pinned
Three.js CDN), `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, a suitable
`Permissions-Policy`, and clickjacking protection through `frame-ancestors` in
CSP. Add any map, analytics, booking or form providers deliberately to CSP only
after review. Review external font/CDN privacy and availability; self-host assets
for stronger performance and control.

## Production checks

Test keyboard-only operation, focus visibility, language switching, consent settings, all internal links, form endpoint behavior, mobile menu and reduced motion. Confirm contrast with actual final content and test responsive layouts across small phones through wide desktop. Run Lighthouse and an accessibility audit on the deployed build. Do not treat prototype placeholders or legal drafts as launch-ready facts.
