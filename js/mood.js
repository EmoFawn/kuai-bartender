/* ========================================================
   心情调酒 · MOOD BLEND
   ======================================================== */

// 心情气泡定义：size 影响气泡大小，c 是气泡主色
const MOOD_BUBBLES=[
  {id:'tired',   emo:'😮‍💨', txt:'疲惫', c:'#4a5570', size:72, flavor:'醇厚', hint:'想被托住'},
  {id:'happy',   emo:'🥳',   txt:'开心', c:'#c99420', size:68, flavor:'明亮', hint:'值得气泡'},
  {id:'sad',     emo:'💧',   txt:'低落', c:'#3a4a70', size:70, flavor:'柔软', hint:'需要甜'},
  {id:'anxious', emo:'🌀',   txt:'焦虑', c:'#5a6a58', size:66, flavor:'清冽', hint:'先清醒'},
  {id:'lonely',  emo:'🌌',   txt:'孤独', c:'#453a6a', size:70, flavor:'深邃', hint:'一个人也辽阔'},
  {id:'angry',   emo:'🔥',   txt:'烦躁', c:'#9a3520', size:66, flavor:'辛辣', hint:'需要发泄'},
  {id:'calm',    emo:'🌙',   txt:'平静', c:'#2f6a72', size:68, flavor:'清淡', hint:'慢下来'},
  {id:'romantic',emo:'💗',   txt:'心动', c:'#a8447a', size:64, flavor:'花香', hint:'有点忐忑'},
  {id:'excited', emo:'⚡',   txt:'兴奋', c:'#b8601a', size:64, flavor:'冲击', hint:'点把火'},
  // ↓ 新增：更细的情绪颗粒度
  {id:'lost',    emo:'🌫️',  txt:'迷茫', c:'#4a5a62', size:68, flavor:'朦胧', hint:'看不清前面'},
  {id:'letdown', emo:'🪞',   txt:'失落', c:'#48485e', size:66, flavor:'涩', hint:'期待落空了'},
  {id:'nostalgic',emo:'🍂',  txt:'怀念', c:'#6a5040', size:68, flavor:'陈香', hint:'回不去了'},
  {id:'thinking',emo:'📖',   txt:'思考', c:'#3a5a6a', size:64, flavor:'微苦', hint:'想理清楚'},
  {id:'hopeful', emo:'🌱',   txt:'期待', c:'#3a8a5a', size:64, flavor:'清甜', hint:'有点盼头'},
  {id:'grateful',emo:'🫂',   txt:'感恩', c:'#b06848', size:66, flavor:'暖甜', hint:'被接住了'},
  {id:'lazy',    emo:'🛋️',  txt:'慵懒', c:'#7a6a4a', size:68, flavor:'绵软', hint:'什么都不想干'},
];

// 心情组合 → 酒的映射（前端 demo 用，后端接入后由大模型生成）
const BLEND_RULES=[
  {need:['tired','calm'],       out:{poeticZh:'夜色慢慢沉下来',poeticEn:'Where Night Settles Slow',base:'威士忌',topNote:'蜂蜜',midNote:'柠檬',baseNote:'肉桂',color1:'#8a5a20',color2:'#d0a050',glowColor:'#a06818',glass:'rocks',strength:2,comment:'不用急着睡，先让这杯替你把白天关上。'}},
  {need:['tired','anxious'],    out:{poeticZh:'清醒与沉醉的战场',poeticEn:'Battleground of Clarity',base:'伏特加',topNote:'咖啡',midNote:'可可',baseNote:'香草',color1:'#2e1a0c',color2:'#6a3818',glowColor:'#2a1808',glass:'coupe',strength:3,comment:'咖啡因和酒精同时报到，你选谁先到。'}},
  {need:['sad','lonely'],       out:{poeticZh:'一个人的星海',poeticEn:'Cosmos for One',base:'伏特加',topNote:'黑加仑',midNote:'蓝橙',baseNote:'柑橘皮',color1:'#241a52',color2:'#4a3a92',glowColor:'#2a2060',glass:'coupe',strength:3,comment:'独处不是缺席，是你终于安静地在场。'}},
  {need:['sad','tired'],        out:{poeticZh:'奶油裹住的低落',poeticEn:'Sadness Wrapped in Cream',base:'伏特加',topNote:'奶油',midNote:'咖啡',baseNote:'香草',color1:'#8a6a38',color2:'#e0c898',glowColor:'#c4a068',glass:'rocks',strength:2,comment:'奶油味会把丧裹住，咽下去就轻了。'}},
  {need:['happy','excited'],    out:{poeticZh:'金色时刻',poeticEn:'Golden Hour',base:'香槟',topNote:'气泡',midNote:'苦橙',baseNote:'白兰地',color1:'#b89818',color2:'#f0dc58',glowColor:'#c4a828',glass:'flute',strength:3,comment:'今天值得 bubbles，别省着。'}},
  {need:['happy','calm'],       out:{poeticZh:'阳光落在午后',poeticEn:'Afternoon of Sun',base:'Prosecco',topNote:'橙皮',midNote:'苦橙',baseNote:'气泡',color1:'#c85818',color2:'#f09040',glowColor:'#d05818',glass:'flute',strength:1,comment:'度数最低，快乐最高。这就是它的设计。'}},
  {need:['angry','excited'],    out:{poeticZh:'一刀切开的烈',poeticEn:'Sharp as a Clean Cut',base:'龙舌兰',topNote:'盐',midNote:'青柠',baseNote:'烟熏龙舌兰',color1:'#5a9a28',color2:'#a8d060',glowColor:'#80c048',glass:'coupe',strength:4,comment:'有些情绪需要被一刀切开，不是慢慢磨。'}},
  {need:['angry','tired'],      out:{poeticZh:'压不住的姜与雷',poeticEn:'Ginger and Thunder',base:'黑朗姆',topNote:'姜辣',midNote:'青柠',baseNote:'糖蜜',color1:'#2a3450',color2:'#5a6a88',glowColor:'#1a2438',glass:'highball',strength:3,comment:'先辣一下，把堵住的那口气冲开。'}},
  {need:['anxious','calm'],     out:{poeticZh:'清醒时刻的留白',poeticEn:'Clarity Between Thoughts',base:'金酒',topNote:'杜松',midNote:'青柠',baseNote:'奎宁',color1:'#88b878',color2:'#d8f0c0',glowColor:'#90c888',glass:'highball',strength:2,comment:'先清醒，再慢慢放松。顺序别搞反。'}},
  {need:['romantic','happy'],   out:{poeticZh:'绯色的告白',poeticEn:'Rosy Confession',base:'金酒',topNote:'荔枝',midNote:'玫瑰',baseNote:'蔓越莓',color1:'#9a2858',color2:'#f07098',glowColor:'#c03868',glass:'coupe',strength:2,comment:'心动的部分不用解释，喝掉就好。'}},
  {need:['romantic','lonely'],  out:{poeticZh:'没说出口的那句',poeticEn:'The Words Unsaid',base:'金酒',topNote:'玫瑰',midNote:'葡萄柚',baseNote:'苦艾',color1:'#7a2a52',color2:'#c05888',glowColor:'#8a3060',glass:'coupe',strength:3,comment:'有些话适合留在杯底，不适合说出口。'}},
  {need:['calm','lonely'],      out:{poeticZh:'薄荷味的禅',poeticEn:'Zen with Mint',base:'白朗姆',topNote:'薄荷',midNote:'青柠',baseNote:'甘蔗',color1:'#2a6a58',color2:'#78c0a0',glowColor:'#3a8a68',glass:'highball',strength:2,comment:'安静不是空的，是终于听见自己。'}},
  // ↓ 新增情绪的组合
  {need:['lost','anxious'],     out:{poeticZh:'雾里找方向',poeticEn:'Direction in the Fog',base:'金酒',topNote:'柚子',midNote:'杜松',baseNote:'海盐',color1:'#3a5560',color2:'#8ab0b8',glowColor:'#4a7080',glass:'coupe',strength:2,comment:'先别急着选路，站稳比走快重要。'}},
  {need:['lost','thinking'],    out:{poeticZh:'想不通的那部分',poeticEn:'The Part That Wont Add Up',base:'黑麦威士忌',topNote:'橙皮',midNote:'苦草本',baseNote:'橡木',color1:'#4a3a3a',color2:'#a08870',glowColor:'#5a4438',glass:'rocks',strength:3,comment:'不是每件事今晚都得有答案。'}},
  {need:['letdown','sad'],      out:{poeticZh:'落空之后',poeticEn:'After It Fell Through',base:'白兰地',topNote:'黑樱桃',midNote:'红茶',baseNote:'可可',color1:'#4a2830',color2:'#a06070',glowColor:'#6a3040',glass:'coupe',strength:3,comment:'失望说明你曾认真过，这不丢人。'}},
  {need:['nostalgic','lonely'], out:{poeticZh:'旧时光的回声',poeticEn:'Echo of Old Days',base:'威士忌',topNote:'陈皮',midNote:'焦糖',baseNote:'烟熏',color1:'#5a3a20',color2:'#c09050',glowColor:'#7a5028',glass:'rocks',strength:3,comment:'想念是一种温柔的疼，慢慢喝。'}},
  {need:['nostalgic','grateful'],out:{poeticZh:'谢谢那段日子',poeticEn:'Thanks for Those Days',base:'白兰地',topNote:'蜂蜜',midNote:'杏',baseNote:'橡木',color1:'#8a5a28',color2:'#e0b070',glowColor:'#a87038',glass:'rocks',strength:2,comment:'走过的都算数，包括不圆满的。'}},
  {need:['hopeful','excited'],  out:{poeticZh:'天要亮了',poeticEn:'Almost Daybreak',base:'龙舌兰',topNote:'血橙',midNote:'百香果',baseNote:'龙舌兰蜜',color1:'#c85828',color2:'#f8b060',glowColor:'#d87030',glass:'highball',strength:3,comment:'这股劲儿留着，明天用得上。'}},
  {need:['hopeful','calm'],     out:{poeticZh:'慢慢会好的',poeticEn:'It Gets Better, Slowly',base:'白朗姆',topNote:'青苹果',midNote:'薄荷',baseNote:'甘蔗',color1:'#2a7a52',color2:'#98d8b0',glowColor:'#3a9a68',glass:'highball',strength:2,comment:'不用快，只要还在往前。'}},
  {need:['lazy','calm'],        out:{poeticZh:'沙发上的一整晚',poeticEn:'All Night on the Couch',base:'咖啡利口酒',topNote:'奶油',midNote:'可可',baseNote:'香草',color1:'#6a5238',color2:'#d0b088',glowColor:'#8a6a48',glass:'rocks',strength:2,comment:'什么都不做，也是一种照顾自己。'}},
  {need:['lazy','tired'],       out:{poeticZh:'彻底关机',poeticEn:'Fully Powered Down',base:'威士忌',topNote:'奶油',midNote:'蜂蜜',baseNote:'橡木',color1:'#5a4028',color2:'#b89060',glowColor:'#7a5430',glass:'rocks',strength:2,comment:'今晚不营业，明天再说。'}},
  {need:['grateful','happy'],   out:{poeticZh:'满出来的那点甜',poeticEn:'Sweetness Overflowing',base:'香槟',topNote:'蜂蜜',midNote:'白桃',baseNote:'气泡',color1:'#b88818',color2:'#f8dc80',glowColor:'#c8a030',glass:'flute',strength:2,comment:'好事要说出来，气泡替你说。'}},
  {need:['thinking','calm'],    out:{poeticZh:'安静地想明白',poeticEn:'Thinking It Through',base:'金酒',topNote:'葡萄柚',midNote:'苦草本',baseNote:'奎宁',color1:'#3a5a62',color2:'#88b0b8',glowColor:'#48788a',glass:'coupe',strength:3,comment:'想清楚不需要热闹，需要时间。'}},
  {need:['romantic','hopeful'], out:{poeticZh:'也许可以试试',poeticEn:'Maybe Worth a Try',base:'金酒',topNote:'荔枝',midNote:'玫瑰',baseNote:'白桃',color1:'#a04868',color2:'#f8a0b8',glowColor:'#c05880',glass:'coupe',strength:2,comment:'心动本身就是答案的一半。'}},
];
// 单一心情兜底
const SOLO_BLEND={
  tired:   {poeticZh:'深夜的避风港',poeticEn:'Midnight Harbor',base:'威士忌',topNote:'蜂蜜',midNote:'柠檬',baseNote:'肉桂',color1:'#8a5a20',color2:'#d0a050',glowColor:'#a06818',glass:'rocks',strength:2,comment:'白天的事就放在白天，这杯只管今晚。'},
  happy:   {poeticZh:'阳光碳酸',poeticEn:'Sunny Fizz',base:'金酒',topNote:'橙皮',midNote:'柑橘',baseNote:'气泡',color1:'#c88818',color2:'#f0c848',glowColor:'#d4a020',glass:'highball',strength:2,comment:'把好心情倒进杯子，让气泡替你欢呼。'},
  sad:     {poeticZh:'奶油裹住的低落',poeticEn:'Sadness in Cream',base:'伏特加',topNote:'奶油',midNote:'咖啡',baseNote:'香草',color1:'#8a6a38',color2:'#e0c898',glowColor:'#c4a068',glass:'rocks',strength:2,comment:'不用马上好起来，先甜一口。'},
  anxious: {poeticZh:'一杯冷静',poeticEn:'A Glass of Calm',base:'金酒',topNote:'杜松',midNote:'青柠',baseNote:'奎宁',color1:'#88b878',color2:'#d8f0c0',glowColor:'#90c888',glass:'highball',strength:2,comment:'焦虑是身体在提醒你太用力了。慢点。'},
  lonely:  {poeticZh:'星海独酌',poeticEn:'Lone Cosmos',base:'伏特加',topNote:'黑加仑',midNote:'蓝橙',baseNote:'柑橘皮',color1:'#241a52',color2:'#4a3a92',glowColor:'#2a2060',glass:'coupe',strength:3,comment:'一个人的夜晚也可以很辽阔。'},
  angry:   {poeticZh:'不讨好的红',poeticEn:'An Unapologetic Red',base:'金酒',topNote:'橙皮',midNote:'苦草本',baseNote:'苦艾',color1:'#9a2418',color2:'#e05038',glowColor:'#b02818',glass:'rocks',strength:3,comment:'这杯不讨好任何人，包括你。但你会回来的。'},
  calm:    {poeticZh:'薄荷味的禅',poeticEn:'Zen with Mint',base:'白朗姆',topNote:'薄荷',midNote:'青柠',baseNote:'甘蔗',color1:'#2a6a58',color2:'#78c0a0',glowColor:'#3a8a68',glass:'highball',strength:2,comment:'慢下来，这杯不赶时间。'},
  romantic:{poeticZh:'绯色的告白',poeticEn:'Rosy Confession',base:'金酒',topNote:'荔枝',midNote:'玫瑰',baseNote:'蔓越莓',color1:'#9a2858',color2:'#f07098',glowColor:'#c03868',glass:'coupe',strength:2,comment:'心动的部分不用解释，喝掉就好。'},
  excited: {poeticZh:'电流冲击',poeticEn:'Electric Rush',base:'朗姆酒',topNote:'姜辣',midNote:'青柠',baseNote:'薄荷',color1:'#a03818',color2:'#e88840',glowColor:'#c04818',glass:'highball',strength:3,comment:'这股劲儿别浪费，今晚尽情燃烧。'},
  // ↓ 新增情绪的单选兜底
  lost:    {poeticZh:'雾里那条路',poeticEn:'The Road in Fog',base:'金酒',topNote:'柚子',midNote:'白花',baseNote:'海盐',color1:'#3a4a55',color2:'#8aa0a8',glowColor:'#4a6070',glass:'coupe',strength:2,comment:'看不清也没关系，先站稳再走。'},
  letdown: {poeticZh:'期待落地的声音',poeticEn:'Where Hope Landed',base:'黑麦威士忌',topNote:'橙皮',midNote:'红茶',baseNote:'可可',color1:'#5a3a30',color2:'#a87858',glowColor:'#6a4030',glass:'rocks',strength:3,comment:'落空过的人才知道要什么，这不算白等。'},
  nostalgic:{poeticZh:'旧唱片的余温',poeticEn:'Warmth of an Old Record',base:'白兰地',topNote:'陈皮',midNote:'焦糖',baseNote:'橡木',color1:'#6a4a28',color2:'#c89860',glowColor:'#8a6030',glass:'rocks',strength:3,comment:'回不去的地方，就留在杯底吧。'},
  thinking:{poeticZh:'想清楚之前',poeticEn:'Before It Makes Sense',base:'金酒',topNote:'葡萄柚',midNote:'苦草本',baseNote:'奎宁',color1:'#3a5a62',color2:'#7aa8b0',glowColor:'#48788a',glass:'coupe',strength:3,comment:'苦一点有助于诚实，慢慢想。'},
  hopeful: {poeticZh:'刚发芽的那点亮',poeticEn:'A Small Green Light',base:'白朗姆',topNote:'青苹果',midNote:'薄荷',baseNote:'甘蔗',color1:'#2a7a52',color2:'#8ad0a0',glowColor:'#3a9a68',glass:'highball',strength:2,comment:'有点盼头就够撑一晚了。'},
  grateful:{poeticZh:'被接住的那一刻',poeticEn:'The Moment You Were Caught',base:'威士忌',topNote:'蜂蜜',midNote:'杏',baseNote:'肉桂',color1:'#9a6428',color2:'#e8b868',glowColor:'#b07830',glass:'rocks',strength:2,comment:'记得这份暖，冷的时候能拿出来用。'},
  lazy:    {poeticZh:'什么都不想干',poeticEn:'Gloriously Doing Nothing',base:'咖啡利口酒',topNote:'奶油',midNote:'可可',baseNote:'香草',color1:'#6a5238',color2:'#c8a878',glowColor:'#8a6a48',glass:'rocks',strength:2,comment:'今晚不用有产出，躺着就是正事。'},
};

let picked=[];          // 已投入的心情 id
const MAX_PICK=3;
const bubbleField=document.getElementById('bubble-field');
const shakerZone=document.getElementById('shaker-zone');
const pickedList=document.getElementById('picked-list');
const btnMoodMix=document.getElementById('btn-mood-mix');
const btnMoodTxt=document.getElementById('btn-mood-txt');
const shakerHint=document.getElementById('shaker-hint');

/* ---- 渲染气泡池 ---- */
/* [移动端适配] 气泡池原本是固定 310px 高 + 固定 px 直径的气泡。
   在 iPhone SE 这类矮屏上，池子 + 酒杯 + 按钮总高超出视口，
   最后一行气泡和「开始调制」按钮会被裁掉（看不见也点不到）。
   这里按视口高度算一个统一缩放系数，池高与气泡直径一起等比缩小 ——
   只压池高不压气泡的话，气泡会互相重叠糊成一团。

   [BUGFIX·气泡突然变小] 这个系数必须"锁住"，不能每次渲染都实时读 innerHeight。
   原因：移动端浏览器地址栏会随滚动收起/展开，innerHeight 随之跳变 60~100px。
   之前 moodScale() 每次都实时计算，于是：
     · 地址栏一收起 → resize 事件 → 重排 → 气泡整体缩放一档；
     · DEEP 每翻一层都会 renderDeepLayer() 重新读一次 innerHeight，
       只要中间地址栏状态变了，下一层气泡就会突然大一圈或小一圈。
   这就是"DEEP 模式图标会突然变小，很诡异"的根因。
   现在：进页面时算一次并缓存；只有真正的横竖屏切换（宽度也变了）
   才重新计算 —— 地址栏伸缩只改高度不改宽度，因此不会再触发缩放。 */
let _moodScale=null;       // 缓存的缩放系数
let _moodScaleW=0;         // 计算这个系数时的视口宽度

function computeMoodScale(){
  const h=window.innerHeight||800;
  // 设计基准：视口 880px 时 = 1.0；越矮越小，最低 0.62 保证还能点得中
  const s=(h-300)/580;
  return Math.max(0.62,Math.min(1,s));
}
function moodScale(){
  if(_moodScale===null){
    _moodScale=computeMoodScale();
    _moodScaleW=window.innerWidth;
  }
  return _moodScale;
}
/* 仅在宽度变化（= 真的转屏/改窗口）时才允许刷新系数 */
function refreshMoodScaleIfNeeded(){
  if(window.innerWidth===_moodScaleW)return false;
  _moodScale=computeMoodScale();
  _moodScaleW=window.innerWidth;
  return true;
}
/* 气泡池实际高度（DEEP 池要减去 .deep-trail 那一行，保持两模式杯子落点一致） */
function moodFieldH(base){return Math.round(base*moodScale());}

function layoutBubbles(){
  bubbleField.innerHTML='';
  const s=moodScale();
  bubbleField.style.height=moodFieldH(310)+'px';
  /* 4 列 × N 行自动网格：每格内做小幅随机偏移，
     保留错落的手工感，同时能容纳任意数量的心情词。 */
  const COLS=4;
  const rows=Math.ceil(MOOD_BUBBLES.length/COLS);
  const colW=100/COLS;          // 每列宽度（%）
  const rowH=100/rows;          // 每行高度（%）
  MOOD_BUBBLES.forEach((m,i)=>{
    const col=i%COLS,row=Math.floor(i/COLS);
    // 奇数行整体右移半格，形成蜂巢式错落
    const stagger=(row%2)?colW*0.28:0;
    const lx=col*colW+stagger+(Math.random()*3-1.5);
    const ty=row*rowH+(Math.random()*4-2);
    const sz=Math.round(m.size*s);
    const el=document.createElement('div');
    el.className='bubble';
    el.dataset.id=m.id;
    el.style.cssText=`left:${Math.max(0,Math.min(78,lx)).toFixed(1)}%;
      top:${Math.max(0,Math.min(80,ty)).toFixed(1)}%;
      width:${sz}px;height:${sz}px;
      background:radial-gradient(circle at 32% 28%,${m.c}f0,${m.c}88 62%,${m.c}44);
      animation-delay:${(i*0.24).toFixed(2)}s;`;
    el.innerHTML=`<div class="bub-emo">${m.emo}</div><div class="bub-txt">${m.txt}</div>`;
    bindDrag(el,m);
    bubbleField.appendChild(el);
  });
}

/* 只在「真的转屏 / 改窗口大小」时重排气泡池。
   [BUGFIX·气泡突然变小] 之前这里用「高度变化 > 60px」当触发条件，
   但移动端地址栏收起/展开正好就是 60~100px 的高度跳变 ——
   于是用户只要滚一下页面，气泡就会整体缩放一档，观感非常诡异。
   现在改用「宽度变化」判定：地址栏伸缩只改高度不改宽度，
   而横竖屏切换宽高都变，正好能区分这两种情况。 */
let _moodRelayoutT=null;
function scheduleMoodRelayout(){
  clearTimeout(_moodRelayoutT);
  _moodRelayoutT=setTimeout(()=>{
    if(!refreshMoodScaleIfNeeded())return;   // 宽度没变 → 不是转屏，不动
    killGhost();
    layoutBubbles();
    syncShaker();
    // DEEP 正在用的话，同步重铺当前层
    if(typeof deepOn!=='undefined'&&deepOn&&typeof renderDeepLayer==='function'){
      renderDeepLayer();
    }
  },220);
}
window.addEventListener('resize',scheduleMoodRelayout);
window.addEventListener('orientationchange',scheduleMoodRelayout);

/* ---- 拖拽（Pointer Events，同时支持鼠标与触屏） ----
   [BUGFIX] 之前 ghost（跟随光标的克隆气泡）会卡在画面上不动，根因三条：
   1) pointermove / pointerup 绑在气泡自身。一旦指针捕获被系统中断
      （切后台、滚动接管、右键、多指触摸、元素被 innerHTML 重建），
      就再也收不到 pointerup，ghost 永久残留在页面上；
   2) 每个气泡各自持有一份 ghost 变量，连续快速拖动会生成多个 ghost 互相覆盖；
   3) pointerup 之后浏览器还会补一次 click，导致重复 addMood。
   现在改为：全局单例 ghost + 事件挂在 document + requestAnimationFrame 合帧
   写 transform（避免高频 pointermove 掉帧）+ 多重兜底清理。 */
let dragGhost=null,dragCtx=null,dragRAF=0;

// 所有异常路径统一走这里，保证画面上绝不会留下悬空气泡
function killGhost(){
  if(dragRAF){cancelAnimationFrame(dragRAF);dragRAF=0;}
  if(dragGhost){dragGhost.remove();dragGhost=null;}
  if(dragCtx){
    dragCtx.el.style.opacity='';
    try{dragCtx.el.releasePointerCapture(dragCtx.pid);}catch(_){}
    dragCtx=null;
  }
  shakerZone.classList.remove('hover');
  if(deepShaker)deepShaker.classList.remove('hover');
}

// 当前生效的投放区：DEEP 开着就是纵向那只杯子
function activeZone(){
  return (deepOn&&deepShaker)?deepShaker:shakerZone;
}

function inShaker(x,y,zoneEl){
  const z=(zoneEl||activeZone()).getBoundingClientRect();
  return x>z.left-16&&x<z.right+16&&y>z.top-16&&y<z.bottom+16;
}

function onDragMove(e){
  if(!dragCtx||!dragGhost||e.pointerId!==dragCtx.pid)return;
  dragCtx.x=e.clientX;dragCtx.y=e.clientY;
  if(Math.abs(e.clientX-dragCtx.ox)+Math.abs(e.clientY-dragCtx.oy)>5)dragCtx.moved=true;
  // 合帧：一帧只写一次 transform，避免 pointermove 高频触发布局抖动
  if(!dragRAF){
    dragRAF=requestAnimationFrame(()=>{
      dragRAF=0;
      if(!dragCtx||!dragGhost)return;
      dragGhost.style.transform=
        `translate3d(${dragCtx.x-dragCtx.gx}px,${dragCtx.y-dragCtx.gy}px,0) scale(1.14)`;
      dragCtx.zone.classList.toggle('hover',
        inShaker(dragCtx.x,dragCtx.y,dragCtx.zone));
    });
  }
}

function onDragEnd(e){
  if(!dragCtx)return;
  if(e&&e.pointerId!==undefined&&e.pointerId!==dragCtx.pid)return;
  const ctx=dragCtx;
  const x=(e&&e.clientX!==undefined)?e.clientX:ctx.x;
  const y=(e&&e.clientY!==undefined)?e.clientY:ctx.y;
  const drop=inShaker(x,y,ctx.zone),moved=ctx.moved;
  killGhost();
  // 拖进杯中 → 投入；几乎没移动 → 当作点击投入（移动端友好）
  if(drop||!moved)ctx.onDrop(ctx.mood,ctx.el);
}

document.addEventListener('pointermove',onDragMove,{passive:true});
document.addEventListener('pointerup',onDragEnd);
document.addEventListener('pointercancel',onDragEnd);
// 兜底：捕获丢失 / 窗口失焦 / 切到后台 / 按 Esc，一律清掉 ghost
document.addEventListener('lostpointercapture',()=>{if(dragCtx)onDragEnd(null);});
window.addEventListener('blur',killGhost);
document.addEventListener('visibilitychange',()=>{if(document.hidden)killGhost();});
window.addEventListener('keydown',e=>{if(e.key==='Escape')killGhost();});

/* opts.onDrop  投放回调，默认走横向模式的 addMood
   opts.canDrag 是否允许开始拖动，默认按横向模式的已选/上限判断
   opts.zone    投放区元素，默认当前生效的杯子 */
function bindDrag(el,mood,opts){
  opts=opts||{};
  const onDrop=opts.onDrop||(m=>addMood(m));
  const canDrag=opts.canDrag||(()=>!(picked.includes(mood.id)||picked.length>=MAX_PICK));
  el.addEventListener('pointerdown',e=>{
    if(e.button!==undefined&&e.button!==0)return;   // 只响应主键
    if(!canDrag())return;
    killGhost();                                   // 先清掉上一次可能的残留
    e.preventDefault();
    const r=el.getBoundingClientRect();
    try{el.setPointerCapture(e.pointerId);}catch(_){}
    dragCtx={el:el,mood:mood,pid:e.pointerId,
      zone:opts.zone||activeZone(),onDrop:onDrop,
      gx:e.clientX-r.left,gy:e.clientY-r.top,       // 光标在气泡内的偏移
      ox:e.clientX,oy:e.clientY,                   // 起点，用于判断是否真的拖动过
      x:e.clientX,y:e.clientY,moved:false};
    dragGhost=el.cloneNode(true);
    dragGhost.className='bubble dragging';
    dragGhost.style.cssText=el.style.cssText+
      `position:fixed;left:0;top:0;margin:0;pointer-events:none;`+
      `animation:none;transition:none;will-change:transform;`+
      `transform:translate3d(${r.left}px,${r.top}px,0) scale(1.14);`;
    document.body.appendChild(dragGhost);
    el.style.opacity='0.28';
  });
}

/* ---- 投入 / 移除心情 ---- */
function addMood(mood){
  if(picked.includes(mood.id)||picked.length>=MAX_PICK)return;
  picked.push(mood.id);
  splashEffect(mood.c);
  syncShaker();
}
function removeMood(id){
  picked=picked.filter(p=>p!==id);
  syncShaker();
}

function splashEffect(color,zoneEl){
  const s=document.createElement('div');
  s.className='splash';
  s.style.background=`radial-gradient(circle,${color}cc,transparent 70%)`;
  (zoneEl||shakerZone).appendChild(s);
  setTimeout(()=>s.remove(),620);
}

/* ---- 同步杯中液体 / 标签 / 按钮 ---- */
function syncShaker(){
  const n=picked.length;
  const moods=picked.map(id=>MOOD_BUBBLES.find(m=>m.id===id));

  // 液体高度与混色
  const liquid=document.getElementById('mix-liquid');
  const surface=document.getElementById('mix-surface');
  const heights=[0,38,64,86];
  const h=heights[n];
  const topY=138-h;
  liquid.setAttribute('y',topY);
  liquid.setAttribute('height',h);
  surface.setAttribute('cy',topY);
  surface.setAttribute('rx',n?38:0);

  if(n){
    const mixed=mixColors(moods.map(m=>m.c));
    document.getElementById('mixC1').setAttribute('stop-color',lighten(mixed,26));
    document.getElementById('mixC2').setAttribute('stop-color',mixed);
  }

  // 心情标签（点击可移除）
  pickedList.innerHTML='';
  moods.forEach(m=>{
    const t=document.createElement('div');
    t.className='picked-tag';
    t.innerHTML=`${m.emo} ${m.txt} <span style="opacity:0.5;">×</span>`;
    t.title='点击移除';
    t.onclick=()=>removeMood(m.id);
    pickedList.appendChild(t);
  });

  // 气泡置灰
  document.querySelectorAll('#bubble-field .bubble').forEach(b=>{
    b.classList.toggle('used',picked.includes(b.dataset.id));
  });

  // 提示与按钮
  shakerHint.style.opacity=n?'0':'1';
  btnMoodMix.disabled=n===0;
  btnMoodTxt.textContent=n===0?'先选一个心情'
    :n===1?'开始调制 / 还能再加 2 个'
    :n===2?'开始调制 / 还能再加 1 个'
    :'开始调制 / Start Blending';
}

/* ---- 颜色工具 ---- */
function mixColors(list){
  const rgb=list.map(hex=>[
    parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)
  ]);
  const avg=[0,1,2].map(i=>Math.round(rgb.reduce((s,c)=>s+c[i],0)/rgb.length));
  return '#'+avg.map(v=>v.toString(16).padStart(2,'0')).join('');
}
function lighten(hex,amt){
  const v=[1,3,5].map(i=>Math.min(255,parseInt(hex.slice(i,i+2),16)+amt));
  return '#'+v.map(x=>x.toString(16).padStart(2,'0')).join('');
}

/* ---- 本地混合引擎（后端接入后由大模型替代） ---- */
function blendLocal(ids){
  if(ids.length===1)return {...SOLO_BLEND[ids[0]]};
  // 找命中最多的规则
  let best=null,bestHit=0;
  BLEND_RULES.forEach(r=>{
    const hit=r.need.filter(n=>ids.includes(n)).length;
    if(hit>bestHit||(hit===bestHit&&hit===r.need.length&&hit>0)){bestHit=hit;best=r;}
  });
  if(best&&bestHit>=2)return {...best.out};
  // 兜底：以第一个心情为主，把其他心情的风味并进香调
  const solo={...SOLO_BLEND[ids[0]]};
  const others=ids.slice(1).map(i=>MOOD_BUBBLES.find(m=>m.id===i));
  if(others.length){
    solo.poeticZh=solo.poeticZh+'（混）';
    solo.midNote=others[0].flavor;
  }
  return solo;
}

/* ---- 调制流程 ---- */
function moodShowSub(id){
  document.querySelectorAll('#pane-mood .sub').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

const MOOD_MIX_MSGS=['正在称量每一种心情...','让它们在杯中相遇...','寻找能承住这些情绪的基酒...','校准香气层次...','你的心情已经变成一杯酒。'];

/* ---- 调制执行（心情池 & DEEP 纵向探究 共用） ----
   moods: [{id,emo,txt,flavor,c}]
   deep:  纵向模式下的 {path:[...], layers:[...]}，普通模式传 null */
async function runMoodMix(moods,deep){
  if(!moods||!moods.length)return;
  const ids=moods.map(m=>m.id);
  const ml=document.getElementById('mood-mix-liq');
  const steps=document.getElementById('mood-mix-steps');
  steps.innerHTML='';
  ml.style.background=mixColors(moods.map(m=>m.c));
  ml.style.height='0%';
  moodShowSub('mood-sub-mixing');
  // 先把卡片置为 loading 占位
  document.getElementById('mood-bar-card').classList.add('loading');
  setTimeout(()=>{ml.style.height='68%';},200);

  // 纵向模式换一套更"往下挖"的过程文案
  const msgs=deep?[
    '顺着你给的路径往下走...',
    '从笼统的心情，到具体的那一种...',
    '找一支能接住这种情绪的基酒...',
    '把你想加的那点味道调进去...',
    '这杯是你自己一层层挖出来的。'
  ]:MOOD_MIX_MSGS;

  // 预留：后端接入点（当前失败则用本地引擎）
  const aiPromise=fetch('/api/moodblend',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      moods:moods.map(m=>({id:m.id,txt:m.txt,flavor:m.flavor})),
      mode:deep?'deep':'wide',
      // 纵向路径一并交给后端，让大模型能理解"层层递进"的语义
      path:deep?deep.path:null
    })
  }).then(r=>r.json()).then(d=>(d&&d.primary&&!d._noKey)?d.primary:null)
    .catch(()=>null);

  msgs.forEach((msg,i)=>{
    setTimeout(()=>{
      const div=document.createElement('div');
      div.className='mix-step';
      div.innerHTML=`<div class="step-dot"></div><div class="step-txt">${msg}</div>`;
      steps.appendChild(div);
      setTimeout(()=>div.classList.add('vis'),50);
    },i*620);
  });

  const minWait=new Promise(r=>setTimeout(r,msgs.length*620+500));
  const [ai]=await Promise.all([aiPromise,minWait]);

  const drink=ai||(deep?blendDeep(deep):blendLocal(ids));
  renderMoodResult(drink,moods,!!ai,deep);
  moodShowSub('mood-sub-result');
}

btnMoodMix.addEventListener('click',()=>{
  if(!picked.length)return;
  runMoodMix(picked.map(id=>MOOD_BUBBLES.find(m=>m.id===id)),null);
});

function renderMoodResult(c,moods,byAI,deep){
  // 记住当前这杯，供星号珍藏使用
  lastMoodDrink=c;
  lastMoodBlend=deep
    ? deep.path.map(p=>p.emo+p.txt).join(' → ')
    : moods.map(m=>m.emo+m.txt).join(' + ');
  syncKeepBtn(document.getElementById('mood-keep'),c,'mood');
  document.getElementById('m-name-zh').textContent=c.poeticZh||'—';
  document.getElementById('m-name-en').textContent=c.poeticEn||'—';
  // 纵向模式：用 ↓ 串起整条路径，体现"往下挖"而不是"并列混合"
  document.getElementById('m-blend').textContent=deep
    ? deep.path.map(p=>p.emo+p.txt).join(' → ')
    : moods.map(m=>m.emo+m.txt).join(' + ');
  document.getElementById('m-base').textContent=c.base||'—';
  renderRecipe('m',c);
  document.getElementById('m-top').textContent=c.topNote||'—';
  document.getElementById('m-mid').textContent=c.midNote||'—';
  document.getElementById('m-base-note').textContent=c.baseNote||'—';
  document.getElementById('m-comment').textContent=`"${c.comment||''}"`;
  const abv=drinkABV(c);
  document.getElementById('m-pct').textContent=abv+'% ABV';
  setTimeout(()=>{document.getElementById('m-bar').style.width=abvBarPct(abv)+'%';},300);
  document.getElementById('m-glow').style.background=c.glowColor||c.color1;
  renderGlassInto('m-glass',c);

  // 调酒师卡片
  fillBarCard('mood-bar-card','mood-card-headline','mood-card-body','mood-card-tag',c,byAI);
}

function resetMood(){
  picked=[];
  syncShaker();
  // 从结果页返回时，尊重当前开关状态：DEEP 开着就回到纵向流程
  if(deepOn){startDeep();}
  else{moodShowSub('mood-sub-pick');}
}
document.getElementById('mood-back').addEventListener('click',resetMood);
document.getElementById('mood-remix').addEventListener('click',resetMood);
document.getElementById('mood-save').addEventListener('click',()=>{
  if(!lastMoodDrink)return;
  saveCard(lastMoodDrink,{
    from:lastMoodBlend?'今夜心情：'+lastMoodBlend:'',
  });
});

