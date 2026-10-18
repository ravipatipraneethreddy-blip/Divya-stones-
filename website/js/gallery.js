(() => {
  'use strict';
  const dialog = document.querySelector('.ds-gallery-dialog');
  const cards = [...document.querySelectorAll('.ds-gallery-section [data-media-kind]')];
  if (!dialog || !cards.length) return;
  const image = dialog.querySelector('#gallery-photo');
  const video = dialog.querySelector('#gallery-video');
  const status = dialog.querySelector('#gallery-status');
  const original = dialog.querySelector('#gallery-original');
  const more = document.querySelector('#gallery-more');
  const count = document.querySelector('#gallery-visible-count');
  let selected = cards, limit = 12, current = 0, hls = null, version = 0, library;
  const render = () => {
    cards.forEach(card => { card.hidden = !selected.includes(card) || selected.indexOf(card) >= limit; });
    more.hidden = limit >= selected.length;
    count.textContent = `${Math.min(limit, selected.length)} of ${selected.length}`;
  };
  document.querySelectorAll('[data-gallery-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-gallery-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const filter = button.dataset.galleryFilter;
    selected = cards.filter(card => filter === 'all' || card.dataset.mediaKind === filter);
    limit = 12;
    render();
  }));
  more.addEventListener('click', () => { limit += 12; render(); });
  render();
  const cleanup = () => {
    version++;
    if (hls) { hls.destroy(); hls = null; }
    video.pause(); video.removeAttribute('src'); video.load();
    image.removeAttribute('src');
    image.hidden = true; video.hidden = true; original.hidden = true;
    status.textContent = '';
  };
  const loadPlayer = () => library || (library = new Promise((resolve, reject) => {
    if (window.Hls) return resolve(window.Hls);
    const script = document.createElement('script');
    script.src = '/js/vendor/hls.min.js';
    script.onload = () => resolve(window.Hls);
    script.onerror = () => { library = null; script.remove(); reject(new Error('Player unavailable')); };
    document.head.append(script);
  }));
  const show = async index => {
    cleanup();
    const ticket = version;
    current = (index + selected.length) % selected.length;
    const card = selected[current];
    const link = card.querySelector('[data-gallery-open]');
    dialog.querySelector('#gallery-photo-count').textContent = `${current + 1} / ${selected.length}`;
    status.textContent = 'Loading…';
    if (card.dataset.mediaKind === 'photo') {
      image.hidden = false; image.alt = link.getAttribute('aria-label').replace('Open ', '');
      image.onload = () => { if (ticket === version) status.textContent = ''; };
      image.onerror = () => { if (ticket === version) status.textContent = 'The photo could not load. Please try again.'; };
      image.src = link.href;
      original.href = link.dataset.original; original.hidden = false;
      return;
    }
    video.hidden = false; video.poster = card.querySelector('img').src;
    video.onloadeddata = () => { if (ticket === version) status.textContent = ''; };
    video.onerror = () => { if (ticket === version) status.textContent = 'The video could not load. Please try again.'; };
    if (link.pathname.endsWith('.mp4') || video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = link.href; video.load(); video.play().catch(() => {});
      return;
    }
    try {
      const Hls = await loadPlayer();
      if (ticket !== version) return;
      if (!Hls.isSupported()) throw new Error('Unsupported');
      hls = new Hls({ maxBufferLength: 8, maxMaxBufferLength: 12, backBufferLength: 4 });
      hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal && ticket === version) status.textContent = 'The video could not load. Please try again.'; });
      hls.on(Hls.Events.MANIFEST_PARSED, () => { if (ticket === version) video.play().catch(() => {}); });
      hls.loadSource(link.href); hls.attachMedia(video);
    } catch (_) { if (ticket === version) status.textContent = 'This browser cannot play the video. Please try Safari, Chrome or Edge.'; }
  };
  cards.forEach(card => card.querySelector('[data-gallery-open]').addEventListener('click', event => {
    event.preventDefault();
    dialog.showModal();
    show(selected.indexOf(card));
  }));
  dialog.querySelector('.ds-gallery-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', cleanup);
  dialog.querySelector('.ds-gallery-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.ds-gallery-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.target === video) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
})();
