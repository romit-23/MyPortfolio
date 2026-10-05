# Romit Addagatla — AI Engineering Portfolio

Live address: https://romit-23.github.io/MyPortfolio/

This replaces the previous portfolio in the same repository and preserves its GitHub Pages address. It uses the exact resume-based portfolio design with Motion animations, responsive project panels, accessible navigation, and reduced-motion support.

## Run locally

Run these commands inside this repository, where `package.json` lives:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, including `/MyPortfolio/`.

## Build and publish

The existing Pages publishing source stays on `main`, at the repository root.

```bash
npm run typecheck
npm run build
npm run preview
```

The build first creates `.build/`, then copies the finished static HTML, assets, and resume to the repository root. Commit both your source changes and the generated files, then push `main`. GitHub Pages publishes that commit using the existing hosting setup. No custom-domain or Pages-source changes are needed.

## Edit

- `site/app/page.tsx`: professional content and interactive components.
- `site/app/globals.css`: colors, layout, responsiveness, and animation.
- `site/public/Romit-Addagatla-Resume.pdf`: the unchanged supplied resume.
- `site/index.html`: page metadata and favicon.

The built root `index.html` is generated; edit `site/index.html` instead. The previous `ML-Resume-Romit-2026.pdf` filename is retained as an alias serving the latest supplied PDF.

Browser checks can run with `PORTFOLIO_URL=http://127.0.0.1:4173/MyPortfolio npm run verify` while the production preview is running. They use an installed Google Chrome browser. Screenshots are saved in the ignored `outputs/` directory.
