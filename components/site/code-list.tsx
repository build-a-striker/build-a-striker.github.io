"use client";

import { useState } from "react";
import { codes } from "@/content/reported-codes";

// Reports gathered from published guide sources on 2026-10-29.
// These entries have NOT been redeemed in the game by this site.


export function CodeList() {
  const [message, setMessage] = useState("");
  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setMessage(`${code} copied. Paste it in Roblox Settings to check it.`);
    } catch {
      setMessage(`Unable to copy ${code}. Please select the text and copy manually.`);
    }
  }
  return (
    <div className="mt-6 overflow-x-auto rounded-theme border border-border" aria-label="Recently reported codes">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="border-b border-border bg-secondary/60 px-5 py-3 text-left font-bold text-foreground">
          Recently reported codes — sources reviewed October 29, 2026; redemption not independently tested
        </caption>
        <thead className="bg-muted/60 text-foreground">
          <tr>
            <th scope="col" className="px-4 py-3">Code</th>
            <th scope="col" className="px-4 py-3">Reported reward</th>
            <th scope="col" className="px-4 py-3">Source</th>
            <th scope="col" className="px-4 py-3">Copy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-muted-foreground">
          {codes.map(({ code, reward, source, url }) => (
            <tr key={code} className="bg-card/45">
              <th scope="row" className="px-4 py-3 font-mono text-foreground">{code}</th>
              <td className="px-4 py-3">{reward}</td>
              <td className="px-4 py-3"><a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">{source}</a></td>
              <td className="px-4 py-3">
                <button type="button" onClick={() => void copy(code)} aria-label={`Copy ${code}`} className="button-secondary px-3 py-1.5 text-xs">Copy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p role="status" aria-live="polite" className="px-4 py-2 text-sm text-muted-foreground">{message || "Every code above is untested by this site; game responses determine validity."}</p>
    </div>
  );
}
