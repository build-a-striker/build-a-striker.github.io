import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { FixedCodeEvents } from "@/components/templates/fixed-code-events";
import { codes } from "@/content/reported-codes";
import type { DataTable, PageSection } from "@/config/types";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { enabledLegalPages, getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { pageSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function tableHtml(table: DataTable): string {
  const headers = table.columns.map((name) => `<th scope="col">${esc(name)}</th>`).join("");
  const rows = table.rows.map((cells) => `<tr>${cells.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("");
  return `<div class="template-data-table" role="region" tabindex="0" aria-label="${esc(table.caption)}"><table><caption>${esc(table.caption)}</caption><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function codeTableHtml(): string {
  const rows = codes.map(({ code, reward, source, url }) =>
    `<tr><th scope="row"><code>${esc(code)}</code></th><td>${esc(reward)}</td><td><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(source)}</a></td><td><button class="template-code-copy" type="button" aria-label="Copy ${esc(code)}" data-code-copy="${esc(code)}">Copy</button></td></tr>`
  ).join("");
  return `<div class="template-data-table" role="region" tabindex="0" aria-label="Recently reported Build A Striker codes"><table><caption>Recently reported codes — not independently redeemed by this site</caption><thead><tr><th scope="col">Code</th><th scope="col">Reported reward</th><th scope="col">Source</th><th scope="col">Copy</th></tr></thead><tbody>${rows}</tbody></table></div><p class="template-copy-status" role="status" id="fixed-code-copy-status" aria-live="polite">These codes are reported by third-party guides; check the actual game response.</p>`;
}

function sectionHtml(section: PageSection): string {
  const intro = section.intro ? `<p>${esc(section.intro)}</p>` : "";
  const paragraphs = (section.paragraphs ?? []).map((p) => `<p>${esc(p)}</p>`).join("");
  const subsections = (section.subsections ?? []).map((sub) => {
    const subParas = sub.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
    const bullets = sub.bullets?.length ? `<ul>${sub.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "";
    return `<div class="template-content-card"><h3>${esc(sub.heading)}</h3>${subParas}${bullets}${sub.table ? tableHtml(sub.table) : ""}</div>`;
  }).join("");
  const steps = section.steps?.length ? `<ol>${section.steps.map((step) => `<li><strong>${esc(step.heading)}:</strong> ${esc(step.description)}</li>`).join("")}</ol>` : "";
  const links = section.links?.length ? `<div class="template-link-list">${section.links.map((link) => `<a href="${esc(routePath(link.slug))}"><strong>${esc(link.label)}</strong>${link.description ? ` — ${esc(link.description)}` : ""}</a>`).join("")}</div>` : "";
  const codesHtml = section.id === "reported-codes" ? codeTableHtml() : "";
  return `<section id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${intro}${paragraphs}${codesHtml}${subsections}${steps}${section.table ? tableHtml(section.table) : ""}${links}</section>`;
}

function articleInner(page: SeoPageDefinition): string {
  const sections = page.sections.map(sectionHtml).join("");
  const faq = page.faq?.length
    ? `<section id="faq"><h2>Frequently Asked Questions</h2>${page.faq.map((item) => `<div class="template-content-card"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p></div>`).join("")}</section>`
    : "";
  const related = getRelatedPages(page);
  const relatedHtml = related.length
    ? `<section id="related"><h2>Related Guides</h2><ul>${related.map((item) => (
      `<li><a href="${esc(siteSkin() === "arcade-play" ? assetPath(routePath(item.slug)) : routePath(item.slug))}">${esc(item.navLabel)}</a></li>`
    )).join("")}</ul></section>`
    : "";
  return `<p class="lead">${esc(page.hero.lead)}</p>${sections}${faq}${relatedHtml}`;
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages
    .filter((item) => item.slug.replace(/^\/+|\/+$/g, ""))
    .map((item) => ({ slug: item.slug.replace(/^\/+|\/+$/g, ""), label: item.navLabel, href: routePath(item.slug) }));
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug: page.slug,
    homeHref: skin === "arcade-play" ? assetPath("/") : "/",
    logoUrl: skin === "arcade-play" ? assetPath(siteConfig.assets.logo) : null,
    ...(skin === "arcade-play" ? { legalLinks: enabledLegalPages.map((item) => ({ slug: item.slug, label: item.navLabel, href: assetPath(routePath(item.slug)) })) } : {}),
    heading: page.hero.heading,
    lead: page.hero.lead,
    articleHtml: articleInner(page),
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      {page.slug === "codes" ? <FixedCodeEvents /> : null}
      <div className="site-container"><NativeAdSlot /></div>
    </>
  );
}
