import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const pages=["", "codes", "beginner-guide", "attributes", "best-builds"];
const base="out";
for(const slug of pages){
 const path=join(base,slug,"index.html");
 if(!existsSync(path))throw Error(`Missing page ${path}`);
 const html=readFileSync(path,"utf8");
 const title=(html.match(/<title>(.*?)<\/title>/)||[])[1];
 if(!title||!title.toLowerCase().includes("build a striker")) throw Error(`SEO title missing for ${path}`);
 if(!/<h1[\s>]/i.test(html)||!/<meta name="description"/i.test(html))throw Error(`SEO metadata missing for ${path}`);
 if(/<meta name="robots" content="noindex/i.test(html)) throw Error(`Noindex unexpectedly set for ${path}`);
 if(!html.includes("https://build-a-striker.github.io"))throw Error(`Canonical target missing for ${path}`);
 for(const other of pages.filter(Boolean)){if(!html.includes(`/${other}/`))throw Error(`Navigation to ${other} missing on ${path}`)}
 for(const slot of ["banner","native"]){
  const count=(html.match(new RegExp(`data-adsterra-${slot}-slot`, "g"))||[]).length;
  if(count!==1)throw Error(`Expected one ${slot} ad slot in ${path}; found ${count}`);
 }
 if(html.indexOf("data-adsterra-banner-slot")>html.indexOf("data-adsterra-native-slot"))throw Error(`Banner must precede Native on ${path}`);
 console.log(`${path} title=${title} adSlots=ok`)
}
if(!existsSync(join(base,"robots.txt")) || !existsSync(join(base,"sitemap.xml")))throw Error("SEO discovery files missing");
const robots=readFileSync(join(base,"robots.txt"),"utf8");
if(robots.includes("Disallow: /"))throw Error("Production robots.txt blocks indexing");
const sitemap=readFileSync(join(base,"sitemap.xml"),"utf8");
for(const slug of pages){const url=`https://build-a-striker.github.io/${slug?slug+"/":""}`;if(!sitemap.includes(url))throw Error(`Missing sitemap URL ${url}`)}
console.log("All five static pages and sitemap validated");
