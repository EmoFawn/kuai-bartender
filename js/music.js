/* ========================================================
   音乐调酒 · MUSIC MIX
   ----------------------------------------------------------
   流程与另外两个模式同构：输入 → 调制中 → 结果，
   区别只在"原材料"从情绪换成了一首歌。

   一次 /api/musicmix 调用返回三样东西：
     song    这首歌的档案（歌手/曲风/年代/速度/听感）
     primary 为它调的那杯酒（结构与对话调酒完全一致，
             所以结果卡、配方区、导出卡、珍藏入柜全部直接复用）
     similar 3 首同曲风推荐

   降级策略：未配 Key 或请求失败时，走本地"曲风关键词 → 酒"的
   映射引擎，保证离线也能出一杯像样的酒，不至于白屏。
   ======================================================== */

let lastMusicDrink=null,lastMusicSong=null,lastMusicTunes=[];

const songInput=document.getElementById('song-input');
const btnMusicMix=document.getElementById('btn-music-mix');
const btnMusicTxt=document.getElementById('btn-music-txt');
const musicHint=document.getElementById('music-hint');
const vinylLabel=document.getElementById('vinyl-label');

/* ---- 引子歌单：面对空输入框时给几个可直接点的例子 ----
   刻意挑不同曲风，暗示"什么歌都能来"，而不是只吃华语流行。 */
const SONG_SEEDS=[
  '消愁 - 毛不易',
  'Plastic Love - 竹内玛莉亚',
  '海阔天空 - Beyond',
  'Autumn Leaves - Chet Baker',
  '晴天 - 周杰伦',
  'Midnight City - M83',
];

(function initSongChips(){
  const wrap=document.getElementById('song-chips');
  if(!wrap)return;
  // 每次进页面随机取 3 个，让引子有新鲜感
  const pick=SONG_SEEDS.slice().sort(()=>Math.random()-0.5).slice(0,3);
  wrap.innerHTML=pick.map(s=>`<span class="song-chip">${s}</span>`).join('');
  wrap.querySelectorAll('.song-chip').forEach(el=>{
    el.addEventListener('click',()=>{
      songInput.value=el.textContent;
      syncSongInput();
      songInput.focus();
    });
  });
})();

function musicShowSub(id){
  document.querySelectorAll('#pane-music .sub').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ---- 输入态同步：唱片标签实时显示歌名，像真的贴上去了 ---- */
function syncSongInput(){
  const v=songInput.value.trim();
  btnMusicMix.disabled=!v;
  btnMusicTxt.textContent=v?'落下唱针 / Drop the Needle':'先写一首歌';
  musicHint.textContent=v?'Ready to play...':'Drop the needle...';
  const txt=vinylLabel&&vinylLabel.querySelector('.vinyl-label-txt');
  if(txt){
    // 唱片中心标签空间很小，只放主歌名（去掉 " - 歌手" 后缀）并限长
    const main=v.split(/\s*[-–—]\s*/)[0].replace(/^[《"']|["'》]$/g,'');
    txt.textContent=main?(main.length>6?main.slice(0,6):main):'苦艾';
  }
}
songInput.addEventListener('input',syncSongInput);
songInput.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!btnMusicMix.disabled){e.preventDefault();startMusicMix();}
});
btnMusicMix.addEventListener('click',()=>startMusicMix());

/* ---- 本地降级引擎 ----
   从歌名/歌手里能读到的曲风信号极其有限，所以这里按关键词粗分几档，
   命中不了就用歌名 hash 稳定选一款 —— 同一首歌每次给同一杯，
   避免"再点一次就变了"的不可信感。 */
const MUSIC_FALLBACK=[
  {kw:/摇滚|rock|metal|朋克|punk|嘶|嘶吼/i,
   genre:'摇滚',tempo:'快',mood:'躁动 / 释放',
   d:{poeticZh:'失真的那一下',poeticEn:'That One Distortion',base:'黑麦威士忌',
      topNote:'橙皮',midNote:'焦糖',baseNote:'烟熏橡木',
      color1:'#5a2a18',color2:'#b8582a',glowColor:'#7a3418',glass:'rocks',strength:4,abv:30,
      recipe:[['黑麦威士忌','60 ml'],['糖浆','10 ml'],['安高天娜苦精','2 dash']],
      method:'古典杯加大冰，搅拌至外壁挂霜',garnish:'橙皮',
      comment:'这杯不需要你冷静，它陪你吵完这一架。',
      reading:'失真吉他把所有细节都糊掉了，只剩推力 —— 所以给你一杯同样不修边角的烈酒。'}},
  {kw:/爵士|jazz|blues|蓝调|萨克斯|swing/i,
   genre:'爵士 / 蓝调',tempo:'慢',mood:'慵懒 / 微醺',
   d:{poeticZh:'萨克斯的尾音',poeticEn:'Where the Sax Trails Off',base:'波本威士忌',
      topNote:'蜂蜜',midNote:'香草',baseNote:'烟熏',
      color1:'#7a4a1a',color2:'#d09a48',glowColor:'#a05a20',glass:'rocks',strength:4,abv:28,
      recipe:[['波本威士忌','50 ml'],['甜味美思','20 ml'],['安高天娜苦精','2 dash']],
      method:'调酒杯加冰搅匀，滤入冰过的杯子',garnish:'糖渍樱桃',
      comment:'慢慢喝，这杯和这首歌一样不赶时间。',
      reading:'铜管的温润和威士忌在冰上化开的速度是同一个节奏，都得等。'}},
  {kw:/电子|electronic|synth|techno|house|edm|赛博|合成器/i,
   genre:'电子',tempo:'快',mood:'冷冽 / 兴奋',
   d:{poeticZh:'霓虹从水里升起',poeticEn:'Neon Rising Through Water',base:'伏特加',
      topNote:'气泡',midNote:'青柠',baseNote:'杜松',
      color1:'#1a3a6a',color2:'#4a9ad8',glowColor:'#2a5a9a',glass:'highball',strength:3,abv:18,
      recipe:[['伏特加','45 ml'],['蓝橙利口酒','15 ml'],['青柠汁','15 ml'],['苏打水','补满']],
      method:'高球杯加满冰，兑和后苏打补满',garnish:'青柠角',
      comment:'气泡的密度和这首歌的鼓机一样，一秒都不给你停。',
      reading:'合成器的音色是冷的、有边缘的，所以这杯必须冰、必须带气。'}},
  {kw:/民谣|folk|acoustic|木吉他|校园|谣/i,
   genre:'民谣',tempo:'慢',mood:'温和 / 怀念',
   d:{poeticZh:'木吉他的年纪',poeticEn:'The Age of an Old Guitar',base:'白朗姆',
      topNote:'蜂蜜',midNote:'柠檬',baseNote:'甘蔗',
      color1:'#8a6a30',color2:'#e0c078',glowColor:'#a8823a',glass:'rocks',strength:2,abv:16,
      recipe:[['白朗姆','45 ml'],['蜂蜜','15 ml'],['柠檬汁','20 ml']],
      method:'加冰摇匀，滤入加了新冰的古典杯',garnish:'柠檬皮',
      comment:'不复杂，但耐听。这杯也是。',
      reading:'木吉他是没有修饰的声音，所以配方也只留最朴素的三样。'}},
  {kw:/city pop|citypop|昭和|复古|disco|funk|soul/i,
   genre:'City Pop',tempo:'中速',mood:'夏夜 / 微甜',
   d:{poeticZh:'夜里那条海岸线',poeticEn:'Coastline After Dark',base:'白朗姆',
      topNote:'菠萝',midNote:'椰香',baseNote:'海盐',
      color1:'#1a6a7a',color2:'#5ac0c8',glowColor:'#2a8a98',glass:'highball',strength:2,abv:15,
      recipe:[['白朗姆','40 ml'],['菠萝汁','60 ml'],['椰浆','20 ml'],['青柠汁','10 ml']],
      method:'加冰摇匀，倒入盛满碎冰的高球杯',garnish:'菠萝片',
      comment:'开着车窗的那种爽，这杯替你留住了。',
      reading:'合成贝斯和铺开的和声都是暖的、亮的，所以给它热带水果的甜。'}},
  {kw:/古典|classical|钢琴|piano|交响|协奏|后摇|post.?rock|ambient/i,
   genre:'古典 / 后摇',tempo:'慢',mood:'辽阔 / 沉静',
   d:{poeticZh:'很长的那一段留白',poeticEn:'A Very Long Silence',base:'金酒',
      topNote:'杜松',midNote:'葡萄柚',baseNote:'白胡椒',
      color1:'#3a5a62',color2:'#8ab8c0',glowColor:'#4a7a88',glass:'coupe',strength:3,abv:22,
      recipe:[['金酒','55 ml'],['干味美思','15 ml'],['葡萄柚皮','1 片']],
      method:'调酒杯加冰搅拌 30 秒，滤入冰过的碟形杯',garnish:'葡萄柚皮',
      comment:'空的地方才是这首歌的主角，这杯也一样。',
      reading:'大量残响留出的空间感，只有极干净、极冷的酒体撑得住。'}},
  {kw:/情歌|ballad|抒情|粤语|失恋|分手|想你|爱你/i,
   genre:'流行情歌',tempo:'慢',mood:'柔软 / 不舍',
   d:{poeticZh:'没说完的那半句',poeticEn:'The Half You Never Said',base:'金酒',
      topNote:'荔枝',midNote:'玫瑰',baseNote:'蔓越莓',
      color1:'#8a2a52',color2:'#e07898',glowColor:'#b03868',glass:'coupe',strength:2,abv:18,
      recipe:[['金酒','40 ml'],['荔枝利口酒','20 ml'],['蔓越莓汁','40 ml'],['柠檬汁','10 ml']],
      method:'加冰摇匀，滤入冰过的碟形杯',garnish:'玫瑰花瓣',
      comment:'有些话适合留在杯底，不适合说出口。',
      reading:'人声贴得很近、气息都听得见，所以这杯要甜、要软、要有一点酸。'}},
  {kw:/说唱|rap|hip.?hop|trap|嘻哈/i,
   genre:'嘻哈',tempo:'中速',mood:'冷静 / 有劲',
   d:{poeticZh:'压在拍子后面',poeticEn:'Just Behind the Beat',base:'龙舌兰',
      topNote:'盐边',midNote:'青柠',baseNote:'烟熏龙舌兰',
      color1:'#4a6a20',color2:'#a8c850',glowColor:'#6a8a28',glass:'coupe',strength:4,abv:26,
      recipe:[['龙舌兰','50 ml'],['橙皮利口酒','20 ml'],['青柠汁','15 ml']],
      method:'加冰摇匀，滤入抹好盐边的冰杯',garnish:'盐边 / 青柠片',
      comment:'不解释，喝就完事。',
      reading:'808 的低频是往下压的，配一杯同样不上扬、只往喉咙里走的烈酒。'}},
];
// 一首歌都对不上时的通用底牌
const MUSIC_DEFAULT={
  genre:'未知曲风',tempo:'中速',mood:'难以归类',
  d:{poeticZh:'听不出来的那一杯',poeticEn:'A Glass I Cant Name',base:'威士忌',
     topNote:'橙皮',midNote:'焦糖',baseNote:'烟熏',
     color1:'#7a4a1a',color2:'#c47830',glowColor:'#a05a20',glass:'rocks',strength:3,abv:24,
     recipe:[['威士忌','50 ml'],['糖浆','10 ml'],['苦精','2 dash']],
     method:'古典杯加大冰，搅拌至冰化开一点',garnish:'橙皮',
     comment:'我没听过这首歌，但这杯按你写的名字调的。',
     reading:'离线状态下我读不到这首歌的编曲，只能照着歌名的意象给你一杯。'}
};

function musicLocal(raw){
  const hit=MUSIC_FALLBACK.find(f=>f.kw.test(raw))||MUSIC_DEFAULT;
  // 拆出「歌名 - 歌手」；只写歌名时 artist 留空，不编造
  const parts=raw.split(/\s*[-–—]\s*/);
  const title=(parts[0]||raw).replace(/^[《"']|["'》]$/g,'').trim();
  const artist=(parts[1]||'').trim();
  return {
    song:{title:title||raw,artist:artist,album:'',year:'',
      genre:hit.genre,tempo:hit.tempo,mood:hit.mood,
      listen:'',known:false},
    primary:{...hit.d},
    similar:[],
    _local:true,
  };
}

/* ---- 调用后端 ---- */
async function aiMusicMix(song){
  const res=await fetch('/api/musicmix',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({song})
  });
  const d=await res.json();
  if(d.error)throw new Error(d.error);
  if(d._noKey)return null;            // 后端未配 Key
  if(!d.primary)throw new Error('返回结构异常');
  return d;
}

const MUSIC_MIX_MSGS=[
  '唱针落下，先听完前八拍...',
  '辨认曲风与速度...',
  '把音色翻译成基酒...',
  '按混响的长度校准余味...',
  '这杯是这首歌的味道。'
];

async function startMusicMix(){
  const raw=songInput.value.trim();
  if(!raw)return;
  const steps=document.getElementById('music-mix-steps');
  steps.innerHTML='';
  // 转场时把歌名贴到转动的那张唱片上
  const vs=document.getElementById('vinyl-song');
  if(vs){
    const main=raw.split(/\s*[-–—]\s*/)[0].replace(/^[《"']|["'》]$/g,'');
    vs.textContent=main.length>6?main.slice(0,6):main;
  }
  musicShowSub('music-sub-mixing');
  document.getElementById('music-bar-card').classList.add('loading');

  const aiPromise=aiMusicMix(raw).catch(e=>{
    console.warn('音乐调酒失败，降级本地:',e.message);return null;
  });

  MUSIC_MIX_MSGS.forEach((msg,i)=>{
    setTimeout(()=>{
      const div=document.createElement('div');
      div.className='mix-step';
      div.innerHTML=`<div class="step-dot"></div><div class="step-txt">${msg}</div>`;
      steps.appendChild(div);
      setTimeout(()=>div.classList.add('vis'),50);
    },i*680);
  });

  const minWait=new Promise(r=>setTimeout(r,MUSIC_MIX_MSGS.length*680+500));
  const [ai]=await Promise.all([aiPromise,minWait]);

  const data=ai||musicLocal(raw);
  renderMusicResult(data,!!ai);
  musicShowSub('music-sub-result');
}

/* ---- 结果渲染 ---- */
// 局部转义：模型返回的歌名/歌手是纯文本，拼入 innerHTML 前必须转义。
// 命名加前缀，避开其他模块可能同名的局部变量，不污染全局。
const mEsc=s=>String(s==null?'':s).replace(/[&<>]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));

function renderMusicResult(data,byAI){
  const c=data.primary,s=data.song||{};
  lastMusicDrink=c;
  lastMusicSong=s;
  lastMusicTunes=Array.isArray(data.similar)?data.similar:[];

  /* ① 歌曲档案 */
  document.getElementById('s-title').textContent=s.title||'—';
  const artistEl=document.getElementById('s-artist');
  // 模型说自己不认识这首歌时，如实标注，不装作知道
  artistEl.textContent=s.artist||(s.known?'—':'（未能确认这首歌）');
  artistEl.classList.toggle('dim',!s.artist);

  // 元信息标签：只渲染真的有值的那几个，避免一排「—」
  const metas=[
    ['曲风',s.genre],['速度',s.tempo],['情绪',s.mood],
    ['年份',s.year],['专辑',s.album],
  ].filter(([,v])=>v&&v!=='—');
  document.getElementById('s-metas').innerHTML=
    metas.map(([k,v])=>`<span class="song-meta"><i>${mEsc(k)}</i>${mEsc(v)}</span>`).join('');

  const listen=document.getElementById('s-listen');
  if(s.listen){listen.textContent='「'+s.listen+'」';listen.style.display='';}
  else{listen.style.display='none';}

  /* ② 酒卡（与另外两个模式同一套渲染） */
  syncKeepBtn(document.getElementById('music-keep'),c,'music');
  document.getElementById('u-name-zh').textContent=c.poeticZh||'—';
  document.getElementById('u-name-en').textContent=c.poeticEn||'—';
  document.getElementById('u-base').textContent=c.base||'—';
  renderRecipe('u',c);
  document.getElementById('u-top').textContent=c.topNote||'—';
  document.getElementById('u-mid').textContent=c.midNote||'—';
  document.getElementById('u-base-note').textContent=c.baseNote||'—';
  const abv=drinkABV(c);
  document.getElementById('u-pct').textContent=abv+'% ABV';
  setTimeout(()=>{document.getElementById('u-bar').style.width=abvBarPct(abv)+'%';},300);
  renderGlassInto('u-glass',c);
  document.getElementById('u-glow').style.background=c.glowColor||c.color1;

  // 「为什么这首歌是这杯酒」
  const rr=document.getElementById('u-reading-row');
  if(c.reading){
    document.getElementById('u-reading').textContent=c.reading;
    rr.style.display='block';
  }else{rr.style.display='none';}

  /* ③ 同频歌单 */
  const tl=document.getElementById('tune-list');
  const rows=Array.isArray(data.similar)?data.similar:[];
  if(rows.length){
    document.getElementById('tune-rows').innerHTML=rows.map((t,i)=>`
      <div class="tune-row">
        <span class="tune-n">${String(i+1).padStart(2,'0')}</span>
        <div class="tune-main">
          <div class="tune-title">${mEsc(t.title)}</div>
          ${t.artist?`<div class="tune-artist">${mEsc(t.artist)}</div>`:''}
          ${t.why?`<div class="tune-why">${mEsc(t.why)}</div>`:''}
        </div>
      </div>`).join('');
    tl.style.display='';
  }else{
    tl.style.display='none';
  }

  /* ④ 调酒师卡片 */
  fillBarCard('music-bar-card','music-card-headline','music-card-body','music-card-tag',c,byAI);
}

/* ---- 返回 / 重来 / 导出 ---- */
function resetMusic(){
  musicShowSub('music-sub-input');
}
document.getElementById('music-back').addEventListener('click',resetMusic);
document.getElementById('music-remix').addEventListener('click',()=>{
  songInput.value='';
  syncSongInput();
  resetMusic();
  setTimeout(()=>songInput.focus(),320);
});
document.getElementById('music-save').addEventListener('click',()=>{
  if(!lastMusicDrink)return;
  // tunes 会被卡片画成「接着放」那一区，让分享出去的图
  // 同时是一杯酒和一份歌单
  saveCard(lastMusicDrink,{from:musicFromLine(),tunes:lastMusicTunes});
});

/* 导出卡与酒柜共用的一行来源说明：「♪ 歌名 - 歌手」 */
function musicFromLine(){
  if(!lastMusicSong)return '';
  const s=lastMusicSong;
  return '♪ '+(s.title||'')+(s.artist?' - '+s.artist:'');
}

/* 配方展开/收起：结果页第三个前缀 'u' 也要绑上 */
(function bindMusicRecipeToggle(){
  const tg=document.getElementById('u-rx-toggle');
  const wrap=document.getElementById('u-rx-wrap');
  if(!tg||!wrap)return;
  const toggle=()=>{
    const on=wrap.classList.toggle('open');
    tg.setAttribute('aria-expanded',on?'true':'false');
  };
  tg.addEventListener('click',toggle);
  tg.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}
  });
})();

syncSongInput();
