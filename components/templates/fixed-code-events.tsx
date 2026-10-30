"use client";

import { useEffect } from "react";

/** Progressive enhancement for copy controls in the server-rendered fixed-template table. */
export function FixedCodeEvents() {
  useEffect(() => {
    async function handleCopy(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>("button[data-code-copy]");
      if (!button) return;
      const code = button.dataset.codeCopy;
      if (!code) return;
      const status = document.getElementById("fixed-code-copy-status");
      try {
        await navigator.clipboard.writeText(code);
        if (status) status.textContent = `${code} copied. Paste it into the game to verify.`;
      } catch {
        if (status) status.textContent = `Could not copy ${code}. Select the text and copy manually.`;
      }
    }
    document.addEventListener("click", handleCopy);
    return () => document.removeEventListener("click", handleCopy);
  }, []);
  return null;
}
