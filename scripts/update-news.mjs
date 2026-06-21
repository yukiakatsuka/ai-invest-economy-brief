import { mkdir, readFile, writeFile } from "node:fs/promises";

const feeds = [
  {
    category: "ai",
    source: "Google News",
    url: "https://news.google.com/rss/search?q=AI%20OR%20%E7%94%9F%E6%88%90AI%20OR%20%E4%BA%BA%E5%B7%A5%E7%9F%A5%E8%83%BD&hl=ja&gl=JP&ceid=JP:ja"
  },
  {
    category: "ai",
    source: "Yahoo!ニュース",
    url: "https://news.yahoo.co.jp/rss/topics/it.xml"
  },
  {
    category: "invest",
    source: "Google News",
    url: "https://news.google.com/rss/search?q=%E6%8A%95%E8%B3%87%20OR%20%E6%A0%AA%E4%BE%A1%20OR%20%E6%97%A5%E6%9C%AC%E6%A0%AA%20OR%20%E7%B1%B3%E5%9B%BD%E6%A0%AA&hl=ja&gl=JP&ceid=JP:ja"
  },
  {
    category: "invest",
    source: "Yahoo!ニュース",
    url: "https://news.yahoo.co.jp/rss/topics/business.xml"
  },
  {
    category: "economy",
    source: "Google News",
    url: "https://news.google.com/rss/search?q=%E7%B5%8C%E6%B8%88%20OR%20%E9%87%91%E5%88%A9%20OR%20%E7%82%BA%E6%9B%BF%20OR%20%E7%89%A9%E4%BE%A1&hl=ja&gl=JP&ceid=JP:ja"
  },
  {
    category: "economy",
    source: "NHK",
    url: "https://www3.nhk.or.jp/rss/news/cat0.xml"
  }
];

const maxItemsPerCategory = 12;

function decodeEntities(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function tagValue(item, tag) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function cleanTitle(title) {
  return title.replace(/\s+-\s+[^-]+$/u, "").trim();
}

function extractItems(xml, feed) {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)]
    .map(([item]) => {
      const title = cleanTitle(tagValue(item, "title"));
      const link = tagValue(item, "link");
      const publishedAt = tagValue(item, "pubDate");
      return {
        title,
        url: link,
        category: feed.category,
        source: feed.source,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null
      };
    })
    .filter((item) => item.title && item.url)
    .slice(0, maxItemsPerCategory);
}

async function fetchFeed(feed) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(feed.url, {
        headers: {
          "user-agent": "ai-invest-economy-brief/1.0"
        }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const items = extractItems(await response.text(), feed);
      if (!items.length) throw new Error("0 items");
      console.log(`${feed.category} ${feed.source}: ${items.length} items`);
      return items;
    } catch (error) {
      console.warn(`${feed.category} ${feed.source} attempt ${attempt} failed: ${error.message}`);
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  return [];
}

const settled = await Promise.allSettled(feeds.map(fetchFeed));
const items = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
const seen = new Set();
const uniqueItems = items.filter((item) => {
  const key = `${item.title}:${item.url}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

let output = {
  updatedAt: new Date().toISOString(),
  policy: "free-rss-title-url-only",
  fetchStatus: "success",
  items: uniqueItems
};

if (!uniqueItems.length) {
  console.warn("No news items were fetched. Keeping the previous data/news.json.");
  output = JSON.parse(await readFile("data/news.json", "utf8"));
  output.fetchStatus = "fallback";
}

await mkdir("data", { recursive: true });
await writeFile("data/news.json", `${JSON.stringify(output, null, 2)}\n`, "utf8");

console.log(`Wrote ${output.items.length} news items. status=${output.fetchStatus}`);
