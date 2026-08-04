/**
 * /api/mix — 音乐调酒
 * POST { song: string }
 */
const { readBody, apiJSON, llmJSON, searchSong, normalizeDrink, LLM_API_KEY, LLM_MODEL } = require("./_shared");

/* 本地降级（无 Key 时） */
function localFallback(song) {
  const palette = [
    { c: "#7b5cff", m: "深邃 / 迷幻", g: "电子", ck: "星海霓虹", en: "Neon Cosmos",
      r: [["伏特加","45ml"],["蓝橙利口酒","20ml"],["苏打水","适量"]],
      why: "合成器的电流感像蓝橙在杯壁上流动，一口下去是整片赛博夜色。" },
    { c: "#ff5e9c", m: "甜蜜 / 心动", g: "流行情歌", ck: "绯色副歌", en: "Rosy Chorus",
      r: [["金酒","40ml"],["荔枝利口酒","20ml"],["蔓越莓汁","40ml"]],
      why: "副歌一上来就是满屏粉红泡泡，荔枝的甜正好接住那句告白。" },
    { c: "#e6a94a", m: "慵懒 / 复古", g: "爵士 / 民谣", ck: "琥珀慢板", en: "Amber Adagio",
      r: [["威士忌","45ml"],["苦精","2dash"],["方糖","1颗"],["橙皮","1片"]],
      why: "萨克斯的尾音像威士忌在冰上化开，慢悠悠地把夜拉长。" },
    { c: "#3bd4c9", m: "清爽 / 治愈", g: "City Pop", ck: "薄荷海风", en: "Mint Breeze",
      r: [["白朗姆","30ml"],["薄荷糖浆","15ml"],["苏打水","90ml"],["青柠","2角"]],
      why: "轻快的鼓点配薄荷气泡，像开着车窗吹过一整个夏天的海岸线。" },
  ];
  let h = 0; for (const ch of song) h = (h * 31 + ch.charCodeAt(0)) % palette.length;
  const p = palette[h];
  return { song, mood: p.m, genre: p.g, cocktail: p.ck, cocktail_en: p.en, color: p.c, recipe: p.r, reason: p.why, _demo: true };
}

async function llmMix(song, context) {
  const sys = `你是一位既懂音乐又懂调酒的创意大师。用户给你一首歌，你要：
1. 理解这首歌的曲风、情绪、意境、时代感；
2. 为它匹配一款"听感一致"的鸡尾酒（可以是经典款，也可以原创命名）；
3. 用富有画面感的语言解释「为什么这首歌是这杯酒」。
只输出 JSON，不要多余文字，格式：
{
  "song": "歌名(可补全歌手)",
  "mood": "两三个情绪关键词",
  "genre": "曲风",
  "cocktail": "酒名",
  "cocktail_en": "英文名",
  "color": "#十六进制主色(贴合歌曲氛围)",
  "recipe": [["材料","用量"], ...],
  "reason": "为什么这首歌配这杯酒(2-3句，有画面感)"
}`;
  const user = `歌曲：《${song}》\n${context ? "网络参考资料：\n" + context : "(无联网资料，凭你的音乐知识判断)"}`;
  const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
  const r = await apiJSON(`${LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${LLM_API_KEY}` },
    body: { model: LLM_MODEL, temperature: 0.9, response_format: { type: "json_object" }, messages: [{ role: "system", content: sys }, { role: "user", content: user }] },
  });
  if (r.status !== 200 || !r.json) throw new Error("LLM 调用失败: " + (r.raw || r.status));
  return JSON.parse(r.json.choices[0].message.content);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const body = await readBody(req);
    const { song } = JSON.parse(body || "{}");
    if (!song || !song.trim()) return res.status(400).json({ error: "请输入歌名" });
    if (!LLM_API_KEY) return res.status(200).json(localFallback(song.trim()));
    const context = await searchSong(song.trim());
    const result = await llmMix(song.trim(), context);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
