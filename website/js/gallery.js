(() => {
  'use strict';
  const dialog = document.querySelector('.ds-gallery-dialog');
  const buttons = [...document.querySelectorAll('button[data-gallery-index]')];
  if (!dialog || !buttons.length) return;
  const image = dialog.querySelector('#gallery-photo');
  let current = 0;
  const show = index => {
    current = (index + buttons.length) % buttons.length;
    const card = buttons[current].closest('figure');
    const thumbnail = card.querySelector('img');
    image.src = thumbnail.src;
    image.alt = thumbnail.alt;
    dialog.querySelector('#gallery-photo-title').textContent = card.querySelector('h3').textContent;
    dialog.querySelector('#gallery-photo-finish').textContent = card.querySelector('.ds-eyebrow').textContent;
    dialog.querySelector('#gallery-photo-count').textContent = `${current + 1} / ${buttons.length}`;
  };
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    show(index);
    dialog.showModal();
  }));
  dialog.querySelector('.ds-gallery-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.ds-gallery-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.ds-gallery-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
