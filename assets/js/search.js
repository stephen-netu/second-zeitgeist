    (function(){
  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function escapeHtml(str){ return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

  document.addEventListener('DOMContentLoaded', async function(){
    const input = $('#site-search-input');
    const panel = $('#site-search-results');
    const clearBtn = $('#site-search-clear');
    if(!input || !panel) return;

    // Create a polite live region for announcing results to screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('role', 'status');
    liveRegion.className = 'sr-only';
    const searchContainer = input.closest('.site-search') || document.body;
    searchContainer.appendChild(liveRegion);

    let data = null;
    let results = [];
    let activeIndex = -1;
    let currentFilter = 'all'; // all | event | quote | page
    let lastQuery = '';
    let lastCounts = { all: 0, event: 0, quote: 0, page: 0 };

    function debounce(fn, ms){
      let t; return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), ms); };
    }

    async function loadData(){
      if(data) return data;
      try {
        const res = await fetch(`${document.documentElement.dataset.baseurl || ''}/search.json`, {credentials: 'same-origin'});
        data = await res.json();
        // Preprocess items with searchable text and simple weighting
        const items = [];
        const push = (obj) => items.push(obj);
        (data.events || []).forEach(e => {
          const text = [e.title, e.claim, e.description, (e.facets||[]).join(' '), e.date].filter(Boolean).join(' \n ').toLowerCase();
          push({ type: 'event', title: e.title, url: e.url, snippet: e.claim || e.description || e.title, sort_key: e.sort_key, text });
        });
        (data.quotes || []).forEach(q => {
          const text = [q.text, q.cite].filter(Boolean).join(' \n ').toLowerCase();
          push({ type: 'quote', title: q.cite || 'Quote', url: q.url, snippet: q.text, text });
        });
        (data.pages || []).forEach(p => {
          const text = [p.title, p.content].filter(Boolean).join(' \n ').toLowerCase();
          push({ type: 'page', title: p.title, url: p.url, snippet: p.content, text });
        });
        data._items = items;
        return data;
      } catch (e) {
        console.error('Search data load failed', e);
        data = { _items: [] };
        return data;
      }
    }

    function score(item, q){
      // Simple heuristic: title match> snippet> generic text; startswith bonus
      const title = (item.title||'').toLowerCase();
      const snip = (item.snippet||'').toLowerCase();
      let s = 0;
      if (title.includes(q)) s += 5;
      if (snip.includes(q)) s += 3;
      if (item.text.includes(q)) s += 1;
      if (title.startsWith(q)) s += 2;
      return s;
    }

    function renderFilters(){
      const tabs = [
        {key:'all', label:'All'},
        {key:'event', label:'Events'},
        {key:'quote', label:'Quotes'},
        {key:'page', label:'Pages'},
      ];
      const btns = tabs.map(t=>{
        const count = lastCounts[t.key] ?? 0;
        const label = count ? `${t.label} (${count})` : t.label;
        const selected = currentFilter===t.key;
        const tabIndex = selected ? '0' : '-1';
        return `<button class="filter-btn${selected?' active':''}" role="tab" aria-selected="${selected}" tabindex="${tabIndex}" data-key="${t.key}">${label}</button>`;
      }).join('');
      return `<div class="results-filter" role="tablist" aria-label="Filter results by type">${btns}</div>`;
    }

    function highlight(text){
      if (!lastQuery || !text) return escapeHtml(text.toString());
      const escaped = escapeHtml(text.toString());
      const q = lastQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(q, 'ig');
      return escaped.replace(re, (m)=>`<mark>${m}</mark>`);
    }

    function render(list){
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      const html = [
        renderFilters(),
        list.length ? '<ul id="site-search-listbox" class="results-list" role="listbox" aria-labelledby="site-search-input">' : '<div class="results-empty" role="status">No results</div>',
        ...list.map((r,i)=>{
          const icon = r.type==='event'?'📅':(r.type==='quote'?'❝':'📄');
          const title = highlight(r.title || (r.type==='quote'?'Quote':'Untitled'));
          const snippet = highlight((r.snippet||'').toString().slice(0,160));
          const optId = `result-option-${i}`;
          // Anchor inside option should not be focusable to avoid nested interactive controls within role=option
          return `<li id="${optId}" class="result-item" role="option" aria-selected="false" data-index="${i}" data-url="${r.url}">
            <a href="${r.url}" class="result-link" tabindex="-1" role="presentation">
              <span class="result-icon" aria-hidden="true">${icon}</span>
              <span class="result-main">
                <span class="result-title">${title}</span>
                <span class="result-snippet">${snippet}</span>
              </span>
            </a>
          </li>`;
        }),
        list.length ? '</ul>' : ''
      ].join('');
      panel.innerHTML = html;
      if (list.length){
        activeIndex = -1;
        updateActive();
      }

      // Announce state to assistive tech
      try {
        const typeLabel = currentFilter==='all' ? 'all types' : currentFilter + 's';
        if (lastQuery && lastQuery.trim().length >= 2) {
          if (list.length === 0) {
            liveRegion.textContent = `No results for "${lastQuery}" in ${typeLabel}.`;
          } else {
            liveRegion.textContent = `${list.length} result${list.length===1?'':'s'} for "${lastQuery}" in ${typeLabel}.`;
          }
        } else {
          liveRegion.textContent = '';
        }
      } catch(_e) {}

      // Wire filter clicks
      const container = panel.querySelector('.results-filter');
      if (container){
        container.addEventListener('click', (e)=>{
          const btn = e.target.closest('.filter-btn');
          if (!btn) return;
          const key = btn.getAttribute('data-key');
          if (!key) return;
          currentFilter = key;
          // rerun the search to re-render list under new filter
          run(input.value);
        });

        // Keyboard navigation for tabs (Left/Right/Home/End)
        container.addEventListener('keydown', (e)=>{
          const tabs = $all('[role="tab"]', container);
          if (!tabs.length) return;
          const current = container.querySelector('[role="tab"][aria-selected="true"]');
          let idx = tabs.indexOf(current);
          if (idx < 0) idx = 0;
          let targetIdx = idx;
          if (e.key === 'ArrowRight') { targetIdx = (idx + 1) % tabs.length; e.preventDefault(); }
          else if (e.key === 'ArrowLeft') { targetIdx = (idx - 1 + tabs.length) % tabs.length; e.preventDefault(); }
          else if (e.key === 'Home') { targetIdx = 0; e.preventDefault(); }
          else if (e.key === 'End') { targetIdx = tabs.length - 1; e.preventDefault(); }
          else { return; }
          const target = tabs[targetIdx];
          if (target) {
            tabs.forEach(t => t.setAttribute('tabindex', t===target?'0':'-1'));
            target.focus();
            const key = target.getAttribute('data-key');
            if (key && key !== currentFilter) {
              currentFilter = key;
              // Announce filter switch immediately
              const label = target.textContent.trim();
              try { liveRegion.textContent = `Filter changed to ${label}.`; } catch(_) {}
              run(input.value);
            }
          }
        });
      }
    }

    function updateActive(){
      $all('.result-item', panel).forEach(el=>{ el.classList.remove('active'); el.setAttribute('aria-selected','false'); });
      if (activeIndex >=0) {
        const el = $(`.result-item[data-index="${activeIndex}"]`, panel);
        if (el) {
          el.classList.add('active');
          el.setAttribute('aria-selected','true');
          el.scrollIntoView({block:'nearest'});
          const id = el.getAttribute('id');
          if (id) input.setAttribute('aria-activedescendant', id);
        }
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    function clear(){
      results = [];
      activeIndex = -1;
      panel.hidden = true;
      panel.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
      try { liveRegion.textContent = ''; } catch(_) {}
    }

    async function run(q){
      lastQuery = q;
      q = q.trim().toLowerCase();
      if (q.length < 2) { clear(); if (clearBtn) clearBtn.hidden = true; return; }
      const d = await loadData();
      const items = d._items || [];
      const scored = items
        .map(it => ({ it, s: score(it, q) }))
        .filter(x => x.s>0);

      // counts across all types for tabs
      const counts = { all: scored.length, event: 0, quote: 0, page: 0 };
      for (const x of scored){ counts[x.it.type] = (counts[x.it.type]||0) + 1; }
      lastCounts = counts;

      const matched = scored
        .filter(x => currentFilter==='all' ? true : x.it.type===currentFilter)
        .sort((a,b)=>{
          if (b.s!==a.s) return b.s-a.s;
          // for events, secondary sort by sort_key ascending
          const ak = (a.it.sort_key||'');
          const bk = (b.it.sort_key||'');
          return (ak>bk?1:ak<bk?-1:0);
        })
        .slice(0, 12)
        .map(x => x.it);
      results = matched;
      render(results);
      if (clearBtn) clearBtn.hidden = (input.value.trim()==='');
    }

    function navigate(delta){
      if (panel.hidden || !results.length) return;
      activeIndex = Math.max(0, Math.min(results.length-1, (activeIndex<0? (delta>0?0:results.length-1) : activeIndex+delta)));
      updateActive();
    }

    function openActive(){
      if (activeIndex<0) return;
      const el = $(`.result-item[data-index="${activeIndex}"]`, panel);
      const url = el && el.getAttribute('data-url');
      if (url) { window.location.href = url; }
    }

    const debounced = debounce((q)=> run(q), 150);
    input.addEventListener('input', (e)=> {
      debounced(e.target.value);
      if (clearBtn) clearBtn.hidden = (e.target.value.trim()==='');
    });
    input.addEventListener('keydown', (e)=>{
      switch(e.key){
        case 'ArrowDown': e.preventDefault(); navigate(1); break;
        case 'ArrowUp': e.preventDefault(); navigate(-1); break;
        case 'Enter': if(!panel.hidden){ e.preventDefault(); openActive(); } break;
        case 'Escape': clear(); break;
      }
    });

    document.addEventListener('click', (e)=>{
      // Activate option on click
      const opt = e.target.closest('.result-item');
      if (opt && panel.contains(opt)) {
        e.preventDefault();
        const idx = parseInt(opt.getAttribute('data-index'), 10);
        if (!Number.isNaN(idx)) { activeIndex = idx; updateActive(); openActive(); return; }
      }
      // Dismiss when clicking outside
      if (!panel.contains(e.target) && e.target!==input) {
        panel.hidden = true;
        input.setAttribute('aria-expanded', 'false');
      }
    });

    if (clearBtn){
      clearBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        input.value = '';
        clear();
        clearBtn.hidden = true;
        input.focus();
      });
    }

    // Initialize from URL param ?q=
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) { input.value = q; run(q); }
    } catch(e){}
  });
})();
