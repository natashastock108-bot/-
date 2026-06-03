import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeNews(title: string, content: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { 
      summary: "請配置 GEMINI_API_KEY 以啟用 AI 摘要功能。",
      translatedTitle: title,
      translatedContent: content
    };
  }

  const prompt = `你是一位專業且吸睛的新聞主編，正在為『夯星文』平台撰寫報導。
請針對以下新聞進行處理：
標題：${title}
內容背景：${content.substring(0, 1000)}

要求：
1. 【翻譯標題】：請將標題翻譯為台灣繁體中文，必須吸睛且符合台灣媒體風格。
2. 【繁體中文大綱】：撰寫 80-120 字的繁體中文摘要。
3. 統一使用台灣繁體術語（如：川普、太空總署、貼文、影片、品質、軟體、輝達、螢幕、鏡頭、使用者、資訊、數據、計畫）。
4. 嚴禁使用簡體字，嚴禁使用中國大陸用語（如：質量、視頻、軟件、屏幕、用戶、信息、數據、項目）。
5. 加入 1-2 個 Emoji。
6. 以 JSON 格式回傳，包含 "translatedTitle" (對應試算表的翻譯標題), "summary" (對應試算表的繁體中文大綱) 兩個欄位。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text || "{}";
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error:", e, "Raw text:", text);
      data = {};
    }
    
    return {
      summary: data.summary || "摘要生成失敗",
      translatedTitle: data.translatedTitle || title,
      translatedContent: content // 保持原文
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "摘要生成失敗",
      translatedTitle: title,
      translatedContent: content
    };
  }
}
