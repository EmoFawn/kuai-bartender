// ===== CHAT PANE =====
let lastInput='',lastRec=null;
let lastMoodDrink=null,lastMoodBlend='';   // 心情调酒当前这杯（供珍藏）
const moodInput=document.getElementById('mood-input');
const charCnt=document.getElementById('char-cnt');
const progFill=document.getElementById('prog-fill');
const btnMix=document.getElementById('btn-mix');
const btnMixTxt=document.getElementById('btn-mix-txt');
const liqBody=document.getElementById('liq-body');
const circleHint=document.getElementById('circle-hint');

function showSub(id){
  document.querySelectorAll('#pane-chat .sub').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* 液位曲线：前 10 个字快速上涨（16%→62%），
   之后放缓，到 50 字逼近顶部（88%）——像倒酒时先猛后收。 */
function liqLevelFor(len){
  if(len<=0)return 16;
  if(len<=10){
    // 第一段：陡峭线性，每个字约 +4.6%
    return 16+len/10*46;
  }
  // 第二段：剩余 40 字用平方根曲线缓慢补满，越往后越慢
  const t=Math.min((len-10)/40,1);
  return 62+Math.sqrt(t)*26;
}

moodInput.addEventListener('input',()=>{
  const val=moodInput.value,len=val.length;
  charCnt.textContent=len+' / 50';
  progFill.style.width=(len/50*100)+'%';
  if(len===0){
    btnMixTxt.textContent='随机生成 / Random Mix';
    liqBody.style.height='16%';liqBody.style.background='#4a5a48';
    circleHint.textContent='Waiting for input...';
  }else{
    btnMixTxt.textContent='开始调制 / Start Mixing';
    const{moodColor}=detectCtx(val);
    liqBody.style.height=liqLevelFor(len).toFixed(1)+'%';
    liqBody.style.background=moodColor;
    circleHint.textContent='Reading your mood...';
  }
});

btnMix.addEventListener('click',()=>{lastInput=moodInput.value;startMixing();});

/* ===== 调用后端大模型；失败/未配 Key 时降级本地引擎 ===== */
async function aiBartend(mood){
  const res=await fetch('/api/bartend',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mood})
  });
  const d=await res.json();
  if(d.error)throw new Error(d.error);
  if(d._noKey)return null;           // 后端未配 Key
  if(!d.primary)throw new Error('返回结构异常');
  return d;
}

async function startMixing(){
  const{moodColor}=detectCtx(lastInput);
  const ml=document.getElementById('mix-liq');
  const mh=document.getElementById('mix-hint');
  const stepsEl=document.getElementById('mix-steps');
  stepsEl.innerHTML='';
  ml.style.background=moodColor;ml.style.height='0%';
  showSub('sub-mixing');
  // 先把卡片置为 loading 占位
  document.getElementById('chat-bar-card').classList.add('loading');
  setTimeout(()=>{ml.style.height='68%';},200);

  // 并行：动画走起 + 后端请求
  const aiPromise=aiBartend(lastInput).catch(e=>{console.warn('AI 调酒失败，降级本地:',e.message);return null;});

  MIX_MSGS.forEach((msg,i)=>{
    setTimeout(()=>{
      const div=document.createElement('div');
      div.className='mix-step';
      div.innerHTML=`<div class="step-dot"></div><div class="step-txt">${msg}</div>`;
      stepsEl.appendChild(div);
      setTimeout(()=>div.classList.add('vis'),50);
      mh.textContent=i<MIX_MSGS.length-1?'Mixing...':'Almost done...';
    },i*700);
  });

  // 动画最短时长与 AI 返回，取较慢者
  const minWait=new Promise(r=>setTimeout(r,MIX_MSGS.length*700+600));
  const [ai]=await Promise.all([aiPromise,minWait]);

  if(ai){
    lastRec={primary:ai.primary,secondary:ai.secondary||ai.primary};
    lastRec.byAI=true;
  }else{
    lastRec=recommend(lastInput);
    lastRec.byAI=false;
  }
  renderResult(lastRec);
  showSub('sub-result');
}

/* ===== SVG 酒杯渲染 ===== */
// 四种杯型：coupe(碟形/马天尼)、rocks(古典杯)、highball(高球杯)、flute(香槟笛)
const GLASS_SHAPES={
  coupe:{ // 马天尼/碟形杯
    outline:'M30 34 L120 34 C118 66 100 84 79 88 L79 140 L100 148 L50 148 L71 140 L71 88 C50 84 32 66 30 34 Z',
    liquid:(lv)=>{const top=38+(1-lv)*40;return `M${30+(top-34)*0.62} ${top} L${120-(top-34)*0.62} ${top} C${118-(top-34)*0.6} 66 100 84 79 88 L71 88 C50 84 32 66 ${30+(top-34)*0.2} ${top+2} Z`;},
    rim:'M30 34 L120 34',ice:false,bubbles:false
  },
  rocks:{ // 古典杯：宽矮厚底
    outline:'M36 46 L114 46 L108 148 C108 152 104 154 100 154 L50 154 C46 154 42 152 42 148 Z',
    liquid:(lv)=>{const top=150-lv*96;return `M${36+(top-46)*0.06} ${top} L${114-(top-46)*0.06} ${top} L108 148 C108 152 104 154 100 154 L50 154 C46 154 42 152 42 148 Z`;},
    rim:'M36 46 L114 46',ice:true,bubbles:false
  },
  highball:{ // 高球杯：细高
    outline:'M46 26 L104 26 L101 152 C101 156 98 158 94 158 L56 158 C52 158 49 156 49 152 Z',
    liquid:(lv)=>{const top=154-lv*126;return `M${46+(top-26)*0.024} ${top} L${104-(top-26)*0.024} ${top} L101 152 C101 156 98 158 94 158 L56 158 C52 158 49 156 49 152 Z`;},
    rim:'M46 26 L104 26',ice:true,bubbles:true
  },
  flute:{ // 香槟笛：细长郁金香
    outline:'M56 22 C56 22 54 62 60 82 C64 96 70 100 70 108 L70 142 L84 150 L46 150 L65 142 L65 108 C65 100 66 96 70 82 C76 62 74 22 74 22 Z M56 22 L94 22 C94 22 92 62 86 82 C82 96 80 100 80 108 L80 142 L96 150 L54 150 L70 142 L70 108 C70 100 68 96 64 82 C58 62 56 22 56 22 Z',
    liquid:(lv)=>{const top=104-lv*78;return `M${56+(top-22)*0.13} ${top} L${94-(top-22)*0.13} ${top} C${90-(top-22)*0.05} 90 80 100 80 108 L70 108 C70 100 60 90 ${56+(top-22)*0.16} ${top+2} Z`;},
    rim:'M56 22 L94 22',ice:false,bubbles:true
  }
};

// 根据基酒/风格推断杯型
function pickGlass(c){
  if(c.glass&&GLASS_SHAPES[c.glass])return c.glass;
  const n=(c.name||'')+(c.base||'')+(c.nameZh||'');
  if(/香槟|Champagne|Prosecco|Spritz|气泡/i.test(n))return 'flute';
  if(/Old Fashioned|古典|Negroni|尼格罗尼|威士忌|Toddy|托迪/i.test(n))return 'rocks';
  if(/Tonic|汤力|Mojito|莫吉托|Highball|Stormy|风暴|Collins/i.test(n))return 'highball';
  if(/Martini|马天尼|Margarita|玛格丽特|Daiquiri|Sour/i.test(n))return 'coupe';
  return 'rocks';
}

// targetId 允许多个页面复用同一套酒杯渲染（对话调酒 / 心情调酒）
function renderGlassInto(targetId,c){
  const type=pickGlass(c);
  const g=GLASS_SHAPES[type];
  const lv=Math.max(0.35,Math.min(0.92,(c.strength||3)/5*0.55+0.4)); // 液位
  const c1=c.color1||'#7a4a1a',c2=c.color2||'#c47830';
  const uid='g'+Math.random().toString(36).slice(2,7);

  // 冰块（古典杯/高球杯）
  let ice='';
  if(g.ice){
    const cubes=type==='rocks'
      ? [[58,96,26,24,-8],[80,84,22,21,12]]
      : [[62,74,22,21,-6],[68,102,21,20,10],[60,128,22,20,-12]];
    ice=cubes.map(([x,y,w,h,rot])=>`
      <g transform="rotate(${rot} ${x+w/2} ${y+h/2})">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"
          fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <rect x="${x+3}" y="${y+3}" width="${w*0.32}" height="${h*0.3}" rx="2" fill="rgba(255,255,255,0.28)"/>
      </g>`).join('');
  }

  // 气泡
  let bubbles='';
  if(g.bubbles){
    const bs=[[66,132,1.7,0],[76,138,1.3,0.7],[70,126,2,1.5],[82,134,1.5,2.2],[62,140,1.4,2.8]];
    bubbles=bs.map(([x,y,r,d])=>`<circle class="bub" cx="${x}" cy="${y}" r="${r}"
      fill="rgba(255,255,255,0.6)" style="animation-delay:${d}s"/>`).join('');
  }

  // 装饰物：柑橘片 / 薄荷 / 樱桃 / 咖啡豆 / 盐边
  const note=(c.topNote||'')+(c.midNote||'')+(c.name||'')+(c.nameZh||'');
  let garnish='';
  const gx=type==='coupe'?106:type==='flute'?92:104;
  const gy=type==='coupe'?32:type==='flute'?22:44;
  if(/薄荷|mint/i.test(note)){
    garnish=`<g transform="translate(${gx-8},${gy-12})">
      <path d="M0 8 C-9 2 -8 -8 2 -10 C10 -6 8 4 0 8 Z" fill="rgba(110,180,110,0.9)"/>
      <path d="M6 12 C0 4 6 -4 15 -3 C19 4 14 12 6 12 Z" fill="rgba(140,200,130,0.85)"/>
      <line x1="2" y1="8" x2="6" y2="22" stroke="rgba(110,170,110,0.7)" stroke-width="1.2"/>
    </g>`;
  }else if(/咖啡|coffee|espresso|可可|cocoa/i.test(note)){
    // 咖啡豆三粒浮在液面
    garnish=`<g transform="translate(75,${type==='coupe'?46:58})">
      ${[[-9,0,-14],[0,-2.5,8],[9,0.5,20]].map(([x,y,r])=>`
        <g transform="translate(${x},${y}) rotate(${r})">
          <ellipse rx="4.2" ry="3" fill="rgba(60,34,18,0.95)"/>
          <path d="M0 -2.6 Q1.2 0 0 2.6" stroke="rgba(150,110,80,0.7)" stroke-width="0.7" fill="none"/>
        </g>`).join('')}
    </g>`;
  }else if(/橙|柑|orange/i.test(note)){
    garnish=`<g transform="translate(${gx},${gy})">
      <circle r="11" fill="rgba(240,150,50,0.9)" stroke="rgba(255,200,120,0.8)" stroke-width="1.4"/>
      ${[0,60,120,180,240,300].map(a=>`<line x1="0" y1="0" x2="${9*Math.cos(a*Math.PI/180)}" y2="${9*Math.sin(a*Math.PI/180)}" stroke="rgba(255,225,180,0.55)" stroke-width="0.8"/>`).join('')}
    </g>`;
  }else if(/柠|青柠|lime|lemon/i.test(note)){
    garnish=`<g transform="translate(${gx},${gy})">
      <circle r="10" fill="rgba(170,215,90,0.9)" stroke="rgba(210,240,150,0.8)" stroke-width="1.4"/>
      ${[0,60,120,180,240,300].map(a=>`<line x1="0" y1="0" x2="${8*Math.cos(a*Math.PI/180)}" y2="${8*Math.sin(a*Math.PI/180)}" stroke="rgba(235,255,200,0.6)" stroke-width="0.8"/>`).join('')}
    </g>`;
  }else if(/樱桃|cherry|莓|berry/i.test(note)){
    garnish=`<g transform="translate(${gx-2},${gy})">
      <circle r="7" fill="rgba(190,40,60,0.92)"/>
      <circle cx="-2" cy="-2" r="2" fill="rgba(255,140,150,0.5)"/>
      <path d="M0 -7 C4 -16 10 -18 12 -20" stroke="rgba(140,180,110,0.8)" stroke-width="1.3" fill="none"/>
    </g>`;
  }else if(/盐|salt/i.test(note)){
    // 盐边
    garnish=`<g>${Array.from({length:16},(_,i)=>{
      const x=32+i*(86/15);return `<circle cx="${x}" cy="${34+Math.random()*2}" r="${0.9+Math.random()*0.7}" fill="rgba(255,255,255,0.75)"/>`;
    }).join('')}</g>`;
  }else if(/蜂蜜|honey|肉桂|cinnamon/i.test(note)){
    garnish=`<g transform="translate(${gx-4},${gy-10})">
      <rect x="0" y="0" width="3" height="34" rx="1.5" fill="rgba(150,95,50,0.9)" transform="rotate(12)"/>
      <rect x="0.8" y="1" width="1" height="32" rx="0.5" fill="rgba(190,140,90,0.6)" transform="rotate(12)"/>
    </g>`;
  }

  // 液面椭圆（俯视厚度感）——按杯型给出液面宽度
  const surf={coupe:[75,48,44,5.5],rocks:[75,56,38,5],highball:[75,40,28,4],flute:[75,40,18,3.5]}[type];
  const lvTop={coupe:38+(1-lv)*40,rocks:150-lv*96,highball:154-lv*126,flute:104-lv*78}[type];
  const surfW={coupe:(45-(lvTop-34)*0.62)+(lvTop-34)*0.02,rocks:39-(lvTop-46)*0.06,highball:29,flute:19-(lvTop-22)*0.13}[type];
  const surface=`
    <ellipse cx="75" cy="${lvTop}" rx="${Math.max(8,surfW)}" ry="${Math.max(2.5,surfW*0.13)}"
      fill="rgba(255,255,255,0.18)"/>
    <ellipse cx="75" cy="${lvTop}" rx="${Math.max(8,surfW)}" ry="${Math.max(2.5,surfW*0.13)}"
      fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="0.7"/>`;

  document.getElementById(targetId).innerHTML=`
  <defs>
    <linearGradient id="liq-${uid}" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0%" stop-color="${c2}" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="${c1}" stop-opacity="0.97"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="gls-${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="18%" stop-color="rgba(255,255,255,0.05)"/>
      <stop offset="82%" stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.18)"/>
    </linearGradient>
    <radialGradient id="shd-${uid}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${c.glowColor||c1}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${c.glowColor||c1}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="clip-${uid}"><path d="${g.outline}"/></clipPath>
  </defs>

  <!-- 杯底投影 -->
  <ellipse cx="75" cy="${type==='coupe'||type==='flute'?154:160}" rx="34" ry="6" fill="url(#shd-${uid})"/>

  <!-- 杯身玻璃底 -->
  <path d="${g.outline}" fill="url(#gls-${uid})"/>

  <!-- 液体 + 冰 + 气泡（裁切在杯内） -->
  <g clip-path="url(#clip-${uid})">
    <g class="liq-fill">
      <path d="${g.liquid(lv)}" fill="url(#liq-${uid})"/>
    </g>
    ${ice}
    ${bubbles}
    ${surface}
    <!-- 玻璃高光 -->
    <ellipse cx="52" cy="70" rx="5" ry="30" fill="rgba(255,255,255,0.13)" transform="rotate(-6 52 70)"/>
    <ellipse cx="99" cy="80" rx="2.6" ry="22" fill="rgba(255,255,255,0.09)"/>
  </g>

  <!-- 杯壁描边 -->
  <path d="${g.outline}" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="1.5" stroke-linejoin="round"/>
  <!-- 杯口亮边 -->
  <path d="${g.rim}" stroke="rgba(255,255,255,0.72)" stroke-width="2" stroke-linecap="round"/>
  ${garnish}`;
}

/* ===== 调酒师卡片填充 ===== */
// c 是酒对象，AI 模式下会有 card.headline/body/tag；本地降级时用 comment 兜底
function fillBarCard(cardId,hlId,bodyId,tagId,c,byAI){
  const card=document.getElementById(cardId);
  const hl=document.getElementById(hlId);
  const body=document.getElementById(bodyId);
  const tag=document.getElementById(tagId);
  // 移除加载状态
  card.classList.remove('loading');
  if(byAI&&c.card){
    hl.textContent=c.card.headline||c.poeticZh||'—';
    body.textContent=c.card.body||c.comment||'—';
    tag.textContent=c.card.tag||'今晚';
  }else{
    // 本地降级：用诗意名做标题、comment 做正文、强度做 tag
    hl.textContent=c.poeticZh||'—';
    body.textContent=c.comment||'—';
    const strLabel=['','温柔','温柔','平衡','有劲','烈'][Math.max(1,Math.min(5,c.strength||3))];
    tag.textContent=strLabel;
  }
}

/* ===== 调酒配方渲染（对话调酒 / 心情调酒共用） =====
   prefix 是 'r' 或 'm'，对应两个结果页的 id 前缀。
   折叠态只显示「N 味材料 · 总量 xx ml」，点开才铺完整清单 —— 
   结果页信息已经很密，配方默认收起，需要照着做的人再展开。 */
function renderRecipe(prefix,c){
  const wrap=document.getElementById(prefix+'-rx-wrap');
  const body=document.getElementById(prefix+'-rx-body');
  const sum=document.getElementById(prefix+'-rx-sum');
  if(!wrap||!body)return;
  const rows=drinkRecipe(c);
  if(!rows.length){wrap.style.display='none';return;}
  wrap.style.display='';
  wrap.classList.remove('open');                      // 每杯新酒都回到折叠态
  const tg=document.getElementById(prefix+'-rx-toggle');
  if(tg)tg.setAttribute('aria-expanded','false');

  // 摘要：材料数 + 可累加的液体总量（ml 才计入，「补满」「少许」这类跳过）
  let ml=0;
  rows.forEach(([,amt])=>{
    const m=String(amt).match(/([0-9]+(?:\.[0-9]+)?)\s*ml/i);
    if(m)ml+=parseFloat(m[1]);
  });
  sum.textContent=rows.length+' 味材料'+(ml?' · 约 '+Math.round(ml)+' ml':'');

  const esc=s=>String(s).replace(/[&<>]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));
  const list=rows.map(([name,amt])=>
    `<div class="rx-row"><span class="rx-name">${esc(name)}</span>
       <span class="rx-dot"></span>
       <span class="rx-amt">${esc(amt||'适量')}</span></div>`).join('');
  const method=c.method?`<div class="rx-meta"><span class="rx-k">做法</span><span class="rx-v">${esc(c.method)}</span></div>`:'';
  const garnish=c.garnish?`<div class="rx-meta"><span class="rx-k">装饰</span><span class="rx-v">${esc(c.garnish)}</span></div>`:'';
  // 没有 recipe 字段时是本地推的骨架，标注清楚，别让人当成权威配方
  const guessed=!(c.recipe&&c.recipe.length);
  const tip=guessed?`<div class="rx-tip">※ 按基酒与香调推算的参考配比</div>`:'';
  body.innerHTML=`<div class="rx-inner">${list}${method}${garnish}${tip}</div>`;
}

/* 展开/收起：两个结果页各绑一次，键盘也能操作 */
['r','m'].forEach(p=>{
  const tg=document.getElementById(p+'-rx-toggle');
  const wrap=document.getElementById(p+'-rx-wrap');
  if(!tg||!wrap)return;
  const toggle=()=>{
    const on=wrap.classList.toggle('open');
    tg.setAttribute('aria-expanded',on?'true':'false');
  };
  tg.addEventListener('click',toggle);
  tg.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}
  });
});

function renderResult(rec){
  const c=rec.primary,s=rec.secondary;
  syncKeepBtn(document.getElementById('btn-keep'),c,'chat');
  document.getElementById('r-name-zh').textContent=c.poeticZh;
  document.getElementById('r-name-en').textContent=c.poeticEn;
  document.getElementById('r-base').textContent=c.base;
  renderRecipe('r',c);
  document.getElementById('r-top').textContent=c.topNote||'—';
  document.getElementById('r-mid').textContent=c.midNote||'—';
  document.getElementById('r-base-note').textContent=c.baseNote||'—';
  const abv=drinkABV(c);
  document.getElementById('r-pct').textContent=abv+'% ABV';
  setTimeout(()=>{document.getElementById('r-bar').style.width=abvBarPct(abv)+'%';},300);
  renderGlassInto('r-glass',c);
  document.getElementById('r-glow').style.background=c.glowColor;

  /* [精简] 调酒师的一句话与模式标识已下线（交给下方调酒师卡片），
     但「AI 读到的」保留 —— 只是去掉了标题，让这句话自己说话。 */
  const rr=document.getElementById('r-reading-row');
  if(c.reading){
    document.getElementById('r-reading').textContent=c.reading;
    rr.style.display='block';
  }else{rr.style.display='none';}

  // 调酒师卡片
  fillBarCard('chat-bar-card','chat-card-headline','chat-card-body','chat-card-tag',c,rec.byAI);
}

function resetChat(){
  lastInput='';
  moodInput.value='';charCnt.textContent='0 / 50';progFill.style.width='0%';
  liqBody.style.height='16%';liqBody.style.background='#4a5a48';
  circleHint.textContent='Waiting for input...';
  btnMixTxt.textContent='随机生成 / Random Mix';
  showSub('sub-input');
}

document.getElementById('btn-back').addEventListener('click',resetChat);
document.getElementById('btn-remix').addEventListener('click',resetChat);
document.getElementById('btn-save').addEventListener('click',()=>{
  if(!lastRec)return;
  saveCard(lastRec.primary,{
    from:lastInput?'你说：'+lastInput:'',
  });
});

