(() => {
  'use strict';
  const data = window.PORTFOLIO_DATA;
  if (!data) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const external = 'target="_blank" rel="noopener noreferrer"';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const projects = data.projects;
  const excluded = new Set(['yguodong627-star.github.io', '----', 'demo', 'HelpCat', 'Ethan']);
  const repos = data.repos.filter(repo => !excluded.has(repo.name));
  let category = '全部';
  let expanded = false;
  let activeProject = null;
  let imageIndex = 0;
  let lastOpener = null;
  let toastTimer;

  $('#year').textContent = new Date().getFullYear();
  $('#collection-count').textContent = projects.length;
  $('#repo-count').textContent = repos.length;
  $('[data-code-filter="all"] span').textContent = repos.length;
  $('[data-filter="全部"] small').textContent = projects.length;
  function sharpCover(element, image, sizes) {
    element.src = image.src;
    element.srcset = `${image.thumb} ${image.thumbWidth}w, ${image.src} ${image.fullWidth}w`;
    element.sizes = sizes;
  }
  sharpCover($('#hero-illustration'), data.hero.illustration, '(max-width: 700px) 40vw, 25vw');
  sharpCover($('#hero-chair'), data.hero.chair, '(max-width: 700px) 44vw, 27vw');
  sharpCover($('#hero-ip'), data.hero.ip, '(max-width: 700px) 60vw, 35vw');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.06});
  function observeReveals() {
    $$('.reveal:not(.is-visible)').forEach(element => revealObserver.observe(element));
  }

  function renderArt() {
    const matching = projects.filter(project => category === '全部' || project.category === category);
    const visible = category === '全部' && !expanded ? matching.slice(0, 6) : matching;
    $('#art-grid').innerHTML = visible.map(project => {
      const position = String(projects.indexOf(project) + 1).padStart(2, '0');
      return `<article class="art-card reveal" data-id="${escape(project.id)}"><button type="button" class="art-image" data-open-art="${escape(project.id)}" aria-label="查看${escape(project.title)}，${project.images.length}张图片"><img src="${escape(project.cover.src)}" srcset="${escape(project.cover.thumb)} ${project.cover.thumbWidth}w, ${escape(project.cover.src)} ${project.cover.fullWidth}w" sizes="(max-width: 700px) 88vw, 60vw" alt="${escape(project.title)}" loading="lazy" decoding="async" width="${project.cover.width}" height="${project.cover.height}"><span class="art-series">${escape(project.tag)}</span><span class="art-view" aria-hidden="true">↗</span></button><div class="art-caption"><div><h3>${escape(project.title)}</h3><p>${escape(project.category)} · ${project.images.length} 张作品</p></div><span class="art-number">/${position}</span></div></article>`;
    }).join('');
    $('.filter-count').textContent = `SHOWING / ${String(visible.length).padStart(2, '0')}`;
    const more = $('#more-art');
    more.hidden = category !== '全部';
    more.innerHTML = expanded ? '收起部分项目 <span>−</span>' : `展开全部 ${projects.length} 组视觉项目 <span>＋</span>`;
    $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    observeReveals();
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    renderArt();
  }));
  $('#more-art').addEventListener('click', () => {
    expanded = !expanded;
    renderArt();
    if (!expanded) $('#works').scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth'});
  });
  renderArt();

  const projectNames = {
    'vibe-farm': ['溪谷小农场', 'A little farm', 'farm', '像素田园生活游戏。种田、钓鱼、挖矿，也可以养动物和交朋友。'],
    'vibe-ridge': ['岚山', 'Ridge', 'ridge', '随真实时辰变换色彩的生成式山岚，支持导出 iPhone 壁纸。'],
    'vibe-ink-bloom': ['墨韵', 'Ink Bloom', 'ink', '一场可以亲手参与的水墨晕染实验。让墨色随操作展开。'],
    'vibe-hue-weave': ['拾色', 'Hue Weave', 'hue', '渐变色块拼图小游戏。在细微的色彩之间，找回秩序。'],
    'vibe-pdfbox': ['页匠', 'PDF Box', 'pdf', '在浏览器里完成 PDF 合并、拆分和整理，文件在本地处理。'],
    'vibe-loom': ['织时', 'Loom', 'loom', '深色专注番茄钟。为一段安静、专注的时间留一个位置。'],
    'vibe-liteshot': ['压片', 'LiteShot', null, '电商图片批量处理：尺寸、压缩、水印、重命名与 ZIP 导出。'],
    'cike-cundang': ['此刻存档', 'Capture the moment', null],
    'answers-book': ['答案之书', 'Answers Book', null],
    'vibe-tide-breath': ['潮息', 'Tide Breath', null],
    'lockscreen-cat': ['锁屏萌宠', 'Lockscreen Pet', null],
    'tomjerry-chat': ['猫和老鼠语音聊天小屋', 'Voice Chat', null],
    'vibe-fenhao': ['分好', 'Split Simply', null],
    'vibe-subwake': ['订醒', 'SubWake', null],
    'vibe-gongzuotai': ['本地工作台', 'Workspace', null],
    'vibe-crm': ['客簿', 'Personal CRM', null],
    'vibe-shuanglian': ['链记', 'Linked Notes', null],
    'vibe-shoujixiang': ['拾页', 'Read Later', null],
    'vibe-zhoubao': ['周报台', 'Weekly Desk', null],
    'vibe-caiwu': ['细水账', 'Personal Finance', null],
    'vibe-piaoju': ['票据夹', 'Receipt Library', null],
    'vibe-zhuanwen': ['转文', 'Text Tools', null],
    'vibe-kaidan': ['开单', 'Invoice Desk', null],
    'vibe-profit-calc': ['利润定价计算器', 'Pricing Calculator', null]
  };
  function links(repo) {
    const demo = /^https:\/\//.test(repo.homepage || '') ? `<a href="${escape(repo.homepage)}" ${external}>打开体验 ↗</a>` : '';
    return `<div class="project-links">${demo}<a href="${escape(repo.html_url)}" ${external}>GitHub 源码 ↗</a></div>`;
  }
  const ridge = repos.find(repo => repo.name === 'vibe-ridge');
  if (ridge) {
    $('#featured-code').innerHTML = `<article class="featured-code reveal"><a href="${escape(ridge.homepage)}" ${external} class="featured-screenshot" aria-label="打开岚山动态壁纸体验"><img src="assets/project-ridge.jpg" alt="岚山 Ridge 实际界面" loading="lazy" width="1200" height="800"><span class="screen-stamp">FEATURED EXPERIMENT / 01</span></a><div class="featured-info"><span class="mono">GENERATIVE ART × A MOMENT OF CALM</span><h3>岚山 <em>Ridge</em></h3><p>把一天的光，装进一片山岚。<br>随真实时辰变换色彩的生成式动态壁纸，还可以导出到你的 iPhone。</p>${links(ridge)}</div></article>`;
  }
  const selectedNames = ['vibe-ink-bloom', 'vibe-hue-weave', 'vibe-farm', 'vibe-pdfbox', 'vibe-loom', 'vibe-liteshot'];
  function renderCode(mode = 'featured') {
    const listing = mode === 'all' ? repos.filter(repo => repo.name !== 'vibe-ridge') : selectedNames.map(name => repos.find(repo => repo.name === name)).filter(Boolean);
    $('#code-grid').innerHTML = listing.map(repo => {
      const [name, subtitle, screenshot, description] = projectNames[repo.name] || [repo.name, 'Independent project', null];
      const url = /^https:\/\//.test(repo.homepage || '') ? repo.homepage : repo.html_url;
      const visual = screenshot ? `<img src="assets/project-${screenshot}.jpg" alt="${escape(name)}的实际项目界面" loading="lazy" decoding="async" width="1200" height="800">` : `<div class="repo-icon" aria-hidden="true"><span>${escape(name.slice(0, 2))}.</span></div>`;
      return `<article class="code-card reveal"><a class="code-preview" href="${escape(url)}" ${external} aria-label="打开${escape(name)}">${visual}</a><h3>${escape(name)} <span>${escape(subtitle)}</span></h3><p>${escape(description || repo.description || '独立开发项目，点击查看项目说明。')}</p>${links(repo)}</article>`;
    }).join('');
    $$('[data-code-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.codeFilter === mode)));
    observeReveals();
  }
  $$('[data-code-filter]').forEach(button => button.addEventListener('click', () => renderCode(button.dataset.codeFilter)));
  renderCode();

  const dialog = $('#project-dialog');
  let orderedImages = [];
  function showImage(index) {
    imageIndex = (index + orderedImages.length) % orderedImages.length;
    const image = orderedImages[imageIndex];
    $('#dialog-image').src = image.src;
    $('#dialog-image').alt = `${activeProject.title} · ${image.name}`;
    $('#image-name').textContent = image.name;
    $('#image-count').textContent = `${String(imageIndex + 1).padStart(2, '0')} / ${String(orderedImages.length).padStart(2, '0')}`;
    $$('#image-thumbs button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === imageIndex)));
    const currentThumb = $$('#image-thumbs button')[imageIndex];
    if (currentThumb) {
      const thumbs = $('#image-thumbs');
      thumbs.scrollTo({left: Math.max(0, currentThumb.offsetLeft - thumbs.offsetLeft - thumbs.clientWidth / 2 + currentThumb.clientWidth / 2), behavior: reducedMotion ? 'auto' : 'smooth'});
    }
    const next = orderedImages[(imageIndex + 1) % orderedImages.length];
    if (next && next.src !== image.src) { const preload = new Image(); preload.src = next.src; }
  }
  function openProject(id, opener) {
    const project = projects.find(item => item.id === id);
    if (!project) return;
    if (opener) lastOpener = opener;
    activeProject = project;
    orderedImages = [project.cover, ...project.images.filter(image => image.src !== project.cover.src)];
    $('#dialog-title').textContent = project.title;
    $('#dialog-summary').textContent = project.summary;
    $('#dialog-category').textContent = project.category;
    $('#dialog-kicker').textContent = `${project.tag} / ${orderedImages.length} IMAGES`;
    $('#image-thumbs').innerHTML = orderedImages.map((image, i) => `<button type="button" data-image-index="${i}" aria-label="查看第 ${i + 1} 张：${escape(image.name)}" aria-pressed="false"><img src="${escape(image.thumb)}" alt="" loading="lazy"></button>`).join('');
    showImage(0);
    document.body.classList.add('dialog-open');
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }
  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-open-art]');
    if (opener) openProject(opener.dataset.openArt, opener);
    const thumb = event.target.closest('[data-image-index]');
    if (thumb) showImage(Number(thumb.dataset.imageIndex));
  });
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    lastOpener?.focus({preventScroll: true});
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  $('.previous-image').addEventListener('click', () => showImage(imageIndex - 1));
  $('.next-image').addEventListener('click', () => showImage(imageIndex + 1));
  $('.next-project').addEventListener('click', () => {
    const i = projects.indexOf(activeProject);
    openProject(projects[(i + 1) % projects.length].id);
  });
  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') {event.preventDefault(); showImage(imageIndex - 1);}
    if (event.key === 'ArrowRight') {event.preventDefault(); showImage(imageIndex + 1);}
  });
  let touchStart;
  $('.image-stage').addEventListener('touchstart', event => touchStart = {x:event.touches[0].clientX,y:event.touches[0].clientY}, {passive:true});
  $('.image-stage').addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)) showImage(imageIndex+(dx<0?1:-1));
    touchStart=null;
  }, {passive:true});

  const collage = $('.hero-collage');
  if (!reducedMotion) {
    collage.addEventListener('pointermove', event => {
      const rect = collage.getBoundingClientRect();
      collage.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width - .5) * 2);
      collage.style.setProperty('--my', ((event.clientY - rect.top) / rect.height - .5) * 2);
    });
    collage.addEventListener('pointerleave', () => {collage.style.setProperty('--mx', 0);collage.style.setProperty('--my', 0);});
  }
  const menu = $('.menu-toggle');
  function closeMenu() {$('.header').classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','打开导航');}
  menu.addEventListener('click', () => {
    const open = $('.header').classList.toggle('menu-open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  });
  $$('.nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {if(event.key==='Escape')closeMenu();});

  function toast(message) {
    clearTimeout(toastTimer);const element=$('#toast');element.textContent=message;element.classList.add('visible');toastTimer=setTimeout(()=>element.classList.remove('visible'),2600);
  }
  $$('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const text=button.dataset.copy;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(!ok)throw new Error('copy unavailable');}
      toast('已复制电话 / 微信号：'+text);
    } catch {toast('电话 / 微信号：'+text);}
  }));

  $$('.code-preview img, .featured-screenshot img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const fallback=document.createElement('div');fallback.className='repo-icon';fallback.innerHTML='<span>↗</span>';img.parentElement.prepend(fallback);},{once:true}));
  observeReveals();
})();
