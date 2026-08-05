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
/* ========================================================
   经典酒的调酒配比
   ----------------------------------------------------------
   key = CLASSIC_BAR 的 en 字段。
   ratio  : [[材料, 用量], ...]  尽量按 IBA 官方配方，单位统一 ml，
            少量调味用 dash / tsp / 叶 等惯用计量。
   method : 做法（摇/搅/兑/分层…），一句话讲清操作。
   garnish: 装饰物；没有就留空，渲染时会自动跳过。
   ======================================================== */
const CLASSIC_RECIPE={
  'B-52':{ratio:[['咖啡利口酒','20 ml'],['百利甜','20 ml'],['金万利','20 ml']],
    method:'按密度由重到轻依次贴壁缓倒，分三层不搅拌',garnish:''},
  'Aperol Spritz':{ratio:[['Prosecco','90 ml'],['Aperol','60 ml'],['苏打水','30 ml']],
    method:'杯中加满冰，直接兑和，轻搅一下',garnish:'橙片'},
  'White Russian':{ratio:[['伏特加','50 ml'],['咖啡利口酒','20 ml'],['淡奶油','30 ml']],
    method:'古典杯加冰，先兑前两者，奶油浮面',garnish:''},
  'Sidecar':{ratio:[['干邑','50 ml'],['橙皮利口酒','20 ml'],['柠檬汁','20 ml']],
    method:'摇酒壶加冰摇匀，滤入冰杯',garnish:'糖边 / 柠檬皮'},
  'Daiquiri':{ratio:[['白朗姆','60 ml'],['青柠汁','25 ml'],['糖浆','15 ml']],
    method:'加冰摇匀，双重过滤入冰杯',garnish:'青柠片'},
  'Dry Martini':{ratio:[['金酒','60 ml'],['干味美思','10 ml']],
    method:'调酒杯加冰搅拌 30 秒，滤入冰杯',garnish:'橄榄或柠檬皮'},
  'Old Fashioned':{ratio:[['波本威士忌','60 ml'],['糖浆','10 ml'],['安高天娜苦精','2 dash']],
    method:'古典杯化糖加大冰，搅拌至外壁挂霜',garnish:'橙皮'},
  "Dark 'n' Stormy":{ratio:[['黑朗姆','60 ml'],['姜汁啤酒','100 ml'],['青柠汁','10 ml']],
    method:'高球杯加冰兑姜啤，朗姆最后浮面成"风暴"',garnish:'青柠角'},
  'Sex on the Beach':{ratio:[['伏特加','40 ml'],['桃子利口酒','20 ml'],['橙汁','40 ml'],['蔓越莓汁','40 ml']],
    method:'加冰摇匀后倒入高球杯，或直接兑和',garnish:'橙片'},
  'Gimlet':{ratio:[['金酒','60 ml'],['青柠汁','20 ml'],['糖浆','10 ml']],
    method:'加冰摇匀，滤入冰过的碟形杯',garnish:'青柠片'},
  'Zombie':{ratio:[['牙买加朗姆','45 ml'],['金朗姆','45 ml'],['高度朗姆','15 ml'],['青柠汁','20 ml'],['法勒南糖浆','15 ml'],['葡萄柚汁','15 ml']],
    method:'碎冰摇匀倒入提基杯，一人一杯封顶',garnish:'薄荷 / 青柠'},
  'Godfather':{ratio:[['苏格兰威士忌','45 ml'],['杏仁利口酒','15 ml']],
    method:'古典杯加大冰，直接兑和轻搅',garnish:''},
  'Gin & Tonic':{ratio:[['金酒','50 ml'],['汤力水','150 ml']],
    method:'杯中加满冰，贴壁倒汤力水保气泡',garnish:'青柠角'},
  'Blue Hawaii':{ratio:[['白朗姆','30 ml'],['蓝橙利口酒','15 ml'],['菠萝汁','60 ml'],['甜酸汁','15 ml']],
    method:'加冰摇匀，倒入盛碎冰的飓风杯',garnish:'菠萝片 / 樱桃'},
  'Tequila Sunrise':{ratio:[['龙舌兰','45 ml'],['橙汁','90 ml'],['红石榴糖浆','15 ml']],
    method:'兑好龙舌兰与橙汁，糖浆沿壁沉底成渐层，不搅',garnish:'橙片'},
  'Screwdriver':{ratio:[['伏特加','50 ml'],['橙汁','100 ml']],
    method:'高球杯加冰，直接兑和',garnish:'橙片'},
  'Margarita':{ratio:[['龙舌兰','50 ml'],['橙皮利口酒','20 ml'],['青柠汁','15 ml']],
    method:'加冰摇匀，滤入抹好盐边的冰杯',garnish:'盐边 / 青柠片'},
  'Manhattan':{ratio:[['黑麦威士忌','50 ml'],['甜味美思','20 ml'],['安高天娜苦精','2 dash']],
    method:'调酒杯加冰搅匀，滤入冰过的碟形杯',garnish:'糖渍樱桃'},
  'See You Tomorrow':{ratio:[['威士忌','45 ml'],['咖啡利口酒','15 ml'],['糖浆','5 ml'],['苦精','1 dash']],
    method:'加冰搅匀，滤入冰过的古典杯',garnish:'柠檬皮'},
  'Mojito':{ratio:[['白朗姆','45 ml'],['青柠汁','20 ml'],['白砂糖','2 tsp'],['薄荷叶','6 片'],['苏打水','补满']],
    method:'薄荷与糖轻压出香，加冰兑朗姆，苏打补满',garnish:'薄荷枝'},
  'Negroni':{ratio:[['金酒','30 ml'],['甜味美思','30 ml'],['金巴利','30 ml']],
    method:'古典杯加大冰，等份兑和搅匀',garnish:'橙皮'},
  'Espresso Martini':{ratio:[['伏特加','50 ml'],['咖啡利口酒','20 ml'],['浓缩咖啡','30 ml'],['糖浆','10 ml']],
    method:'加冰用力摇出厚泡，滤入冰过的碟形杯',garnish:'三粒咖啡豆'},
  'Hot Toddy':{ratio:[['威士忌','45 ml'],['蜂蜜','15 ml'],['柠檬汁','15 ml'],['热水','100 ml']],
    method:'温杯后化开蜂蜜，兑酒与热水，别煮沸',garnish:'柠檬片 / 丁香 / 肉桂'},
  'Clover Club':{ratio:[['金酒','45 ml'],['覆盆子糖浆','15 ml'],['柠檬汁','15 ml'],['蛋白','1 个']],
    method:'先干摇起泡，再加冰摇匀，双重过滤',garnish:'覆盆子'},
  'Tom Collins':{ratio:[['金酒','45 ml'],['柠檬汁','30 ml'],['糖浆','15 ml'],['苏打水','60 ml']],
    method:'前三者摇匀滤入加冰的柯林杯，苏打补满',garnish:'柠檬片 / 樱桃'},
  'Whiskey Sour':{ratio:[['波本威士忌','45 ml'],['柠檬汁','25 ml'],['糖浆','15 ml'],['蛋白','可选'] ],
    method:'加冰摇匀，滤入冰杯；加蛋白则先干摇',garnish:'柠檬片 / 樱桃'},
  'Salty Dog':{ratio:[['金酒','45 ml'],['葡萄柚汁','120 ml']],
    method:'抹好盐边的杯中加冰，直接兑和',garnish:'盐边 / 葡萄柚片'},
  'Champagne Cocktail':{ratio:[['香槟','90 ml'],['白兰地','10 ml'],['方糖','1 块'],['安高天娜苦精','2 dash']],
    method:'方糖蘸苦精置杯底，注入香槟，白兰地浮面',garnish:'橙皮'},
  'Yukiguni':{ratio:[['伏特加','40 ml'],['白橙皮利口酒','20 ml'],['青柠汁','2 tsp']],
    method:'加冰摇匀，滤入抹好糖边的冰杯',garnish:'糖边 / 绿樱桃'},
  'Bloody Mary':{ratio:[['伏特加','45 ml'],['番茄汁','90 ml'],['柠檬汁','15 ml'],['伍斯特酱','2 dash'],['塔巴斯科','1 dash'],['盐与黑胡椒','少许']],
    method:'两杯之间来回滚动混合，避免摇散番茄汁',garnish:'芹菜梗 / 柠檬角'},
  'Alexander':{ratio:[['白兰地','30 ml'],['可可利口酒','30 ml'],['鲜奶油','30 ml']],
    method:'等份加冰摇匀，滤入冰过的碟形杯',garnish:'现磨肉豆蔻'},
  'Piña Colada':{ratio:[['白朗姆','50 ml'],['椰浆','30 ml'],['菠萝汁','90 ml']],
    method:'与碎冰一同搅打成绵密沙冰',garnish:'菠萝片 / 樱桃'},
  'Long Island Iced Tea':{ratio:[['伏特加','15 ml'],['金酒','15 ml'],['白朗姆','15 ml'],['龙舌兰','15 ml'],['橙皮利口酒','15 ml'],['柠檬汁','25 ml'],['糖浆','15 ml'],['可乐','补满']],
    method:'除可乐外摇匀滤入加冰长杯，可乐补出茶色',garnish:'柠檬角'},
  'Cuba Libre':{ratio:[['白朗姆','50 ml'],['可乐','120 ml'],['青柠汁','10 ml']],
    method:'高球杯加冰，挤青柠后兑可乐',garnish:'青柠角'},
  'Last Word':{ratio:[['金酒','22.5 ml'],['绿查特酒','22.5 ml'],['马拉斯奇诺','22.5 ml'],['青柠汁','22.5 ml']],
    method:'四等份加冰摇匀，滤入冰过的碟形杯',garnish:'糖渍樱桃'},
};

/* [性能] 酒柜图片三档图源
   原 酒柜/*.png 是 1760×2336 的母版，单张 1~4MB、35 张共 64MB。
   移动端切进「我的酒柜」要一次性拉 35 张原图，首屏直接卡住数秒。
   现改为：
     列表(110px 显示) → 酒柜/thumbs/*.png  480px 宽，共 3.3MB
     详情(380px 显示) → 酒柜/mid/*.png     900px 宽，共 11MB（按需加载）
     原 PNG 作为母版保留，不再由前端加载。

   ⚠️ 缩略图必须是 PNG，不能用 JPEG：
   母版是抠图，酒杯外的背景是透明的，靠 .bottle-pic 的深色渐变透上来。
   JPEG 不支持 alpha，转换时透明区会被压成纯白 → 酒柜变成一格格白底方块。
   PNG 保留 alpha，480px 单张约 140KB，相比原图仍是 16 倍提升。

   缩略图由 scripts/optimize-images.sh 生成（macOS sips，零依赖）。
   若缩略图缺失，onerror 会自动回退到原 PNG，不会出现空图。 */
CLASSIC_BAR.forEach(c=>{
  c.img      = '酒柜/'+c.zh+'.png';          // 母版（兜底）
  c.imgThumb = '酒柜/thumbs/'+c.zh+'.png';   // 列表
  c.imgMid   = '酒柜/mid/'+c.zh+'.png';      // 详情
  c.kind     = 'classic';
  c.recipe   = CLASSIC_RECIPE[c.en]||null;   // 调酒配比（详情卡展示）
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
    // 配方一并存下来，否则酒柜里的珍藏只剩香调、看不到怎么做。
    // 统一成 [[名称,用量式]]，和经典酒谱同一种格式。
    recipe:(typeof normRecipe==='function'?normRecipe(c.recipe):[]),
    method:c.method||'',garnish:c.garnish||'',
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

/* ---- 调酒配比区块 ----
   两种数据源共用同一张配方卡：
     · 经典酒谱   d.recipe = {ratio,method,garnish}
     · 珍藏自调酒 d.recipe = [[名称,用量]]，method/garnish 平铺在 d 上
   都归一成 {rows,method,garnish} 再渲染；没配方则返回空串自动跳过。
   材料按「名称 —— 用量」两端对齐排列，中间用点线连起来，
   看起来像酒单/配方卡，而不是一张普通表格。 */
function recipeHTML(d){
  if(!d)return '';
  const r=d.recipe;
  let rows=[],method=d.method||'',garnish=d.garnish||'';
  if(Array.isArray(r)){
    rows=r;
  }else if(r&&Array.isArray(r.ratio)){
    rows=r.ratio;
    method=r.method||method;
    garnish=r.garnish||garnish;
  }
  if(!rows.length)return '';
  const esc=s=>String(s).replace(/[&<>]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));
  const list=rows.map(([name,amt])=>
    `<div class="rc-row"><span class="rc-name">${esc(name)}</span>
       <span class="rc-dot"></span><span class="rc-amt">${esc(amt||'适量')}</span></div>`).join('');
  return `<div class="sheet-recipe">
    <div class="rc-hd"><span class="rc-lbl">RECIPE</span><span class="rc-zh">调酒配比</span></div>
    <div class="rc-list">${list}</div>
    ${method?`<div class="rc-meta"><span class="rc-k">做法</span><span class="rc-v">${esc(method)}</span></div>`:''}
    ${garnish?`<div class="rc-meta"><span class="rc-k">装饰</span><span class="rc-v">${esc(garnish)}</span></div>`:''}
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
     ${recipeHTML(d)}
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

/* ---- 三个结果页的星号按钮 ---- */
const btnKeep=document.getElementById('btn-keep');
const moodKeep=document.getElementById('mood-keep');
const musicKeep=document.getElementById('music-keep');

btnKeep.addEventListener('click',()=>{
  if(!lastRec)return;
  keepDrink(lastRec.primary,'chat',{blend:lastInput||''},btnKeep);
});
moodKeep.addEventListener('click',()=>{
  if(!lastMoodDrink)return;
  keepDrink(lastMoodDrink,'mood',{blend:lastMoodBlend||''},moodKeep);
});
// 音乐调酒：来源写成「♪ 歌名 - 歌手」，进柜后一眼知道这杯是哪首歌来的
if(musicKeep)musicKeep.addEventListener('click',()=>{
  if(typeof lastMusicDrink==='undefined'||!lastMusicDrink)return;
  keepDrink(lastMusicDrink,'music',
    {blend:(typeof musicFromLine==='function'?musicFromLine():'')},musicKeep);
});

// 每次出结果都把星号复位（新的一杯还没收藏）
function syncKeepBtn(btn,c,src){
  if(!btn)return;
  btn.classList.toggle('starred',!!(c&&isKept(c,src)));
}

renderCabinet();

