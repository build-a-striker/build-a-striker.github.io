import type { SeoPageDefinition } from "@/config/types";
import rawPages from "./generated/pages.json";
import { updateGuides } from "./update-guides";

export const corePages = [...(rawPages as SeoPageDefinition[]), ...updateGuides];
