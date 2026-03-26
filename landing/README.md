# PassiveIntent Landing

Static landing page for `passiveintent.dev`.

## Local preview

From repo root:

```bash
npx serve landing
```

Then open `http://localhost:3000`.

## Deploy on Cloudflare Pages (recommended free path)

1. Push this repo to GitHub.
2. In Cloudflare dashboard: `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
3. Select this repository.
4. Build settings:
   - Framework preset: `None`
   - Build command: _(leave empty)_
   - Build output directory: `landing`
5. Deploy.
6. Add custom domain:
   - `Workers & Pages` -> your project -> `Custom domains` -> `Set up a custom domain`.
   - Add `passiveintent.dev` and `www.passiveintent.dev`.
7. In Cloudflare DNS, ensure proxied DNS records are created automatically (orange cloud enabled).

Because your nameservers are already on Cloudflare, no Hostinger DNS changes should be needed after this.

## Deploy on Vercel (alternative)

1. Import GitHub repo in Vercel.
2. Framework preset: `Other`.
3. Build command: _(empty)_.
4. Output directory: `landing`.
5. Add custom domain `passiveintent.dev` in project settings.

## SEO

### What's already in place

| Signal                                                 | Where                                                                                                        |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Meta description, robots directives                    | All pages                                                                                                    |
| Canonical URLs                                         | All pages                                                                                                    |
| Open Graph + Twitter Card tags                         | All pages                                                                                                    |
| Structured data (JSON-LD)                              | All pages — `WebSite`, `Organization`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `Article` schemas |
| `sitemap.xml` with `lastmod`, `changefreq`, `priority` | `landing/sitemap.xml`                                                                                        |
| `robots.txt` pointing to sitemap                       | `landing/robots.txt`                                                                                         |
| `<link rel="sitemap">` in every `<head>`               | All pages                                                                                                    |
| `site.webmanifest` + `apple-touch-icon`                | All pages                                                                                                    |
| IndexNow key file                                      | `landing/7f2c8e4a1b9d3f5e2a7c4b8d3e6f1c9a.txt`                                                               |

### Post-deploy checklist

#### 1. Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → **URL prefix** → `https://passiveintent.dev/`
3. Verify ownership (HTML file upload, DNS TXT record, or Google Analytics)
4. **Sitemaps** → submit `https://passiveintent.dev/sitemap.xml`

#### 2. Bing Webmaster Tools

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add site → `https://passiveintent.dev/`
3. Fastest path: **Import from Google Search Console** (one click once GSC is verified)
4. Submit sitemap: `https://passiveintent.dev/sitemap.xml`

#### 3. IndexNow (instant Bing/Yandex/DuckDuckGo indexing)

Verify the key file is accessible:

```
https://passiveintent.dev/7f2c8e4a1b9d3f5e2a7c4b8d3e6f1c9a.txt
```

Then submit all URLs in one request:

```powershell
Invoke-WebRequest -Uri "https://api.indexnow.org/indexnow" `
  -Method POST `
  -ContentType "application/json; charset=utf-8" `
  -Body '{
    "host": "passiveintent.dev",
    "key": "7f2c8e4a1b9d3f5e2a7c4b8d3e6f1c9a",
    "keyLocation": "https://passiveintent.dev/7f2c8e4a1b9d3f5e2a7c4b8d3e6f1c9a.txt",
    "urlList": [
      "https://passiveintent.dev/",
      "https://passiveintent.dev/ecommerce",
      "https://passiveintent.dev/cheatsheet.html",
      "https://passiveintent.dev/privacy.html",
      "https://passiveintent.dev/terms.html"
    ]
  }'
```

Expected response: `200 OK`. A `422` means the key file is not yet publicly accessible — deploy first.

Re-run this curl after any significant content update. Bing will propagate the signal to other IndexNow-compatible engines automatically.

#### 4. Validation

Run these after each deploy:

| Tool                   | URL                                                                                | What to check                                                              |
| ---------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Google Rich Results    | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) | FAQPage, BreadcrumbList, Article, SoftwareApplication parse without errors |
| OG preview             | [opengraph.xyz](https://www.opengraph.xyz)                                         | Social card renders correctly for each page                                |
| Twitter card validator | [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)         | `summary_large_image` card shows on Twitter/X                              |
| Schema.org validator   | [validator.schema.org](https://validator.schema.org)                               | No critical JSON-LD warnings                                               |

### Updating the sitemap

When adding a new page:

1. Add a `<url>` block to `sitemap.xml` with `lastmod` set to today's date
2. Add OG/Twitter tags, a canonical, and a `<link rel="sitemap">` to the new page's `<head>`
3. Re-submit via IndexNow (curl above)

When updating an existing page, bump its `lastmod` in `sitemap.xml`.

## Files

- `index.html` - structure/content
- `styles.css` - visual design/responsive layout
- `script.js` - reveal animation and dynamic year
- `_headers` - security headers for static hosting
- `sitemap.xml` - XML sitemap (submit to GSC and Bing)
- `robots.txt` - crawler directives
- `7f2c8e4a1b9d3f5e2a7c4b8d3e6f1c9a.txt` - IndexNow key file

## Social preview image

The landing page metadata expects a social sharing image at:

- `landing/social-preview.png`

Recommended asset spec:

- `1200x630` pixels
- `PNG` format
- Keep important text away from the outer edges for cropped previews

This file is used by Open Graph and Twitter metadata in `index.html`, which powers previews on X/Twitter, LinkedIn, WhatsApp, Slack, Discord, and other social/link unfurlers.
