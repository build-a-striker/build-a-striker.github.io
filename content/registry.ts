import type { SeoPageDefinition } from "@/config/types";
import { routePath } from "@/lib/urls";
import { legalPages } from "./legal";
import { corePages } from "./pages";
import { updateGuides } from "./update-guides";

export const allPages: SeoPageDefinition[] = [...corePages, ...legalPages];
export const enabledPages = allPages.filter((page) => page.enabled);
export const enabledCorePages = corePages.filter((page) => page.enabled);
export const visibleCorePages = enabledCorePages.filter((page) => page.navVisible);
export const enabledLegalPages = legalPages.filter((page) => page.enabled);
export const updateGuideLinks = updateGuides
  .filter((page) => page.enabled)
  .map((page) => ({ slug: page.slug, label: page.navLabel, href: routePath(page.slug) }));

export function getPageBySlug(slug: string) {
  return enabledPages.find((page) => page.slug === slug);
}

export function getRelatedPages(page: SeoPageDefinition) {
  return (page.relatedSlugs ?? [])
    .map((slug) => getPageBySlug(slug))
    .filter((related): related is SeoPageDefinition => Boolean(related));
}
