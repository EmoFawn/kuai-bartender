/* ========================================================
   酒卡导出 · CARD EXPORT
   点「↓」不再直接甩一张图下来，而是：
     绘制高清卡片 → 弹窗预览 → 用户决定「保存」或「复制」
   卡片按真实名片比例排版，元素分区：
     徽标 / 酒名 / 杯型插画 / 配方信息 / 一句话 / 落款
   ======================================================== */

const CARD_W=750,CARD_H=1180,DPR=2;   // DPR=2 输出 1500×2360，够清晰

let cardBlob=null,cardName='苦艾酒卡';

/* ---- 圆角矩形路径 ---- */
function rrPath(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

/* ---- 文本按宽度换行，返回实际占用高度 ---- */
function wrapText(ctx,text,cx,y,maxW,lh){
  const chars=String(text||'').split('');
  let line='',lines=[];
  chars.forEach(ch=>{
    if(ctx.measureText(line+ch).width>maxW&&line){lines.push(line);line=ch;}
    else line+=ch;
  });
  if(line)lines.push(line);
  lines.forEach((l,i)=>ctx.fillText(l,cx,y+i*lh));
  return lines.length*lh;
}

/* ---- 细分隔线（中间亮、两端淡） ---- */
function divider(ctx,y,x1,x2){
  const g=ctx.createLinearGradient(x1,y,x2,y);
  g.addColorStop(0,'rgba(201,169,110,0)');
  g.addColorStop(0.5,'rgba(201,169,110,0.3)');
  g.addColorStop(1,'rgba(201,169,110,0)');
  ctx.strokeStyle=g;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();
}

/* ---- 画杯型插画（4 种杯型的简化剪影 + 液体） ---- */
function drawGlassArt(ctx,cx,cy,c){
  const type=(typeof pickGlass==='function')?pickGlass(c):'rocks';
  const c1=c.color1||'#7a4a1a',c2=c.color2||'#c47830';
  const liq=ctx.createLinearGradient(cx-70,cy-60,cx+50,cy+90);
  liq.addColorStop(0,c1);liq.addColorStop(1,c2);
  const glass='rgba(255,255,255,0.13)';
  const edge='rgba(255,255,255,0.42)';
  ctx.save();
  ctx.translate(cx,cy);
  ctx.lineWidth=2.4;ctx.lineJoin='round';

  const shapes={
    rocks:{body:[[-62,-72],[62,-72],[52,84],[-52,84]],level:-18},
    highball:{body:[[-44,-96],[44,-96],[38,88],[-38,88]],level:-56},
    coupe:{body:[[-76,-70],[76,-70],[10,10],[-10,10]],level:-44},
    flute:{body:[[-34,-100],[34,-100],[10,20],[-10,20]],level:-58},
  };
  const s=shapes[type]||shapes.rocks;
  const [tl,tr,br,bl]=s.body;

  // 杯身
  ctx.beginPath();
  ctx.moveTo(tl[0],tl[1]);ctx.lineTo(tr[0],tr[1]);
  ctx.lineTo(br[0],br[1]);ctx.lineTo(bl[0],bl[1]);ctx.closePath();
  ctx.fillStyle=glass;ctx.fill();

  // 液体（裁剪在杯身内）
  ctx.save();ctx.clip();
  const lvY=s.level;
  ctx.fillStyle=liq;
  ctx.fillRect(-90,lvY,180,200);
  // 液面高光
  ctx.fillStyle='rgba(255,255,255,0.22)';
  ctx.fillRect(-90,lvY,180,3);
  ctx.restore();

  // 杯壁描边 + 左侧竖向反光
  ctx.beginPath();
  ctx.moveTo(tl[0],tl[1]);ctx.lineTo(tr[0],tr[1]);
  ctx.lineTo(br[0],br[1]);ctx.lineTo(bl[0],bl[1]);ctx.closePath();
  ctx.strokeStyle=edge;ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(tl[0],tl[1]);ctx.lineTo(tr[0],tr[1]);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.14)';
  ctx.beginPath();ctx.ellipse(tl[0]+16,-20,5,40,0,0,Math.PI*2);ctx.fill();

  // 高脚杯的杯脚
  if(type==='coupe'||type==='flute'){
    ctx.strokeStyle=edge;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(0,74);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-32,80);ctx.lineTo(32,80);ctx.stroke();
  }
  ctx.restore();
}

/* ---- 主绘制 ---- */
function drawCard(c,meta){
  const canvas=document.getElementById('card-canvas');
  canvas.width=CARD_W*DPR;canvas.height=CARD_H*DPR;
  const ctx=canvas.getContext('2d');
  ctx.scale(DPR,DPR);
  const W=CARD_W,H=CARD_H,cx=W/2;
  const glow=c.glowColor||c.color1||'#a05a20';

  // 背景：深色渐变 + 酒色氛围光
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#100e09');bg.addColorStop(0.5,'#16130d');bg.addColorStop(1,'#0c0a06');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const rg=ctx.createRadialGradient(cx,470,0,cx,470,340);
  rg.addColorStop(0,glow+'4d');rg.addColorStop(1,'transparent');
  ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);

  // 双层金边框
  ctx.strokeStyle='rgba(201,169,110,0.22)';ctx.lineWidth=1.5;
  rrPath(ctx,26,26,W-52,H-52,20);ctx.stroke();
  ctx.strokeStyle='rgba(201,169,110,0.1)';ctx.lineWidth=1;
  rrPath(ctx,36,36,W-72,H-72,15);ctx.stroke();

  ctx.textAlign='center';

  // 顶部徽标：—— ◇ 苦艾 ◇ ——
  ctx.fillStyle='#c9a96e';
  ctx.font='600 19px "Noto Serif SC","Songti SC",serif';
  ctx.fillText('苦 艾',cx,96);
  ctx.strokeStyle='rgba(201,169,110,0.45)';ctx.lineWidth=1;
  [[-1,1],[1,-1]].forEach(()=>{});
  ctx.beginPath();ctx.moveTo(cx-92,90);ctx.lineTo(cx-46,90);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx+46,90);ctx.lineTo(cx+92,90);ctx.stroke();
  ctx.save();ctx.translate(cx-34,90);ctx.rotate(Math.PI/4);
  ctx.fillStyle='rgba(201,169,110,0.7)';ctx.fillRect(-3,-3,6,6);ctx.restore();
  ctx.save();ctx.translate(cx+34,90);ctx.rotate(Math.PI/4);
  ctx.fillStyle='rgba(201,169,110,0.7)';ctx.fillRect(-3,-3,6,6);ctx.restore();

  // 来源标签
  ctx.fillStyle='#6b6255';
  ctx.font='11px "Inter",sans-serif';
  ctx.fillText(meta&&meta.label?meta.label:'YOUR EXCLUSIVE BLEND',cx,130);

  // 酒名（中/英）
  ctx.fillStyle='#efe6d8';
  ctx.font='700 42px "Noto Serif SC","Songti SC",serif';
  const nameH=wrapText(ctx,c.poeticZh||'今夜这一杯',cx,190,W-160,52);
  ctx.fillStyle='#8a7f6c';
  ctx.font='italic 18px "Playfair Display",Georgia,serif';
  ctx.fillText(c.poeticEn||'',cx,190+nameH+2);

  // 杯型插画
  drawGlassArt(ctx,cx,468,c);

  // 信息区
  let y=612;
  divider(ctx,y,90,W-90);
  y+=38;
  ctx.textAlign='left';
  ctx.fillStyle='#6b6255';ctx.font='12px "Inter",sans-serif';
  ctx.fillText('基酒 BASE',100,y);
  ctx.textAlign='right';
  ctx.fillStyle='#e8ddd0';ctx.font='19px "Noto Serif SC",serif';
  ctx.fillText(c.base||'—',W-100,y);

  y+=28;divider(ctx,y,90,W-90);y+=36;
  // 三段香调
  [['TOP',c.topNote],['MID',c.midNote],['BASE',c.baseNote]].forEach((it,i)=>{
    const x=100+i*((W-200)/3);
    ctx.textAlign='left';
    ctx.fillStyle='#6b6255';ctx.font='10px "Inter",sans-serif';
    ctx.fillText(it[0],x,y);
    ctx.fillStyle='#e8ddd0';ctx.font='17px "Noto Serif SC",serif';
    ctx.fillText(it[1]||'—',x,y+26);
  });

  y+=52;divider(ctx,y,90,W-90);y+=34;
  // ABV
  const abv=(typeof drinkABV==='function')?drinkABV(c):(c.abv||20);
  ctx.textAlign='left';
  ctx.fillStyle='#6b6255';ctx.font='12px "Inter",sans-serif';
  ctx.fillText('酒精度 ABV',100,y);
  ctx.textAlign='right';
  ctx.fillStyle='#c9a96e';ctx.font='600 19px "Inter",sans-serif';
  ctx.fillText(abv+'%',W-100,y);
  // 强度条
  const barY=y+14,barW=W-200;
  ctx.fillStyle='rgba(255,255,255,0.07)';rrPath(ctx,100,barY,barW,6,3);ctx.fill();
  const pct=(typeof abvBarPct==='function')?abvBarPct(abv)/100:abv/40;
  const fg=ctx.createLinearGradient(100,0,100+barW*pct,0);
  fg.addColorStop(0,'#a07840');fg.addColorStop(1,'#e0c48a');
  ctx.fillStyle=fg;rrPath(ctx,100,barY,Math.max(8,barW*pct),6,3);ctx.fill();

  y=barY+44;divider(ctx,y,90,W-90);

  // 心情来源（如果有）
  y+=36;
  ctx.textAlign='center';
  if(meta&&meta.from){
    ctx.fillStyle='#6b6255';ctx.font='12px "Noto Serif SC",serif';
    y+=wrapText(ctx,meta.from,cx,y,W-190,24);
    y+=14;
  }

  // 一句话（调酒师的话）
  ctx.fillStyle='#a89a84';
  ctx.font='italic 19px "Noto Serif SC",serif';
  wrapText(ctx,'「'+(c.comment||'今晚交给它。')+'」',cx,y+8,W-190,32);

  // 落款
  ctx.fillStyle='#5a5248';ctx.font='11px "Inter",sans-serif';
  ctx.fillText('苦艾 kuAI · 情绪调酒馆',cx,H-92);
  const d=new Date();
  ctx.fillStyle='rgba(107,98,85,0.65)';ctx.font='10px "Inter",sans-serif';
  ctx.fillText(`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} 只属于今晚`,cx,H-70);

  return canvas;
}

/* ---- 打开预览弹窗 ---- */
const cardModal=document.getElementById('card-modal');
const cardPreview=document.getElementById('card-preview');
const cardTip=document.getElementById('card-tip');

function saveCard(c,meta){
  if(!c)return;
  const canvas=drawCard(c,meta);
  cardName='苦艾-'+(c.poeticZh||'今夜这一杯');
  cardPreview.src=canvas.toDataURL('image/png');
  canvas.toBlob(b=>{cardBlob=b;},'image/png');
  cardTip.textContent='长按图片也可保存';
  cardTip.classList.remove('ok');
  cardModal.classList.add('on');
}

function closeCardModal(){cardModal.classList.remove('on');}
document.getElementById('card-close').addEventListener('click',closeCardModal);
document.getElementById('card-modal-mask').addEventListener('click',closeCardModal);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&cardModal.classList.contains('on'))closeCardModal();
});

/* 保存：优先用 Web Share（移动端可直接存相册/发给朋友），否则退回下载 */
document.getElementById('card-download').addEventListener('click',async()=>{
  const url=cardPreview.src;
  if(!url)return;
  try{
    if(cardBlob&&navigator.canShare){
      const file=new File([cardBlob],cardName+'.png',{type:'image/png'});
      if(navigator.canShare({files:[file]})){
        await navigator.share({files:[file],title:cardName});
        return;
      }
    }
  }catch(e){/* 用户取消分享或不支持，走下载 */}
  const a=document.createElement('a');
  a.download=cardName+'.png';a.href=url;a.click();
  cardTip.textContent='已保存 ✦';cardTip.classList.add('ok');
});

/* 复制到剪贴板 */
document.getElementById('card-copy').addEventListener('click',async()=>{
  try{
    if(!cardBlob)throw new Error('图片还没准备好');
    await navigator.clipboard.write([new ClipboardItem({'image/png':cardBlob})]);
    cardTip.textContent='已复制到剪贴板 ✦';cardTip.classList.add('ok');
  }catch(e){
    cardTip.textContent='当前浏览器不支持复制，请用「保存」';
    cardTip.classList.remove('ok');
  }
});
