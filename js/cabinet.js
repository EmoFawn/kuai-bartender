/* ========================================================
   我的酒柜 · CABINET
   两格陈列：
     ① 我的珍藏 —— 你点星号存下来的自调酒（localStorage 持久化）
     ② 经典酒谱 —— 硬编码的 35 杯经典款，用 酒柜/ 目录下的真实照片
   陈列形式：三列一排，每排下方一道木纹隔板，像真的柜子；
   点任意一瓶从底部升起详情卡。
   ======================================================== */

// 经典酒谱（图片取自 酒柜/*.png，文件名即中文名）
const CLASSIC_BAR=[
  {zh:'B-52轰炸机',en:'B-52',base:'咖啡利口酒',abv:24,tags:['分层','烈','甜'],
   note:'三层不肯融合，像三种情绪各自站在自己的位置上。'},
  {zh:'阿佩罗喷趣酒',en:'Aperol Spritz',base:'Prosecco',abv:11,tags:['气泡','清爽','微苦'],
   note:'度数最低，快乐最高。这就是它的设计。'},
  {zh:'白俄罗斯',en:'White Russian',base:'伏特加',abv:20,tags:['奶香','甜','治愈'],
   note:'奶油味会把丧裹住，咽下去就轻了。'},
  {zh:'边车',en:'Sidecar',base:'干邑',abv:26,tags:['酸','优雅','经典'],
   note:'酸得干净利落，不留余地也不留遗憾。'},
  {zh:'黛绮莉',en:'Daiquiri',base:'白朗姆',abv:20,tags:['酸','清爽','简洁'],
   note:'三种材料，没有一处可以藏拙。'},
  {zh:'干马天尼',en:'Dry Martini',base:'金酒',abv:30,tags:['烈','冷','极简'],
   note:'冷到极致的清醒。它不安慰你，它审视你。'},
  {zh:'古典',en:'Old Fashioned',base:'波本威士忌',abv:32,tags:['微苦','沉稳','深夜'],
   note:'苦味有时候是糖，慢慢就知道了。'},
  {zh:'黑风暴',en:"Dark 'n' Stormy",base:'黑朗姆',abv:15,tags:['辛','深沉','独处'],
   note:'姜的辣和朗姆的甜在打架，你负责观战。'},
  {zh:'激情海岸',en:'Sex on the Beach',base:'伏特加',abv:12,tags:['果味','甜','热带'],
   note:'名字比酒放得开，喝起来其实很乖。'},
  {zh:'吉姆雷特',en:'Gimlet',base:'金酒',abv:24,tags:['酸','清冽','利落'],
   note:'"喝 Gimlet 太早了。"——有些话要在对的时候说。'},
  {zh:'僵尸',en:'Zombie',base:'多种朗姆',abv:28,tags:['烈','热带','危险'],
   note:'一杯封顶不是规矩，是忠告。'},
  {zh:'教父',en:'Godfather',base:'苏格兰威士忌',abv:30,tags:['杏仁','烈','沉'],
   note:'两种材料就能压场，靠的是底气。'},
  {zh:'金汤力',en:'Gin & Tonic',base:'金酒',abv:12,tags:['清爽','气泡','解渴'],
   note:'先清醒，再慢慢放松。顺序别搞反。'},
  {zh:'蓝色夏威夷',en:'Blue Hawaii',base:'白朗姆',abv:13,tags:['果味','热带','甜'],
   note:'蓝色不属于任何水果，但属于假期。'},
  {zh:'龙舌兰日出',en:'Tequila Sunrise',base:'龙舌兰',abv:13,tags:['果味','渐层','甜'],
   note:'红慢慢渗下来，像天亮那几分钟。'},
  {zh:'螺丝起子',en:'Screwdriver',base:'伏特加',abv:14,tags:['果味','简单','清爽'],
   note:'最不装的一杯。想喝就喝，不用理由。'},
  {zh:'玛格丽特',en:'Margarita',base:'龙舌兰',abv:22,tags:['酸','盐边','烈'],
   note:'有些情绪需要被一刀切开，不是慢慢磨。'},
  {zh:'曼哈顿',en:'Manhattan',base:'黑麦威士忌',abv:30,tags:['微苦','经典','沉稳'],
   note:'这杯不陪犹豫。喝之前想好，喝完去做。'},
  {zh:'明天见',en:'See You Tomorrow',base:'威士忌',abv:26,tags:['告别','微苦','夜'],
   note:'不是再见，是明天还得见。'},
  {zh:'莫吉托',en:'Mojito',base:'白朗姆',abv:12,tags:['清爽','薄荷','气泡'],
   note:'让薄荷替你松一口气。'},
  {zh:'内格罗尼',en:'Negroni',base:'金酒',abv:24,tags:['苦','有态度','红'],
   note:'这杯不讨好任何人，包括你。但你会回来的。'},
  {zh:'浓缩咖啡马天尼',en:'Espresso Martini',base:'伏特加',abv:22,tags:['苦','提神','浓郁'],
   note:'咖啡因和酒精同时报到，你选谁先到。'},
  {zh:'热托迪',en:'Hot Toddy',base:'威士忌',abv:13,tags:['暖','蜂蜜','治愈'],
   note:'有些夜晚不需要微醺，只需要被抱住。'},
  {zh:'三叶草俱乐部',en:'Clover Club',base:'金酒',abv:18,tags:['柔','果味','泡沫'],
   note:'这杯温柔到你可以不用坚强。'},
  {zh:'汤姆柯林斯',en:'Tom Collins',base:'金酒',abv:11,tags:['气泡','酸','悠长'],
   note:'能聊两个小时的那种酒，不急着喝完。'},
  {zh:'威士忌酸',en:'Whiskey Sour',base:'波本威士忌',abv:20,tags:['酸','平衡','泡沫'],
   note:'酸和甜互相让一步，就成了刚好。'},
  {zh:'咸狗',en:'Salty Dog',base:'金酒',abv:14,tags:['盐边','微苦','清爽'],
   note:'咸味让苦更诚实一点。'},
  {zh:'香槟鸡尾酒',en:'Champagne Cocktail',base:'香槟',abv:15,tags:['气泡','庆祝','精致'],
   note:'今天值得 bubbles，别省着。'},
  {zh:'雪国',en:'Yukiguni',base:'伏特加',abv:26,tags:['糖边','清冽','白'],
   note:'"穿过县界长长的隧道，便是雪国。"'},
  {zh:'血腥玛丽',en:'Bloody Mary',base:'伏特加',abv:12,tags:['咸鲜','番茄','醒神'],
   note:'早晨的救命汤，只是它带酒。'},
  {zh:'亚历山大',en:'Alexander',base:'白兰地',abv:20,tags:['奶香','可可','甜'],
   note:'甜得像不用负责的那种夜晚。'},
  {zh:'椰林飘香',en:'Piña Colada',base:'白朗姆',abv:13,tags:['椰香','热带','甜'],
   note:'你在工位上，但这杯替你去了海边。'},
  {zh:'长岛冰茶',en:'Long Island Iced Tea',base:'四种基酒',abv:22,tags:['烈','伪装','危险'],
   note:'看着像茶，喝着像茶，然后你就躺下了。'},
  {zh:'自由古巴',en:'Cuba Libre',base:'白朗姆',abv:13,tags:['可乐','青柠','轻松'],
   note:'最不费力的快乐，一挤一倒就有。'},
  {zh:'最后一言',en:'Last Word',base:'金酒',abv:26,tags:['草本','酸','复杂'],
   note:'有些事到此为止，这杯替你说最后一句话。'},
];
/* [性能] 酒柜图片三档图源
   原 酒柜/*.png 是 1760×2336 的母版，单张 1~4MB、35 张共 64MB。
   移动端切进「我的酒柜」要一次性拉 35 张原图，首屏直接卡住数秒。
   现改为：
     列表(110px 显示) → 酒柜/thumbs/*.jpg  480px 宽，共 616KB
     详情(380px 显示) → 酒柜/mid/*.jpg     900px 宽，共 1.9MB
     原 PNG 作为母版保留，不再由前端加载。
   缩略图由 scripts/optimize-images.sh 生成（macOS sips，零依赖）。
   若缩略图缺失，onerror 会自动回退到原 PNG，不会出现空图。 */
CLASSIC_BAR.forEach(c=>{
  c.img      = '酒柜/'+c.zh+'.png';          // 母版（兜底）
  c.imgThumb = '酒柜/thumbs/'+c.zh+'.jpg';   // 列表
  c.imgMid   = '酒柜/mid/'+c.zh+'.jpg';      // 详情
  c.kind     = 'classic';
});

const KEEP_KEY='kuai_cabinet_v1';
let keptList=[];            // 珍藏列表
let cabSeg='kept';          // 当前分区
let cabTimers=[];

function loadKept(){
  try{keptList=JSON.parse(localStorage.getItem(KEEP_KEY)||'[]');}
  catch(_){keptList=[];}
  if(!Array.isArray(keptList))keptList=[];
}
function saveKept(){
  try{localStorage.setItem(KEEP_KEY,JSON.stringify(keptList));}catch(_){}
}
loadKept();

// 一杯酒的唯一签名：同一杯反复点星号不会重复入柜
function drinkKey(c,src){
  return (src||'')+'|'+(c.poeticZh||c.nameZh||c.name||'')+'|'+(c.base||'');
}
function isKept(c,src){
  const k=drinkKey(c,src);
  return keptList.some(x=>x.key===k);
}

/* ---- 珍藏进柜 ---- */
function keepDrink(c,src,meta,btn){
  if(!c)return;
  const k=drinkKey(c,src);
  if(keptList.some(x=>x.key===k)){
    showToast('这杯已经在柜里了');
    return;
  }
  keptList.unshift({
    key:k,kind:'kept',src:src,
    zh:c.poeticZh||c.nameZh||'无名之作',
    en:c.poeticEn||c.name||'',
    base:c.base||'—',topNote:c.topNote||'',midNote:c.midNote||'',baseNote:c.baseNote||'',
    color1:c.color1||'#7a4a1a',color2:c.color2||'#c47830',glowColor:c.glowColor||c.color1||'#a05a20',
    glass:c.glass||'',strength:c.strength||3,
    note:c.comment||'',
    blend:meta&&meta.blend?meta.blend:'',      // 心情配比 / 输入文字
    at:Date.now(),
  });
  saveKept();
  if(btn){
    btn.classList.add('starred','pop');
    setTimeout(()=>btn.classList.remove('pop'),480);
  }
  showToast('✦ 已珍藏进酒柜');
  renderCabinet();
}

let toastTimer=null;
function showToast(txt){
  let t=document.getElementById('keep-toast');
  if(!t){
    t=document.createElement('div');
    t.id='keep-toast';t.className='keep-toast';
    document.body.appendChild(t);
  }
  t.textContent=txt;
  void t.offsetWidth;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('on'),1900);
}

/* ---- 渲染柜体 ---- */
function renderCabinet(){
  cabTimers.forEach(clearTimeout);cabTimers=[];
  const body=document.getElementById('cab-body');
  document.getElementById('seg-n-kept').textContent=keptList.length;
  document.getElementById('seg-n-classic').textContent=CLASSIC_BAR.length;
  const list=cabSeg==='kept'?keptList:CLASSIC_BAR;
  document.getElementById('cab-count').textContent=
    cabSeg==='kept'?(keptList.length?keptList.length+' 杯珍藏':'尚无珍藏')
                   :CLASSIC_BAR.length+' 款经典';

  if(!list.length){
    body.innerHTML=
      `<div class="cab-empty">
         <div class="cab-empty-ico">🥃</div>
         <div class="cab-empty-t">柜子还是空的</div>
         <div class="cab-empty-s">去「对话调酒」或「心情调酒」调一杯，
           在结果页点右下角的 ✦，它就会留在这里。</div>
       </div>`;
    return;
  }

  // 三列一排，每排下面垫一层隔板
  let html='';
  for(let i=0;i<list.length;i+=3){
    const row=list.slice(i,i+3);
    html+='<div class="shelf"><div class="shelf-row">';
    row.forEach((d,j)=>{
      const idx=i+j;
      html+=bottleHTML(d,idx);
    });
    // 不足三列时补空位，保证左对齐不被拉伸
    for(let k=row.length;k<3;k++)html+='<div></div>';
    html+='</div></div><div class="shelf-board"></div>';
  }
  body.innerHTML=html;

  // 逐个上架
  // [性能] 原来是 40+i*46，35 瓶要 1.6s 才全部就位，移动端观感很"卡"。
  // 现在只对首屏可见的前 12 瓶做错峰入场，后面的直接就位 ——
  // 反正它们在滚动线以下，用户看不到入场动画，只会感觉到延迟。
  body.querySelectorAll('.bottle').forEach((el,i)=>{
    if(i<12){
      const t=setTimeout(()=>el.classList.add('in'),40+i*38);
      cabTimers.push(t);
    }else{
      el.classList.add('in');
    }
    el.addEventListener('click',()=>openSheet(list[+el.dataset.idx],+el.dataset.idx));
  });
  // 珍藏的自调酒没有照片，用生成的酒杯补上
  body.querySelectorAll('.bottle-gen').forEach(g=>{
    const d=list[+g.dataset.idx];
    if(d)renderGlassInto(g.querySelector('svg').id,d);
  });
}

function bottleHTML(d,idx){
  if(d.kind==='classic'){
    /* [性能] 列表只加载 480px 缩略图；
       decoding="async" 让解码不阻塞主线程滚动，
       width/height 提前占位避免图片陆续到达时布局反复重排（移动端卡顿主因之一），
       onerror 兜底回退母版 PNG。 */
    return `<div class="bottle" data-idx="${idx}">
      <div class="bottle-pic">
        <img src="${encodeURI(d.imgThumb||d.img)}" alt="${d.zh}"
             loading="lazy" decoding="async" width="360" height="480"
             onerror="this.onerror=null;this.src='${encodeURI(d.img)}'">
      </div>
      <div class="bottle-name">${d.zh}</div>
      <div class="bottle-abv">${d.abv}% ABV</div>
    </div>`;
  }
  // 珍藏：用配色光晕 + 生成杯型
  const sid='cabg'+idx;
  return `<div class="bottle" data-idx="${idx}">
    <div class="bottle-pic">
      <div class="bottle-glow" style="background:${d.glowColor}"></div>
      <div class="bottle-gen" data-idx="${idx}"><svg id="${sid}" viewBox="0 0 150 180"></svg></div>
      <div class="bottle-star">✦</div>
    </div>
    <div class="bottle-name">${d.zh}</div>
    <div class="bottle-abv">${drinkABV(d)}% ABV</div>
  </div>`;
}

/* ---- 详情卡 ---- */
const sheetEl=document.getElementById('sheet');
const sheetMask=document.getElementById('sheet-mask');
const sheetScroll=document.getElementById('sheet-scroll');

function openSheet(d,idx){
  if(!d)return;
  const isClassic=d.kind==='classic';
  const notes=[d.topNote,d.midNote,d.baseNote].filter(Boolean);
  sheetScroll.innerHTML=
    (isClassic
      ? `<div class="sheet-pic"><img src="${encodeURI(d.imgMid||d.img)}" alt="${d.zh}"
             decoding="async"
             onerror="this.onerror=null;this.src='${encodeURI(d.img)}'"></div>`
      : `<div class="sheet-pic" style="background:radial-gradient(ellipse 65% 60% at 50% 55%,${d.glowColor}55,rgba(0,0,0,0.5));display:flex;align-items:center;justify-content:center;">
           <svg id="sheet-glass" viewBox="0 0 150 180" style="width:150px;height:170px;position:relative;z-index:1;"></svg>
         </div>`)+
    `<div class="sheet-name">${d.zh}</div>
     <div class="sheet-en">${d.en||''}</div>
     <div class="sheet-tagrow">
       ${(d.tags||[]).map(t=>`<span class="sheet-tag">${t}</span>`).join('')}
       <span class="sheet-tag">基酒 ${d.base}</span>
       <span class="sheet-tag">${drinkABV(d)}% ABV</span>
     </div>
     ${notes.length?`<div class="sheet-tagrow">${notes.map(n=>`<span class="sheet-tag">${n}</span>`).join('')}</div>`:''}
     ${d.blend?`<div class="sheet-quote" style="font-style:normal;color:rgba(201,169,110,0.85);">来自：${d.blend}</div>`:''}
     <div class="sheet-quote">"${d.note||''}"</div>
     <div class="sheet-actions">
       ${isClassic
         ? `<button class="sheet-btn solid" id="sheet-close2">知道了</button>`
         : `<button class="sheet-btn danger" id="sheet-del">移出酒柜</button>
            <button class="sheet-btn solid" id="sheet-close2">收起</button>`}
     </div>`;
  if(!isClassic)renderGlassInto('sheet-glass',d);

  sheetMask.classList.add('on');
  sheetEl.classList.add('on');

  const c2=document.getElementById('sheet-close2');
  if(c2)c2.addEventListener('click',closeSheet);
  const del=document.getElementById('sheet-del');
  if(del)del.addEventListener('click',()=>{
    keptList=keptList.filter(x=>x.key!==d.key);
    saveKept();closeSheet();renderCabinet();
    showToast('已移出酒柜');
  });
}
function closeSheet(){
  sheetEl.classList.remove('on');
  sheetMask.classList.remove('on');
}
sheetMask.addEventListener('click',closeSheet);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet();});

// 分区切换
document.querySelectorAll('.cab-seg').forEach(s=>{
  s.addEventListener('click',()=>{
    document.querySelectorAll('.cab-seg').forEach(x=>x.classList.remove('on'));
    s.classList.add('on');
    cabSeg=s.dataset.seg;
    closeSheet();
    renderCabinet();
  });
});

/* ---- 两个星号按钮 ---- */
const btnKeep=document.getElementById('btn-keep');
const moodKeep=document.getElementById('mood-keep');

btnKeep.addEventListener('click',()=>{
  if(!lastRec)return;
  keepDrink(lastRec.primary,'chat',{blend:lastInput||''},btnKeep);
});
moodKeep.addEventListener('click',()=>{
  if(!lastMoodDrink)return;
  keepDrink(lastMoodDrink,'mood',{blend:lastMoodBlend||''},moodKeep);
});

// 每次出结果都把星号复位（新的一杯还没收藏）
function syncKeepBtn(btn,c,src){
  if(!btn)return;
  btn.classList.toggle('starred',!!(c&&isKept(c,src)));
}

renderCabinet();

