const NEWS_URL = "./data/news.json";
const FILTER_KEY = "brief-news-filter-v1";

const labels = {
  all: "すべて",
  ai: "AI",
  invest: "投資",
  economy: "経済"
};

const fallbackNews = {
  updatedAt: new Date().toISOString(),
  items: [
    {
      title: "ニュース取得前です。しばらくしてから更新してください。",
      url: "https://news.google.com/",
      category: "all",
      source: "Google News"
    }
  ]
};

let state = {
  filter: localStorage.getItem(FILTER_KEY) || "all",
  news: fallbackNews,
  loading: true,
  error: ""
};

function formatUpdated(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "未更新";
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function filteredItems() {
  const items = state.news.items || [];
  return items.filter((item) => state.filter === "all" || item.category === state.filter);
}

async function loadNews() {
  state.loading = true;
  state.error = "";
  render();

  try {
    const response = await fetch(`${NEWS_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.news = await response.json();
  } catch {
    state.news = fallbackNews;
    state.error = "ニュースを取得できませんでした。";
  } finally {
    state.loading = false;
    render();
  }
}

function renderFilters() {
  return `
    <nav class="filters" aria-label="カテゴリ">
      ${Object.entries(labels)
        .map(
          ([key, label]) => `
            <button class="${state.filter === key ? "selected" : ""}" data-filter="${key}">
              ${label}
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}

function renderList() {
  if (state.loading) {
    return `<div class="message">読み込み中です。</div>`;
  }

  const items = filteredItems();
  if (!items.length) {
    return `<div class="message">このカテゴリのニュースはありません。</div>`;
  }

  return `
    <ol class="news-list">
      ${items
        .map(
          (item) => `
            <li>
              <a href="${item.url}" rel="noopener noreferrer">
                <span class="category ${item.category}">${labels[item.category] || item.category}</span>
                <strong>${item.title}</strong>
              </a>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

function render() {
  document.querySelector("#app").innerHTML = `
    <header class="top-bar">
      <div>
        <h1>Daily Brief</h1>
        <p>AI・投資・経済ニュース</p>
      </div>
      <button class="refresh-button" data-refresh aria-label="更新">更新</button>
    </header>
    <section class="summary">
      <span>最終取得</span>
      <strong>${formatUpdated(state.news.updatedAt)}</strong>
      <small>${state.news.items?.length || 0}件</small>
    </section>
    ${renderFilters()}
    ${state.error ? `<p class="error">${state.error}</p>` : ""}
    ${renderList()}
  `;
}

document.addEventListener("click", (event) => {
  const filter = event.target.closest("[data-filter]");
  const refresh = event.target.closest("[data-refresh]");

  if (filter) {
    state.filter = filter.dataset.filter;
    localStorage.setItem(FILTER_KEY, state.filter);
    render();
  }

  if (refresh) {
    loadNews();
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

loadNews();
