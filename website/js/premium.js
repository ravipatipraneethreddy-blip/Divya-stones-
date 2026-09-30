(() => {
'use strict';
const init=()=>{
 const menu=document.querySelector('.mobile-menu-btn');
 const nav=document.querySelector('.nav-links');
 const closeMenu=()=>{nav?.classList.remove('active');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');};
 menu?.addEventListener('click',()=>{const open=nav.classList.toggle('active');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 const current=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
 nav?.querySelectorAll('a').forEach(a=>{const path=new URL(a.href).pathname;if(path===current){a.setAttribute('aria-current','page');a.classList.add('active');}});
 const dialog=document.querySelector('.ds-search-dialog');
 const field=document.getElementById('stone-search');
 const results=document.getElementById('search-results');
 let products=null;
 const render=()=>{
  if(!products)return;
  const query=field.value.trim().toLowerCase();
  const matches=products.filter(p=>(p.name+' '+p.category+' '+p.text).toLowerCase().includes(query)).slice(0,query?35:7);
  results.replaceChildren();
  if(!matches.length){const p=document.createElement('p');p.textContent='No exact match. Try a colour, stone name or collection, or contact our team.';results.append(p);return;}
  matches.forEach(p=>{const a=document.createElement('a');a.href=p.url;const name=document.createElement('b');name.textContent=p.name;const category=document.createElement('span');category.textContent=p.category+' ↗';a.append(name,category);results.append(a);});
 };
 document.querySelectorAll('.ds-search-open').forEach(b=>b.addEventListener('click',async()=>{
  closeMenu();dialog.showModal();field.focus();
  if(products){render();return;}
  results.textContent='Loading the material library…';
  try{const r=await fetch('/search-index.json');if(!r.ok)throw Error('unavailable');products=await r.json();render();}
  catch{results.replaceChildren();const a=document.createElement('a');a.href='/products';a.textContent='Browse all collections ↗';results.append(a);}
 }));
 document.querySelector('.ds-search-close')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 field?.addEventListener('input',render);
 document.querySelectorAll('.gallery-thumb').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','View '+img.alt);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();img.click();}});});
 document.querySelectorAll('.product-tabs').forEach(group=>{
  group.setAttribute('role','tablist');group.setAttribute('aria-label','Product information');
  const tabs=[...group.querySelectorAll('button')];
  const update=()=>tabs.forEach(t=>{const selected=t.classList.contains('active');t.setAttribute('role','tab');t.setAttribute('aria-selected',String(selected));t.setAttribute('aria-controls',t.dataset.tab);t.tabIndex=selected?0:-1;const panel=document.getElementById(t.dataset.tab);if(panel){panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',t.id||(t.id='tab-button-'+t.dataset.tab));}});
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>queueMicrotask(update));t.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].click();tabs[n].focus();}});});update();
 });

};
if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init);else init();
})();
