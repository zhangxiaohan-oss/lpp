# LPP Web Next.js

This project is the Next.js version of the LPP Hat Shop single-page storefront.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Build

```bash
npm run build
npm run start
```

## Main Routes

- `/` homepage
- `/shop` product listing
- `/product/[slug]` product detail pages
- `/cart?product=[slug]` cart demo
- `/checkout?product=[slug]` checkout demo
- `/about`, `/customize`, `/tracking`, `/contact`

Static images live in `public/assets`. The old static `index.html`, `styles.css`, and `script.js` are kept for reference.
