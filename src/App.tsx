import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  Search,
  Menu,
  X,
  Share2,
  Bookmark,
  Rocket,
  Bitcoin,
  Globe,
  AtSign,
  ArrowRight,
  Eye
} from "lucide-react";
import { NewsItem, CATEGORIES } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const CATEGORY_EMOJIS: Record<string, string> = {
  "🤖 3C新創": "🤖",
  "⚖️ 科技宮鬥": "⚖️",
  "🇯🇵 日本新潮流": "🇯🇵",
  "🇰🇷 韓流最前線": "🇰🇷",
  "🎵 流行音樂": "🎵",
  "🎬 影視權威": "🎬",
  "📱 社群話題": "📱",
  "全部": "🌌"
};

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "🤖 3C新創": "https://picsum.photos/seed/tech/1200/800",
  "⚖️ 科技宮鬥": "https://picsum.photos/seed/business/1200/800",
  "🇯🇵 日本新潮流": "https://picsum.photos/seed/japan/1200/800",
  "🇰🇷 韓流最前線": "https://picsum.photos/seed/korea/1200/800",
  "🎵 流行音樂": "https://picsum.photos/seed/music/1200/800",
  "🎬 影視權威": "https://picsum.photos/seed/movie/1200/800",
  "📱 社群話題": "https://picsum.photos/seed/social/1200/800",
  "全部": "https://picsum.photos/seed/galaxy/1200/800"
};

interface ScrollRestorerProps {
  scrollRef: React.MutableRefObject<number>;
}

const ScrollRestorer: React.FC<ScrollRestorerProps> = ({ scrollRef }) => {
  useEffect(() => {
    if (scrollRef.current > 0) {
      const savedPosition = scrollRef.current;
      const timer = setTimeout(() => {
        window.scrollTo({ top: savedPosition, behavior: 'instant' });
        scrollRef.current = 0; // reset
      }, 80); // 80ms allows content to render and document to compute height
      return () => clearTimeout(timer);
    }
  }, [scrollRef]);
  return null;
};

export default function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [heroTranslatedTitle, setHeroTranslatedTitle] = useState<string | null>(null);
  const [rankingBoost, setRankingBoost] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isNewestFirst, setIsNewestFirst] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollPositionRef = useRef<number>(0);

  const triggerRocketSparks = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure canvas matches window dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      decay: number;
      gravity: number;
      shrinkRate: number;
      planetType: "ring" | "crater" | "stripe" | "star";
      rotation: number;
      rotationSpeed: number;
      shadowColor: string;
      glowColor: string;
    }

    const particles: Particle[] = [];

    // Galactic palette & schemes representing distinct planetary bodies
    const schemes = [
      {
        color: "#00f2ff", // Glowing Cyan Ice Giant
        glowColor: "#00a2ff",
        shadowColor: "#022c43",
        planetType: "ring" as const
      },
      {
        color: "#ff4d00", // Molten Lava Star/Planet
        glowColor: "#ffaa00",
        shadowColor: "#3a0c00",
        planetType: "stripe" as const
      },
      {
        color: "#fbbf24", // Cosmic Moon
        glowColor: "#ffffff",
        shadowColor: "#472c00",
        planetType: "crater" as const
      },
      {
        color: "#c084fc", // Purple Gas Giant
        glowColor: "#f43f5e",
        shadowColor: "#1e0b36",
        planetType: "stripe" as const
      },
      {
        color: "#3b82f6", // Oceanic Blue Marble
        glowColor: "#10b981", // Emerald land/glow
        shadowColor: "#051630",
        planetType: "star" as const
      },
      {
        color: "#f43f5e", // Magenta Star
        glowColor: "#ffffff",
        shadowColor: "#4c0519",
        planetType: "ring" as const
      }
    ];

    // Spawn 45 diverse planets bursting like a super-nova liftoff
    for (let i = 0; i < 45; i++) {
      const scheme = schemes[Math.floor(Math.random() * schemes.length)];
      
      // Upward burst angle with some flare spreading
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = 3 + Math.random() * 11;
      
      particles.push({
        x: clientX,
        y: clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        color: scheme.color,
        size: 5 + Math.random() * 11, // Planet diameter is larger so the features are nicely visible
        alpha: 1,
        decay: 0.008 + Math.random() * 0.012, // slightly longer lifespan for gorgeous visual trail
        gravity: 0.08, // floaty celestial path
        shrinkRate: 0.985 + Math.random() * 0.01,
        planetType: scheme.planetType,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.06,
        shadowColor: scheme.shadowColor,
        glowColor: scheme.glowColor
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0 || p.size <= 0.8) continue;

        activeParticles++;

        // Orbit/Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98; // gentle cosmic drag
        p.alpha -= p.decay;
        p.size *= p.shrinkRate;
        p.rotation += p.rotationSpeed;

        // Render Planet Style
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        
        // Dynamic Halo Atmospheric Glow
        ctx.shadowBlur = p.size * 1.5;
        ctx.shadowColor = p.glowColor;
        
        // 3D Spherical Radial Highlight/Shadow Gradient
        const gradient = ctx.createRadialGradient(
          p.x - p.size * 0.25, 
          p.y - p.size * 0.25, 
          p.size * 0.05, 
          p.x, 
          p.y, 
          p.size
        );
        gradient.addColorStop(0, "#ffffff"); // Atmosphere high-reflection
        gradient.addColorStop(0.3, p.color); // Native planet color
        gradient.addColorStop(1, p.shadowColor); // Dark shadowed hemisphere
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Turn off shadowBlur on details for sharper features
        ctx.shadowBlur = 0;

        if (p.planetType === "ring") {
          // Ringed gas giant (e.g., Saturn)
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          
          // Render rings
          ctx.strokeStyle = p.glowColor;
          ctx.lineWidth = Math.max(1, p.size * 0.16);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Inner ring highlight
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = Math.max(0.6, p.size * 0.05);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.28, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } 
        else if (p.planetType === "crater") {
          // Lunar craters
          ctx.fillStyle = p.shadowColor;
          ctx.globalAlpha = Math.max(0, p.alpha * 0.45);
          
          ctx.beginPath();
          ctx.arc(p.x + p.size * 0.25, p.y + p.size * 0.1, p.size * 0.22, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.35, p.y - p.size * 0.2, p.size * 0.18, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x + p.size * 0.1, p.y - p.size * 0.4, p.size * 0.14, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (p.planetType === "stripe") {
          // Striped atmospheric gas bands (e.g., Jupiter / Neptune)
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.clip(); // Mask within planet
          
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          
          ctx.fillStyle = p.glowColor;
          ctx.globalAlpha = Math.max(0, p.alpha * 0.65);
          ctx.fillRect(-p.size * 2, -p.size * 0.3, p.size * 4, p.size * 0.18);
          ctx.fillRect(-p.size * 2, p.size * 0.12, p.size * 4, p.size * 0.22);
          ctx.fillRect(-p.size * 2, -p.size * 0.7, p.size * 4, p.size * 0.08);
          ctx.restore();
        } 
        else if (p.planetType === "star") {
          // Oceanic continent patterns
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.clip(); // Mask within planet
          
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          
          ctx.fillStyle = p.glowColor;
          ctx.globalAlpha = Math.max(0, p.alpha * 0.7);
          
          ctx.beginPath();
          ctx.arc(-p.size * 0.3, -p.size * 0.2, p.size * 0.5, 0, Math.PI * 2);
          ctx.arc(p.size * 0.35, p.size * 0.25, p.size * 0.4, 0, Math.PI * 2);
          ctx.arc(-p.size * 0.1, p.size * 0.45, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.restore();
      }

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();
  }, []);

  const handleReturnToCourse = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX || (rect.left + rect.width / 2);
    const clickY = e.clientY || (rect.top + rect.height / 2);

    triggerRocketSparks(clickX, clickY);

    setTimeout(() => {
      setSelectedNews(null);
    }, 220); 
  }, [triggerRocketSparks]);

  const fetchNewsData = useCallback(async () => {
    setLoading(true);
    try {
      let newData: NewsItem[] = [];
      try {
        const res = await fetch("/api/news", { cache: 'no-store' });
        if (res.ok) {
          newData = await res.json();
        } else {
          throw new Error("Local API status not OK");
        }
      } catch (apiError) {
        console.warn("Local API fetch failed, falling back to direct GAS fetch:", apiError);
        const GAS_URL = "https://script.google.com/macros/s/AKfycbxAi0tV_o-yOuCrz-vdtROzV7sDrE80j_elWV03z_TpyWIxQQlGG-HgoI6Wh7vnS3fUew/exec?type=json";
        const gasRes = await fetch(GAS_URL);
        if (gasRes.ok) {
          const rawData = await gasRes.json();
          newData = rawData.map((item: any) => ({
            title: item.title,
            pubDate: item.time,
            link: item.link,
            content: item.summary,
            summary: item.summary,
            source: item.source,
            category: item.category,
            imageUrl: item.imageUrl
          }));
        } else {
          throw new Error("Direct GAS fetch failed as well");
        }
      }
      
      setNews(prevNews => {
        // Merge logic: keep all unique news items
        const combined = [...newData];
        const newLinks = new Set(newData.map(n => n.link));
        
        prevNews.forEach(oldItem => {
          if (!newLinks.has(oldItem.link)) {
            combined.push(oldItem);
          }
        });

        // Filter out items older than 48 hours to keep the state manageable
        // (We still use 24h for display, but keep a bit more in state just in case)
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const cleaned = combined.filter(item => {
          const dateVal = item.pubDate || (item as any).time;
          if (!dateVal) return false;
          const pubDate = new Date(dateVal);
          return !isNaN(pubDate.getTime()) && pubDate >= fortyEightHoursAgo;
        });

        // Persist to localStorage
        try {
          localStorage.setItem('star_news_cache', JSON.stringify(cleaned));
        } catch (e) {
          console.error("Failed to persist news:", e);
        }

        return cleaned;
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load from cache on mount
    const cached = localStorage.getItem('star_news_cache');
    if (cached) {
      try {
        setNews(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to parse cached news:", e);
      }
    }
    
    fetchNewsData();

    // Polling every 5 minutes
    const interval = setInterval(fetchNewsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNewsData]);

  useEffect(() => {
    if (news.length > 0) {
      const uniqueCats = Array.from(new Set(news.map(n => n.category)));
      console.log("Available categories in data:", uniqueCats);
    }
  }, [news]);

  // Restore scroll position is now handled at the feed list render block using <ScrollRestorer />
  // to avoid race conditions with <AnimatePresence mode="wait"> exit animations.

  // Reset scroll reference coordinate and scroll to top when switching categories or on search query update
  useEffect(() => {
    scrollPositionRef.current = 0;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [selectedCategory, searchQuery]);

  const filteredNews = useMemo(() => {
    const normalize = (s: any) => (String(s || "")).replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim();

    const searchPool = searchQuery.trim() 
      ? news.filter(n => n && (
          (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
          (n.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          normalize(n.category || "").toLowerCase().includes(searchQuery.toLowerCase())
        ))
      : news;

    if (searchQuery.trim()) {
      return searchPool
        .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
        .slice(0, 100);
    }

    if (selectedCategory === "全部") {
      const categories = CATEGORIES.filter(c => c !== "全部");
      const balanced: NewsItem[] = [];
      
      categories.forEach(cat => {
        const normalizedCat = normalize(cat);
        const catItems = searchPool.filter(n => normalize(n.category) === normalizedCat);
        balanced.push(...catItems.slice(0, 3));
      });
      
      if (balanced.length < 31) {
        const existingLinks = new Set(balanced.map(n => n.link));
        const backfill = searchPool
          .filter(n => !existingLinks.has(n.link))
          .slice(0, 31 - balanced.length);
        balanced.push(...backfill);
      }
      
      return balanced
        .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
        .slice(0, 31);
    }
    
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const normalizedSelected = normalize(selectedCategory);
    
    // Check if there is any news in this category at all, and if there is any recent news
    const hasAnyInCat = searchPool.some(n => normalize(n.category) === normalizedSelected);
    const hasRecentInCat = searchPool.some(n => {
      if (normalize(n.category) !== normalizedSelected) return false;
      const d = new Date(n.pubDate || (n as any).time || 0);
      return !isNaN(d.getTime()) && d >= twentyFourHoursAgo;
    });

    // For category pages: 24-hour filter, newest first (relaxed if no recent items exist)
    const categoryItems = searchPool.filter((item) => {
      const isCorrectCategory = normalize(item.category) === normalizedSelected;
      const dateVal = item.pubDate || (item as any).time;
      if (!dateVal) return false;
      const pubDate = new Date(dateVal);
      if (isNaN(pubDate.getTime())) return false;
      
      // If there's a search query OR no recent items exist in this category, relax the 24-hour filter
      const isWithinTimeRange = (searchQuery.trim() || !hasRecentInCat) ? true : pubDate >= twentyFourHoursAgo;
      
      return isCorrectCategory && isWithinTimeRange;
    });


    return categoryItems
      .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
      .slice(0, 100);
  }, [news, selectedCategory, searchQuery]);

  useEffect(() => {
    // Hero title is now handled by the initial fetch translation
    setHeroTranslatedTitle(null);
  }, [filteredNews]);

  const fetchNews = async () => {
    // This is now handled by the useEffect above, keeping it for compatibility if needed
  };

  const handleOpenNews = (item: NewsItem) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedNews(item);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00f2ff] selection:text-black pb-24 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between relative">
          <div className={`flex items-center gap-12 transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
            <h1 
              className="text-xl lg:text-2xl font-black tracking-tighter text-[#00f2ff] cursor-pointer" 
              onClick={() => {
                setSelectedCategory(CATEGORIES[0]);
                setSelectedNews(null);
                setSearchQuery("");
                setIsMobileSearchOpen(false);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              夯星文
            </h1>
            
            <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold tracking-wider text-white/60 uppercase">
              {CATEGORIES.filter(cat => cat !== "全部").map(cat => (
                <a 
                  key={cat} 
                  href="#" 
                  className={`hover:text-[#00f2ff] transition-colors ${selectedCategory === cat ? 'text-[#00f2ff]' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory(cat);
                    setSelectedNews(null);
                  }}
                >
                  {cat}
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile Search Overlay Input */}
          <div className={`absolute inset-x-4 lg:hidden transition-all duration-300 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 h-10 ${isMobileSearchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <Search className="w-4 h-4 text-[#00f2ff] mr-2" />
            <input 
              type="text" 
              placeholder="探索銀河動態..." 
              value={searchQuery}
              autoFocus={isMobileSearchOpen}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20"
            />
            <button 
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="ml-2 text-white/40 font-bold"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all ${isMobileSearchOpen ? 'text-[#00f2ff] bg-white/10' : 'text-white/30 hover:text-white'}`}
            >
              <Search className="w-5 h-5" />
            </button>
            {lastUpdated && (
              <div className="hidden xl:block text-[10px] font-bold text-white/20 uppercase tracking-widest">
                銀河標準時間: {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')} {lastUpdated.split(/[:\s]/).slice(0, 2).join(':')}
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00f2ff] hover:text-black transition-all"
              onClick={() => {
                fetchNewsData();
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              disabled={loading}
            >
              <Clock className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-64 focus-within:border-[#00f2ff]/50 transition-colors group">
              <Search className="w-4 h-4 text-white/40 mr-2 group-focus-within:text-[#00f2ff] transition-colors" />
              <input 
                type="text" 
                placeholder="探索銀河動態..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full placeholder:text-white/20 text-white"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-white/20 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
            <a 
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedNews?.title || "夯星文")}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f2ff] to-blue-600 p-0.5 cursor-pointer hover:scale-110 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                <Globe className="w-4 h-4 text-[#00f2ff]" />
              </div>
            </a>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!selectedNews ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ScrollRestorer scrollRef={scrollPositionRef} />
            {/* Breaking News Ticker */}
            <div className="bg-[#00f2ff]/10 border-y border-[#00f2ff]/20 py-3 overflow-hidden whitespace-nowrap">
              <div className="animate-marquee flex items-center gap-12">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Badge className="bg-[#00f2ff] text-black font-black text-[9px] px-2 py-0.5 rounded-sm">宇宙快報</Badge>
                    <span className="text-[11px] font-bold tracking-widest text-white/80 uppercase">
                      {news[i % news.length]?.title || "正在連結銀河數據庫..."}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]/40" />
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Section */}
            {!loading && filteredNews.length > 0 && (
              <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                  <img 
                    src={filteredNews[0].imageUrl || CATEGORY_FALLBACK_IMAGES[filteredNews[0].category] || CATEGORY_FALLBACK_IMAGES["全部"]} 
                    alt={filteredNews[0].title}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 to-transparent" />
                </div>
                
                <div className="container mx-auto px-4 relative z-10 pt-10 md:pt-0">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <Badge className="bg-white/10 text-[#00f2ff] border-none rounded-sm px-2 py-0.5 text-[9px] md:text-[10px] font-bold tracking-widest uppercase">
                        {CATEGORY_EMOJIS[filteredNews[0].category] || "🌌"} {filteredNews[0].category.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim()}
                      </Badge>
                      <div className="h-[1px] w-8 md:w-12 bg-white/20" />
                    </div>
                    <h2 className={`font-black tracking-tight leading-[1.1] md:leading-[0.95] mb-4 md:mb-6 text-white text-3xl line-clamp-3 ${
                      (filteredNews[0].title || "").length > 40 
                        ? "md:text-4xl lg:text-5xl" 
                        : (filteredNews[0].title || "").length > 25 
                          ? "md:text-5xl lg:text-6xl"
                          : "md:text-7xl lg:text-8xl"
                    }`}>
                      {filteredNews[0].title}
                    </h2>
                    <p className="text-white/60 text-sm md:text-xl max-w-2xl mb-6 md:mb-8 leading-relaxed line-clamp-2 md:line-clamp-3">
                      {filteredNews[0].summary || filteredNews[0].content}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="bg-[#00f2ff] hover:bg-[#00d8e6] text-black font-black px-8 md:px-10 py-5 md:py-7 rounded-lg text-base md:text-lg transition-all active:scale-95"
                        onClick={() => handleOpenNews(filteredNews[0])}
                      >
                        立即探索
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-8 md:px-10 py-5 md:py-7 rounded-lg text-base md:text-lg group"
                        onClick={() => handleOpenNews(filteredNews[0])}
                      >
                        閱讀專題 <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-20">
              {loading ? (
                <div className="space-y-20">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 aspect-[16/10] lg:aspect-auto lg:h-[600px] rounded-3xl bg-white/5 animate-pulse" />
                    <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                      <div className="aspect-[16/7] lg:aspect-auto lg:flex-1 rounded-3xl bg-white/5 animate-pulse" />
                      <div className="aspect-[16/7] lg:aspect-auto lg:flex-1 rounded-3xl bg-white/5 animate-pulse" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-6 md:gap-8">
                <h3 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-4 whitespace-nowrap flex-shrink-0 min-w-fit">
                  {selectedCategory === "全部" ? "精選焦點" : selectedCategory}
                  <div className="h-1.5 w-16 bg-[#00f2ff] rounded-full hidden lg:block" />
                </h3>
                
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                  <div className="relative">
                    <div className="overflow-x-auto overflow-y-hidden no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                      <TabsList className="bg-white/5 border border-white/5 p-1 h-auto flex flex-nowrap justify-start md:justify-end min-w-max gap-1">
                        {CATEGORIES.filter(cat => cat !== "全部").map(cat => (
                          <TabsTrigger 
                            key={cat} 
                            value={cat}
                            className="data-[state=active]:bg-[#00f2ff] data-[state=active]:text-black text-white/50 data-[state=active]:opacity-100 text-[11px] md:text-sm font-bold uppercase tracking-widest px-5 md:px-8 py-3 rounded-xl whitespace-nowrap transition-all border border-transparent data-[state=active]:border-[#00f2ff]"
                          >
                            {cat}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                  </div>
                </Tabs>
              </div>

              {/* Main Content Area */}
              {filteredNews.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-white/20" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">未找到相關訊息</h4>
                  <p className="text-white/40 text-sm max-w-xs">
                    在星際座標中找不到「{searchQuery}」，請嘗試其他關鍵字或清除搜尋條件。
                  </p>
                  <Button 
                    variant="link" 
                    className="mt-4 text-[#00f2ff]"
                    onClick={() => setSearchQuery("")}
                  >
                    清除所有條件
                  </Button>
                </div>
              ) : (selectedCategory === "全部" && !searchQuery.trim()) ? (
                <>
                  {/* Bento Grid Layout (Homepage Only, Only when not searching) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 md:mb-20">
                    {/* Large Featured Card */}
                    {filteredNews.length > 1 && (
                      <div 
                        className="lg:col-span-8 group relative aspect-[16/10] lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden cursor-pointer"
                        onClick={() => handleOpenNews(filteredNews[1])}
                      >
                        <img 
                          src={filteredNews[1].imageUrl || CATEGORY_FALLBACK_IMAGES[filteredNews[1].category] || CATEGORY_FALLBACK_IMAGES["全部"]} 
                          alt={filteredNews[1].title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-6 left-6">
                          <Badge className="bg-[#00f2ff] text-black font-black text-[10px] px-2 py-0.5 rounded-sm">
                            {CATEGORY_EMOJIS[filteredNews[1].category] || "🌌"} {filteredNews[1].category.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim()}
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 p-6 md:p-10">
                          <h4 className="text-xl md:text-5xl font-black tracking-tight leading-tight mb-4 group-hover:text-[#00f2ff] transition-colors">
                            {filteredNews[1].title}
                          </h4>
                          <div className="flex items-center gap-6 text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> 2 小時前</span>
                            <span className="flex items-center gap-2"><Eye className="w-3 h-3" /> 12.4k 閱讀</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Side Cards */}
                    <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                      {filteredNews.slice(2, 4).map((item, i) => (
                        <div 
                          key={i}
                          className="group relative aspect-[16/7] lg:aspect-auto lg:flex-1 rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10"
                          onClick={() => handleOpenNews(item)}
                        >
                          <img 
                            src={item.imageUrl || CATEGORY_FALLBACK_IMAGES[item.category] || CATEGORY_FALLBACK_IMAGES["全部"]} 
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                            <Badge className="bg-white/10 text-[#00f2ff] text-[9px] font-bold mb-2 border-none">
                              {CATEGORY_EMOJIS[item.category] || "🌌"} {item.category.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim()}
                            </Badge>
                            <h5 className="text-sm md:text-lg font-black leading-tight group-hover:text-[#00f2ff] transition-colors line-clamp-2">
                              {item.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lower Bento Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
                    {/* Icon Card 1 */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:border-blue-500 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8">
                        <Rocket className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h6 className="text-xl font-black mb-4 leading-tight">
                          {filteredNews[4]?.title || "觀看香港BL劇《Sammy的兒童節》的5個理由"}
                        </h6>
                        <p className="text-white/40 text-xs leading-relaxed mb-6 line-clamp-3">
                          {filteredNews[4]?.summary || filteredNews[4]?.content || "《三年的兒童節》以上世紀80年代九龍城寨的陰暗氛圍為背..."}
                        </p>
                        <a href="#" className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2" onClick={(e) => { e.preventDefault(); filteredNews[4] && handleOpenNews(filteredNews[4]); }}>
                          閱讀更多 <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Icon Card 2 */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:border-purple-500 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8">
                        <Bitcoin className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h6 className="text-xl font-black mb-4 leading-tight">
                          {filteredNews[5]?.title || "在《我們的幸福時光》中，康賢京與尹健勳和解對峙"}
                        </h6>
                        <p className="text-white/40 text-xs leading-relaxed mb-6 line-clamp-3">
                          {filteredNews[5]?.summary || filteredNews[5]?.content || "《我們的幸福時光》在即將播出的新一集之前公開了新的劇照..."}
                        </p>
                        <a href="#" className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2" onClick={(e) => { e.preventDefault(); filteredNews[5] && handleOpenNews(filteredNews[5]); }}>
                          閱讀更多 <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Wide Image Card */}
                    <div 
                      className="lg:col-span-2 group relative h-[300px] md:h-auto rounded-3xl overflow-hidden cursor-pointer"
                      onClick={() => filteredNews[6] && handleOpenNews(filteredNews[6])}
                    >
                      <img 
                        src={filteredNews[6]?.imageUrl || CATEGORY_FALLBACK_IMAGES[filteredNews[6]?.category] || CATEGORY_FALLBACK_IMAGES["全部"]} 
                        alt="wide"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex flex-col justify-center p-10">
                        <Badge className="bg-[#00f2ff] text-black font-black text-[9px] w-fit mb-4">
                          {CATEGORY_EMOJIS[filteredNews[6]?.category] || "🎬"} {(filteredNews[6]?.category || "影視大亨").replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim()}
                        </Badge>
                        <h6 className="text-2xl font-black leading-tight max-w-md group-hover:text-[#00f2ff] transition-colors">
                          {filteredNews[6]?.title || "在《幻影律師》中，柳演錫幫助李絮與已故的姊姊重聚。"}
                        </h6>
                      </div>
                    </div>
                  </div>

                  {/* Additional Cards (Homepage backfill) */}
                  {filteredNews.length > 7 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                      {filteredNews.slice(7, 31).map((item, i) => (
                        <div 
                          key={i}
                          className="group relative rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 flex flex-col"
                          onClick={() => handleOpenNews(item)}
                        >
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={item.imageUrl || CATEGORY_FALLBACK_IMAGES[item.category] || CATEGORY_FALLBACK_IMAGES["全部"]} 
                              alt="extra"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-6">
                            <Badge className="bg-white/10 text-[#00f2ff] text-[8px] font-bold mb-2 border-none">
                              {CATEGORY_EMOJIS[item.category] || "🌌"} {item.category.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim()}
                            </Badge>
                            <h5 className="text-sm font-black leading-tight group-hover:text-[#00f2ff] transition-colors line-clamp-2">
                              {item.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Category Page Layout (Simple Grid for up to 100 items) */
                <>
                  {/* Category list duplicate control & item count */}
                  <div className="flex flex-row items-center justify-between gap-2 pb-4 mb-8 border-b border-white/5">
                    <span className="text-[10px] md:text-xs font-bold text-white/40 tracking-widest uppercase flex items-center gap-2">
                      🌌 各分區情報 (共 {filteredNews.length} 則)
                    </span>
                    <button
                      onClick={() => setIsNewestFirst(prev => !prev)}
                      className={`text-[9px] md:text-[11px] font-black tracking-widest uppercase px-3.5 py-2 rounded-xl border transition-all flex items-center gap-2 cursor-pointer duration-300 ${
                        isNewestFirst 
                          ? 'border-[#00f2ff]/30 text-[#00f2ff] bg-[#00f2ff]/5 hover:bg-[#00f2ff]/10' 
                          : 'border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isNewestFirst ? 'bg-[#00f2ff] animate-pulse' : 'bg-purple-400'}`} />
                      {isNewestFirst ? '最新到最舊夯星文排序' : '最舊到最新夯星文排序'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {(() => {
                      const displayItems = isNewestFirst 
                        ? filteredNews.slice(1, 101) 
                        : [...filteredNews].reverse().slice(0, 100);
                      return displayItems.map((item, i) => (
                        <div 
                          key={i}
                          className="group relative rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 flex flex-col"
                          onClick={() => handleOpenNews(item)}
                        >
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={item.imageUrl || CATEGORY_FALLBACK_IMAGES[item.category] || CATEGORY_FALLBACK_IMAGES["全部"]} 
                              alt="category-news"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-6">
                            <Badge className="bg-white/10 text-[#00f2ff] text-[8px] font-bold mb-2 border-none">
                              {CATEGORY_EMOJIS[item.category] || "🌌"} {item.category.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim()}
                            </Badge>
                            <h5 className="text-sm font-black leading-tight group-hover:text-[#00f2ff] transition-colors line-clamp-2">
                              {item.title}
                            </h5>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </>
              )}
            </>
          )}

          {/* Newsletter Section */}
              <section className="bg-white/5 border border-white/10 rounded-2xl md:rounded-[40px] p-8 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-xl text-center md:text-left">
                  <h4 className="text-2xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                    掌握星際第一手消息
                  </h4>
                  <p className="text-white/40 text-base md:text-lg">
                    加入全球探索者，接收來自「夯星文」的宇宙快報。
                  </p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="輸入您的電子信箱" 
                    className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 w-full sm:w-80 outline-none focus:border-[#00f2ff] transition-colors text-sm"
                  />
                  <Button className="bg-[#00f2ff] hover:bg-[#00d8e6] text-black font-black px-10 py-4 h-14 rounded-xl">
                    立即啟航
                  </Button>
                </div>
              </section>
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pb-20"
          >
            {/* Article Header */}
            <div className="container mx-auto px-4 pt-4 md:pt-12 pb-12 md:pb-20">
              <div className="max-w-5xl mx-auto">
                      <button 
                        onClick={handleReturnToCourse}
                        className="lg:hidden flex items-center gap-2 text-[#00f2ff] font-bold text-sm mb-10 h-10 px-2 uppercase tracking-widest active:scale-95"
                      >
                        <ArrowRight className="w-5 h-5 rotate-180" /> 返回銀河樞紐
                      </button>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
                  <Badge className="w-fit bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 rounded-sm px-3 py-1 text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                    趨勢報告
                  </Badge>
                  <span className="text-white/20 text-[9px] md:text-[10px] font-bold tracking-widest uppercase">
                    {new Date().toLocaleDateString('zh-TW', { 
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit' 
                    }).replace(/\//g, '.')} {new Date().toLocaleTimeString('zh-TW', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })} — 銀河標準時間
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-8xl font-black tracking-tight leading-[1.1] md:leading-[1] mb-8 md:mb-12 bg-gradient-to-r from-white via-[#00f2ff] to-blue-500 bg-clip-text text-transparent">
                  {selectedNews.title}
                </h2>

                <div className="aspect-video rounded-2xl md:rounded-[40px] overflow-hidden mb-12 md:mb-20 border border-white/10 shadow-2xl shadow-[#00f2ff]/5">
                  <img 
                    src={selectedNews.imageUrl || `https://picsum.photos/seed/article/1200/800`} 
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">
                  {/* Sidebar */}
                  <div className="lg:col-span-3 space-y-12">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00f2ff] to-blue-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-2xl">
                          {CATEGORY_EMOJIS[selectedNews.category] || "🌌"}
                        </div>
                      </div>
                      <div>
                        <div className="font-black text-white">
                          {selectedNews.category.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim()}
                        </div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{selectedNews.source}</div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">星文熱度</div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-1.5 flex-grow bg-white/5 rounded-full overflow-hidden mr-4">
                            <div className="h-full bg-[#00f2ff] w-[84%]" />
                          </div>
                          <span className="text-xs font-black text-[#00f2ff]">84%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">宇宙排行</div>
                        <div className="flex items-end gap-1 h-12">
                          <div className="w-4 bg-white/5 h-2 rounded-t-sm" />
                          <div className="w-4 bg-white/5 h-4 rounded-t-sm" />
                          <div className="w-4 bg-white/5 h-3 rounded-t-sm" />
                          <motion.div 
                            animate={{ height: 32 + rankingBoost }}
                            className="w-4 bg-[#00f2ff] rounded-t-sm shadow-[0_0_15px_rgba(0,242,255,0.5)]" 
                          />
                          <span className="ml-2 text-[10px] font-black text-[#00f2ff]">+{12.4 + (rankingBoost/2)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">分享脈動</div>
                      <div className="flex gap-4">
                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00f2ff] hover:text-black transition-all">
                          <Share2 className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00f2ff] hover:text-black transition-all">
                          <Bookmark className="w-5 h-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00f2ff] hover:text-black transition-all"
                          onClick={() => setRankingBoost(prev => prev + 8)}
                        >
                          <TrendingUp className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-9">
                    <div className="prose prose-invert max-w-none">
                      {selectedNews.summary && (
                        <div className="bg-[#00f2ff]/5 border-l-4 border-[#00f2ff] p-8 mb-12 rounded-r-2xl">
                          <h4 className="text-[#00f2ff] font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            新聞摘要 <Globe className="w-3 h-3" />
                          </h4>
                          <p className="text-xl font-bold leading-relaxed text-white/90 italic">
                            {selectedNews.summary}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 md:mt-20 flex flex-col items-center gap-4 w-full">
                      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a 
                          href={selectedNews.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none bg-[#00f2ff] hover:bg-[#00d8e6] text-black font-black px-8 md:px-12 py-5 md:py-6 rounded-xl text-base md:text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                        >
                          直接開啟原文 <ExternalLink className="ml-3 w-4 h-4 md:w-5 md:h-5" />
                        </a>
                        <a 
                          href={`https://translate.google.com/translate?sl=auto&tl=zh-TW&u=${encodeURIComponent(selectedNews.link)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 text-white/80 font-bold px-8 md:px-12 py-5 md:py-6 rounded-xl text-base md:text-lg border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                          Google 中文化 <Globe className="ml-3 w-4 h-4 md:w-5 md:h-5" />
                        </a>
                      </div>
                      <button 
                        onClick={handleReturnToCourse}
                        className="text-white/40 hover:text-[#00f2ff] font-extrabold text-base md:text-lg py-5 px-10 tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 touch-manipulation select-none"
                      >
                        <Rocket className="w-5 h-5 text-[#00f2ff] animate-pulse" /> [ 返回航道 ]
                      </button>
                    </div>
                    <p className="text-center mt-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      本文由 AI 輔助編撰及美化設計
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Explore More */}
            <section className="container mx-auto px-4 py-20 border-t border-white/5">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-3xl font-black tracking-tight mb-2">探索更多星際脈動</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">繼續您的宇宙探索之旅</p>
                </div>
                <a 
                  href="#" 
                  className="text-[11px] font-bold text-[#00f2ff] hover:underline transition-all flex items-center gap-2 uppercase tracking-widest"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory(selectedNews.category);
                    setSelectedNews(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  更多星聞 <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
                {/* Large Bottom Card */}
                <div 
                  className="lg:col-span-8 group relative aspect-video lg:aspect-auto rounded-3xl overflow-hidden cursor-pointer"
                  onClick={() => news[5] && handleOpenNews(news[5])}
                >
                  <img 
                    src={news[5]?.imageUrl || `https://picsum.photos/seed/bottom/1200/800`} 
                    alt="bottom"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10">
                    <Badge className="bg-[#00f2ff] text-black font-black text-[9px] mb-4">流量密碼</Badge>
                    <h4 className="text-3xl font-black leading-tight mb-6 group-hover:text-[#00f2ff] transition-colors">
                      晶鑽之城：揭秘拉尼亞凱亞最大的貿易港
                    </h4>
                    <a href="#" className="text-[10px] font-black text-[#00f2ff] uppercase tracking-widest flex items-center gap-2">
                      閱讀詳情 <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Small Bottom Cards */}
                <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6">
                  {news.slice(6, 8).map((item, i) => (
                    <div 
                      key={i}
                      className="group relative rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 flex flex-col"
                      onClick={() => handleOpenNews(item)}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.imageUrl || `https://picsum.photos/seed/small-bottom-${i}/400/300`} 
                          alt="small"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <Badge className="bg-white/10 text-[#00f2ff] text-[8px] font-bold mb-2 border-none">
                          {CATEGORY_EMOJIS[item.category] || "🌌"} {item.category}
                        </Badge>
                        <h5 className="text-sm font-black leading-tight group-hover:text-[#00f2ff] transition-colors line-clamp-2">
                          {item.title}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-[#00f2ff] mb-4">
                夯星文 銀河觀察者
              </h2>
              <p className="text-white/20 text-xs max-w-sm leading-relaxed font-medium">
                探索、洞察、超越。在訊息的銀河中，我們為您指引光芒。
              </p>
            </div>
            <div className="flex flex-wrap gap-12">
              <div className="space-y-4">
                <div className="text-[10px] font-black text-white uppercase tracking-widest">導航</div>
                <ul className="space-y-2 text-[11px] font-bold text-white/40">
                  <li><a href="#" className="hover:text-[#00f2ff] transition-colors">關於我們</a></li>
                  <li><a href="#" className="hover:text-[#00f2ff] transition-colors">服務條款</a></li>
                  <li><a href="#" className="hover:text-[#00f2ff] transition-colors">隱私政策</a></li>
                  <li><a href="#" className="hover:text-[#00f2ff] transition-colors">廣告洽詢</a></li>
                </ul>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00f2ff] hover:text-black transition-all cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00f2ff] hover:text-black transition-all cursor-pointer">
                  <AtSign className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <p>© 2026 夯星文 銀河觀察者。保留所有權利。</p>
            <p>自量子時代以來的宇宙視角。</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden bg-[#050505]/95 backdrop-blur-2xl border-t border-white/5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 8px)' }}>
        <div className="relative w-full">
          {/* Scrolling Container */}
          <div className="flex items-center justify-start gap-4 overflow-x-auto no-scrollbar px-6 py-4 scroll-smooth">
            {CATEGORIES.filter(cat => cat !== "全部").map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedNews(null);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className={`flex flex-col items-center gap-1.5 flex-shrink-0 p-2 transition-all ${
                  selectedCategory === cat ? 'text-[#00f2ff] scale-105' : 'text-white/40'
                }`}
              >
                <div className={`text-xl transition-all duration-300 ${selectedCategory === cat ? 'drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]' : ''}`}>
                  {cat === "全部" ? "🏠" : (CATEGORY_EMOJIS[cat] || "🌌")}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tight whitespace-nowrap`}>
                  {cat.replace(/^[^\s]+\s/, '')}
                </span>
                {selectedCategory === cat && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="w-1 h-1 rounded-full bg-[#00f2ff]"
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Right Fade for scrolling hint */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
        </div>
      </nav>

      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[100]" 
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
