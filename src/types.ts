export interface NewsItem {
  title: string;
  originalTitle?: string;
  link: string;
  pubDate: string;
  content: string;
  source: string;
  category: string;
  imageUrl: string;
  summary?: string;
}

export const CATEGORIES = [
  "全部",
  "🤖 3C新創",
  "⚖️ 科技宮鬥",
  "📱 社群話題",
  "🎬 影視權威",
  "🎵 流行音樂",
  "🇯🇵 日本新潮流",
  "🇰🇷 韓流最前線"
];
