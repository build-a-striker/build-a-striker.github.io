import { accentOverrideCss, resolveAccent, templatePack, type TemplatePack, type TemplateSkin } from "./catalog";
import { SPEC_HTML } from "./spec-html";

export interface TemplateLink { slug: string; label: string; href: string; }
export interface TemplateEntry { href: string; title: string; text: string; }
export interface FixedTemplateInput {
  preview?: boolean;
  legalLinks?: TemplateLink[];
  skin: TemplateSkin | string; page: "home" | "inner"; accentColorId?: string | null; gameName: string;
  nav: TemplateLink[]; currentSlug?: string | null; homeHref: string; logoUrl?: string | null; bannerUrl?: string | null;
  heading?: string | null; lead?: string | null; articleHtml?: string | null; entries?: TemplateEntry[] | null; supplementHtml?: string | null;
}

export function esc(value: string): string { return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function safeAttr(value: string) { return esc(value).replace(/'/g,"&#39;"); }
function slugOnly(value: string) { return value.replace(/^\/+|\/+$/g, ""); }

export function templateNavLinks(nav: TemplateLink[], page: "home" | "inner", currentSlug?: string | null): string {
  return nav.filter((item)=>slugOnly(item.slug)).map((item)=>{
    const active = page === "inner" && currentSlug && slugOnly(item.slug) === slugOnly(currentSlug);
    return `<a class="nav-link${active ? " active" : ""}" data-nav href="${safeAttr(item.href)}">${esc(item.label)}</a>`;
  }).join("");
}

function firstLetter(gameName: string) { return esc((gameName.trim()[0] || "G").toUpperCase()); }
function logoMarkup(input: FixedTemplateInput) {
  return input.logoUrl
    ? `<img class="brand-logo" alt="" src="${safeAttr(input.logoUrl)}">`
    : `<span class="brand-logo logo-fallback" aria-hidden="true">${firstLetter(input.gameName)}</span>`;
}
function brandMarkup(input: FixedTemplateInput) { return `${logoMarkup(input)}<strong>${esc(input.gameName)}</strong>`; }

function replaceBrand(html: string, input: FixedTemplateInput): string {
  let changed = false;
  let next = html.replace(/<a class="([^"]*\b(?:brand|logo)\b[^"]*)"[^>]*>[\s\S]*?<\/a>/, (_m, cls:string)=>{
    changed = true; return `<a class="${cls}" href="${safeAttr(input.homeHref)}" aria-label="Back to homepage">${brandMarkup(input)}</a>`;
  });
  next = next.replace(/<span class="brand-logo">[\s\S]*?<\/span>/g, logoMarkup(input));
  if (!changed) next = next.replace(/<div class="task">[\s\S]*?<\/div>/, `<a class="task" href="${safeAttr(input.homeHref)}" aria-label="Back to homepage">${esc(input.gameName)}</a>`);
  return next;
}

function replaceNav(html: string, links: string): string {
  const patterns = [
    /<nav class="([^"]*site-nav[^"]*)"[^>]*>[\s\S]*?<\/nav>/,
    /<nav class="(nav)"[^>]*>[\s\S]*?<\/nav>/,
    /<div class="(nav)">[\s\S]*?<\/div>/,
  ];
  for (const pattern of patterns) {
    if (!pattern.test(html)) continue;
    return html.replace(pattern, (full, cls: string) => {
      const primary = full.startsWith("<div")
        ? `<div class="${cls}">${links}</div>`
        : `<nav class="${cls}" aria-label="Primary navigation">${links}</nav>`;
      // The approved fixed template hides the desktop nav at mobile widths;
      // preserve its geometry and supply a keyboard-accessible mobile menu.
      return `${primary}<details class="template-mobile-guide-nav"><summary>Guides</summary><nav aria-label="Mobile guide navigation">${links}</nav></details>`;
    });
  }
  return html;
}

function replaceCrumbs(html: string, homeHref: string, current: string | null): string {
  const body = current ? `<a href="${safeAttr(homeHref)}">Home</a> › ${esc(current)}` : `<a href="${safeAttr(homeHref)}">Home</a>`;
  return html.replace(/<div class="site-breadcrumb">[\s\S]*?<\/div>/g,`<div class="site-breadcrumb">${body}</div>`).replace(/<div class="crumb">[\s\S]*?<\/div>/g,`<div class="crumb">${body}</div>`);
}

function injectTemplateAssets(html: string, input: FixedTemplateInput): string {
  let next = html.replace(/<(?:p|span)[^>]*data-nav-status[^>]*>[\s\S]*?<\/(?:p|span)>/g, "");
  if (input.bannerUrl) {
    const banner = `<img class="template-banner-image" alt="" src="${safeAttr(input.bannerUrl)}">`;
    next = next.replace(/(<(?:div|aside|article)[^>]*class="[^"]*(?:cover-own|hero-cover|hero-art|cover-card|\bcover\b|\bvisual\b)[^"]*"[^>]*>)/, `$1${banner}`);
  }
  return next.replace("</style>", `\n.brand-logo{width:36px;height:36px;object-fit:cover;display:inline-grid;place-items:center;vertical-align:middle}.template-banner-image{width:100%;height:100%;min-height:180px;object-fit:cover;display:block}.template-banner-image~svg{display:none!important}.template-page-list{display:grid;gap:8px;margin:12px 0}.template-page-link{display:block;padding:9px 10px;border:1px solid currentColor;text-decoration:none;opacity:.9}\n</style>`);
}

function replaceFactsWithEntries(html: string, entries: TemplateEntry[] | null | undefined): string {
  if (!entries?.length) return html;
  const list = `<div class="template-page-list">${entries.slice(0,8).map(e=>`<a class="template-page-link" href="${safeAttr(e.href)}"><b>${esc(e.title)}</b></a>`).join("")}</div>`;
  return html.replace(/<table class="facts">[\s\S]*?<\/table>/g, list);
}

function replaceBalanced(html: string, tag: string, className: string, inner: string): string {
  const marker = `<${tag} class="${className}">`; const start = html.indexOf(marker); if (start < 0) return html;
  const openEnd = start + marker.length; const closer = `</${tag}>`; let depth=1,index=openEnd;
  while(index<html.length&&depth>0){const no=html.indexOf(`<${tag}`,index),nc=html.indexOf(closer,index);if(nc<0)return html;if(no!==-1&&no<nc){depth++;index=no+tag.length+1}else{depth--;if(depth===0)return html.slice(0,openEnd)+inner+html.slice(nc);index=nc+closer.length}}
  return html;
}
function applyEntries(html: string, skin: string, entries: TemplateEntry[]): string {
  const cards = entries.slice(0,8).map((entry,index)=>{
    const title=esc(entry.title), text=esc(entry.text), href=safeAttr(entry.href);
    if(skin==="portal")return `<a class="card" href="${href}"><div class="icon">${index+1}</div><h3>${title}</h3><p>${text}</p></a>`;
    if(skin==="wiki")return `<a class="row" href="${href}"><b>${title}</b><span>${text}</span></a>`;
    if(skin==="resource")return `<a class="quick" href="${href}"><b>${title}</b><span>${text}</span></a>`;
    if(skin==="editorial")return `<article class="article"><a href="${href}"><div class="thumb"></div><div class="article-body"><h3>${title}</h3><p>${text}</p></div></a></article>`;
    if(skin==="glass")return `<a class="block" href="${href}"><div class="num">0${index+1}</div><b>${title}</b><p>${text}</p></a>`;
    if(skin==="pixel")return `<a class="tile" href="${href}"><div class="icon">▣</div><b>${title}</b><p>${text}</p></a>`;
    if(skin==="horror")return `<article class="card"><a href="${href}"><div class="tag">GUIDE</div><h3>${title}</h3><p>${text}</p></a></article>`;
    return "";
  }).join("");
  if(!cards)return html;
  if(skin==="portal")return replaceBalanced(html,"div","grid",cards);
  if(skin==="wiki")return replaceBalanced(html,"div","list",cards);
  if(skin==="resource")return replaceBalanced(html,"div","quick-grid",cards);
  if(skin==="editorial")return replaceBalanced(html,"section","grid",cards);
  if(skin==="glass")return replaceBalanced(html,"div","blocks",cards);
  if(skin==="pixel")return replaceBalanced(html,"div","tiles",cards);
  if(skin==="horror")return replaceBalanced(html,"div","cards",cards);
  return html;
}

function neutralizeDemoCopy(html: string, input: FixedTemplateInput): string {
  const lead = esc(input.lead || `${input.gameName} guides, walkthroughs, reference information, and quick answers for players.`);
  let next=html;
  const replacements:[RegExp,string][]=[
    [/What Drag(?:&#x27;|')n Wash Is/g,`About ${esc(input.gameName)}`],
    [/Drag(?:&#x27;|')n Wash is an adult-only dragon wash simulation from Gator Dragon Games\.[\s\S]*?three endings\./g,lead],
    [/This hub routes you to beginner progress,[\s\S]*?itch\.io\./g,`Use the navigation above to open the guides and reference pages in this site.`],
    [/Drag(?:&#x27;|')n Wash \(also styled DragN'Wash\)[\s\S]*?open-world exploration\./g,`${esc(input.gameName)} is covered here with player-focused guides and reference information.`],
    [/Sessions are short by design\.[\s\S]*?Linux\./g,`Use each guide for a focused player task, then follow related pages for deeper coverage.`],
    [/Ryan, Alexander and Conrad/gi,"Characters and game systems"],
    [/Three Endings/gi,"Game Guides"],[/3 Routes/gi,"Guide Routes"],[/ENDINGS/g,"GUIDES"],
    [/Steam \/ itch\.io/gi,"Official platforms"],[/September 10, 2026/gi,"Official release"],[/Gator Dragon Games/gi,"Official developer"],
  ];
  for(const [pattern,value] of replacements)next=next.replace(pattern,value);
  next=next.replaceAll("Drag'n Wash",input.gameName).replaceAll("Drag&#x27;n Wash",esc(input.gameName)).replaceAll("DragN'Wash",input.gameName);
  return next;
}

function applyCopy(html: string, input: FixedTemplateInput): string {
  let next=neutralizeDemoCopy(html,input);
  if(input.heading)next=next.replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${esc(input.heading)}</h1>`);
  if(input.lead){
    if(next.includes('<p class="lead">')) next=next.replace(/<p class="lead">[\s\S]*?<\/p>/,`<p class="lead">${esc(input.lead)}</p>`);
    // Yorich's seed template has a blank paragraph under the home H1.
    else if(input.page === "home") next=next.replace(/(<h1>[\s\S]*?<\/h1>)<p><\/p>/,`$1<p class="lead">${esc(input.lead)}</p>`);
  }
  return next;
}

export function extractStyle(html:string):string{return [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]??"").join("\n")}
export function extractBody(html:string):string{const m=html.match(/<body[^>]*>([\s\S]*)<\/body>/i);return(m?.[1]??html).replace(/<script[\s\S]*?<\/script>/g,"")}
function deriveInnerTemplate(home:string,pack:TemplatePack):string{
  const style=extractStyle(home); const fg=pack.dark?"#F4F4F5":"#1F2937", muted=pack.dark?"#A1A1AA":"#667085";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Game Guide</title><style>${style}\n:root{--accent:${pack.defaultAccent}}body{background:${pack.background};color:${fg}}.template-inner-header{position:relative;z-index:10;border-bottom:1px solid color-mix(in srgb,${fg} 18%,transparent)}.template-inner-row{width:min(1120px,calc(100% - 32px));min-height:68px;margin:auto;display:flex;align-items:center;gap:20px}.template-inner-row .brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit}.template-inner-row .site-nav{margin-left:auto;display:flex;flex-wrap:wrap;gap:6px}.template-inner-row .nav-link{padding:9px 11px;text-decoration:none;color:${muted}}.template-inner-row .nav-link.active{color:inherit;box-shadow:inset 0 -2px 0 var(--accent)}.template-inner-main{width:min(980px,calc(100% - 32px));margin:auto;padding:34px 0 54px}.site-breadcrumb{font-size:12px;color:${muted};margin-bottom:22px}.site-breadcrumb a{color:var(--accent)}.template-inner-article h1{font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.02;margin:0 0 18px}.template-inner-article h2{margin-top:38px}.template-inner-article p,.template-inner-article li{line-height:1.78;color:${muted}}.template-inner-footer{border-top:1px solid color-mix(in srgb,${fg} 18%,transparent);padding:30px 0}.template-inner-footer>div{width:min(1120px,calc(100% - 32px));margin:auto;color:${muted};font-size:13px}@media(max-width:760px){.template-inner-row .site-nav{display:none}}</style></head><body data-template="${pack.specId.replace(/^\d+-/,"")}"><header class="template-inner-header"><div class="template-inner-row"><a class="brand" href="home.html" aria-label="Back to homepage"><strong>Game</strong></a><nav class="site-nav"><a class="nav-link" href="inner.html#guide">Guide</a></nav></div></header><main class="template-inner-main"><div class="site-breadcrumb"><a href="home.html">Home</a> › Guide</div><article class="template-inner-article"><h1>Game Guide</h1><p class="lead">Player guide and reference page.</p><section id="guide"><h2>Guide</h2><p>Guide content.</p></section></article></main><footer class="template-inner-footer"><div>Independent player guide</div></footer></body></html>`;
}
function templateSource(skin:string,page:"home"|"inner"){const pack=templatePack(skin),source=SPEC_HTML[pack.specId];if(!source?.home)throw new Error(`Missing approved HTML for ${pack.specId} home`);return{pack,html:page==="home"?source.home:(source.inner||deriveInnerTemplate(source.home,pack))}}

function replaceArticleBody(html:string,articleHtml:string):string{
  const match=html.match(/<article([^>]*)class="([^"]*template-inner-article[^"]*)"([^>]*)>[\s\S]*?<\/article>/) || html.match(/<article([^>]*)>[\s\S]*?<\/article>/);
  if(!match)return html; const full=match[0]; const attrs=full.match(/^<article([^>]*)>/)?.[1]??""; const h1=full.match(/<h1>[\s\S]*?<\/h1>/)?.[0]??"";
  return html.replace(full,`<article${attrs}>${h1}${articleHtml}</article>`);
}
function insertSupplement(html:string,supplement:string){if(html.includes("</main>"))return html.replace("</main>",`</main><div class="wrap template-home-supplement">${supplement}</div>`);if(html.includes("<footer"))return html.replace("<footer",`<div class="wrap template-home-supplement">${supplement}</div><footer`);return html.replace("</body>",`<div class="wrap template-home-supplement">${supplement}</div></body>`)}

/** Preserve Yorich's footer columns and classes, filling only blank game-specific copy and links. */
function populateSoftGuideFooter(html: string, input: FixedTemplateInput): string {
  if (input.skin !== "soft-guide") return html;
  const start = html.indexOf('<footer class="site-footer">');
  if (start < 0) return html;
  const end = html.indexOf('</footer>', start);
  if (end < 0) return html;
  const links = input.nav.filter(x => x.href !== "/");
  const link = (at: number) => links[at]
    ? `<a href="${safeAttr(links[at].href)}">${esc(links[at].label)}</a>`
    : `<a href="${safeAttr(input.homeHref)}">Home</a>`;
  const footer = `<footer class="site-footer"><div class="footer-inner"><div><div class="footer-brand"><img class="brand-logo" src="${safeAttr(input.logoUrl || "/images/build-a-striker-logo.png")}" alt=""><b>${esc(input.gameName)}</b></div><p>Independent Roblox player guides. Not affiliated with Roblox or the developer.</p></div><div><b>Game Guides</b>${link(0)}${link(1)}${link(2)}</div><div><b>More Resources</b>${link(3)}<a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></div></div></footer>`;
  return html.slice(0, start) + footer + html.slice(end + '</footer>'.length);
}

export function renderFixedTemplate(input:FixedTemplateInput):string{
  const {pack,html:source}=templateSource(input.skin,input.page); const paint=resolveAccent(pack.skin,input.accentColorId);
  const currentLabel=input.page==="inner"?(input.nav.find(x=>slugOnly(x.slug)===slugOnly(input.currentSlug||""))?.label||input.heading||"Guide"):null;
  let html=source;
  html=replaceBrand(html,input);
  html=html.replaceAll('href="home.html"',`href="${safeAttr(input.homeHref)}"`);
  html=replaceNav(html,templateNavLinks(input.nav,input.page,input.currentSlug));
  html=replaceCrumbs(html,input.homeHref,currentLabel);
  html=html.replace(/href="inner\.html#([^"]+)"/g,(_m: string, id: string)=>{const linked=input.nav.find(x=>slugOnly(x.slug)===id);return`href="${safeAttr(linked?.href||`#${id}`)}"`});
  html=injectTemplateAssets(html,input);
  if(input.page==="home"&&input.entries?.length){
    html=applyEntries(html,pack.skin,input.entries);
    html=replaceFactsWithEntries(html,input.entries);
    // Fill the original template's first content card without changing the card/grid markup.
    html=replaceBalanced(html,"article","card",`<div class="kicker">Quick start</div><h2>About ${esc(input.gameName)}</h2><p>${esc(input.lead||"Find guides, codes and player resources.")}</p><p>Use the guide links to explore codes, beginner steps, attributes and build strategies.</p>`);
  }
  if(input.page==="inner"&&input.articleHtml)html=replaceArticleBody(html,input.articleHtml);
  if(input.supplementHtml)html=insertSupplement(html,input.supplementHtml);
  html=applyCopy(html,input);
  html=populateSoftGuideFooter(html,input);
  html=html.replace(/--accent:#[0-9A-Fa-f]{6}/,`--accent:${paint.textAccent}`);
  html=html.replace("</style>",`${accentOverrideCss(pack.skin,paint)}</style>`);
  if(!/<body[^>]*data-template=/.test(html))html=html.replace(/<body([^>]*)>/,`<body$1 data-template="${pack.specId.replace(/^\d+-/,"")}">`);
  return html;
}

function balancedFirstElement(body:string,marker:string,tag:string){const start=body.indexOf(marker);if(start<0)return"";const openEnd=body.indexOf(">",start)+1, closer=`</${tag}>`;let depth=1,index=openEnd;while(index<body.length&&depth){const no=body.indexOf(`<${tag}`,index),nc=body.indexOf(closer,index);if(nc<0)return"";if(no!==-1&&no<nc){depth++;index=no+tag.length+1}else{depth--;index=nc+closer.length}}return body.slice(start,index)}
export function splitFixedChrome(body:string,_skin:string):{chrome:string;rest:string}{const source=body.trim();let chrome="";if(source.startsWith('<div class="topline">')){const end=source.indexOf("</header>");if(end>=0)chrome=source.slice(0,end+9)}else if(source.startsWith('<nav class="floating">')){chrome=balancedFirstElement(source,'<nav class="floating">',"nav")}else if(source.startsWith('<div class="desktopbar">')){chrome=balancedFirstElement(source,'<div class="desktopbar">',"div")}else{const hs=source.indexOf("<header"),he=source.indexOf("</header>");if(hs>=0&&he>=0)chrome=source.slice(hs,he+9)}return{chrome,rest:chrome?source.replace(chrome,""):source}}

function scopeSelectorList(selector:string,scope:string){return selector.split(",").map(part=>{const sel=part.trim();if(!sel||sel.startsWith("@"))return sel;if(sel===":root"||sel==="html"||sel==="body")return scope;return`${scope} ${sel}`}).join(",")}
export function scopeTemplateCss(css:string,scope:string):string{
  let source=css.replace(/@import\s+url\(\s*(?:"[^"]*"|'[^']*'|[^)]*)\s*\)\s*;/g, "").trim(),index=0,out=""; while(index<source.length){while(/[\s]/.test(source[index]||""))index++;if(index>=source.length)break;
    if(source.startsWith("@media",index)||source.startsWith("@supports",index)){const brace=source.indexOf("{",index);if(brace<0)break;const header=source.slice(index,brace+1);let depth=1,cursor=brace+1;while(cursor<source.length&&depth){if(source[cursor]==="{")depth++;else if(source[cursor]==="}")depth--;cursor++}out+=header+scopeTemplateCss(source.slice(brace+1,cursor-1),scope)+"}";index=cursor;continue}
    if(source.startsWith("@keyframes",index)||source.startsWith("@font-face",index)){const brace=source.indexOf("{",index);if(brace<0)break;let depth=1,cursor=brace+1;while(cursor<source.length&&depth){if(source[cursor]==="{")depth++;else if(source[cursor]==="}")depth--;cursor++}out+=source.slice(index,cursor);index=cursor;continue}
    const brace=source.indexOf("{",index);if(brace<0)break;const selector=source.slice(index,brace).trim(),close=source.indexOf("}",brace);if(close<0)break;out+=scopeSelectorList(selector,scope)+"{"+source.slice(brace+1,close)+"}";index=close+1;
  }return out;
}

/** Scoped content-only safeguards. These do not alter the original template chrome/hero. */
function fixedContentStyles(skin: string): string {
  const scope = `body[data-fixed-template="${skin}"]`;
  return `
${scope} .brand-logo{width:36px;height:36px;object-fit:cover;display:inline-grid;place-items:center;vertical-align:middle;flex-shrink:0}
${scope} .template-banner-image{width:100%;height:100%;min-height:180px;object-fit:cover;display:block}
${scope} .template-banner-image~svg{display:none!important}
${scope} .template-page-list{display:grid;gap:8px;margin:12px 0}
${scope} .template-page-link{display:block;padding:9px 10px;border:1px solid hsl(var(--border));border-radius:8px;text-decoration:none;color:hsl(var(--foreground))}
${scope} .template-mobile-guide-nav{display:none}
${scope} .template-mobile-guide-nav summary{cursor:pointer;list-style:revert;padding:9px 12px;border:1px solid hsl(var(--border));border-radius:8px;font-weight:700}
${scope} .template-mobile-guide-nav nav{position:absolute;z-index:100;right:0;top:100%;display:grid;gap:3px;min-width:190px;padding:10px;border:1px solid hsl(var(--border));border-radius:10px;background:hsl(var(--card));box-shadow:var(--card-shadow)}
${scope} .template-mobile-guide-nav nav a{display:block;padding:9px 10px;color:hsl(var(--foreground));text-decoration:none}
${scope} .template-mobile-guide-nav nav a:focus-visible{outline:2px solid hsl(var(--primary))}
${scope} .top-inner,${scope} .template-inner-row{position:relative}
${scope}{background-color:hsl(var(--background));background-image:var(--background-pattern);color:hsl(var(--foreground));font-family:var(--font-sans)}
${scope} .top-inner{background:hsl(var(--card));border-color:hsl(var(--border));box-shadow:var(--card-shadow)}
${scope} .site-nav a{color:hsl(var(--foreground))}
${scope} .site-nav a.active{background:hsl(var(--primary));color:hsl(var(--primary-foreground));box-shadow:none}
${scope} .hero-shell{background:linear-gradient(135deg,hsl(var(--card)),hsl(var(--background)));border-color:hsl(var(--border));box-shadow:var(--card-shadow)}
${scope} .hero h1,${scope} .card h2{color:hsl(var(--foreground));font-family:var(--font-heading)}
${scope} .hero p,${scope} .card,${scope} .site-footer{color:hsl(var(--foreground))}
${scope} .card{background:hsl(var(--card));border-color:hsl(var(--border));box-shadow:var(--card-shadow)}
${scope} .site-footer{background:hsl(var(--card));border-color:hsl(var(--border))}
${scope} .template-inner-article p,${scope} .template-inner-article li,${scope} .template-inner-row .nav-link{color:hsl(var(--foreground))}
${scope} .template-home-supplement{padding:24px 0 54px;max-width:1100px;margin-inline:auto}
${scope} .template-home-supplement section{padding:24px 0;border-bottom:1px solid color-mix(in srgb,currentColor 16%,transparent)}
${scope} .template-home-supplement h2{margin:0 0 16px;font-size:clamp(1.55rem,3vw,2.1rem)}
${scope} .template-home-supplement p{max-width:78ch;line-height:1.75;margin:10px 0;overflow-wrap:anywhere}
${scope} .template-home-supplement ul{padding-left:1.25rem;line-height:1.9}
${scope} .template-home-supplement a{color:var(--accent,#9B6D39);text-decoration:underline;text-underline-offset:3px}
${scope} .template-inner-main{max-width:min(980px,calc(100% - 32px));overflow-wrap:anywhere}
${scope} .template-inner-article{min-width:0}
${scope} .template-inner-article section{margin-top:30px}
${scope} .template-inner-article h2{overflow-wrap:break-word;line-height:1.18}
${scope} .template-inner-article h3{font-size:1.2rem;line-height:1.3;margin:24px 0 12px}
${scope} .template-inner-article ul,${scope} .template-inner-article ol{padding-left:1.4rem}
${scope} .template-inner-article li{margin:8px 0}
${scope} .template-inner-article a{color:var(--accent,#9B6D39);text-decoration:underline;text-underline-offset:3px}
${scope} .template-data-table{max-width:100%;overflow-x:auto;margin:18px 0;border:1px solid color-mix(in srgb,currentColor 22%,transparent);border-radius:12px}
${scope} .template-data-table table{border-collapse:collapse;width:100%;min-width:520px;font-size:.925rem}
${scope} .template-data-table th,${scope} .template-data-table td{padding:12px 14px;text-align:left;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);vertical-align:top;overflow-wrap:anywhere}
${scope} .template-data-table th{font-weight:700}
${scope} .template-data-table caption{padding:13px;text-align:left;font-weight:700}
${scope} .template-code-copy{cursor:pointer;border:1px solid currentColor;border-radius:7px;background:transparent;color:inherit;padding:6px 12px;font:inherit}
${scope} .template-code-copy:hover,${scope} .template-code-copy:focus-visible{background:color-mix(in srgb,var(--accent,#9B6D39) 16%,transparent);outline-offset:2px}
${scope} .template-inner-article .template-content-card{padding:15px 18px;margin:16px 0;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:12px}
${scope} .template-inner-article .template-content-card h3{margin-top:4px}
${scope} .template-inner-article .template-link-list{display:grid;gap:10px;margin:16px 0}
${scope} .template-inner-article .template-link-list a{display:block;overflow-wrap:break-word}
${scope} .template-inner-article .template-copy-status{font-size:.85rem}
@media(max-width:820px){${scope} .template-mobile-guide-nav{display:block}}
@media(max-width:760px){${scope} .template-inner-main{padding:24px 0 38px}${scope} .template-inner-article h1{font-size:clamp(2rem,8vw,3.2rem)}${scope} .template-home-supplement{padding:16px 0 34px}${scope} .template-data-table table{min-width:460px}}
`;
}

export function scopedTemplateCss(skin:string,accentColorId?:string|null):string{const {pack,html:home}=templateSource(skin,"home"),{html:inner}=templateSource(skin,"inner"),paint=resolveAccent(pack.skin,accentColorId);const raw=extractStyle(home)+"\n"+extractStyle(inner)+"\n"+accentOverrideCss(pack.skin,paint);return scopeTemplateCss(raw,`body[data-fixed-template="${pack.skin}"]`) + fixedContentStyles(pack.skin)}
export function renderFixedDocument(input:FixedTemplateInput):{html:string;body:string;chrome:string;rest:string}{const html=renderFixedTemplate(input),body=extractBody(html),parts=splitFixedChrome(body,templatePack(input.skin).skin);return{html,body,...parts}}