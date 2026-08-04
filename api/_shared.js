/**
 * api/_shared.js — 三个调酒 API 共用的 LLM 工具函数
 */
const https = require("https");
const http = require("http");

const LLM_API_KEY  = process.env.LLM_API_KEY  || "";
const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const LLM_MODEL    = process.env.LLM_MODEL    || "gpt-4o-mini";
const SERP_KEY     = process.env.SERP_KEY     || "";

/* 通用 HTTPS/HTTP JSON 请求 */
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

/* 读取请求 body */
function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => resolve(body));
  });
}

/* 统一的 LLM JSON 调用 */
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

/* 联网搜歌（可选） */
async function searchSong(song) {
  if (!SERP_KEY) return "";
  try {
    const r = await apiJSON("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": SERP_KEY },
      body: { q: `${song} 歌曲 歌手 曲风 情绪`, gl: "cn", hl: "zh-cn", num: 5 },
    });
    const items = (r.json && r.json.organic) || [];
    const snippets = items.map((i) => `- ${i.title}: ${i.snippet || ""}`).join("\n");
    const kg = r.json && r.json.knowledgeGraph
      ? `\n[知识卡片] ${JSON.stringify(r.json.knowledgeGraph)}` : "";
    return snippets + kg;
  } catch { return ""; }
}

/* 调酒师人格 */
const PERSONA = `你是「苦艾」调酒馆的主调酒师。你不是在推荐酒，你是在把一个人此刻的情绪，翻译成一杯真实可饮的鸡尾酒。

你的风格：
- 克制、精准、有文学性，但绝不堆砌辞藻。像一个话不多但看得很透的人。
- 你懂真正的调酒：基酒的选择、香调的层次、酒体的轻重，都要说得住。
- 你从不敷衍。用户说"随便"，你也要从这两个字里读出情绪。

调酒原则：
- 情绪与酒体必须对得上：疲惫配醇厚回甘，焦虑配清冽有气泡，钝痛配烈而干净，欢愉配明亮果调。
- 配方必须真实可做，材料是酒吧里能拿到的，用量符合标准配比（总量 60-150ml）。
- 颜色必须贴合情绪：低落用深琥珀/墨绿/暗紫，明快用琥珀金/柑橘橙，清冽用青碧/雪松灰蓝。避免俗艳的纯红纯蓝。`;

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

/* 补齐前端必需字段 */
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
  c.comment   = c.comment || "今晚交给它。";
  c.card      = c.card && typeof c.card === "object" ? c.card : {};
  c.card.headline = c.card.headline || c.poeticZh;
  c.card.body     = c.card.body     || c.comment;
  c.card.tag      = c.card.tag      || "今晚";
  return c;
}

module.exports = { apiJSON, readBody, llmJSON, searchSong, PERSONA, SCHEMA_DOC, normalizeDrink, LLM_API_KEY, LLM_MODEL };
