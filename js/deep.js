/* ========================================================
   DEEP · 纵向探究心情
   横向（气泡池）= 一次并列拼贴多种情绪；
   纵向（DEEP）  = 顺着同一种心情一层层往下问，越问越具体。
   三层：① 笼统的心情 → ② 细分的情绪 → ③ 想加的味道
   交互形式与横向一致：都是把气泡拖进杯子里。
   ======================================================== */

// ① 第一层：笼统的心情（大类）—— 9 个，正好 3×3
const DEEP_L1=[
  {id:'tired', emo:'😮‍💨',txt:'累',   size:70,c:'#4a5570'},
  {id:'down',  emo:'💧',  txt:'低落', size:70,c:'#3a4a70'},
  {id:'restless',emo:'🌀',txt:'心乱', size:68,c:'#5a6a58'},
  {id:'angry', emo:'🔥',  txt:'烦',   size:66,c:'#9a3520'},
  {id:'calm',  emo:'🌙',  txt:'平静', size:68,c:'#2f6a72'},
  {id:'good',  emo:'✨',  txt:'不错', size:66,c:'#c99420'},
  {id:'numb',  emo:'🫥',  txt:'没感觉',size:68,c:'#4a4a52'},
  {id:'longing',emo:'🕯️',txt:'想念', size:68,c:'#6a5040'},
  {id:'pressed',emo:'🧱', txt:'压力大',size:70,c:'#5a4a3a'},
];

// ② 第二层：细分的情绪（把大类拆细）
const DEEP_L2={
  tired:[
    {id:'body_tired', emo:'🦴',txt:'身体累',  size:70,c:'#4a5570'},
    {id:'brain_tired',emo:'🧠',txt:'脑子累',  size:70,c:'#453a6a'},
    {id:'social_tired',emo:'🎭',txt:'应付人累',size:68,c:'#5a4a62'},
    {id:'burnout',    emo:'🪫',txt:'提不起劲',size:66,c:'#454550'},
    {id:'sleepless',  emo:'🌃',txt:'睡不着',  size:68,c:'#3a4258'},
    {id:'overloaded', emo:'📚',txt:'事情太多',size:66,c:'#544a3a'},
    {id:'eye_tired',  emo:'👁️',txt:'眼睛酸',size:66,c:'#4a4a5a'},
    {id:'talked_out', emo:'💬',txt:'说不动话',size:68,c:'#50465a'},
    {id:'weekend_gone',emo:'📅',txt:'休完还累',size:66,c:'#484f42'},
  ],
  down:[
    {id:'sad',     emo:'😔',txt:'难过',   size:70,c:'#3a4a70'},
    {id:'lonely',  emo:'🌌',txt:'孤独',   size:70,c:'#453a6a'},
    {id:'nostalgic',emo:'🍂',txt:'怀念',  size:68,c:'#6a5040'},
    {id:'letdown', emo:'🪞',txt:'失望',   size:66,c:'#48485e'},
    {id:'heartbroken',emo:'💔',txt:'心碎',size:70,c:'#5a2a3a'},
    {id:'worthless',emo:'🥀',txt:'觉得没用',size:66,c:'#3f3a4a'},
    {id:'left_out', emo:'🪑',txt:'被落下',size:68,c:'#3a4452'},
    {id:'homesick', emo:'🌂',txt:'无依无靠',size:66,c:'#44445a'},
    {id:'cant_cry',  emo:'🫧',txt:'哭不出来',size:68,c:'#3a4048'},
  ],
  restless:[
    {id:'anxious', emo:'😬',txt:'焦虑',   size:70,c:'#5a6a58'},
    {id:'nervous', emo:'⚡',txt:'紧张',   size:66,c:'#6a6a3a'},
    {id:'confused',emo:'🌫️',txt:'迷茫',  size:70,c:'#4a5a62'},
    {id:'excited', emo:'💗',txt:'心动',   size:68,c:'#a8447a'},
    {id:'impatient',emo:'⏳',txt:'等不了',size:66,c:'#6a5238'},
    {id:'scared',  emo:'🫨',txt:'有点怕', size:68,c:'#44506a'},
    {id:'cant_focus',emo:'📶',txt:'难专注',size:66,c:'#54604a'},
    {id:'waiting',  emo:'📬',txt:'在等回复',size:68,c:'#4a5a5a'},
    {id:'torn',     emo:'🤝',txt:'很纠结', size:66,c:'#5a4a60'},
  ],
  angry:[
    {id:'irritated',emo:'😤',txt:'烦躁',  size:70,c:'#9a3520'},
    {id:'unfair',  emo:'⚖️',txt:'憋屈',  size:70,c:'#8a4a30'},
    {id:'furious', emo:'💥',txt:'很想炸', size:68,c:'#a83018'},
    {id:'blame',   emo:'🪨',txt:'气自己', size:66,c:'#6a3a2a'},
    {id:'betrayed',emo:'🗡️',txt:'被辜负',size:68,c:'#7a2a2a'},
    {id:'fedup',   emo:'🙄',txt:'懒得吵', size:66,c:'#5a4a44'},
    {id:'nitpicked',emo:'📌',txt:'被挑剔',size:66,c:'#6a4438'},
    {id:'wasted',  emo:'🗑️',txt:'白忙一场',size:68,c:'#5a4030'},
    {id:'no_reason',emo:'🌫️',txt:'说不清在气什么',size:66,c:'#4a423a'},
  ],
  calm:[
    {id:'peaceful',emo:'🍃',txt:'松弛',   size:70,c:'#2f6a72'},
    {id:'thinking',emo:'📖',txt:'想事情', size:68,c:'#3a5a6a'},
    {id:'empty',   emo:'⬜',txt:'空空的', size:66,c:'#48485e'},
    {id:'tender',  emo:'🫧',txt:'温柔',   size:70,c:'#8a6a80'},
    {id:'lazy',    emo:'🛋️',txt:'慵懒',  size:68,c:'#7a6a4a'},
    {id:'clear',   emo:'💎',txt:'很清醒', size:66,c:'#3a6a7a'},
    {id:'slow_down',emo:'🐌',txt:'想慢下来',size:68,c:'#3a6a5a'},
    {id:'satisfied',emo:'🍛',txt:'刚刚好',size:66,c:'#7a6a3a'},
    {id:'alone_ok',emo:'🪑',txt:'一个人挺好',size:68,c:'#446a6a'},
  ],
  good:[
    {id:'happy',   emo:'🥳',txt:'开心',   size:70,c:'#c99420'},
    {id:'proud',   emo:'🏅',txt:'有成就感',size:68,c:'#b08428'},
    {id:'warm',    emo:'🫂',txt:'被暖到', size:70,c:'#b06848'},
    {id:'free',    emo:'🪽',txt:'轻松了', size:66,c:'#3a8a72'},
    {id:'hopeful', emo:'🌱',txt:'有盼头', size:68,c:'#3a8a5a'},
    {id:'grateful',emo:'🙏',txt:'感恩',   size:66,c:'#a87848'},
    {id:'seen',    emo:'👁️',txt:'被看见',size:66,c:'#a06838'},
    {id:'lucky',   emo:'🍀',txt:'运气不错',size:68,c:'#4a8a48'},
    {id:'excited_good',emo:'🎊',txt:'想庆祝',size:70,c:'#c07828'},
  ],
  numb:[
    {id:'flat',    emo:'➖',txt:'平平的', size:70,c:'#4a4a52'},
    {id:'detached',emo:'🪟',txt:'像在看别人',size:70,c:'#44505a'},
    {id:'tired_of',emo:'🫗',txt:'提不起兴趣',size:68,c:'#504a44'},
    {id:'autopilot',emo:'🤖',txt:'自动驾驶',size:66,c:'#4a5258'},
    {id:'quiet_sad',emo:'🌑',txt:'说不出哪不对',size:68,c:'#3a3a48'},
    {id:'need_rest',emo:'🛌',txt:'只想躺平',size:66,c:'#54504a'},
    {id:'no_want',  emo:'🕳️',txt:'什么都不想要',size:68,c:'#48484e'},
    {id:'day_same', emo:'🔁',txt:'每天一样',size:66,c:'#4e4a44'},
    {id:'watching', emo:'📺',txt:'只想放空',size:68,c:'#44464e'},
  ],
  longing:[
    {id:'miss_someone',emo:'📞',txt:'想一个人',size:70,c:'#6a4050'},
    {id:'miss_home', emo:'🏠',txt:'想回家', size:70,c:'#6a5040'},
    {id:'miss_past', emo:'📷',txt:'想回到从前',size:68,c:'#5a4a3a'},
    {id:'unsaid',    emo:'✉️',txt:'有话没说',size:68,c:'#4a4058'},
    {id:'wanna_see', emo:'🚉',txt:'想见面', size:66,c:'#6a4a4a'},
    {id:'let_go',    emo:'🕊️',txt:'想放下',size:66,c:'#4a5a62'},
    {id:'old_friend',emo:'🧃',txt:'想起老朋友',size:68,c:'#5a5a44'},
    {id:'regret',    emo:'🪺',txt:'有点后悔',size:66,c:'#54424a'},
    {id:'keep_warm', emo:'🧣',txt:'想被记得',size:68,c:'#6a4a3a'},
  ],
  pressed:[
    {id:'deadline',  emo:'⏰',txt:'被deadline追',size:70,c:'#7a4a2a'},
    {id:'expected',  emo:'🎯',txt:'被期待着',size:68,c:'#5a5238'},
    {id:'no_way_out',emo:'🧱',txt:'喘不过气',size:70,c:'#4a4038'},
    {id:'money',     emo:'💸',txt:'钱的事', size:66,c:'#3a5244'},
    {id:'compare',   emo:'📊',txt:'被比较', size:66,c:'#4a4a5a'},
    {id:'responsible',emo:'🎒',txt:'责任太重',size:68,c:'#5a4438'},
    {id:'cant_fail', emo:'🪤',txt:'不能出错',size:66,c:'#54383a'},
    {id:'no_time',   emo:'🌪️',txt:'时间不够',size:68,c:'#4a5250'},
    {id:'alone_carry',emo:'🏔️',txt:'只能自己扛',size:70,c:'#44485a'},
  ],
};

// ③ 第三层：想加的味道（决定这杯酒的性格）
const DEEP_L3=[
  {id:'sweet', emo:'🍯',txt:'甜',   size:70,c:'#b0782a',taste:'甜',  strength:2,
   base:'威士忌',topNote:'蜂蜜',midNote:'柠檬',baseNote:'肉桂',
   color1:'#8a5a20',color2:'#d0a050',glowColor:'#a06818',glass:'rocks',
   poeticEn:'Something Sweet Tonight',comment:'不用讲道理，先甜一口。'},
  {id:'bitter',emo:'☕',txt:'苦',   size:68,c:'#4a3524',taste:'苦',  strength:3,
   base:'金酒',topNote:'橙皮',midNote:'苦草本',baseNote:'苦艾',
   color1:'#7a2a18',color2:'#c05838',glowColor:'#8a3018',glass:'rocks',
   poeticEn:'The Bitter Kind of Honest',comment:'这杯不哄你，但它说的都是真的。'},
  {id:'sour',  emo:'🍋',txt:'酸',   size:68,c:'#8a8a28',taste:'酸',  strength:3,
   base:'龙舌兰',topNote:'盐',midNote:'青柠',baseNote:'烟熏龙舌兰',
   color1:'#5a9a28',color2:'#a8d060',glowColor:'#80c048',glass:'coupe',
   poeticEn:'Sharp as a Clean Cut',comment:'有些情绪要被一刀切开，不是慢慢磨。'},
  {id:'fresh', emo:'🌿',txt:'清爽', size:70,c:'#2a7a5a',taste:'清冽',strength:2,
   base:'金酒',topNote:'杜松',midNote:'青柠',baseNote:'奎宁',
   color1:'#88b878',color2:'#d8f0c0',glowColor:'#90c888',glass:'highball',
   poeticEn:'Clarity, Finally',comment:'先清醒，再慢慢放松。顺序别搞反。'},
  {id:'strong',emo:'🥃',txt:'烈',   size:66,c:'#7a3018',taste:'炽烈',strength:4,
   base:'黑朗姆',topNote:'姜辣',midNote:'青柠',baseNote:'糖蜜',
   color1:'#2a3450',color2:'#5a6a88',glowColor:'#1a2438',glass:'highball',
   poeticEn:'Ginger and Thunder',comment:'先辣一下，把堵住的那口气冲开。'},
  {id:'fizzy', emo:'🫧',txt:'气泡', size:70,c:'#b09420',taste:'气泡',strength:2,
   base:'香槟',topNote:'气泡',midNote:'苦橙',baseNote:'白兰地',
   color1:'#b89818',color2:'#f0dc58',glowColor:'#c4a828',glass:'flute',
   poeticEn:'Golden Hour',comment:'今晚值得 bubbles，别省着。'},
  {id:'creamy',emo:'🥛',txt:'奶香', size:68,c:'#8a6a48',taste:'奶香',strength:2,
   base:'伏特加',topNote:'奶油',midNote:'咖啡',baseNote:'香草',
   color1:'#8a6a38',color2:'#e0c898',glowColor:'#c4a068',glass:'rocks',
   poeticEn:'Wrapped in Cream',comment:'奶油味会把情绪裹住，咽下去就轻了。'},
  {id:'smoky', emo:'🔥',txt:'烟熏', size:68,c:'#54443a',taste:'烟熏',strength:4,
   base:'艾雷岛威士忌',topNote:'泥煤',midNote:'焦橙',baseNote:'海盐',
   color1:'#4a3a2a',color2:'#a08058',glowColor:'#6a4a30',glass:'rocks',
   poeticEn:'Smoke and Salt',comment:'烧过一遍的东西，味道更实在。'},
  {id:'floral',emo:'🌸',txt:'花香', size:66,c:'#a8547a',taste:'花香',strength:2,
   base:'金酒',topNote:'玫瑰',midNote:'荔枝',baseNote:'白桃',
   color1:'#a04868',color2:'#f8a8c0',glowColor:'#c05880',glass:'coupe',
   poeticEn:'Something Blooming',comment:'温柔一点，今晚允许你软下来。'},
];

const DEEP_QS=[
  '今晚大概是什么心情？',
  '再具体一点，是哪一种？',
  '最后，想给它加点什么味道？',
];
const DEEP_TIPS=[
  '拖一个进杯子里 · 笼统的就好',
  '拖一个进杯子里 · 越具体越准',
  '拖一个进杯子里 · 决定这杯的性格',
];
const DEEP_LAYERS=3;

let deepOn=false;                 // DEEP 开关状态
let deepPath=[];                  // 已选路径
let deepTimers=[];                // 本层的所有定时器，切层时统一清理
let deepBusy=false;               // 切层动画中，防止连点

const deepToggle=document.getElementById('deep-toggle');
const deepFieldEl=document.getElementById('deep-field');
const deepTrailEl=document.getElementById('deep-trail');
const deepQEl=document.getElementById('deep-q');
const deepStepEl=document.getElementById('deep-step');
const deepUpBtn=document.getElementById('deep-up');
const deepShaker=document.getElementById('deep-shaker');
const deepHint=document.getElementById('deep-hint');

// [关键] 切层前清掉上一层挂着的定时器，
// 否则旧 timer 会在新一层元素上乱加 class，出现"卡住不动"的气泡
function clearDeepTimers(){deepTimers.forEach(clearTimeout);deepTimers=[];}
function dt(fn,ms){const t=setTimeout(fn,ms);deepTimers.push(t);return t;}

function deepLayerOpts(){
  const n=deepPath.length;
  if(n===0)return DEEP_L1;
  if(n===1)return DEEP_L2[deepPath[0].id]||DEEP_L2.tired;
  return DEEP_L3;
}

// 已选路径小胶囊
function renderDeepTrail(){
  deepTrailEl.innerHTML='';
  deepPath.forEach((p,i)=>{
    if(i>0){
      const a=document.createElement('span');
      a.className='trail-arrow';a.textContent='→';
      deepTrailEl.appendChild(a);
      dt(()=>a.classList.add('in'),40+i*80);
    }
    const c=document.createElement('span');
    c.className='trail-chip';
    c.innerHTML=`<i style="background:${p.c};color:${p.c}"></i>${p.emo} ${p.txt}`;
    deepTrailEl.appendChild(c);
    dt(()=>c.classList.add('in'),60+i*80);
  });
}

// 杯中液体随层数升高，视觉上"越挖越满"
function syncDeepGlass(){
  const n=deepPath.length;
  const liquid=document.getElementById('dp-liquid');
  const surface=document.getElementById('dp-surface');
  const heights=[0,42,72,100];
  const h=heights[Math.min(n,3)];
  liquid.setAttribute('y',138-h);
  liquid.setAttribute('height',h);
  surface.setAttribute('cy',138-h);
  surface.setAttribute('rx',n?38:0);
  if(n){
    const mixed=mixColors(deepPath.map(p=>p.c));
    document.getElementById('dpC1').setAttribute('stop-color',lighten(mixed,26));
    document.getElementById('dpC2').setAttribute('stop-color',mixed);
  }
  deepHint.textContent=DEEP_TIPS[Math.min(n,DEEP_LAYERS-1)];
  deepHint.style.opacity=n>=DEEP_LAYERS?'0':'1';
}

// 渲染当前层的气泡池（复用横向模式那套 .bubble 视觉与拖拽）
function renderDeepLayer(){
  clearDeepTimers();
  deepBusy=false;
  const n=deepPath.length;
  const opts=deepLayerOpts();

  deepStepEl.textContent='第 '+(n+1)+' 层 / '+DEEP_LAYERS;
  deepQEl.classList.remove('in');
  dt(()=>{deepQEl.textContent=DEEP_QS[n];deepQEl.classList.add('in');},130);

  renderDeepTrail();
  syncDeepGlass();
  deepUpBtn.classList.toggle('gone',n===0);

  // 固定 3×3 网格：每层都是 9 个选项，整齐排布
  const COLS=3;
  const rows=Math.ceil(opts.length/COLS);
  const colW=100/COLS,rowH=100/rows;

  deepFieldEl.innerHTML='';
  opts.forEach((o,i)=>{
    const col=i%COLS,row=Math.floor(i/COLS);
    // 每格内居中，仅留极小随机偏移保持手工感（不破坏 3x3 结构）
    const lx=col*colW+colW*0.09+(Math.random()*2-1);
    const ty=row*rowH+rowH*0.06+(Math.random()*2-1);
    const el=document.createElement('div');
    el.className='bubble b-in';
    el.dataset.id=o.id;
    const sz=o.size||70;
    el.style.cssText=`left:${Math.max(0,Math.min(74,lx)).toFixed(1)}%;`+
      `top:${Math.max(0,Math.min(76,ty)).toFixed(1)}%;width:${sz}px;height:${sz}px;`+
      `background:radial-gradient(circle at 32% 28%,${o.c}f0,${o.c}88 62%,${o.c}44);`+
      `animation-delay:${(i*0.06).toFixed(2)}s,${(0.5+i*0.19).toFixed(2)}s;`;
    el.innerHTML=`<div class="bub-emo">${o.emo}</div><div class="bub-txt">${o.txt}</div>`;
    // 拖进本层的杯子即为选中
    bindDrag(el,o,{
      zone:deepShaker,
      canDrag:()=>!deepBusy,
      onDrop:(mood,elem)=>pickDeep(mood,elem),
    });
    deepFieldEl.appendChild(el);
  });
}

function pickDeep(o,el){
  if(deepBusy)return;
  deepBusy=true;
  clearDeepTimers();
  splashEffect(o.c,deepShaker);
  if(el){el.classList.remove('b-in');el.classList.add('b-chosen');}
  // 其余气泡淡出，被选中的稍后再走 —— "选中 → 沉进杯里"
  deepFieldEl.querySelectorAll('.bubble').forEach(x=>{
    if(x!==el){x.classList.remove('b-in');x.classList.add('b-out');}
  });
  deepPath.push({layer:deepPath.length+1,id:o.id,emo:o.emo,txt:o.txt,c:o.c,
                 taste:o.taste,strength:o.strength,recipe:o});
  syncDeepGlass();
  dt(()=>{
    if(el){el.classList.remove('b-chosen');el.classList.add('b-out');}
    dt(()=>{
      if(deepPath.length>=DEEP_LAYERS){
        const moods=deepPath.map(p=>({id:p.id,emo:p.emo,txt:p.txt,
          flavor:p.taste||p.txt,c:p.c}));
        runMoodMix(moods,{path:[...deepPath]});
      }else{
        renderDeepLayer();
      }
    },260);
  },260);
}

function deepUp(){
  if(!deepPath.length||deepBusy)return;
  clearDeepTimers();
  deepPath.pop();
  renderDeepLayer();
}

function startDeep(){
  clearDeepTimers();
  killGhost();
  deepPath=[];
  deepBusy=false;
  moodShowSub('mood-sub-deep');
  renderDeepLayer();
}

deepUpBtn.addEventListener('click',deepUp);

deepToggle.addEventListener('click',()=>{
  deepOn=!deepOn;
  deepToggle.classList.toggle('on',deepOn);
  killGhost();          // 万一切换时正拖着气泡，先清干净
  if(deepOn){
    picked=[];syncShaker();
    startDeep();
  }else{
    clearDeepTimers();
    deepPath=[];
    moodShowSub('mood-sub-pick');
  }
});

// 调制页/结果页隐藏开关，避免悬在内容上方
const _moodShowSubBase=moodShowSub;
moodShowSub=function(id){
  _moodShowSubBase(id);
  const showToggle=(id==='mood-sub-pick'||id==='mood-sub-deep');
  deepToggle.classList.toggle('gone',!showToggle);
};

/* ---- DEEP 本地混合引擎：味道层（第三层）决定这杯酒的性格 ---- */
/* DEEP 第一层 id → SOLO_BLEND 的 key 映射。
   DEEP 的大类名（down/restless/numb/longing/pressed…）和横向气泡池的 id 不同名，
   不映射的话 blendDeep 会全部退化成「疲惫」那杯，导致底色/基酒千篇一律。 */
const DEEP_L1_BASE={
  tired:'tired', down:'sad', restless:'anxious', angry:'angry',
  calm:'calm', good:'happy', numb:'lazy', longing:'nostalgic', pressed:'anxious',
};
function blendDeep(deep){
  const path=deep.path;
  const flavor=path[path.length-1];                       // 第三层：想加的味道
  const baseKey=DEEP_L1_BASE[path[0].id]||path[0].id;
  const base={...(SOLO_BLEND[baseKey]||SOLO_BLEND.tired)};
  const r=flavor.recipe||{};
  const out={...base};
  ['base','topNote','midNote','baseNote','color1','color2','glowColor','glass',
   'poeticEn','comment'].forEach(k=>{if(r[k])out[k]=r[k];});
  // 诗名用第二层那个具体情绪，最贴近"到底是哪一种"
  const core=path[1]||path[0];
  out.poeticZh=core.txt+'，配'+flavor.txt;
  out.strength=flavor.strength||base.strength||3;
  return out;
}

// 初始化
layoutBubbles();
syncShaker();

