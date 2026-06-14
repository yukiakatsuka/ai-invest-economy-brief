const STORAGE_KEY = "brief-curator-feedback-v1";

const categories = { all: "すべて", ai: "AI", invest: "投資", economy: "経済" };

const articles = [
  ["openai-agent", "ai", "The Information", "42分前", "OpenAI、企業向けエージェント機能を拡張", "定型業務の自動実行、社内検索、会議メモ連携を強化。生成AIの業務実装が進む流れ。", "OpenAIは企業向けに、定期タスクの実行、ナレッジ検索、ワークフロー連携をまとめた新機能を展開。問い合わせ対応や分析レポート作成に組み込めるようになります。", "あなたが「AIエージェント」と「業務自動化」に強い関心を示しました", 94, ["AIエージェント", "SaaS", "業務効率"]],
  ["nvidia-chip", "ai", "Bloomberg", "1時間前", "NVIDIA、次世代AIチップ供給計画を前倒し", "データセンター需要が継続。クラウド各社の投資計画にも波及する見通し。", "生成AIの推論需要が増え、主要クラウド事業者はGPU調達を継続。半導体サプライチェーンと設備投資の見通しが注目されています。", "あなたが「半導体」と「AIインフラ」に反応しました", 91, ["半導体", "GPU", "クラウド"]],
  ["boj-yen", "economy", "Reuters", "2時間前", "日銀、国債買入れ減額ペースを維持する公算", "為替と長期金利への影響を見極め。市場は次回会合の発言を注視。", "日銀は金融政策の正常化を急がず、物価と賃金のデータを確認しながら調整する姿勢。円相場と銀行株への影響が論点です。", "あなたが「金融政策」と「為替」に関心を示しました", 88, ["日銀", "金利", "為替"]],
  ["us-cpi", "economy", "CNBC", "3時間前", "米CPI、サービス価格の粘着性が続く", "利下げ期待はやや後退。米国株のバリュエーションに重しとなる可能性。", "住居費とサービス価格が高止まり。市場はFRBの年内利下げ回数を再評価しています。", "あなたが「インフレ指標」と「米国株」に関心を示しました", 86, ["CPI", "FRB", "米国株"]],
  ["softbank-arm", "invest", "日本経済新聞", "4時間前", "ソフトバンクG、Arm関連投資の比率を高める", "AI端末と省電力チップ需要を見込み、半導体関連の投資テーマを強化。", "AI端末、サーバー、エッジ処理の需要を背景に、Armエコシステムへの期待が高まっています。", "あなたが「AI関連株」と「日本株」に反応しました", 84, ["日本株", "半導体", "AI端末"]],
  ["toyota-ev", "invest", "東洋経済オンライン", "5時間前", "トヨタ、EV戦略を見直しハイブリッドに注力", "需要鈍化を受けて販売計画を調整。収益性重視の姿勢が鮮明に。", "EV販売の伸びが鈍る中、ハイブリッド車の利益率が見直されています。部品メーカーや電池投資にも影響が広がりそうです。", "あなたが「自動車」と「利益率」に関心を示しました", 79, ["自動車", "日本株", "EV"]],
  ["anthropic-tools", "ai", "TechCrunch", "6時間前", "Anthropic、開発者向けコード支援機能を更新", "リポジトリ理解とレビュー補助を強化。開発現場のAI活用がさらに進む。", "コード検索、依存関係理解、変更提案の精度が改善。AIコーディングツールの競争は機能統合の段階に入りつつあります。", "あなたが「AI開発ツール」に保存操作をしました", 77, ["開発ツール", "LLM", "生産性"]],
  ["japan-wage", "economy", "NHK", "7時間前", "実質賃金、マイナス幅が縮小", "消費回復の兆しを示す一方、食品価格の上昇が家計を圧迫。", "春闘の賃上げ効果が徐々に反映され、消費関連株への見方にも影響。個人消費の回復力が焦点です。", "あなたが「日本経済」と「消費」に関心を示しました", 74, ["賃金", "消費", "日本経済"]],
  ["apple-ai", "ai", "The Verge", "8時間前", "Apple、オンデバイスAI機能の対応地域を拡大", "プライバシー重視のAI体験を前面に。端末買い替え需要への期待も。", "端末内処理とクラウド連携を組み合わせた機能群が拡大。スマートフォン市場と半導体需要に波及する可能性があります。", "あなたが「消費者向けAI」に関心を示しました", 72, ["Apple", "端末AI", "スマホ"]],
  ["oil-demand", "invest", "Financial Times", "9時間前", "原油需要見通し、夏場にかけて上方修正", "移動需要と地政学リスクが価格を下支え。エネルギー株に資金流入。", "供給不安と季節需要が重なり、短期的には価格が底堅い展開。インフレ再燃リスクとしても市場が注目しています。", "あなたが「コモディティ」と「インフレ」に関心を示しました", 69, ["原油", "資源株", "インフレ"]],
  ["china-property", "economy", "Bloomberg", "10時間前", "中国、不動産支援策を追加検討", "地方政府の在庫買い取り案が浮上。景気下支え効果は限定的との見方も。", "住宅在庫と地方財政の問題が続き、追加支援の規模が焦点。アジア株と資源需要への影響もあります。", "あなたが「中国経済」をあとで読むにしました", 66, ["中国", "不動産", "景気"]],
  ["cyber-ai", "ai", "Wired", "11時間前", "AI活用のサイバー攻撃対策、企業導入が加速", "ログ分析と異常検知にAIを利用。セキュリティ投資の優先度が上昇。", "生成AIによる攻撃の高度化に対応するため、防御側もAI分析を導入。セキュリティSaaSへの需要が広がっています。", "あなたが「AIセキュリティ」を閲覧しました", 63, ["セキュリティ", "AI運用", "SaaS"]]
].map(([id, category, source, age, title, summary, detail, reason, baseScore, tags]) => ({ id, category, source, age, title, summary, detail, reason, baseScore, tags }));

const defaultState = { filter: "all", tab: "brief", expandedId: "openai-agent", feedback: {}, updatedAt: new Date().toISOString() };
let state = loadState();

function loadState() {
  try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
  catch { return { ...defaultState }; }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function score(article) {
  const feedback = state.feedback[article.id] || {};
  let value = article.baseScore + (feedback.useful ? 5 : 0) + ((feedback.saved || feedback.later) ? 3 : 0) - (feedback.hidden ? 34 : 0);
  return { ...article, feedback, score: Math.max(8, Math.min(99, value)) };
}
function setFeedback(id, value) {
  const current = state.feedback[id] || {};
  state.feedback[id] = {
    ...current,
    useful: value === "useful" ? !current.useful : current.useful || false,
    hidden: value === "hidden" ? !current.hidden : current.hidden || false,
    saved: value === "saved" ? !current.saved : current.saved || false,
    later: value === "later" ? !current.later : current.later || false,
    touchedAt: new Date().toISOString()
  };
  state.expandedId = id;
  persist();
  render();
}
function interestScores() {
  const totals = { ai: 80, invest: 70, economy: 66 };
  for (const article of articles) {
    const feedback = state.feedback[article.id];
    if (!feedback) continue;
    if (feedback.useful) totals[article.category] += 4;
    if (feedback.saved || feedback.later) totals[article.category] += 2;
    if (feedback.hidden) totals[article.category] -= 5;
  }
  return Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, Math.max(25, Math.min(98, value))]));
}
function visibleArticles() {
  return articles.map(score).filter((article) => state.filter === "all" || article.category === state.filter).filter((article) => {
    if (state.tab === "saved") return article.feedback.saved || article.feedback.later;
    if (state.tab === "feedback") return article.feedback.useful || article.feedback.hidden || article.feedback.saved || article.feedback.later;
    return !article.feedback.hidden;
  }).sort((a, b) => b.score - a.score);
}
function todayLabel() {
  return new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric", weekday: "short" }).format(new Date());
}
function updatedLabel() {
  return new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date(state.updatedAt));
}
function actionClass(article, key) { return article.feedback[key] ? " action-button active" : " action-button"; }
function catLabel(category) { return categories[category] || category; }

function renderInterest() {
  const scores = interestScores();
  const items = [["ai", "AI", "brain-circuit", "急上昇トピックに強い関心"], ["invest", "投資", "briefcase-business", "中から高い関心"], ["economy", "経済", "chart-no-axes-column-increasing", "安定した関心"]];
  return `<section class="interest-panel"><div class="section-header"><div><h2>あなたの関心</h2><p>昨日までのフィードバックから更新</p></div><button class="text-button" data-reset>リセット</button></div><div class="interest-grid">${items.map(([key,label,icon,caption]) => `<article class="interest-card ${key}"><div class="interest-title"><i data-lucide="${icon}"></i><span>${label}</span></div><strong>${scores[key]}<small>/100</small></strong><div class="meter"><span style="width:${scores[key]}%"></span></div><p>${caption}</p></article>`).join("")}</div></section>`;
}
function renderArticle(article, index) {
  const isExpanded = article.id === state.expandedId;
  return `<article class="news-row ${isExpanded ? "expanded" : ""}"><button class="row-main" data-expand="${article.id}" aria-expanded="${isExpanded}"><span class="rank">${index + 1}</span><span class="row-content"><span class="meta-line"><span class="source">${article.source}</span><span class="category-pill ${article.category}">${catLabel(article.category)}</span></span><strong>${article.title}</strong><span class="summary">${article.summary}</span><span class="reason"><i data-lucide="sparkles"></i>${article.reason}</span><span class="time">${article.age}</span></span><span class="score">${article.score}%</span><i class="chevron" data-lucide="${isExpanded ? "chevron-up" : "chevron-down"}"></i></button>${isExpanded ? `<div class="detail"><p>${article.detail}</p><div class="tag-row">${article.tags.map((tag) => `<span>${tag}</span>`).join("")}</div></div>` : ""}<div class="row-actions"><button class="${actionClass(article, "useful")}" data-feedback="${article.id}:useful"><i data-lucide="thumbs-up"></i><span>役に立った</span></button><button class="${actionClass(article, "hidden")}" data-feedback="${article.id}:hidden"><i data-lucide="eye-off"></i><span>不要</span></button><button class="${actionClass(article, "saved")}" data-feedback="${article.id}:saved"><i data-lucide="bookmark"></i><span>保存</span></button></div></article>`;
}
function renderTabContent() {
  if (state.tab === "trends") return `<section class="insight-list"><h2>今週の傾向</h2><article><b>AI</b><span>エージェント、半導体、開発支援への反応が増加。</span></article><article><b>投資</b><span>日本株とAI関連テーマの保存率が高め。</span></article><article><b>経済</b><span>金利、為替、インフレ指標を継続して閲覧。</span></article></section>`;
  if (state.tab === "profile") return `<section class="insight-list"><h2>フィードバック履歴</h2><article><b>${Object.keys(state.feedback).length}</b><span>評価済みの記事数</span></article><article><b>${articles.filter((a) => state.feedback[a.id]?.saved).length}</b><span>保存した記事</span></article><article><b>${articles.filter((a) => state.feedback[a.id]?.hidden).length}</b><span>不要として非表示にした記事</span></article></section>`;
  const list = visibleArticles();
  const label = state.tab === "saved" ? "保存済み" : state.tab === "feedback" ? "評価済み" : "今日のキュー";
  return `<section class="feed"><div class="feed-header"><div><i data-lucide="list-filter"></i><span>${label}：${list.length}本</span></div><button class="sort-button">並び替え：関連度 <i data-lucide="chevron-down"></i></button></div><div class="news-list">${list.length ? list.map(renderArticle).join("") : `<div class="empty">該当する記事はありません。別のフィルターを選んでください。</div>`}</div></section>`;
}
function renderFeedbackTray() {
  const article = score(articles.find((item) => item.id === state.expandedId) || articles[0]);
  return `<aside class="feedback-tray"><div class="tray-grip"></div><div class="tray-copy"><span class="category-pill ${article.category}">${catLabel(article.category)}</span><strong>${article.title}</strong><small>${article.source} ・ ${article.age}</small></div><button class="${actionClass(article, "useful")} tray-action" data-feedback="${article.id}:useful"><i data-lucide="thumbs-up"></i><span>役に立った</span></button><button class="${actionClass(article, "hidden")} tray-action" data-feedback="${article.id}:hidden"><i data-lucide="eye-off"></i><span>不要</span></button><button class="${article.feedback.later ? " action-button active tray-action" : " action-button tray-action"}" data-feedback="${article.id}:later"><i data-lucide="clock-3"></i><span>あとで</span></button></aside>`;
}
function render() {
  document.querySelector("#app").innerHTML = `<header class="top-bar"><div><h1>今日のブリーフ</h1><p>${todayLabel()} ・ ${updatedLabel()} 更新</p></div><div class="header-actions"><button class="icon-button" data-refresh aria-label="更新"><i data-lucide="refresh-cw"></i></button><button class="icon-button" aria-label="設定"><i data-lucide="settings"></i></button></div></header><nav class="segment">${Object.entries(categories).map(([key,label]) => `<button class="${state.filter === key ? "selected" : ""}" data-filter="${key}">${label}</button>`).join("")}</nav>${renderInterest()}<section class="status-strip"><article><span>USD/JPY</span><strong>157.42</strong><em class="up">+0.25%</em></article><article><span>日経平均</span><strong>38,924</strong><em class="down">-0.18%</em></article><article><span>S&P 500</span><strong>5,812</strong><em class="up">+0.32%</em></article><article><span>BTC/JPY</span><strong>15.7M</strong><em class="up">+0.81%</em></article></section><nav class="subsegment"><button class="${state.tab === "brief" ? "selected" : ""}" data-tab="brief">おすすめ</button><button class="${state.tab === "feedback" ? "selected" : ""}" data-tab="feedback">評価済み</button><button class="${state.tab === "saved" ? "selected" : ""}" data-tab="saved">保存済み</button></nav>${renderTabContent()}${renderFeedbackTray()}<nav class="bottom-tabs"><button class="${state.tab === "brief" ? "selected" : ""}" data-tab="brief"><i data-lucide="newspaper"></i><span>Brief</span></button><button class="${state.tab === "feedback" ? "selected" : ""}" data-tab="feedback"><i data-lucide="badge-check"></i><span>Feedback</span></button><button class="${state.tab === "trends" ? "selected" : ""}" data-tab="trends"><i data-lucide="trending-up"></i><span>Trends</span></button><button class="${state.tab === "profile" ? "selected" : ""}" data-tab="profile"><i data-lucide="settings"></i><span>Profile</span></button></nav>`;
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 2 } });
}
document.addEventListener("click", (event) => {
  const filter = event.target.closest("[data-filter]");
  const tab = event.target.closest("[data-tab]");
  const expand = event.target.closest("[data-expand]");
  const feedback = event.target.closest("[data-feedback]");
  if (filter) state.filter = filter.dataset.filter;
  else if (tab) state.tab = tab.dataset.tab;
  else if (expand) state.expandedId = expand.dataset.expand;
  else if (feedback) { const [id, value] = feedback.dataset.feedback.split(":"); setFeedback(id, value); return; }
  else if (event.target.closest("[data-refresh]")) state.updatedAt = new Date().toISOString();
  else if (event.target.closest("[data-reset]")) { state.feedback = {}; state.expandedId = "openai-agent"; }
  persist();
  render();
});
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
render();
