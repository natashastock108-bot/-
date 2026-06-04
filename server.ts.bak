import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAS_URL = "https://script.google.com/macros/s/AKfycbxAi0tV_o-yOuCrz-vdtROzV7sDrE80j_elWV03z_TpyWIxQQlGG-HgoI6Wh7vnS3fUew/exec?type=json";

// Server-side in-memory news store
let globalNewsCache: any[] = [];

async function refreshNews() {
  try {
    const response = await fetch(GAS_URL);
    const data = await response.json();
    
    const mappedNewItems = data.map((item: any) => ({
      title: item.title,
      pubDate: item.time,
      link: item.link,
      content: item.summary,
      summary: item.summary,
      source: item.source,
      category: item.category,
      imageUrl: item.imageUrl
    }));

    // Merge logic
    const newItemLinks = new Set(mappedNewItems.map(n => n.link));
    const merged = [...mappedNewItems];
    
    globalNewsCache.forEach(oldItem => {
      if (!newItemLinks.has(oldItem.link)) {
        merged.push(oldItem);
      }
    });

    // Cleanup: Remove news older than 48 hours to prevent memory leak
    const limit = new Date(Date.now() - 48 * 60 * 60 * 1000);
    globalNewsCache = merged.filter(item => {
      const pubDate = new Date(item.pubDate);
      return !isNaN(pubDate.getTime()) && pubDate >= limit;
    });

    console.log(`[News Update] Total items in cache: ${globalNewsCache.length}`);
  } catch (error) {
    console.error("Failed to background refresh news:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Start initial fetch in background and set interval
  refreshNews();
  setInterval(refreshNews, 5 * 60 * 1000);

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString(), cacheSize: globalNewsCache.length });
  });

  app.get("/api/news", (req, res) => {
    res.json(globalNewsCache);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
