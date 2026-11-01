"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { adsterra } from "@/config/adsterra";

type Banner = typeof adsterra.desktop | typeof adsterra.mobile;

/** An isolated document keeps an ad provider's document.write away from the main Next.js page. */
function renderBanner(slot: HTMLElement) {
  const surface = slot.querySelector<HTMLElement>("[data-adsterra-surface]");
  if (!surface) return;
  const size = window.innerWidth < 768 ? "mobile" : "desktop";
  if (slot.dataset.adsterraSize === size && surface.querySelector("iframe")) return;
  const banner: Banner = size === "mobile" ? adsterra.mobile : adsterra.desktop;
  const options = { key: banner.key, format: banner.format, height: banner.height, width: banner.width, params: banner.params };
  const frame = document.createElement("iframe");
  frame.title = "Advertisement";
  frame.width = String(banner.width);
  frame.height = String(banner.height);
  frame.className = "adsterra-banner-frame";
  frame.setAttribute("scrolling", "no");
  frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  frame.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation");
  frame.srcdoc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;overflow:hidden"><script>atOptions = ${JSON.stringify(options)};</script><script src="${banner.src}"></script></body></html>`;
  surface.replaceChildren(frame);
  slot.dataset.adsterraSize = size;
}

function renderNative(slot: HTMLElement) {
  if (slot.dataset.adsterraMounted === "true") return;
  const surface = slot.querySelector<HTMLElement>("[data-adsterra-surface]");
  if (!surface) return;
  const container = document.createElement("div");
  container.id = adsterra.native.containerId;
  surface.appendChild(container);
  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = adsterra.native.src;
  script.setAttribute("data-adsterra-native-script", "");
  surface.appendChild(script);
  slot.dataset.adsterraMounted = "true";
}

/** The Social Bar is global and runs once per browser document, not once per route. */
export function AdsterraManager() {
  const pathname = usePathname();
  useEffect(() => {
    const slot = document.querySelector<HTMLElement>("[data-adsterra-banner-slot]");
    const nativeSlot = document.querySelector<HTMLElement>("[data-adsterra-native-slot]");
    if (slot) renderBanner(slot);
    if (nativeSlot) renderNative(nativeSlot);
    const onResize = () => { if (slot?.isConnected) renderBanner(slot); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  useEffect(() => {
    if (document.querySelector('script[data-adsterra-social-script]')) return;
    const script = document.createElement("script");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-adsterra-social-script", "");
    script.src = adsterra.social.src;
    document.body.appendChild(script);
  }, []);
  return null;
}
