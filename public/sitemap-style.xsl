<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
      <head>
        <title>Sitemap - LunaBella Golden Retriever</title>
        <meta name="robots" content="noindex"/>
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; max-width: 1400px; margin: 0 auto; padding: 2rem; background: #faf8f5; }
          h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; color: #1a1a1a; }
          p { color: #666; margin-bottom: 1.5rem; font-size: 0.875rem; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
          th { background: #1a1a1a; color: #fff; text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
          td { padding: 0.6rem 1rem; border-bottom: 1px solid #f0ece4; font-size: 0.8125rem; vertical-align: top; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #faf8f5; }
          a { color: #7a6210; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .count { background: #7a6210; color: #fff; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; margin-left: 0.5rem; }
          .alt-link { display: inline-block; font-size: 0.75rem; margin-right: 0.5rem; }
          .alt-link a { color: #666; }
          .alt-link a:hover { color: #7a6210; }
          .badge { display: inline-block; background: #ece8e1; color: #555; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.6875rem; font-weight: 500; margin-right: 0.25rem; }
          .date { color: #888; white-space: nowrap; }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>

        <xsl:if test="sitemap:sitemapindex">
          <p>Indice con <span class="count"><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></span> sitemaps.</p>
          <table>
            <thead>
              <tr>
                <th>Sitemap</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </xsl:if>

        <xsl:if test="sitemap:urlset">
          <p>Sitemap con <span class="count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span> URLs.</p>
          <table>
            <thead>
              <tr>
                <th style="width:50%">URL</th>
                <th style="width:35%">Alternativas</th>
                <th style="width:15%">Modificado</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td>
                    <xsl:for-each select="xhtml:link[@rel='alternate']">
                      <span class="alt-link">
                        <span class="badge"><xsl:value-of select="@hreflang"/></span>
                        <a href="{@href}"><xsl:value-of select="@href"/></a>
                      </span>
                      <xsl:if test="position() != last()"><br/></xsl:if>
                    </xsl:for-each>
                  </td>
                  <td class="date"><xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </xsl:if>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
