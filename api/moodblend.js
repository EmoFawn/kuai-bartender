/**
 * /api/moodblend — 心情调酒（横向组合 wide / 纵向探究 deep）
 * POST { moods, mode, path }
 */
const { readBody, llmJSON, PERSONA, SCHEMA_DOC, normalizeDrink, LLM_API_KEY } = require("./_shared");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const body = await readBody(req);
    const { moods, mode, path: moodPath } = JSON.parse(body || "{}");
    if (!LLM_API_KEY) return res.status(200).json({ _noKey: true });
    if (!moods || !moods.length) return res.status(400).json({ error: "请传入心情列表" });

    const isDeep = mode === "deep";
    const sys = `${PERSONA}\n\n${isDeep
      ? `这次用户是「纵向探究」：他从一个笼统的情绪出发，一层层往下挖，最后落到很具体的那一种感受。\n你要理解这条路径的递进关系——越靠后的层级越接近他真正的核心。调酒时，让最后一层主导酒的性格，前面的层级作为背景层次。`
      : `这次用户是「横向组合」：他挑了几种同时存在的心情，它们是并列的、混在一起的。\n你要调一杯能同时承住这些情绪的酒，让它们在香调的不同层次里各自占位，而不是简单相加。`}\n\n${SCHEMA_DOC}`;

    const user = isDeep && Array.isArray(moodPath) && moodPath.length
      ? `客人的探究路径（从笼统到具体，逐层往下）：\n${moodPath.map((p, i) => `${"  ".repeat(i)}${i + 1}. ${typeof p === "string" ? p : (p.txt || JSON.stringify(p))}`).join("\n")}\n\n最终落点：${moods.map(m => `${m.txt}（风味倾向：${m.flavor}）`).join("、")}\n\n请为这条路径的终点调一杯，reading 字段里说出他一层层挖到最后、真正在意的是什么。`
      : `客人今晚同时装着这些心情：\n${moods.map(m => `- ${m.txt}（风味倾向：${m.flavor}）`).join("\n")}\n\n请调一杯能同时接住它们的酒。reading 字段里说出这些情绪凑在一起，意味着他正处在什么状态。`;

    const data = await llmJSON(sys, user, { temperature: 0.95 });
    if (!data.primary) throw new Error("大模型返回结构异常");
    normalizeDrink(data.primary);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
