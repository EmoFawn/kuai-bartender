/**
 * 苦艾 AI 调酒师 · 后端服务（零依赖，Node 原生）
 *
 * 能力：
 *  1) 提供静态页面（index.html）
 *  2) POST /api/bartend  { mood }  → 大模型 → 返回鸡尾酒 JSON
 *  3) POST /api/moodblend { moods } → 大模型 → 返回心情调酒 JSON
 *  4) POST /api/musicmix  { song }  → 大模型 → 返回 { song, primary, similar }
 *                                      歌曲档案 + 为它调的酒 + 同曲风 3 首
 *
 * 配置（环境变量）：
 *  LLM_API_KEY   大模型 Key（OpenAI 兼容，如 DeepSeek / OpenAI）
 *  LLM_BASE_URL  接口地址，默认 https://api.openai.com/v1
 *  LLM_MODEL     模型名，默认 gpt-4o-mini
 *
 *  SERP_KEY      Serper.dev 联网搜索 Key（可选，用来搜歌曲背景）
 *  PORT          端口，默认 8080
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

/* ---------- 自动读取 .env（零依赖） ---------- */
try {
  const envPath = path.join(__dirname, ".env");
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    // 只在环境变量未被外部设置时才填入（export 优先）
    if (key && val && !process.env[key]) {
      process.env[key] = val;
    }
  }
} catch { /* .env 不存在时静默跳过 */ }

const PORT = process.env.PORT || 8080;

// 大模型（OpenAI 兼容接口，全部调酒能力共用）
const LLM_API_KEY  = process.env.LLM_API_KEY  || "";
const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const LLM_MODEL    = process.env.LLM_MODEL    || "gpt-4o-mini";
const SERP_KEY     = process.env.SERP_KEY     || "";

/* ---------- 通用 JSON 请求（自动识别 http / https） ---------- */
function apiJSON(urlStr, { method = "GET", headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const isHttp = u.protocol === "http:";
    const transport = isHttp ? http : https;
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      method,
      hostname: u.hostname,
      port: u.port || (isHttp ? 80 : 443),
      path: u.pathname + u.search,
      headers: { "Content-Type": "application/json", ...headers },
    };
    if (data) opts.headers["Content-Length"] = Buffer.byteLength(data);
    const req = transport.request(opts, (res) => {
      let buf = "";
      res.on("data", (c) => (buf += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(buf) }); }
        catch { resolve({ status: res.statusCode, json: null, raw: buf }); }
      });
    });
    req.on("error", reject);
    req.setTimeout(30000, () => req.destroy(new Error("请求超时")));
    if (data) req.write(data);
    req.end();
  });
}

// 兼容旧调用（音乐调酒 searchSong / llmMix 还在用这个名字）
const httpsJSON = apiJSON;

/* ---------- 联网搜歌（可选，Serper.dev） ----------
   没有 SERP_KEY 也能跑：大模型自身的音乐知识足以覆盖绝大多数歌曲，
   联网只是为了补上冷门歌 / 新歌的准确信息，属于「锦上添花」。 */
async function searchSong(song) {
  if (!SERP_KEY) return "";
  try {
    const r = await httpsJSON("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": SERP_KEY },
      body: { q: `${song} 歌曲 歌手 专辑 曲风 发行年份`, gl: "cn", hl: "zh-cn", num: 5 },
    });
    const items = (r.json && r.json.organic) || [];
    const snippets = items.map((i) => `- ${i.title}: ${i.snippet || ""}`).join("\n");
    const kg = r.json && r.json.knowledgeGraph
      ? `\n[知识卡片] ${JSON.stringify(r.json.knowledgeGraph)}` : "";
    return snippets + kg;
  } catch (e) {
    return "";
  }
}

/* ---------- 调酒师人格与输出规范 ---------- */
const PERSONA = `你是「苦艾」调酒馆的主调酒师。你不是在推荐酒，你是在把一个人此刻的情绪，翻译成一杯真实可饮的鸡尾酒。

你的风格：
- 克制、精准、有文学性，但绝不堆砌辞藻。像一个话不多但看得很透的人。
- 你懂真正的调酒：基酒的选择、香调的层次、酒体的轻重，都要说得住。
- 你从不敷衍。用户说"随便"，你也要从这两个字里读出情绪。

调酒原则：
- 情绪与酒体必须对得上：疲惫配醇厚回甘，焦虑配清冽有气泡，钝痛配烈而干净，欢愉配明亮果调。
- 配方必须真实可做，材料是酒吧里能拿到的，用量符合标准配比（总量 60-150ml）。
- 颜色必须贴合情绪：低落用深琥珀/墨绿/暗紫，明快用琥珀金/柑橘橙，清冽用青碧/雪松灰蓝。避免俗艳的纯红纯蓝。

配方（recipe）的硬性要求 —— 这是整杯酒最不能含糊的部分：
- 3-6 种材料，按用量从多到少排列；第一项必须是基酒，且与 base 字段完全一致。
- 用量要具体可执行：主料用 ml（如「45 ml」），苦精用 dash（如「2 dash」），
  糖/果酱类可用 tsp，固体材料写个数或片数（如「1 块」「6 片」「1 个」）。
  只有苏打水/汤力水/可乐这类补满的长饮材料，才允许写「补满」。
- 全部液体总量控制在 60-150 ml，并且要能反推出你给的 abv：
  烈酒占比越高，abv 越高，别出现「45ml 金酒 + 120ml 汤力水」却标 30% 这种矛盾。
- 香调（topNote / midNote / baseNote）必须在配方里找得到出处，
  不要出现配方里没有任何材料能解释的香气。
- method 用一句话把关键动作讲清：摇 / 搅 / 兑 / 分层 / 捣压、用什么冰、滤不滤。
- garnish 只写真正需要的装饰物；确实不需要就给空字符串。`;

const SCHEMA_DOC = `严格只输出 JSON，不要 markdown 代码块，不要任何解释文字。

{
  "primary": {
    "name":      "英文酒名，可经典款可原创",
    "nameZh":    "中文酒名（写实的，如「烟熏古典」）",
    "poeticZh":  "诗意名，4-8字，这是展示的主标题（如「隔夜的雨」）",
    "poeticEn":  "诗意英文名，3-6词，气质要与中文一致",
    "base":      "基酒（如：威士忌 / 金酒 / 朗姆 / 龙舌兰 / 伏特加 / 白兰地）",
    "topNote":   "前调，4-10字，入口第一感受",
    "midNote":   "中调，4-10字，酒体展开的味道",
    "baseNote":  "尾调，4-10字，咽下后留在口腔的余味",
    "color1":    "#酒液渐变浅色（十六进制）",
    "color2":    "#酒液渐变深色（十六进制）",
    "glowColor": "#杯底光晕色，取 color1/color2 之间的暖色",
    "glass":     "杯型，只能是这四个之一：coupe（碟形/马天尼，适合无冰的烈酒）、rocks（古典杯，适合加冰醇厚型）、highball（高球杯，适合加气泡的长饮）、flute（笛型杯，适合香槟气泡类）",
    "strength":  "酒感强度整数 1-5（1最柔，5最烈）",
    "abv":       "预估酒精度数字，如 22",
    "recipe":    [["材料名","用量"], ["材料名","用量"]],
    "method":    "做法，一句话（如「加冰摇匀，滤入冰过的碟形杯」）",
    "garnish":   "装饰物（如「橙皮」「盐边 / 青柠片」）；不需要就给空字符串",
    "comment":   "调酒师递上酒时说的一句话，1-2句。对着用户说，用「你」。要有分量，不要安慰腔。",
    "reading":   "你从用户这句话里读到了什么，1-2句。像在说一件他自己没说出口的事。",
    "card": {
      "headline": "分享卡主标题，6-12字，可与 poeticZh 不同，更有钩子",
      "body":     "分享卡正文，20-40字，能被单独截图传播的一段话",
      "tag":      "2-4字情绪标签（如「深夜」「松口气」）"
    }
  },
  "secondary": {
    "poeticZh": "另一种可能性的诗意名（同样情绪的另一种解法）",
    "poeticEn": "其英文名",
    "color1":   "#浅色",
    "color2":   "#深色"
  }
}`;

/* ---------- 统一的 LLM JSON 调用 ---------- */
async function llmJSON(sys, user, { temperature = 0.9 } = {}) {
  if (!LLM_API_KEY) throw new Error("未配置 LLM_API_KEY");
  const r = await apiJSON(`${LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${LLM_API_KEY}` },
    body: {
      model: LLM_MODEL,
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    },
  });
  if (r.status !== 200 || !r.json) {
    throw new Error("大模型调用失败: " + (r.raw || r.status));
  }
  const content = r.json.choices?.[0]?.message?.content;
  if (!content) throw new Error("大模型返回内容为空");
  const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(cleaned);
}

/* ---------- 输出兜底：补齐前端必需字段，避免个别字段缺失导致页面空白 ---------- */
const GLASSES = ["coupe", "rocks", "highball", "flute"];
function normalizeDrink(c) {
  if (!c || typeof c !== "object") throw new Error("返回结构异常");
  c.poeticZh  = c.poeticZh  || c.nameZh || c.name || "今夜这一杯";
  c.poeticEn  = c.poeticEn  || c.name   || "Tonight";
  c.base      = c.base      || "威士忌";
  c.topNote   = c.topNote   || "—";
  c.midNote   = c.midNote   || "—";
  c.baseNote  = c.baseNote  || "—";
  c.color1    = /^#[0-9a-f]{3,8}$/i.test(c.color1 || "") ? c.color1 : "#7a4a1a";
  c.color2    = /^#[0-9a-f]{3,8}$/i.test(c.color2 || "") ? c.color2 : "#c47830";
  c.glowColor = /^#[0-9a-f]{3,8}$/i.test(c.glowColor || "") ? c.glowColor : c.color1;
  c.glass     = GLASSES.includes(c.glass) ? c.glass : "rocks";
  c.strength  = Math.max(1, Math.min(5, Math.round(Number(c.strength) || 3)));
  const abvNum = Number(c.abv);
  c.abv       = abvNum > 0 && abvNum <= 60 ? Math.round(abvNum) : 0;
  c.recipe    = Array.isArray(c.recipe) ? c.recipe.filter(x => Array.isArray(x) && x.length >= 2) : [];
  c.method    = typeof c.method  === "string" ? c.method.trim()  : "";
  c.garnish   = typeof c.garnish === "string" ? c.garnish.trim() : "";
  c.comment   = c.comment || "今晚交给它。";
  c.card      = c.card && typeof c.card === "object" ? c.card : {};
  c.card.headline = c.card.headline || c.poeticZh;
  c.card.body     = c.card.body     || c.comment;
  c.card.tag      = c.card.tag      || "今晚";
  return c;
}

/* ---------- 对话调酒 ---------- */
async function llmBartend(mood) {
  const said = mood && mood.trim();

  const sys = `${PERSONA}

用户会直接告诉你此刻的心情。你要先读懂他，再为他调一杯。

${SCHEMA_DOC}`;

  const user = said
    ? `客人坐下来，说：「${said}」

请为他调一杯。reading 字段里写出你从这句话里读到的、他自己没直接说的那层意思。`
    : `客人坐下来，只说了「随便给我调一杯吧，今晚交给你了」。

一个人说"随便"的时候，往往是懒得解释，或者说不清。请为这种状态调一杯，不要调成敷衍的大众款。`;

  const data = await llmJSON(sys, user, { temperature: 0.95 });
  if (!data.primary) throw new Error("大模型返回结构异常");
  normalizeDrink(data.primary);
  return data;
}

/* ---------- 心情调酒（支持横向组合 wide / 纵向探究 deep） ---------- */
async function llmMoodBlend(moods, mode, path) {
  const isDeep = mode === "deep";

  const sys = `${PERSONA}

${isDeep
  ? `这次用户是「纵向探究」：他从一个笼统的情绪出发，一层层往下挖，最后落到很具体的那一种感受。
你要理解这条路径的递进关系——越靠后的层级越接近他真正的核心。调酒时，让最后一层主导酒的性格，前面的层级作为背景层次。`
  : `这次用户是「横向组合」：他挑了几种同时存在的心情，它们是并列的、混在一起的。
你要调一杯能同时承住这些情绪的酒，让它们在香调的不同层次里各自占位，而不是简单相加。`}

${SCHEMA_DOC}`;

  const user = isDeep && Array.isArray(path) && path.length
    ? `客人的探究路径（从笼统到具体，逐层往下）：
${path.map((p, i) => `${"  ".repeat(i)}${i + 1}. ${typeof p === "string" ? p : (p.txt || JSON.stringify(p))}`).join("\n")}

最终落点：${moods.map(m => `${m.txt}（风味倾向：${m.flavor}）`).join("、")}

请为这条路径的终点调一杯，reading 字段里说出他一层层挖到最后、真正在意的是什么。`
    : `客人今晚同时装着这些心情：
${moods.map(m => `- ${m.txt}（风味倾向：${m.flavor}）`).join("\n")}

请调一杯能同时接住它们的酒。reading 字段里说出这些情绪凑在一起，意味着他正处在什么状态。`;

  const data = await llmJSON(sys, user, { temperature: 0.95 });
  if (!data.primary) throw new Error("大模型返回结构异常");
  normalizeDrink(data.primary);
  return data;
}

/* ========================================================
   音乐调酒 · MUSIC MIX
   ----------------------------------------------------------
   用户只给一个歌名，一次大模型调用要同时产出三样东西：
     ① song    这首歌的档案（歌手/曲风/年份/情绪/一句听感）
     ② primary 一杯"听感一致"的鸡尾酒（完整复用 SCHEMA_DOC 的结构，
               这样前端能直接套用现成的结果卡、配方区、导出卡）
     ③ similar 3 首同曲风推荐（把这一杯延长成一整晚的歌单）
   为什么合并成一次调用：拆成三次会让等待时间翻三倍，
   而这三件事本来就共享同一份"对这首歌的理解"，分开反而容易前后不一致。
   ======================================================== */
const MUSIC_SCHEMA = `严格只输出 JSON，不要 markdown 代码块，不要任何解释文字。

{
  "song": {
    "title":   "歌曲正名（用户可能写错别字或只写一半，你要补全）",
    "artist":  "演唱者 / 乐队",
    "album":   "所属专辑；确实不知道就给空字符串",
    "year":    "发行年份，如「2003」；不确定给空字符串",
    "genre":   "曲风，2-8字（如「City Pop」「后摇」「粤语情歌」）",
    "tempo":   "速度感，只能是这三个之一：慢 / 中速 / 快",
    "mood":    "这首歌的情绪，2-3个词用「/」分隔（如「慵懒 / 微醺」）",
    "listen":  "一句听感描述，20-40字。写这首歌听起来像什么，不要复述歌词也不要写乐评术语。",
    "known":   true 或 false —— 你是否真的认识这首歌。不认识就给 false，
               此时其余字段按用户给的字面信息尽力推测，不要编造歌手和专辑。
  },
  "primary": {
    "name":      "英文酒名",
    "poeticZh":  "诗意酒名，4-8字，要能听出这首歌的影子（这是展示主标题）",
    "poeticEn":  "诗意英文名，3-6词",
    "base":      "基酒（威士忌 / 金酒 / 朗姆 / 龙舌兰 / 伏特加 / 白兰地 / 香槟 …）",
    "topNote":   "前调，4-10字",
    "midNote":   "中调，4-10字",
    "baseNote":  "尾调，4-10字",
    "color1":    "#酒液渐变浅色",
    "color2":    "#酒液渐变深色",
    "glowColor": "#杯底光晕色",
    "glass":     "杯型，只能是：coupe / rocks / highball / flute",
    "strength":  酒感强度整数 1-5,
    "abv":       预估酒精度数字,
    "recipe":    [["材料名","用量"], ["材料名","用量"]],
    "method":    "做法，一句话",
    "garnish":   "装饰物；不需要给空字符串",
    "comment":   "调酒师递上酒时说的一句话，1-2句，对着用户说，用「你」",
    "reading":   "为什么这首歌是这杯酒，1-2句。必须把具体的音乐特征（编曲/音色/节奏/人声质感）和具体的味觉对上，不要只写氛围形容词。",
    "card": {
      "headline": "分享卡主标题，6-12字",
      "body":     "分享卡正文，20-40字",
      "tag":      "2-4字标签（如「深夜」「公路」）"
    }
  },
  "similar": [
    { "title":"歌名", "artist":"歌手", "why":"和这首歌像在哪，12-20字，要具体" },
    { "title":"...",  "artist":"...",  "why":"..." },
    { "title":"...",  "artist":"...",  "why":"..." }
  ]
}`;

async function llmMusicMix(song, context) {
  const sys = `${PERSONA}

这次你还多了一重身份：一个听过很多歌的选曲人。用户给你一首歌，你要先真正听懂它，再把它翻译成一杯酒。

把歌变成酒的原则 —— 必须落到具体的音乐要素上，不能只靠情绪形容词：
- 速度决定酒体：慢歌配醇厚、需要慢慢喝的（加冰的烈酒、奶油质地）；快歌配爽利有气泡的长饮。
- 音色决定基酒：失真吉他与鼓机 → 烈而糙（黑麦威士忌、龙舌兰）；
  钢琴与弦乐 → 干净清透（金酒、伏特加）；铜管与萨克斯 → 温润（波本、白兰地）；
  合成器与电子音色 → 冷冽带气泡；木吉他与民谣 → 朗姆、蜂蜜、柑橘那一类朴素的甜。
- 混响与空间感决定香调层次：干、近、贴耳的录音 → 香调简洁；空旷、大量残响 → 香调层次多、余味长。
- 年代决定气质：老录音配经典款（古典、曼哈顿、边车），新音乐可以原创。

推荐同曲风的 3 首歌时：
- 必须真实存在，别编歌名。风格、年代、情绪三者至少两项贴近这首歌。
- 三首之间要有区分度：不要给三首同一个歌手，也不要三首都是同一张专辑的。
- why 要写具体的相似点（编曲手法 / 人声质感 / 情绪走向），不要写"同样很好听"这种空话。

如果你不认识用户给的这首歌：把 song.known 设为 false，
不要编造歌手和专辑（宁可留空），但依然要根据歌名的字面意象认真调一杯，
并在 primary.reading 里说明这杯是照着歌名的意象调的。

${MUSIC_SCHEMA}`;

  const user = `客人递过来一张歌单，上面只写了：《${song}》

${context ? "以下是联网查到的参考资料，可信度优先于你的记忆：\n" + context : "（没有联网资料，凭你自己的音乐积累判断）"}

请给出这首歌的档案、为它调的那一杯，以及能接着放下去的 3 首歌。`;

  const data = await llmJSON(sys, user, { temperature: 0.9 });
  if (!data.primary) throw new Error("大模型返回结构异常");
  normalizeDrink(data.primary);
  data.song = normalizeSong(data.song, song);
  data.similar = normalizeSimilar(data.similar);
  return data;
}

/* 歌曲档案兜底：任何字段缺失都不该让前端出现 "undefined" */
const TEMPOS = ["慢", "中速", "快"];
function normalizeSong(s, raw) {
  s = (s && typeof s === "object") ? s : {};
  s.title  = (s.title  || raw || "无名之曲").trim();
  s.artist = typeof s.artist === "string" ? s.artist.trim() : "";
  s.album  = typeof s.album  === "string" ? s.album.trim()  : "";
  s.year   = String(s.year || "").trim();
  s.genre  = (s.genre || "未知曲风").trim();
  s.tempo  = TEMPOS.includes(s.tempo) ? s.tempo : "中速";
  s.mood   = (s.mood || "—").trim();
  s.listen = (s.listen || "").trim();
  s.known  = s.known !== false;
  return s;
}

/* 推荐歌单兜底：宁可少给，也不要给出半条残缺的数据 */
function normalizeSimilar(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter(x => x && typeof x === "object" && x.title)
    .slice(0, 3)
    .map(x => ({
      title:  String(x.title).trim(),
      artist: String(x.artist || "").trim(),
      why:    String(x.why || "").trim(),
    }));
}

async function handleMusicMix(song) {
  const s = (song || "").trim();
  if (!s) throw new Error("请先告诉我一首歌");
  const context = await searchSong(s);
  return await llmMusicMix(s, context);
}

/* ---------- HTTP 服务 ---------- */
const server = http.createServer((req, res) => {
  // 心情调酒 API
  if (req.method === "POST" && req.url === "/api/moodblend") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      const json = (code, obj) => {
        res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(obj));
      };
      try {
        const { moods, mode, path: moodPath } = JSON.parse(body || "{}");
        if (!LLM_API_KEY) return json(200, { _noKey: true });
        if (!moods || !moods.length) return json(400, { error: "请传入心情列表" });
        const result = await llmMoodBlend(moods, mode, moodPath);
        json(200, result);
      } catch (e) {
        json(500, { error: e.message });
      }
    });
    return;
  }

  // 对话调酒 API
  if (req.method === "POST" && req.url === "/api/bartend") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      const json = (code, obj) => {
        res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(obj));
      };
      try {
        const { mood } = JSON.parse(body || "{}");
        if (!LLM_API_KEY) return json(200, { _noKey: true });
        const result = await llmBartend(mood);
        json(200, result);
      } catch (e) {
        json(500, { error: e.message });
      }
    });
    return;
  }
  // 音乐调酒 API
  if (req.method === "POST" && req.url === "/api/musicmix") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      const json = (code, obj) => {
        res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(obj));
      };
      try {
        const { song } = JSON.parse(body || "{}");
        if (!LLM_API_KEY) return json(200, { _noKey: true });
        if (!song || !String(song).trim()) return json(400, { error: "请先告诉我一首歌" });
        const result = await handleMusicMix(song);
        json(200, result);
      } catch (e) {
        json(500, { error: e.message });
      }
    });
    return;
  }

  // 静态文件
  let file = req.url === "/" ? "/index.html" : req.url;
  file = file.split("?")[0];
  const full = path.join(__dirname, decodeURIComponent(file));
  if (!full.startsWith(__dirname)) { res.writeHead(403); return res.end("403"); }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); return res.end("404 Not Found"); }
    const ext = path.extname(full).toLowerCase();
    const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
      ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
      ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml" };
    const headers = { "Content-Type": types[ext] || "application/octet-stream" };
    // 酒柜图片体积较大，加上长缓存 + immutable，避免每次切页都重新下载
    // （thumbs/mid 都是构建产物，内容变了文件名也会变，可以放心 immutable）
    if (/^image\//.test(headers["Content-Type"])) {
      headers["Cache-Control"] = "public, max-age=604800, immutable";
    }
    res.writeHead(200, headers);
    res.end(data);
  });
});

// 监听 0.0.0.0：本地可用 localhost 访问，云平台（Render/Railway 等）也能正确接管
server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🍸 苦艾 AI 调酒师已启动: http://localhost:${PORT}`);
  if (LLM_API_KEY) {
    console.log(`   调酒引擎: 大模型 ✅  (${LLM_MODEL})`);
    console.log(`   接口地址: ${LLM_BASE_URL}`);
  } else {
    console.log(`   调酒引擎: ❌ 未配置 → 降级本地关键词引擎`);
    console.log(`\n   配置大模型：`);
    console.log(`   LLM_API_KEY=sk-xxx`);
    console.log(`   LLM_BASE_URL=https://api.deepseek.com/v1`);
    console.log(`   LLM_MODEL=deepseek-chat`);
  }
  console.log(`   联网搜歌: ${SERP_KEY ? "已开启 ✅" : "未开启（音乐调酒改由模型自身音乐知识判断）"}`);
  console.log("");
});
