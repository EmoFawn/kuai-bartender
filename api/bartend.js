/**
 * /api/bartend — 对话调酒
 * POST { mood: string }
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
    const { mood } = JSON.parse(body || "{}");
    if (!LLM_API_KEY) return res.status(200).json({ _noKey: true });

    const said = mood && mood.trim();
    const sys = `${PERSONA}\n\n用户会直接告诉你此刻的心情。你要先读懂他，再为他调一杯。\n\n${SCHEMA_DOC}`;
    const user = said
      ? `客人坐下来，说：「${said}」\n\n请为他调一杯。reading 字段里写出你从这句话里读到的、他自己没直接说的那层意思。`
      : `客人坐下来，只说了「随便给我调一杯吧，今晚交给你了」。\n\n一个人说"随便"的时候，往往是懒得解释，或者说不清。请为这种状态调一杯，不要调成敷衍的大众款。`;

    const data = await llmJSON(sys, user, { temperature: 0.95 });
    if (!data.primary) throw new Error("大模型返回结构异常");
    normalizeDrink(data.primary);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
