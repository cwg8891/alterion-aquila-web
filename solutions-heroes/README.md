# Alterion solutions hero animations

Six hero animations for the Alterion solutions pages. Each file is self-contained (markup, styles, and animation), plays once, and holds on its final frame. **One file covers desktop and mobile**: the animation reads its container width and switches to its phone layout under 520px.

| Page | File |
|---|---|
| Find and control shadow agents | `shadow-agents.js` |
| Secure agents on every endpoint | `endpoints.js` |
| Control your entire agent estate | `agent-estate.js` |
| Stop agent drift | `agent-drift.js` |
| Quantify agent risk and prove compliance | `risk-compliance.js` |
| Optimize agent cost | `agent-cost.js` |

## Webflow setup

1. In the hero visual slot, add an **Embed** element with:
   ```html
   <div data-alterion-hero="endpoints" style="aspect-ratio:5/4;width:100%"></div>
   <script src="https://cdn.jsdelivr.net/gh/cwg8891/alterion-aquila-web@v10/solutions-heroes/endpoints.js" defer></script>
   ```
   Swap `endpoints` for the page's file name (both places). Files live in the `solutions-heroes/` folder of `cwg8891/alterion-aquila-web`.
2. Fonts: the animations use **Host Grotesk** and **IBM Plex Mono**. Both must be loaded on the site (Project settings → Fonts, or Google Fonts).
3. The background is `#050505`, the same as the site, so the frame blends in.

## Hosting notes

- jsDelivr serves files from **public** GitHub repos only.
- Reference a **tag** (`@v10`), not `@main`: tagged files are cached permanently and update instantly on a new tag; branch URLs can stay stale for up to 12 hours.
- To ship a change: commit, then create a new tag (`v11`) and update the embed URLs.

## Test locally

Open `index.html` in a browser: every hero is shown in a desktop frame and a 358px phone frame, loaded from these exact files.
