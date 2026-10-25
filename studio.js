(() => {
  const root = document.querySelector('body.studio');
  if (!root) return;
  const slides = [...root.querySelectorAll('.studio-stage .poster')];
  const info = [
    ['CHARACTER / SERIES', '十二星次 · 盲盒宇宙'],
    ['ILLUSTRATION / LANDSCAPE', '国风山水 · 插画探索'],
    ['PRODUCT / FURNITURE', '坐进一片绿意 · 产品概念']
  ];
  let current = 0;
  const update = () => {
    slides.forEach((slide, index) => {
      slide.hidden = index !== current;
      slide.classList.toggle('is-active', index === current);
    });
    document.getElementById('studio-slide-counter').textContent = String(current + 1).padStart(2, '0') + ' / 03';
    document.getElementById('studio-slide-kind').textContent = info[current][0];
    document.getElementById('studio-slide-title').textContent = info[current][1];
  };
  document.getElementById('studio-prev').addEventListener('click', () => {current = (current + slides.length - 1) % slides.length; update();});
  document.getElementById('studio-next').addEventListener('click', () => {current = (current + 1) % slides.length; update();});
  let start;
  const stage = root.querySelector('.studio-stage');
  let suppressClick = false;
  stage.addEventListener('touchstart', event => {start = {x: event.touches[0].clientX, y:event.touches[0].clientY};}, {passive:true});
  stage.addEventListener('touchend', event => {
    if (!start) return;
    const dx=event.changedTouches[0].clientX-start.x, dy=event.changedTouches[0].clientY-start.y;
    if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) {suppressClick=true;current=(current+(dx<0?1:-1)+slides.length)%slides.length;update();setTimeout(()=>suppressClick=false,350);}
    start=null;
  }, {passive:true});
  stage.addEventListener('click', event => {if(suppressClick){event.preventDefault();event.stopPropagation();}}, true);
  update();
})();
