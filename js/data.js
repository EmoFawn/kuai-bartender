// ===== DATA =====
const COCKTAILS=[{id:'mojito',name:'Mojito',nameZh:'莫吉托',poeticZh:'薄荷雨后的轻盈',poeticEn:'After-Rain Lightness',base:'白朗姆',topNote:'薄荷',midNote:'青柠',baseNote:'甘蔗',color1:'#4a7a5a',color2:'#8abf7a',glowColor:'#5a9a6a',recipe:['白朗姆酒 50ml','青柠汁 25ml','薄荷叶 10片','糖浆 20ml','苏打水适量'],steps:['薄荷与糖浆轻捣','加青柠汁和朗姆','碎冰填满','苏打水补满'],tags:['清爽','疲惫','身体累','天热','提神'],mood:['refreshed','light','awake'],flavor:['sweet','fresh','sour'],strength:2,comment:'让薄荷替你松一口气。',atmosphere:'配一首 Bossa Nova，慢慢喝，这杯不急。'},{id:'old_fashioned',name:'Old Fashioned',nameZh:'古典',poeticZh:'苦中藏糖的深夜',poeticEn:'Bitter Sweetness at Midnight',base:'波本威士忌',topNote:'橙皮',midNote:'焦糖',baseNote:'烟熏',color1:'#7a4a1a',color2:'#c47830',glowColor:'#a05a20',recipe:['波本威士忌 60ml','安高天娜苦精 2dash','方糖 1块','橙皮 1片'],steps:['方糖加苦精捣碎','加威士忌和大冰块','搅拌20圈','橙皮扭捏喷香'],tags:['心累','深沉','想静','沉稳','微苦'],mood:['warm','grounded','reflective'],flavor:['bitter','strong','warm'],strength:4,comment:'苦味有时候是糖，慢慢就知道了。',atmosphere:'配一首蓝调，这杯不赶时间。'},{id:'gin_tonic',name:'Gin & Tonic',nameZh:'金汤力',poeticZh:'清醒时刻的留白',poeticEn:'Clarity Between Thoughts',base:'金酒',topNote:'杜松',midNote:'青柠',baseNote:'奎宁',color1:'#c0e0b0',color2:'#daf0c8',glowColor:'#90c888',recipe:['金酒 45ml','汤力水 120ml','青柠角 1个','冰块'],steps:['杯中加满冰','倒金酒','汤力水沿杯壁缓注','青柠装饰'],tags:['清爽','焦虑','紧张','清醒','提神'],mood:['alert','calm','clear'],flavor:['sour','fresh','light'],strength:2,comment:'先清醒，再慢慢放松。',atmosphere:'配一杯冰水和一首干净的吉他曲。'},{id:'champagne_cocktail',name:'Champagne Cocktail',nameZh:'香槟鸡尾酒',poeticZh:'气泡盛开的瞬间',poeticEn:'The Moment Bubbles Bloom',base:'香槟',topNote:'气泡',midNote:'苦橙',baseNote:'白兰地',color1:'#d8c840',color2:'#f0d840',glowColor:'#c4a828',recipe:['香槟 120ml','苦精 2dash','方糖 1块','白兰地 15ml'],steps:['方糖放杯底淋苦精','加白兰地','缓注香槟'],tags:['庆祝','喜悦','仪式感','精致','气泡'],mood:['celebratory','bright','elevated'],flavor:['sweet','bitter','sparkling'],strength:3,comment:'今天值得 bubbles。',atmosphere:'不用配什么，你就是背景音乐。'},{id:'white_russian',name:'White Russian',nameZh:'白俄罗斯',poeticZh:'奶油裹住的低落',poeticEn:'Sadness Wrapped in Cream',base:'伏特加',topNote:'奶油',midNote:'咖啡',baseNote:'香草',color1:'#c8a870',color2:'#e8d0a0',glowColor:'#d4b878',recipe:['伏特加 40ml','咖啡利口酒 20ml','淡奶油 30ml'],steps:['杯中加冰','倒伏特加和咖啡利口酒','奶油浮在上层','不搅拌直接喝'],tags:['丧','低落','治愈','安慰','甜'],mood:['comforted','warm','soothed'],flavor:['sweet','warm','creamy'],strength:2,comment:'奶油味会把丧裹住，咽下去就轻了。',atmosphere:'配一部老电影，窝在沙发里。'},{id:'negroni',name:'Negroni',nameZh:'尼格罗尼',poeticZh:'不讨好任何人的红',poeticEn:'An Unapologetic Red',base:'金酒',topNote:'橙皮',midNote:'苦草本',baseNote:'苦艾',color1:'#c03020',color2:'#e04030',glowColor:'#b02818',recipe:['金酒 30ml','甜苦艾酒 30ml','金巴利 30ml'],steps:['所有材料加冰搅拌','滤入冰镇杯','橙皮装饰'],tags:['苦','有态度','清醒','想思考','不妥协'],mood:['focused','contemplative','bold'],flavor:['bitter','complex','strong'],strength:3,comment:'这杯不讨好任何人，包括你。但你会回来的。',atmosphere:'配一支烟和一段沉默。'},{id:'margarita',name:'Margarita',nameZh:'玛格丽特',poeticZh:'一刀切开的烈',poeticEn:'Sharp as a Clean Cut',base:'龙舌兰',topNote:'盐边',midNote:'青柠',baseNote:'烟熏龙舌兰',color1:'#70b840',color2:'#a0d060',glowColor:'#80c048',recipe:['龙舌兰 50ml','青柠汁 25ml','橙皮利口酒 20ml','盐边'],steps:['杯口蘸盐边','所有材料加冰摇匀','滤入杯','青柠装饰'],tags:['酸','烈','有劲','想发泄','暴躁'],mood:['energized','liberated','fierce'],flavor:['sour','strong','sharp'],strength:3,comment:'有些情绪需要被一刀切开，不是慢慢磨。',atmosphere:'把音量调到不剩空间给思考。'},{id:'espresso_martini',name:'Espresso Martini',nameZh:'咖啡马天尼',poeticZh:'清醒与沉醉的战场',poeticEn:'Battleground of Clarity',base:'伏特加',topNote:'咖啡泡沫',midNote:'可可',baseNote:'香草苦',color1:'#3a2010',color2:'#6a3818',glowColor:'#2a1808',recipe:['伏特加 40ml','咖啡利口酒 20ml','浓缩咖啡 30ml','糖浆 10ml'],steps:['浓缩咖啡现萃','所有材料加冰摇匀','滤入冰镇杯','咖啡豆三粒装饰'],tags:['提神','浓郁','加班','熬夜','专注'],mood:['awake','driven','sharp'],flavor:['bitter','strong','rich'],strength:3,comment:'咖啡因和酒精同时报到，你选谁先到。',atmosphere:'配一张待办清单，喝完刚好能干完。'},{id:'hot_toddy',name:'Hot Toddy',nameZh:'热托迪',poeticZh:'被抱住的冬夜',poeticEn:'A Winter Night Held Close',base:'威士忌',topNote:'蜂蜜',midNote:'柠檬',baseNote:'肉桂',color1:'#c08030',color2:'#e0a040',glowColor:'#b07020',recipe:['威士忌 45ml','蜂蜜 15ml','柠檬片 2片','热水 120ml','肉桂棒'],steps:['杯中加蜂蜜和柠檬','倒威士忌','注热水搅拌','肉桂棒装饰'],tags:['暖','治愈','心累','想哭','脆弱','冷天'],mood:['comforted','nurtured','warm'],flavor:['sweet','warm','honey'],strength:2,comment:'有些夜晚不需要微醺，只需要被抱住。这杯就是。',atmosphere:'配一条毯子，不用说话。'},{id:'aperol_spritz',name:'Aperol Spritz',nameZh:'阿佩罗喷趣',poeticZh:'阳光和朋友的下午',poeticEn:'Afternoon of Sun & Friends',base:'Prosecco',topNote:'橙皮',midNote:'苦橙',baseNote:'气泡',color1:'#e06820',color2:'#f09040',glowColor:'#d05818',recipe:['Aperol 60ml','Prosecco 90ml','苏打水 30ml','橙片'],steps:['杯中加冰','先倒Prosecco再倒Aperol','苏打水补满','橙片装饰'],tags:['气泡','轻松','社交','开心','阳光','放松'],mood:['light','social','bright'],flavor:['sweet','sour','sparkling'],strength:1,comment:'度数最低，快乐最高。这就是它的设计。',atmosphere:'配一个阳光好的下午和一帮朋友。'},{id:'dark_n_stormy',name:"Dark 'n' Stormy",nameZh:'黑风暴',poeticZh:'暴雨之前的独处',poeticEn:'Solitude Before the Storm',base:'黑朗姆',topNote:'姜辣',midNote:'焦糖',baseNote:'深色糖蜜',color1:'#1a2840',color2:'#2a3858',glowColor:'#1a2030',recipe:['黑朗姆酒 60ml','姜啤 120ml','青柠角'],steps:['杯中加冰','倒姜啤','朗姆酒沿勺背浮在上层'],tags:['辛','深沉','阴天','想独处','丧'],mood:['brooding','intense','solitary'],flavor:['spicy','strong','bold'],strength:3,comment:'姜的辣和朗姆的甜在打架，你负责观战。',atmosphere:'配一场暴雨，或者等一场来。'},{id:'pina_colada',name:'Piña Colada',nameZh:'椰林飘香',poeticZh:'想去但走不了的岛',poeticEn:'The Island You Cannot Reach',base:'白朗姆',topNote:'椰子',midNote:'菠萝',baseNote:'奶香',color1:'#d4d488',color2:'#eef0b0',glowColor:'#c0c870',recipe:['白朗姆酒 50ml','椰奶 40ml','菠萝汁 40ml','碎冰'],steps:['所有材料加碎冰摇匀','倒入飓风杯','菠萝角装饰'],tags:['甜','热带','逃离','想度假','逃避'],mood:['escapist','dreamy','tropical'],flavor:['sweet','creamy','fruity'],strength:2,comment:'你在工位上，但这杯替你去了海边。',atmosphere:'配一个请假的念头。哪怕只是想想。'},{id:'last_word',name:'Last Word',nameZh:'最后一言',poeticZh:'说完就翻篇的结局',poeticEn:'Turn the Page After This',base:'金酒',topNote:'草本',midNote:'樱桃',baseNote:'青柠酸',color1:'#508040',color2:'#70a858',glowColor:'#406830',recipe:['金酒 30ml','青柠汁 30ml','绿查特酒 30ml','黑樱桃利口酒 30ml'],steps:['所有材料加冰摇匀','滤入冰镇杯','樱桃装饰'],tags:['复杂','总结','告别','结尾','神秘'],mood:['final','contemplative','definitive'],flavor:['herbal','sour','complex'],strength:3,comment:'有些事到此为止，这杯替你说最后一句话。',atmosphere:'配一段深夜的独白。说完就翻篇。'},{id:'clover_club',name:'Clover Club',nameZh:'三叶草',poeticZh:'允许自己软一会儿',poeticEn:'Permission to Be Soft',base:'金酒',topNote:'覆盆子',midNote:'蛋白泡沫',baseNote:'柠檬花',color1:'#d870a0',color2:'#f090c0',glowColor:'#c05888',recipe:['金酒 45ml','柠檬汁 20ml','覆盆子糖浆 15ml','蛋白1个'],steps:['干摇蛋白与糖浆','加冰湿摇所有材料','双重过滤入杯'],tags:['柔','温柔','细腻','被照顾','想被安慰'],mood:['gentle','cared-for','soft'],flavor:['sweet','sour','fruity'],strength:2,comment:'这杯温柔到你可以不用坚强。',atmosphere:'配一首慢歌，允许自己软一会儿。'},{id:'manhattan',name:'Manhattan',nameZh:'曼哈顿',poeticZh:'做决定前的那口酒',poeticEn:'The Sip Before the Decision',base:'黑麦威士忌',topNote:'樱桃',midNote:'甜苦艾',baseNote:'黑麦辛香',color1:'#6a1818',color2:'#9a2828',glowColor:'#581010',recipe:['黑麦威士忌 60ml','甜苦艾酒 30ml','苦精 2dash'],steps:['所有材料加冰搅拌','滤入冰镇杯','樱桃装饰'],tags:['经典','沉稳','做决定','严肃'],mood:['determined','classic','resolute'],flavor:['strong','bitter','smooth'],strength:4,comment:'这杯不陪犹豫。喝之前想好，喝完去做。',atmosphere:'配一支笔和一张纸。边喝边把决定写下来。'},{id:'tom_collins',name:'Tom Collins',nameZh:'汤姆柯林斯',poeticZh:'聊两小时也不够的夜',poeticEn:'A Night That Keeps Going',base:'金酒',topNote:'柠檬',midNote:'糖浆',baseNote:'苏打气泡',color1:'#c8e060',color2:'#e0f078',glowColor:'#b0c848',recipe:['金酒 45ml','柠檬汁 25ml','糖浆 15ml','苏打水 90ml'],steps:['金酒柠檬糖浆加冰摇匀','滤入高杯加冰','苏打水补满','柠檬片装饰'],tags:['清爽','轻松','聊天','社交','松弛'],mood:['social','relaxed','easygoing'],flavor:['sour','sweet','sparkling'],strength:2,comment:'长饮杯，慢慢喝，不赶。正好聊天。',atmosphere:'配一个能聊两小时的朋友。'}];

const MOOD_KW={refreshed:['清爽','提神','运动','活力','爽','好天气','出去'],light:['轻松','随便','没事','还行','一般'],warm:['暖','温暖','被照顾','抱','毯子','冬天','冷'],comforted:['安慰','治愈','难过','哭','脆弱','心疼'],grounded:['踏实','稳','安心','沉稳'],reflective:['想想','沉思','安静','发呆','放空','静'],celebratory:['庆祝','开心','好消息','升职','生日','成功','赢','高兴','快乐'],bright:['阳光','开朗','笑','愉快'],social:['朋友','聚会','聊天','社交'],alert:['焦虑','紧张','压力','担心'],escapist:['逃离','想逃','放假','度假','海边','远方','不想上班'],dreamy:['做梦','幻想'],brooding:['丧','阴郁','独处','一个人','阴'],intense:['激烈','暴躁','烦','愤怒','发泄'],gentle:['温柔','细腻','软','慢'],final:['结束','翻篇','告别'],determined:['决定','目标','做事','计划'],tired:['累','疲惫','乏','想睡','没精神','休息','歇'],sad:['难过','伤心','心碎','失落']};
const FLAVOR_KW={fresh:['清爽','清淡','爽口','薄荷'],sweet:['甜','奶油','蜂蜜','糖'],sour:['酸','果味','青柠','柠檬'],bitter:['苦','咖啡','茶'],strong:['烈','劲大'],creamy:['奶','奶油','牛奶'],sparkling:['气泡','碳酸','起泡'],warm:['暖','热']};
const MOOD_CLR={tired:'#3a4560',sad:'#354060',reflective:'#3a4858',comforted:'#7a5030',warm:'#9a6020',celebratory:'#c89020',bright:'#d4a020',social:'#8ab040',alert:'#5a7050',refreshed:'#4a7a50',escapist:'#308080',brooding:'#2a3050',intense:'#803020',gentle:'#a06080'};
const MIX_MSGS=['正在分析你的情绪频率...','读取今日心情原材料...','配比基酒与香气层次...','调试最佳浓度...','你的专属配方已就绪。'];

/* ===== ABV 统一口径 =====
   全站只用「% ABV」表达酒精度，不再出现旧的 strength*0.12 那种假百分比。
   优先级：显式 abv > strength(1~5) 映射到真实鸡尾酒常见区间。
   1 微醺(≈8%) / 2 温和(≈14%) / 3 平衡(≈20%) / 4 有劲(≈27%) / 5 烈(≈34%) */
const ABV_BY_STRENGTH=[0,8,14,20,27,34];
function drinkABV(c){
  if(!c)return 20;
  if(typeof c.abv==='number'&&c.abv>0)return Math.round(c.abv);
  const st=Math.max(1,Math.min(5,Math.round(c.strength||3)));
  return ABV_BY_STRENGTH[st];
}
// ABV → 强度条宽度（以 40% ABV 为满格，更符合直觉）
function abvBarPct(abv){return Math.max(6,Math.min(100,abv/40*100));}

/* ===== 配方统一口径 =====
   全站有三种配方来源，格式各不相同：
     · 大模型返回      → [['金酒','45 ml'],...]   已是 [名称,用量] 对
     · COCKTAILS 本地库 → ['金酒 45ml',...]        名称与用量挤在一个字符串里
     · SOLO_BLEND/DEEP → 完全没有 recipe 字段
   结果页只认一种格式，所以这里统一收口成 [[名称,用量],...]。 */
function normRecipe(list){
  if(!Array.isArray(list))return [];
  return list.map(item=>{
    if(Array.isArray(item))return [String(item[0]||''),String(item[1]||'')];
    const s=String(item||'').trim();
    if(!s)return null;
    // '白朗姆酒 50ml' / '安高天娜苦精 2dash' / '方糖 1块' → 从末段切出用量
    const m=s.match(/^(.*?)[\s·]*([0-9]+(?:\.[0-9]+)?\s*(?:ml|ML|dash|tsp|oz|块|片|个|粒|角|滴)[\s\S]*|适量|少许|补满)$/);
    if(m&&m[1].trim())return [m[1].trim(),m[2].trim()];
    return [s,''];
  }).filter(Boolean);
}

/* 本地引擎兜底配方：SOLO_BLEND / DEEP 混合出来的酒没有 recipe，
   但结果页不该出现「配方空白」。这里按基酒 + 三段香调反推一份
   合乎标准配比的骨架，用量随 strength 浮动，保证与 ABV 自洽。 */
const BASE_ML_BY_STRENGTH=[0,30,40,45,50,55];
// 香调关键词 → 该材料的惯用形态与用量
const NOTE_FORM=[
  [/气泡|苏打|碳酸/,        '苏打水',     '补满'],
  [/香槟|Prosecco/i,       '香槟',       '90 ml'],
  [/汤力|奎宁/,            '汤力水',     '120 ml'],
  [/可乐/,                 '可乐',       '120 ml'],
  [/姜/,                   '姜汁啤酒',   '100 ml'],
  [/奶油|奶香|牛奶/,        '淡奶油',     '30 ml'],
  [/咖啡|espresso/i,       '浓缩咖啡',   '30 ml'],
  [/可可/,                 '可可利口酒', '20 ml'],
  [/蜂蜜/,                 '蜂蜜',       '15 ml'],
  [/糖蜜|甘蔗|焦糖|糖/,     '糖浆',       '15 ml'],
  [/青柠|莱姆|lime/i,      '青柠汁',     '20 ml'],
  [/柠檬|lemon/i,          '柠檬汁',     '20 ml'],
  [/葡萄柚|柚/,            '葡萄柚汁',   '60 ml'],
  [/橙皮|苦橙|血橙|柑|橙/,  '橙汁',       '60 ml'],
  [/荔枝/,                 '荔枝利口酒', '20 ml'],
  [/玫瑰|花香|白花/,        '玫瑰糖浆',   '15 ml'],
  [/桃/,                   '桃子利口酒', '20 ml'],
  [/黑加仑|蔓越莓|莓|樱桃/, '莓果糖浆',   '15 ml'],
  [/百香果|菠萝|杏|苹果/,   '果汁',       '60 ml'],
  [/薄荷|mint/i,           '薄荷叶',     '6 片'],
  [/苦艾/,                 '苦艾酒',     '20 ml'],
  [/苦草本|草本|杜松/,      '味美思',     '20 ml'],
  [/盐|海盐/,              '盐',         '少许'],
  [/肉桂/,                 '肉桂棒',     '1 根'],
  [/香草/,                 '香草糖浆',   '10 ml'],
  [/泥煤|烟熏|橡木/,        '苦精',       '2 dash'],
  [/陈皮/,                 '陈皮',       '1 片'],
  [/热水/,                 '热水',       '100 ml'],
];
function localRecipe(c){
  if(!c)return [];
  const st=Math.max(1,Math.min(5,Math.round(c.strength||3)));
  const base=c.base||'威士忌';
  // 起泡类基酒本身就是长饮主体，用量在 90-120ml，不能按烈酒的 40ml 给
  const sparkling=/香槟|Prosecco|Cava|起泡|气泡酒/i.test(base);
  const rows=[[base,sparkling?'90 ml':BASE_ML_BY_STRENGTH[st]+' ml']];
  const seen=new Set([base]);
  let total=sparkling?90:BASE_ML_BY_STRENGTH[st];   // 已累计的液体量，用于控总量
  [c.topNote,c.midNote,c.baseNote].forEach(note=>{
    if(!note||rows.length>=4)return;
    // 香调本来就是基酒自带的性格（金酒的杜松、香槟的气泡），
    // 再补一味材料反而画蛇添足，直接跳过
    if(base.includes(note)||note.includes(base))return;
    if(sparkling&&/气泡|苏打|碳酸/.test(note))return;
    if(/金酒|gin/i.test(base)&&/杜松/.test(note))return;
    const hit=NOTE_FORM.find(([re])=>re.test(note));
    if(!hit)return;
    if(seen.has(hit[1]))return;
    // 体积预算：两味大容量辅料（果汁 60 + 汤力水 120）叠在一起会冲到
    // 240ml 以上，既不像一杯酒，也和 abv 对不上。超预算就跳过这一味。
    const add=(String(hit[2]).match(/([0-9.]+)\s*ml/i)||[0,0])[1];
    if(total+Number(add)>180)return;
    total+=Number(add);
    seen.add(hit[1]);
    rows.push([hit[1],hit[2]]);
  });
  // 一种材料都没匹配上时，补一份最通用的酸甜骨架，避免只剩一行基酒
  if(rows.length===1){
    rows.push(['柠檬汁','20 ml'],['糖浆','15 ml']);
  }
  return rows;
}
/* 取这杯酒最终要展示的配方：优先大模型/本地库给的，没有才现推一份 */
function drinkRecipe(c){
  const r=normRecipe(c&&c.recipe);
  return r.length?r:localRecipe(c);
}

function detectCtx(text){
  const t=text.toLowerCase(),ms={},fs={};
  for(const[m,kws]of Object.entries(MOOD_KW)){let s=0;kws.forEach(k=>{if(t.includes(k))s+=3;});if(s)ms[m]=(ms[m]||0)+s;}
  for(const[f,kws]of Object.entries(FLAVOR_KW)){let s=0;kws.forEach(k=>{if(t.includes(k))s+=3;});if(s)fs[f]=(fs[f]||0)+s;}
  if(t.includes('心累')){ms['reflective']=(ms['reflective']||0)+5;ms['comforted']=(ms['comforted']||0)+3;}
  const topMood=Object.keys(ms).sort((a,b)=>ms[b]-ms[a])[0]||null;
  const topFlavor=Object.keys(fs).sort((a,b)=>fs[b]-fs[a])[0]||null;
  return{topMood,topFlavor,moodColor:MOOD_CLR[topMood]||'#4a5a48'};
}
function recommend(text){
  const{topMood,topFlavor}=detectCtx(text||'');
  const t=(text||'').toLowerCase();
  const scored=COCKTAILS.map(c=>{
    let s=0;
    if(topMood&&c.mood.includes(topMood))s+=5;
    if(topFlavor&&c.flavor.includes(topFlavor))s+=4;
    c.tags.forEach(tag=>{if(t.includes(tag))s+=2;});
    s+=Math.random()*2;
    return{c,s};
  });
  scored.sort((a,b)=>b.s-a.s);
  return{primary:scored[0].c,secondary:scored[1].c};
}

