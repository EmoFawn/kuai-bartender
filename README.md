# 🍸 苦艾 kuAI · 情绪调酒馆

> 万物皆可入酒，情绪也是。

给一段心情、一句话，或拖几个情绪气泡进杯子，AI 调酒师为你调一杯"听感一致"的鸡尾酒，并告诉你为什么。

## 快速开始

```bash
# 零依赖，Node 原生即可
node server.js
# 打开 http://localhost:8080
```

不配 Key 也能跑：会进入 **本地降级引擎**（用关键词/规则映射到预设酒），用来看交互和视觉效果。

## 接入真·AI

支持任意 OpenAI 兼容的大模型接口。设置环境变量后再启动（也可写进项目根目录的 `.env`）：

```bash
# 大模型（推荐 DeepSeek，便宜且中文效果好）
export LLM_API_KEY="sk-xxxx"
export LLM_BASE_URL="https://api.deepseek.com/v1"
export LLM_MODEL="deepseek-chat"

# 也可以用 OpenAI
# export LLM_BASE_URL="https://api.openai.com/v1"
# export LLM_MODEL="gpt-4o-mini"

# 可选：联网搜歌背景（Serper.dev）
export SERP_KEY="your_serper_key"

node server.js
```

## 项目结构

```
苦艾 kuAI/
├── index.html          # 页面骨架（HTML 结构 + 引入 css/js）
├── server.js           # 零依赖 Node 后端：静态服务 + 3 个 API
├── css/
│   └── styles.css      # 全部样式（落地页 / 各调酒面板 / 酒柜 / 详情卡）
├── js/
│   ├── data.js         # 经典酒数据 + 关键词字典 + 推荐引擎
│   ├── app.js          # 落地页「推门」进入 + Tab 切换
│   ├── chat.js         # 对话调酒（输入心情 → 出酒）+ SVG 酒杯渲染
│   ├── mood.js         # 心情调酒（气泡拖拽 + 混合调制）
│   ├── deep.js         # DEEP 纵向探究（一层层往下挖情绪）
│   ├── cabinet.js      # 我的酒柜（珍藏 + 经典酒谱 + 详情卡）
│   └── export.js       # 结果卡导出为图片（Canvas）
└── 酒柜/               # 35 款经典鸡尾酒实拍图（文件名即中文名）
```

> ⚠️ `js/` 下的文件按顺序以经典 `<script>` 标签加载，共享同一全局作用域，加载顺序不可随意打乱（`data.js` 必须最先）。

## API

后端提供三个接口（均在 `server.js`）：

| 接口 | 入参 | 作用 |
|------|------|------|
| `POST /api/bartend`   | `{ mood }`  | 对话调酒：一句话心情 → 一杯酒 |
| `POST /api/moodblend` | `{ moods }` | 心情调酒：多个情绪组合 → 一杯酒 |
| `POST /api/mix`       | `{ song }`  | 音乐调酒：歌名 → 同频的酒（可联网搜背景）|

未配置任何 Key 时，`/api/bartend`、`/api/moodblend` 返回 `{ _noKey: true }`，前端自动走本地引擎。

## 工作流

```
心情/气泡/歌名 → (可选)联网搜背景 → 大模型理解 → 生成酒+配方+解释 → 前端展示(配色随情绪变化)
```

## 部署

项目零依赖，可一键部署到 Render / Railway 等平台（已带 `render.yaml`）：

1. 仓库推到 GitHub
2. 平台上新建 Web Service，选该仓库
3. 在平台环境变量面板配置 `LLM_API_KEY`（切勿写进代码）

> `.env` 已在 `.gitignore` 中，密钥不会被提交。
