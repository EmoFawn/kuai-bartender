// ===== LANDING =====
/* 落地页漂浮微尘：随机位置/时长/延迟，制造"空气里有东西在动"的呼吸感 */
(function(){
  const dust=document.getElementById('landing-dust');
  if(!dust)return;
  for(let i=0;i<18;i++){
    const s=document.createElement('i');
    s.style.left=Math.random()*100+'%';
    s.style.top=(50+Math.random()*50)+'%';
    s.style.animationDuration=(7+Math.random()*7).toFixed(1)+'s';
    s.style.animationDelay=(Math.random()*8).toFixed(1)+'s';
    dust.appendChild(s);
  }
})();

// #app 初始加 .hidden（display:none）彻底移出渲染树，防止其内部
// 隐形元素遮挡"推门"按钮；点击后先移除 hidden 再触发淡入过渡。
document.getElementById('app').classList.add('hidden');
document.getElementById('btn-door').addEventListener('click',()=>{
  const landing=document.getElementById('landing');
  const app=document.getElementById('app');
  landing.style.opacity='0';
  app.classList.remove('hidden');
  // 强制 reflow，让 display 变化生效后 opacity 过渡才有动画
  void app.offsetWidth;
  setTimeout(()=>{
    landing.classList.remove('active');
    landing.classList.add('hidden');
    app.classList.add('active');
  },700);
});

// ===== TABS =====
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const name=tab.dataset.tab;
    document.querySelectorAll('.pane').forEach(p=>p.classList.remove('active'));
    document.getElementById('pane-'+name).classList.add('active');
  });
});

