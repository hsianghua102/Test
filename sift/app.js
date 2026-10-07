(() => {
  'use strict';

  const SAMPLES = {
    work: `工程師｜登入 API 今天已經修復，但付款 API 還有問題，預計週五完成。請 PM 記得追蹤。\n\n主管｜客戶 Demo 改到週四下午，請 Mina 在前一天準備好簡報。\n\n客戶 Email｜希望下週一以前收到最新的企業方案報價。\n\n設計師｜新版首頁 Wireframe 已完成，請 PM 今天下班前確認並回覆意見。`,
    info: `公司公告｜本週五下午四點將進行辦公室消防設備例行檢查。\n\n市場觀察｜競品 Nova 昨日發布新版首頁，主打整合式搜尋體驗。\n\n團隊近況｜登入 API 已於今天上午恢復正常，目前服務狀態穩定。`,
    error: `[格式異常] 來源資料同步中斷，部分訊息無法讀取。\n\n<<< UNRESOLVED_BLOCK >>>\n\n請嘗試分析這段內容。`
  };

  const DEFAULT_TASKS = [
    { id: 1, title: '確認新版首頁 Wireframe', priority: 'high', deadline: '今天 · 18:00', source: 'Design', description: '檢視新版首頁流程並回覆設計師修改意見。', done: false },
    { id: 2, title: '準備客戶 Demo 簡報', priority: 'high', deadline: '週三 · 17:00', source: 'Manager', description: '因 Demo 改至週四下午，需在前一天完成簡報。', done: false },
    { id: 3, title: '追蹤付款 API 修復進度', priority: 'medium', deadline: '週五', source: 'Engineering', description: '登入 API 已修復；付款 API 仍有問題，需確認交付狀態。', done: false },
    { id: 4, title: '提供客戶最新企業方案報價', priority: 'low', deadline: '下週一', source: 'Customer', description: '整理最新方案內容與價格，於期限前寄給客戶。', done: false }
  ];

  const CONNECTORS = {
    slack: {
      name: 'Slack', count: 8,
      content: `[Slack MCP｜#product-launch]\nMina · 今天 09:42｜客戶 Demo 改到週四下午，請在週三 17:00 前完成簡報並貼到頻道。\nLeo · 今天 10:18｜新版首頁還缺 PM 確認，請今天 18:00 前回覆設計稿。`,
      tasks: [
        { title: '確認新版首頁設計稿', priority: 'high', deadline: '今天 · 18:00', source: 'Slack', description: '#product-launch · 回覆 Leo 首頁 Wireframe 的確認意見。' },
        { title: '完成客戶 Demo 簡報', priority: 'high', deadline: '週三 · 17:00', source: 'Slack', description: '#product-launch · 完成簡報並貼回頻道供團隊確認。' }
      ]
    },
    notion: {
      name: 'Notion', count: 4,
      content: `[Notion MCP｜Project Atlas / 會議紀錄]\nAction Item｜整理企業方案報價，Owner：Mina，Due：下週一。\nDecision｜首頁將採用新版導航；請 PM 明天以前補上驗收條件。`,
      tasks: [
        { title: '補上首頁驗收條件', priority: 'medium', deadline: '明天', source: 'Notion', description: 'Project Atlas · 為新版導航補齊可驗證的驗收條件。' },
        { title: '整理企業方案報價', priority: 'low', deadline: '下週一', source: 'Notion', description: 'Project Atlas · 整理最新方案與價格供客戶確認。' }
      ]
    },
    jira: {
      name: 'Jira', count: 3,
      content: `[Jira MCP｜PAY Sprint]\nPAY-248｜付款 API 偶發 timeout，Assignee：Mina，Due：週五，Status：In Progress。請在截止前確認修復與 QA 結果。\nWEB-102｜首頁埋點規格待 PM Review，Due：明天。`,
      tasks: [
        { title: '確認 PAY-248 修復與 QA 結果', priority: 'medium', deadline: '週五', source: 'Jira · PAY-248', description: '付款 API 偶發 timeout；確認工程修復狀態與 QA 驗證結果。' },
        { title: 'Review WEB-102 首頁埋點規格', priority: 'medium', deadline: '明天', source: 'Jira · WEB-102', description: '檢查首頁埋點事件與參數定義是否完整。' }
      ]
    }
  };

  const $ = selector => document.querySelector(selector);
  const els = {
    intro: $('#intro'), composer: $('#composer'), input: $('#source-input'), inputShell: $('#input-shell'),
    inputStatus: $('#input-status span:last-child'), charCount: $('#char-count'), analyze: $('#analyze-button'),
    processing: $('#processing'), processingTitle: $('#processing-title'), progress: $('#processing-progress'),
    processSteps: [...document.querySelectorAll('.processing-steps span')], results: $('#results'),
    noAction: $('#no-action-state'), error: $('#error-state'), summary: $('#summary-text'),
    stats: $('#brief-stats'), taskList: $('#task-list'), activeCount: $('#active-count'), doneCount: $('#done-count'),
    allDone: $('#all-done'), toast: $('#toast'), toastMessage: $('#toast-message'), toastAction: $('#toast-action'),
    sampleMenu: $('#sample-menu'), sampleTrigger: $('#sample-menu-trigger'), syncStrip: $('#sync-strip'),
    syncSourceCount: $('#sync-source-count'), syncDetail: $('#sync-detail'), syncAll: $('#sync-all')
  };

  let tasks = [];
  let filter = 'active';
  let deletedTask = null;
  let toastTimer;
  let isRetry = false;
  const connectedSources = new Set();

  const priorityMap = {
    high: { label: '高優先', rank: 0 }, medium: { label: '中優先', rank: 1 }, low: { label: '低優先', rank: 2 }
  };

  const formatDate = () => new Intl.DateTimeFormat('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
  $('#current-date').textContent = formatDate();
  $('#brief-date').textContent = formatDate();

  function setInput(value) {
    els.input.value = value;
    updateInputState();
    els.input.focus();
  }

  function loadSample(type) {
    setInput(SAMPLES[type]);
    const labels = { work: '已載入 4 則', info: '已載入資訊範例', error: '已載入錯誤範例' };
    $('#sample-label').textContent = labels[type];
    els.inputShell.classList.remove('just-loaded');
    requestAnimationFrame(() => els.inputShell.classList.add('just-loaded'));
    setTimeout(() => {
      els.inputShell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      els.input.focus({ preventScroll: true });
    }, 120);
    setTimeout(() => els.inputShell.classList.remove('just-loaded'), 1100);
    showToast(type === 'work' ? '範例已載入，可直接開始整理' : '測試範例已載入');
  }

  function updateInputState() {
    const count = els.input.value.length;
    els.charCount.textContent = count.toLocaleString();
    els.analyze.disabled = count < 8;
    els.inputShell.classList.toggle('has-content', count > 0);
    els.inputStatus.textContent = connectedSources.size
      ? `已匯入 ${connectedSources.size} 個來源 · ${[...connectedSources].reduce((sum, key) => sum + CONNECTORS[key].count, 0)} 則資料`
      : count ? `已收到內容 · 約 ${Math.max(1, Math.ceil(count / 120))} 則訊息` : '等待輸入或連接來源';
  }

  async function connectSource(source, quiet = false) {
    const config = CONNECTORS[source];
    const card = document.querySelector(`[data-connector-card="${source}"]`);
    const button = card?.querySelector('[data-connect]');
    const status = card?.querySelector('[data-connector-status]');
    if (!config || !card || !button) return;

    card.classList.add('connecting');
    button.disabled = true;
    button.querySelector('span').textContent = connectedSources.has(source) ? '同步中' : '連接中';
    status.textContent = connectedSources.has(source) ? '正在讀取最新更新…' : '正在授權 MCP…';
    await new Promise(resolve => setTimeout(resolve, quiet ? 420 : 720));

    connectedSources.add(source);
    if (!els.input.value.includes(`[${config.name} MCP`)) {
      els.input.value = `${els.input.value.trim()}${els.input.value.trim() ? '\n\n' : ''}${config.content}`;
    }
    card.classList.remove('connecting');
    card.classList.add('connected');
    button.disabled = false;
    button.querySelector('span').textContent = '已連接';
    button.setAttribute('aria-label', `重新同步 ${config.name}`);
    status.textContent = `已同步 · ${config.count} 則更新`;
    refreshSyncSummary();
    updateInputState();
    if (!quiet) showToast(`${config.name} 已連接，找到 ${config.count} 則近期更新`);
  }

  function refreshSyncSummary() {
    const total = [...connectedSources].reduce((sum, key) => sum + CONNECTORS[key].count, 0);
    els.syncStrip.hidden = connectedSources.size === 0;
    els.syncSourceCount.textContent = `${connectedSources.size} 個來源已連接`;
    els.syncDetail.textContent = `已自動辨識 ${total} 則更新中的 Issue 與日期`;
  }

  function resetConnectors() {
    connectedSources.clear();
    document.querySelectorAll('[data-connector-card]').forEach(card => {
      card.classList.remove('connected', 'connecting');
      const source = card.dataset.connectorCard;
      card.querySelector('[data-connect] span').textContent = '連接';
      card.querySelector('[data-connect]').setAttribute('aria-label', `連接 ${CONNECTORS[source].name}`);
      card.querySelector('[data-connector-status]').textContent = source === 'slack' ? '訊息與討論串' : source === 'notion' ? '頁面與會議紀錄' : 'Issue 與 Sprint';
    });
    refreshSyncSummary();
  }

  document.querySelectorAll('[data-connect]').forEach(button => button.addEventListener('click', () => connectSource(button.dataset.connect)));
  els.syncAll.addEventListener('click', async () => {
    els.syncAll.disabled = true;
    els.syncAll.classList.add('syncing');
    for (const source of connectedSources) await connectSource(source, true);
    els.syncAll.disabled = false;
    els.syncAll.classList.remove('syncing');
    showToast('所有來源已更新至最新狀態');
  });

  function toggleSampleMenu(force) {
    const shouldOpen = typeof force === 'boolean' ? force : els.sampleMenu.hidden;
    els.sampleMenu.hidden = !shouldOpen;
    els.sampleTrigger.setAttribute('aria-expanded', String(shouldOpen));
  }

  $('#sample-button').addEventListener('click', () => loadSample('work'));
  els.sampleTrigger.addEventListener('click', event => { event.stopPropagation(); toggleSampleMenu(); });
  els.sampleMenu.addEventListener('click', event => {
    const button = event.target.closest('[data-sample]');
    if (!button) return;
    loadSample(button.dataset.sample);
    toggleSampleMenu(false);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.sample-wrap')) toggleSampleMenu(false);
    if (!event.target.closest('.more-wrap')) closeTaskMenus();
  });
  els.input.addEventListener('input', updateInputState);

  function hideMainStates() {
    [els.intro, els.composer, els.processing, els.results, els.noAction, els.error].forEach(element => { element.hidden = true; });
  }

  function showComposer(clear = false) {
    hideMainStates();
    els.intro.hidden = false;
    els.composer.hidden = false;
    if (clear) { resetConnectors(); $('#sample-label').textContent = '載入範例'; setInput(''); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => els.input.focus(), 250);
  }

  async function analyze() {
    if (els.input.value.trim().length < 8) return;
    hideMainStates();
    els.processing.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const phases = [
      { title: '正在理解訊息脈絡', progress: 34, step: 0, wait: 620 },
      { title: '正在找出需要行動的事', progress: 68, step: 1, wait: 670 },
      { title: '正在判斷優先順序', progress: 100, step: 2, wait: 600 }
    ];
    for (const phase of phases) {
      els.processingTitle.textContent = phase.title;
      els.progress.style.width = `${phase.progress}%`;
      els.processSteps.forEach((step, index) => step.classList.toggle('active', index <= phase.step));
      await new Promise(resolve => setTimeout(resolve, phase.wait));
    }
    finishAnalysis();
  }

  function finishAnalysis() {
    const text = els.input.value;
    hideMainStates();
    if ((text.includes('格式異常') || text.includes('UNRESOLVED_BLOCK')) && !isRetry) {
      els.error.hidden = false;
      return;
    }
    isRetry = false;
    if (text === SAMPLES.info || (!/[請需]|記得|希望|以前|期限|追蹤|確認|準備|提供|完成|回覆|交付/.test(text))) {
      els.noAction.hidden = false;
      return;
    }
    tasks = createTasksFromInput(text);
    filter = 'active';
    document.querySelectorAll('[data-filter]').forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    els.results.hidden = false;
    renderTasks();
  }

  function createTasksFromInput(text) {
    if (text.includes('付款 API') && text.includes('Wireframe')) return DEFAULT_TASKS.map(task => ({ ...task }));
    const connectorTasks = Object.entries(CONNECTORS)
      .filter(([, config]) => text.includes(`[${config.name} MCP`))
      .flatMap(([, config]) => config.tasks.map(task => ({ ...task, id: 0, done: false })));
    if (connectorTasks.length) return connectorTasks.map((task, index) => ({ ...task, id: Date.now() + index }));
    if (text.includes('UNRESOLVED_BLOCK')) {
      return [{
        id: Date.now(), title: '確認來源資料同步狀態', priority: 'medium', deadline: '尚未指定',
        source: 'System', description: '部分來源內容未能完整讀取，請確認後再補充缺少的訊息。', done: false
      }];
    }
    const lines = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
    const actionLines = lines.filter(line => /請|需要|記得|希望|待辦|追蹤|確認|準備|提供|完成|回覆|交付/.test(line)).slice(0, 6);
    if (!actionLines.length) return [];
    return actionLines.map((line, index) => {
      const clean = line.replace(/^.*?[｜:：]\s*/, '').replace(/[。！]$/, '');
      const title = clean.length > 34 ? `${clean.slice(0, 33)}…` : clean;
      const priority = /今天|立即|緊急|前一天/.test(line) ? 'high' : /週[一二三四五]|明天|下週/.test(line) ? 'medium' : 'low';
      const deadline = line.match(/今天(?:下班前)?|明天|週[一二三四五]|下週[一二三四五]|前一天/)?.[0] || '尚未指定';
      const sourceToken = line.match(/^(.*?)[｜:：]/)?.[1] || 'Notes';
      return { id: Date.now() + index, title, priority, deadline, source: sourceToken.slice(0, 18), description: line, done: false };
    });
  }

  els.analyze.addEventListener('click', analyze);
  $('#retry-button').addEventListener('click', () => { isRetry = true; analyze(); });
  $('#new-analysis').addEventListener('click', () => showComposer(true));
  document.querySelectorAll('.new-analysis-trigger').forEach(button => button.addEventListener('click', () => showComposer(true)));
  document.querySelectorAll('.edit-input').forEach(button => button.addEventListener('click', () => showComposer(false)));

  function getFilteredTasks() {
    return tasks.filter(task => filter === 'all' || (filter === 'done' ? task.done : !task.done)).sort((a, b) => priorityMap[a.priority].rank - priorityMap[b.priority].rank);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }

  function renderTasks() {
    const active = tasks.filter(task => !task.done);
    const done = tasks.length - active.length;
    els.activeCount.textContent = active.length;
    els.doneCount.textContent = done;
    const high = active.filter(task => task.priority === 'high').length;
    const next = active.find(task => task.deadline.includes('今天'))?.deadline || active[0]?.deadline || '—';
    els.summary.textContent = active.length
      ? `今天共有 ${active.length} 項待處理事項，其中 ${high} 項需要優先關注。最近的期限是${next.replace(' · ', ' ')}。`
      : '今天的重要事項都已完成。你已經把最需要關注的工作處理好了。';
    els.stats.innerHTML = `<div class="brief-stat"><strong>${active.length}</strong><span>待處理事項</span></div><div class="brief-stat"><strong>${high}</strong><span>高優先</span></div>`;

    const visible = getFilteredTasks();
    els.taskList.innerHTML = visible.map((task, index) => taskTemplate(task, index)).join('');
    els.allDone.hidden = !(filter === 'active' && visible.length === 0);
    bindTaskEvents();
  }

  function taskTemplate(task, index) {
    const p = priorityMap[task.priority];
    const initial = (task.source.trim()[0] || 'S').toUpperCase();
    return `<article class="task-card ${task.done ? 'done' : ''}" data-id="${task.id}" style="animation-delay:${index * 55}ms">
      <button class="check-button" type="button" aria-label="${task.done ? '標示為待處理' : '完成'}：${escapeHTML(task.title)}" aria-pressed="${task.done}"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="m4.5 9 3 3 6-7" /></svg></button>
      <div class="task-main"><span class="priority ${task.priority}">${p.label}</span><h3 class="task-title">${escapeHTML(task.title)}</h3><p class="task-description">${escapeHTML(task.description)}</p></div>
      <div class="task-meta"><div class="meta-item"><span>Deadline</span><strong>${escapeHTML(task.deadline)}</strong></div><div class="meta-item"><span>Source</span><strong class="source-name" data-initial="${escapeHTML(initial)}">${escapeHTML(task.source)}</strong></div></div>
      <div class="more-wrap"><button class="more-button" type="button" aria-label="更多操作" aria-expanded="false">•••</button><div class="task-menu" hidden><button class="edit-task" type="button">編輯內容</button><button class="delete delete-task" type="button">刪除待辦</button></div></div>
    </article>`;
  }

  function closeTaskMenus(except) {
    document.querySelectorAll('.task-menu').forEach(menu => {
      if (menu !== except) { menu.hidden = true; menu.previousElementSibling?.setAttribute('aria-expanded', 'false'); }
    });
  }

  function bindTaskEvents() {
    els.taskList.querySelectorAll('.task-card').forEach(card => {
      bindSpotlight(card);
      const id = Number(card.dataset.id);
      card.querySelector('.check-button').addEventListener('click', () => toggleTask(id));
      card.querySelector('.more-button').addEventListener('click', event => {
        event.stopPropagation();
        const menu = card.querySelector('.task-menu');
        const open = menu.hidden;
        closeTaskMenus(menu);
        menu.hidden = !open;
        event.currentTarget.setAttribute('aria-expanded', String(open));
      });
      card.querySelector('.edit-task').addEventListener('click', () => openEditor(card, id));
      card.querySelector('.delete-task').addEventListener('click', () => deleteTask(id));
    });
  }

  function toggleTask(id) {
    const task = tasks.find(item => item.id === id);
    if (!task) return;
    task.done = !task.done;
    showToast(task.done ? '已完成一項工作' : '已移回待處理');
    setTimeout(renderTasks, task.done && filter === 'active' ? 420 : 0);
  }

  function openEditor(card, id) {
    closeTaskMenus();
    document.querySelectorAll('.task-editor').forEach(editor => editor.remove());
    const task = tasks.find(item => item.id === id);
    if (!task) return;
    const editor = document.createElement('div');
    editor.className = 'task-editor';
    editor.innerHTML = `
      <div class="field wide"><label for="edit-title-${id}">任務名稱</label><input id="edit-title-${id}" name="title" value="${escapeHTML(task.title)}" /></div>
      <div class="field"><label for="edit-priority-${id}">優先順序</label><select id="edit-priority-${id}" name="priority"><option value="high" ${task.priority === 'high' ? 'selected' : ''}>高優先</option><option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>中優先</option><option value="low" ${task.priority === 'low' ? 'selected' : ''}>低優先</option></select></div>
      <div class="field"><label for="edit-deadline-${id}">期限</label><input id="edit-deadline-${id}" name="deadline" value="${escapeHTML(task.deadline)}" /></div>
      <div class="field"><label for="edit-source-${id}">來源</label><input id="edit-source-${id}" name="source" value="${escapeHTML(task.source)}" /></div>
      <div class="field wide"><label for="edit-description-${id}">說明</label><input id="edit-description-${id}" name="description" value="${escapeHTML(task.description)}" /></div>
      <div class="editor-actions"><button class="cancel-edit" type="button">取消</button><button class="save-edit" type="button">儲存變更</button></div>`;
    card.appendChild(editor);
    editor.querySelector('input').focus();
    editor.querySelector('.cancel-edit').addEventListener('click', () => editor.remove());
    editor.querySelector('.save-edit').addEventListener('click', () => {
      task.title = editor.querySelector('[name="title"]').value.trim() || task.title;
      task.priority = editor.querySelector('[name="priority"]').value;
      task.deadline = editor.querySelector('[name="deadline"]').value.trim() || '尚未指定';
      task.source = editor.querySelector('[name="source"]').value.trim() || 'Notes';
      task.description = editor.querySelector('[name="description"]').value.trim();
      renderTasks();
      showToast('待辦內容已更新');
    });
  }

  function deleteTask(id) {
    const index = tasks.findIndex(item => item.id === id);
    if (index < 0) return;
    deletedTask = { task: tasks[index], index };
    tasks.splice(index, 1);
    renderTasks();
    showToast('已刪除待辦', true);
  }

  function showToast(message, canUndo = false) {
    clearTimeout(toastTimer);
    els.toastMessage.textContent = message;
    els.toastAction.hidden = !canUndo;
    els.toast.classList.add('show');
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 3300);
  }

  els.toastAction.addEventListener('click', () => {
    if (!deletedTask) return;
    tasks.splice(deletedTask.index, 0, deletedTask.task);
    deletedTask = null;
    renderTasks();
    showToast('待辦已復原');
  });

  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      renderTasks();
    });
  });

  function bindSpotlight(element) {
    if (!element || element.dataset.spotlightBound) return;
    element.dataset.spotlightBound = 'true';
    element.addEventListener('pointermove', event => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      element.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    });
  }

  document.querySelectorAll('.spotlight-surface').forEach(bindSpotlight);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const progress = Math.min(window.scrollY / 520, 1);
        els.intro.style.setProperty('--hero-y', `${progress * 70}px`);
        els.intro.style.setProperty('--hero-scale', String(1 - progress * .035));
        els.intro.style.setProperty('--hero-opacity', String(1 - progress * .72));
        ticking = false;
      });
    }, { passive: true });
  }

  updateInputState();
})();
