const GAS_URL = "https://script.google.com/macros/s/AKfycbxAi0tV_o-yOuCrz-vdtROzV7sDrE80j_elWV03z_TpyWIxQQlGG-HgoI6Wh7vnS3fUew/exec?type=json";

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const response = await fetch(GAS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
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

    // Cache-Control: max-age=60 (tell browser / CDN to cache for 1 minute)
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

    return res.status(200).json(mappedNewItems);
  } catch (error: any) {
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to fetch news data from Google Apps Script" 
    });
  }
}
