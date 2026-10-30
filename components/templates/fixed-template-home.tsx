import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function supplement(home: HomePageDefinition): string {
  const sections = home.sections.map((section) => {
    const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
    const intro = section.intro ? `<p>${esc(section.intro)}</p>` : "";
    const links = (section.links ?? []).length
      ? `<ul>${(section.links ?? []).map((link) => `<li><a href="${esc(routePath(link.slug))}">${esc(link.label)}</a>${link.description ? ` — ${esc(link.description)}` : ""}</li>`).join("")}</ul>`
      : "";
    const subsections = (section.subsections ?? []).map((sub) => `<div><h3>${esc(sub.heading)}</h3>${sub.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`).join("");
    return `<section id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${intro}${paragraphs}${links}${subsections}</section>`;
  }).join("");
  return sections;
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = visibleCorePages
    .filter((page) => page.slug.replace(/^\/+|\/+$/g, ""))
    .map((page) => ({ slug: page.slug, label: page.navLabel }));
  const entries = links.slice(0, 6).map((link) => ({
    href: routePath(link.slug),
    title: link.label,
    text: link.label,
  }));
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: assetPath(siteConfig.assets.cover),
    heading: home.hero.heading,
    lead: home.hero.lead,
    entries,
    supplementHtml: supplement(home),
  });
  // Keep the original Footer after all page content, including FAQ and ad slots.
  // The fixed-template HTML already contains Footer markup; split only the
  // render location, never the Footer classes or responsive structure.
  const footerOffset = rendered.rest.indexOf("<footer");
  const mainHtml = footerOffset >= 0 ? rendered.rest.slice(0, footerOffset) : rendered.rest;
  const footerHtml = footerOffset >= 0 ? rendered.rest.slice(footerOffset) : "";
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <div dangerouslySetInnerHTML={{ __html: mainHtml }} />
      <div className="site-container"><NativeAdSlot /></div>
      {home.faq.length ? (
        <div className="site-container"><Faq items={home.faq} /></div>
      ) : null}
      {footerHtml ? <div dangerouslySetInnerHTML={{ __html: footerHtml }} /> : null}
    </>
  );
}