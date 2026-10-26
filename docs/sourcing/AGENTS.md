# Keep the shared HTML in sync

The Markdown files are the source of truth. Whenever you edit either
`2026-10-25-sourcing-brief.md` or `2026-10-25-rental-kits-yiwu-buy-list.md`,
regenerate and verify the matching HTML before completing the task:

```powershell
node docs/sourcing/generate-html.cjs
node docs/sourcing/generate-html.cjs --check
```

Run these commands from the repository root. The generator requires Node.js
and Pandoc on PATH. Include the regenerated HTML with the Markdown changes.
Do not edit generated HTML directly; change `generate-html.cjs` for formatting.
Preserve all source content, including Chinese text and draft assumptions.

For automatic regeneration while editing, keep this command running:

```powershell
node docs/sourcing/generate-html.cjs --watch
```

Watch mode updates both HTML files when either source or an asset in `media/` changes. It only runs
while the command is active. `--check` is read-only and exits with a nonzero
status if an HTML file is missing or stale.

Each HTML file embeds its styling, WebP images and WebM video and can be shared as an attachment. Regenerate the HTML after changing any referenced media. Keep
both files in the same folder for the buy list's link to the sourcing brief.
The Camp Night debrief reference is not bundled in these attachments.

The kit visuals are AI concepts, not confirmed products or approved samples.
Keep that distinction explicit. Standard tents use aluminium poles; the visible
tent pump belongs to the inflatable Luxury tent. The shared mattress pump is
still specified for Standard kits but is deliberately not pictured. Preserve
the Nigerian garden setting drawn from the existing website photography.
