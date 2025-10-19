# Furniture Recommendation Frontend 🪑

Hey! I made this project as part of my **Ikarus assignment**.
It’s a simple React + Vite + TypeScript frontend connected to my FastAPI backend on Hugging Face.

**Backend:** [https://0504ankitsharma-ikarus.hf.space](https://0504ankitsharma-ikarus.hf.space)

---

## What it does

* Chat-style furniture recommendations
* Shows product images and details
* Option to find similar items
* Basic analytics page with simple charts

---

## How to run

Make sure you have **Node.js 18+**.

```bash
npm install
npm run dev
# open http://localhost:5173
```

If needed, update `.env`:

```
VITE_API_BASE_URL=https://0504ankitsharma-ikarus.hf.space
```

---

## Main files

* `src/pages/ChatPage.tsx` – main chat interface
* `src/components/ProductCard.tsx` – shows product cards
* `src/pages/AnalyticsPage.tsx` – analytics and charts

---

## Notes

It’s just a simple demo for my assignment, so I kept the design clean and minimal.
Built using **React**, **TypeScript**, and **Vite** — connected with my FastAPI backend.

---

### License

MIT
