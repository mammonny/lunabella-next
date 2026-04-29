type SitemapEntry = {
  loc: string
  lastmod?: string
  alternateRefs?: Array<{ href: string; hreflang: string }>
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildSitemapXml(entries: SitemapEntry[]): Response {
  const urls = entries
    .map((entry) => {
      const alternates = entry.alternateRefs
        ? entry.alternateRefs
            .map(
              (ref) =>
                `<xhtml:link rel="alternate" hreflang="${ref.hreflang}" href="${escapeXml(ref.href)}"/>`,
            )
            .join('')
        : ''
      return `<url><loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}${alternates}</url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
