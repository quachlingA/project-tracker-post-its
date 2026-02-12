(function () {
  'use strict';

  const STORAGE_ITEMS = 'todo-tracker-items';
  const STORAGE_COLUMNS = 'todo-tracker-columns';
  const STORAGE_TRACKERS = 'todo-tracker-trackers';
  const STORAGE_CURRENT_TRACKER = 'todo-tracker-current';
  const STORAGE_MAIN_VIEW = 'todo-tracker-main-view';
  const STORAGE_THEME = 'todo-tracker-theme';
  const DEFAULT_TRACKER_COLOR = '#bfdbfe';

  const BACKLOG_COLUMN_ID = '';
  const BACKLOG_COLUMN_COLOR = '#e2e8f0';

  const DEFAULT_COLUMNS = [
    { id: 'todo', name: 'To Do', color: '#bfdbfe', default: 'todo', order: 0 },
    { id: 'progress', name: 'In Progress', color: '#e9d5ff', default: 'progress', order: 1 },
    { id: 'done', name: 'Done', color: '#bbf7d0', default: 'done', order: 2 },
  ];

  let items = [];
  let columns = [];
  let trackers = [];
  let currentTrackerId = null;
  let mainView = 'dashboard';

  function loadItems() {
    try {
      const raw = localStorage.getItem(STORAGE_ITEMS);
      items = raw ? JSON.parse(raw) : [];
    } catch {
      items = [];
    }
  }

  function saveItems() {
    localStorage.setItem(STORAGE_ITEMS, JSON.stringify(items));
  }

  function loadColumns() {
    try {
      const raw = localStorage.getItem(STORAGE_COLUMNS);
      columns = raw ? JSON.parse(raw) : [];
      if (columns.length === 0) {
        columns = DEFAULT_COLUMNS.map((c, i) => ({ ...c, order: i }));
        saveColumns();
      }
    } catch {
      columns = DEFAULT_COLUMNS.map((c, i) => ({ ...c, order: i }));
      saveColumns();
    }
  }

  function saveColumns() {
    localStorage.setItem(STORAGE_COLUMNS, JSON.stringify(columns));
  }

  function loadTrackers() {
    try {
      const raw = localStorage.getItem(STORAGE_TRACKERS);
      trackers = raw ? JSON.parse(raw) : [];
    } catch {
      trackers = [];
    }
    const currentRaw = localStorage.getItem(STORAGE_CURRENT_TRACKER);
    currentTrackerId = currentRaw || null;
    const mainRaw = localStorage.getItem(STORAGE_MAIN_VIEW);
    if (mainRaw === 'dashboard' || mainRaw === 'board') mainView = mainRaw;
  }

  function saveTrackers() {
    localStorage.setItem(STORAGE_TRACKERS, JSON.stringify(trackers));
    if (currentTrackerId !== null) localStorage.setItem(STORAGE_CURRENT_TRACKER, currentTrackerId);
    else localStorage.removeItem(STORAGE_CURRENT_TRACKER);
  }

  const EXPORT_VERSION = 1;

  function exportData() {
    const theme = localStorage.getItem(STORAGE_THEME) || document.documentElement.getAttribute('data-theme') || 'light';
    const payload = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      items,
      columns,
      trackers,
      currentTrackerId,
      mainView,
      theme,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'post-its-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(jsonText) {
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch {
      return { ok: false, error: 'Invalid JSON in file.' };
    }
    if (!data || typeof data.version !== 'number') return { ok: false, error: 'Not a valid Post-Its backup file.' };
    const itemsIn = Array.isArray(data.items) ? data.items : [];
    const columnsIn = Array.isArray(data.columns) ? data.columns : [];
    const trackersIn = Array.isArray(data.trackers) ? data.trackers : [];
    items = itemsIn;
    columns = columnsIn.length ? columnsIn : DEFAULT_COLUMNS.map((c, i) => ({ ...c, order: i }));
    trackers = trackersIn.length ? trackersIn : [{ id: 'tracker-default', name: 'Default', goal: null, color: DEFAULT_TRACKER_COLOR, goalMetWeeks: [] }];
    currentTrackerId = data.currentTrackerId != null ? data.currentTrackerId : (trackers[0] && trackers[0].id) || null;
    mainView = data.mainView === 'dashboard' || data.mainView === 'board' ? data.mainView : 'dashboard';
    saveItems();
    saveColumns();
    saveTrackers();
    localStorage.setItem(STORAGE_MAIN_VIEW, mainView);
    const theme = data.theme === 'dark' || data.theme === 'light' ? data.theme : null;
    if (theme) {
      localStorage.setItem(STORAGE_THEME, theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    migrateItemsToTrackers();
    return { ok: true };
  }

  function migrateItemsToTrackers() {
    const hasNoTrackers = !trackers || trackers.length === 0;
    const itemsNeedTracker = items.some((i) => !i.trackerId);
    if (hasNoTrackers) {
      const defaultId = 'tracker-default';
      trackers = [{ id: defaultId, name: 'Default', goal: null, color: DEFAULT_TRACKER_COLOR }];
      saveTrackers();
      items.forEach((i) => { i.trackerId = defaultId; });
      saveItems();
      currentTrackerId = defaultId;
      saveTrackers();
    } else if (itemsNeedTracker) {
      const firstId = trackers[0].id;
      items.forEach((i) => { if (!i.trackerId) i.trackerId = firstId; });
      saveItems();
    }
    trackers.forEach((t) => {
      if (!t.color) t.color = DEFAULT_TRACKER_COLOR;
      if (!t.goalMetWeeks) t.goalMetWeeks = [];
    });
    saveTrackers();
  }

  function parseResourceChangelogString(str) {
    if (!str || String(str).trim() === '' || String(str).trim() === '(none)') return [];
    const segments = String(str).split(' | ');
    return segments.map((segment) => {
      segment = segment.trim();
      if (!segment) return null;
      const httpIndex = segment.search(/https?:\/\//i);
      if (httpIndex === -1) return { url: segment, label: segment };
      const url = segment.slice(httpIndex).trim();
      const label = segment.slice(0, httpIndex).replace(/:+\s*$/, '').trim();
      return { url, label: label || url };
    }).filter(Boolean);
  }

  function migrateChangelogResourcesToLinks() {
    let changed = false;
    items.forEach((item) => {
      const log = item.changelog || [];
      log.forEach((entry) => {
        if (entry.field !== 'resources') return;
        if (entry.oldResources != null && entry.newResources != null) return;
        entry.oldResources = parseResourceChangelogString(entry.old);
        entry.newResources = parseResourceChangelogString(entry.new);
        changed = true;
      });
    });
    if (changed) saveItems();
  }

  function isInBacklog(item) {
    const noPriority = !item.priority || item.priority === '';
    const noStatus = !item.status || item.status === '';
    return noPriority || noStatus;
  }

  function getFilteredItems() {
    const filter = document.getElementById('date-filter').value;
    let list = currentTrackerId ? items.filter((i) => i.trackerId === currentTrackerId) : items;
    if (filter && filter !== 'all') {
      const days = parseInt(filter, 10);
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      list = list.filter((i) => new Date(i.createdAt).getTime() >= cutoff);
    }
    return list;
  }

  function getItemsForTracker(trackerId) {
    return items.filter((i) => i.trackerId === trackerId);
  }

  function getTrackerMetrics(trackerId) {
    const list = getItemsForTracker(trackerId);
    const sortedColumns = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const byStatus = {};
    sortedColumns.forEach((c) => { byStatus[c.id] = 0; });
    let backlogCount = 0;
    list.forEach((i) => {
      if (isInBacklog(i)) backlogCount++;
      else if (i.status && byStatus[i.status] !== undefined) byStatus[i.status]++;
    });
    const doneCol = sortedColumns.find((c) => c.default === 'done' || c.id === 'done');
    const doneCount = doneCol ? (byStatus[doneCol.id] || 0) : 0;
    return { total: list.length, byStatus, backlogCount, doneCount };
  }

  function getAggregateMetrics() {
    const sortedColumns = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const todoCol = sortedColumns.find((c) => c.default === 'todo' || c.id === 'todo');
    const progressCol = sortedColumns.find((c) => c.default === 'progress' || c.id === 'progress');
    const doneCol = sortedColumns.find((c) => c.default === 'done' || c.id === 'done');
    let total = 0, backlog = 0, todo = 0, inProgress = 0, done = 0;
    items.forEach((i) => {
      total++;
      if (isInBacklog(i)) backlog++;
      else {
        if (i.status === (todoCol && todoCol.id)) todo++;
        else if (i.status === (progressCol && progressCol.id)) inProgress++;
        else if (i.status === (doneCol && doneCol.id)) done++;
      }
    });
    return { total, backlog, todo, inProgress, done };
  }

  function getCurrentWeekKey() {
    const d = new Date();
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    const y = start.getFullYear();
    const jan1 = new Date(y, 0, 1);
    const w = Math.ceil((((start - jan1) / 86400000) + jan1.getDay() + 1) / 7);
    return y + '-W' + String(w).padStart(2, '0');
  }

  function markGoalMetForWeek(trackerId) {
    const t = trackers.find((tr) => tr.id === trackerId);
    if (!t) return;
    t.goalMetWeeks = t.goalMetWeeks || [];
    const week = getCurrentWeekKey();
    if (!t.goalMetWeeks.includes(week)) {
      t.goalMetWeeks.push(week);
      saveTrackers();
    }
  }

  function isGoalMetThisWeek(tracker) {
    const weeks = tracker.goalMetWeeks || [];
    return weeks.includes(getCurrentWeekKey());
  }

  function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  function addChangelogEntry(itemId, field, oldVal, newVal, extra) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    item.changelog = item.changelog || [];
    const entry = {
      at: nowISO(),
      field,
      old: oldVal ?? '',
      new: newVal ?? '',
      ...extra,
    };
    item.changelog.push(entry);
    saveItems();
  }

  function setStatusWithHistory(itemId, newStatus) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const prev = item.status || '';
    if (prev === newStatus) return;
    item.status = newStatus;
    item.statusHistory = item.statusHistory || [];
    item.statusHistory.push({
      from: prev,
      to: newStatus,
      at: nowISO(),
    });
    saveItems();
  }

  function renderBoard() {
    const board = document.getElementById('board');
    const filtered = getFilteredItems();
    board.innerHTML = '';

    const sortedColumns = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    function renderColumn(col, isBacklog) {
      const colEl = document.createElement('div');
      colEl.className = 'column';
      colEl.dataset.columnId = col.id === BACKLOG_COLUMN_ID ? 'backlog' : col.id;
      if (col.default) colEl.dataset.default = col.default;
      if (isBacklog) colEl.dataset.backlogColumn = 'true';

      const headerBg = col.color || (col.default === 'todo' ? '#eff6ff' : col.default === 'progress' ? '#f5f3ff' : '#f0fdf4');
      colEl.style.setProperty('--column-header-bg', headerBg);

      const isDefault = !isBacklog && DEFAULT_COLUMNS.some((d) => d.id === col.id);
      const columnIdForAdd = isBacklog ? BACKLOG_COLUMN_ID : col.id;
      const count = isBacklog
        ? filtered.filter((i) => isInBacklog(i)).length
        : filtered.filter((i) => i.status === col.id && !isInBacklog(i)).length;
      colEl.innerHTML = `
        <div class="column-header" style="background: ${col.color || 'var(--bg-card)'}; color: inherit;">
          <span class="column-name">${escapeHtml(col.name)} <span class="column-count">(${count})</span></span>
          <div class="column-actions">
            <button type="button" class="col-add-top" title="Add item">➕</button>
            ${!isBacklog ? `<button type="button" class="col-edit" title="Edit column">✏️</button>
            ${!isDefault ? '<button type="button" class="col-delete" title="Remove column">🗑️</button>' : ''}` : ''}
          </div>
        </div>
        <div class="column-cards" data-column-id="${escapeAttr(columnIdForAdd)}"></div>
        <div class="column-footer">
          <button type="button" class="btn btn-column-add col-add-btn" data-column-id="${escapeAttr(columnIdForAdd)}">+ Add item</button>
        </div>
      `;

      const cardsContainer = colEl.querySelector('.column-cards');
      const colItems = isBacklog
        ? filtered.filter((i) => isInBacklog(i))
        : filtered.filter((i) => i.status === col.id && !isInBacklog(i));
      colItems.forEach((item) => cardsContainer.appendChild(createCard(item)));

      setupColumnDrop(cardsContainer, isBacklog ? BACKLOG_COLUMN_ID : col.id);
      board.appendChild(colEl);

      colEl.querySelector('.col-add-top').addEventListener('click', () => openAddModal(isBacklog ? undefined : col.id));
      colEl.querySelector('.col-add-btn').addEventListener('click', () => openAddModal(isBacklog ? undefined : col.id));
      if (!isBacklog) {
        colEl.querySelector('.col-edit').addEventListener('click', () => openColumnModal(col));
        if (!isDefault) {
          colEl.querySelector('.col-delete').addEventListener('click', () => removeColumn(col.id));
        }
      }
    }

    renderColumn({ id: BACKLOG_COLUMN_ID, name: 'Backlog', color: BACKLOG_COLUMN_COLOR }, true);
    sortedColumns.forEach((col) => renderColumn(col, false));
  }

  function createCard(item) {
    const div = document.createElement('div');
    div.className = 'card';
    div.draggable = true;
    div.dataset.itemId = item.id;
    div.innerHTML = `
      ${item.priority ? `<div class="card-priority-header" data-priority="${escapeAttr(item.priority)}">${escapeHtml(item.priority)}</div>` : ''}
      <div class="card-body">
        <div class="card-name">${escapeHtml(item.name || 'Untitled')}</div>
        <div class="card-meta">
          <span class="card-created">Created ${formatDate(item.createdAt)}</span>
          ${item.dueDate ? `<span class="card-due">Due ${formatDate(item.dueDate)}</span>` : ''}
        </div>
      </div>
    `;
    let dragHappened = false;
    div.addEventListener('dragstart', () => { dragHappened = true; });
    div.addEventListener('dragend', () => { dragHappened = false; });
    div.addEventListener('click', (e) => {
      if (dragHappened) return;
      openDetailModal(item.id);
    });
    div.addEventListener('dblclick', (e) => {
      e.preventDefault();
      openEditModal(item.id);
    });
    setupCardDrag(div, item.id);
    return div;
  }

  function setupCardDrag(cardEl, itemId) {
    cardEl.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', itemId);
      e.dataTransfer.effectAllowed = 'move';
      cardEl.classList.add('dragging');
      setTimeout(() => cardEl.classList.add('dragging'), 0);
    });
    cardEl.addEventListener('dragend', () => {
      cardEl.classList.remove('dragging');
      document.querySelectorAll('.column-cards.drag-over, .backlog-list.drag-over').forEach((el) => el.classList.remove('drag-over'));
    });
  }

  function setupColumnDrop(container, columnId) {
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      container.classList.add('drag-over');
    });
    container.addEventListener('dragleave', () => container.classList.remove('drag-over'));
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('drag-over');
      const itemId = e.dataTransfer.getData('text/plain');
      if (!itemId) return;
      moveItemToColumn(itemId, columnId);
    });
  }

  function moveItemToColumn(itemId, columnId) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const prev = item.status || '';
    item.status = columnId;
    item.statusHistory = item.statusHistory || [];
    item.statusHistory.push({ from: prev, to: columnId, at: nowISO() });
    saveItems();
    renderBoard();
    renderBacklog();
  }

  function setupBacklogDrop() {
    const list = document.getElementById('backlog-list');
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.classList.add('drag-over');
    });
    list.addEventListener('dragleave', () => list.classList.remove('drag-over'));
    list.addEventListener('drop', (e) => {
      e.preventDefault();
      list.classList.remove('drag-over');
      const itemId = e.dataTransfer.getData('text/plain');
      if (!itemId) return;
      setStatusWithHistory(itemId, '');
      renderBoard();
      renderBacklog();
    });
  }

  function renderBacklog() {
    const list = document.getElementById('backlog-list');
    const filtered = getFilteredItems();
    const backlogItems = filtered.filter((i) => isInBacklog(i));
    list.innerHTML = '';
    list.classList.remove('drag-over');
    backlogItems.forEach((item) => list.appendChild(createCard(item)));
  }

  function addResourceRow(container, data) {
    const row = document.createElement('div');
    row.className = 'resource-row';
    row.innerHTML = `
      <input type="url" class="resource-url" placeholder="https://..." value="${escapeAttr((data && data.url) || '')}" />
      <input type="text" class="resource-label" placeholder="Label (optional)" value="${escapeAttr((data && data.label) || '')}" />
      <button type="button" class="resource-remove" title="Remove link">✕</button>
    `;
    row.querySelector('.resource-remove').addEventListener('click', () => row.remove());
    container.appendChild(row);
    return row;
  }

  function getResourcesFromForm() {
    const list = document.getElementById('item-resources-list');
    const rows = list.querySelectorAll('.resource-row');
    const resources = [];
    rows.forEach((row) => {
      const url = (row.querySelector('.resource-url').value || '').trim();
      if (!url) return;
      const label = (row.querySelector('.resource-label').value || '').trim();
      resources.push({ url, label: label || url });
    });
    return resources;
  }

  function openAddModal(preSelectedStatus) {
    document.getElementById('modal-title').textContent = 'Add item';
    document.getElementById('item-form').reset();
    document.getElementById('item-id').value = '';
    const statusSelect = document.getElementById('item-status');
    const sorted = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    statusSelect.innerHTML = '<option value="">— Backlog (no status) —</option>' +
      sorted.map((c) => `<option value="${escapeAttr(c.id)}">${escapeHtml(c.name)}</option>`).join('');
    if (preSelectedStatus) {
      statusSelect.value = preSelectedStatus;
    }
    const resourcesList = document.getElementById('item-resources-list');
    resourcesList.innerHTML = '';
    addResourceRow(resourcesList, {});
    document.getElementById('item-modal').showModal();
  }

  function openEditModal(itemId) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    document.getElementById('modal-title').textContent = 'Edit item';
    document.getElementById('item-id').value = item.id;
    document.getElementById('item-name').value = item.name || '';
    document.getElementById('item-priority').value = item.priority || '';
    document.getElementById('item-notes').value = item.notes || '';
    document.getElementById('item-stakeholders').value = Array.isArray(item.stakeholders) ? item.stakeholders.join(', ') : (item.stakeholders || '');
    const dueVal = item.dueDate ? String(item.dueDate).slice(0, 10) : '';
    document.getElementById('item-due-date').value = dueVal;
    const statusSelect = document.getElementById('item-status');
    statusSelect.innerHTML = '<option value="">— Backlog (no status) —</option>' +
      columns.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((c) => `<option value="${escapeAttr(c.id)}" ${c.id === item.status ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
    const resourcesList = document.getElementById('item-resources-list');
    resourcesList.innerHTML = '';
    const resources = item.resources && item.resources.length ? item.resources : [{ url: '', label: '' }];
    resources.forEach((r) => addResourceRow(resourcesList, r));
    document.getElementById('item-modal').showModal();
  }

  function openDetailModal(itemId) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const col = columns.find((c) => c.id === item.status);
    document.getElementById('detail-name').textContent = item.name || 'Untitled';
    const detailPriorityEl = document.getElementById('detail-priority');
    if (item.priority) {
      detailPriorityEl.textContent = `Priority: ${item.priority}`;
      detailPriorityEl.dataset.priority = item.priority;
    } else {
      detailPriorityEl.textContent = 'No priority';
      delete detailPriorityEl.dataset.priority;
    }
    document.getElementById('detail-created').textContent = `Created ${formatDate(item.createdAt)}`;
    const detailDueEl = document.getElementById('detail-due');
    if (item.dueDate) {
      detailDueEl.textContent = `Due ${formatDate(item.dueDate)}`;
      detailDueEl.style.display = '';
    } else {
      detailDueEl.textContent = '';
      detailDueEl.style.display = 'none';
    }
    document.getElementById('detail-notes').textContent = item.notes || '—';
    document.getElementById('detail-notes-wrap').style.display = item.notes ? 'block' : 'none';
    const stake = Array.isArray(item.stakeholders) ? item.stakeholders.join(', ') : (item.stakeholders || '');
    document.getElementById('detail-stakeholders').textContent = stake || '—';
    document.getElementById('detail-stakeholders-wrap').style.display = stake ? 'block' : 'none';

    const resourcesList = document.getElementById('detail-resources');
    const resources = item.resources || [];
    resourcesList.innerHTML = '';
    if (resources.length) {
      resources.forEach((r) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = r.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = r.label || r.url;
        li.appendChild(a);
        resourcesList.appendChild(li);
      });
    }
    document.getElementById('detail-resources-wrap').style.display = resources.length ? 'block' : 'none';

    const historyList = document.getElementById('detail-status-history');
    historyList.innerHTML = '';
    (item.statusHistory || []).forEach((h) => {
      const li = document.createElement('li');
      const fromName = (columns.find((c) => c.id === h.from) || {}).name || h.from || 'Backlog';
      const toName = (columns.find((c) => c.id === h.to) || {}).name || h.to || 'Backlog';
      li.textContent = `${formatDate(h.at)}: ${fromName} → ${toName}`;
      historyList.appendChild(li);
    });

    const changelogList = document.getElementById('detail-changelog');
    changelogList.innerHTML = '';
    (item.changelog || []).slice().reverse().forEach((c) => {
      const li = document.createElement('li');
      if (c.field === 'resources' && (c.oldResources || c.newResources)) {
        li.appendChild(document.createTextNode(`${formatDate(c.at)}: resources changed. From: `));
        renderResourceLinks(li, c.oldResources);
        li.appendChild(document.createTextNode(' → To: '));
        renderResourceLinks(li, c.newResources);
      } else {
        li.textContent = `${formatDate(c.at)}: ${c.field} changed from "${String(c.old)}" to "${String(c.new)}"`;
      }
      changelogList.appendChild(li);
    });

    document.getElementById('detail-edit').onclick = () => {
      document.getElementById('detail-modal').close();
      openEditModal(itemId);
    };
    document.getElementById('detail-modal').showModal();
  }

  function resourcesToChangelogString(arr) {
    return (arr || []).map((r) => (r.label ? `${r.label}: ${r.url}` : r.url)).join(' | ');
  }

  function renderResourceLinks(container, resources) {
    const list = resources && resources.length ? resources : [];
    if (list.length === 0) {
      container.appendChild(document.createTextNode('(none)'));
      return;
    }
    list.forEach((r, i) => {
      if (i > 0) container.appendChild(document.createTextNode(', '));
      const a = document.createElement('a');
      a.href = r.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = r.label || r.url;
      container.appendChild(a);
    });
  }

  function saveItemForm(e) {
    e.preventDefault();
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value.trim();
    const priority = document.getElementById('item-priority').value;
    const status = document.getElementById('item-status').value;
    const notes = document.getElementById('item-notes').value.trim();
    const stakeholdersStr = document.getElementById('item-stakeholders').value.trim();
    const stakeholders = stakeholdersStr ? stakeholdersStr.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const resources = getResourcesFromForm();
    const dueDateRaw = document.getElementById('item-due-date').value.trim();
    const dueDate = dueDateRaw || null;

    if (id) {
      const item = items.find((i) => i.id === id);
      if (item) {
        if (item.name !== name) { addChangelogEntry(id, 'name', item.name, name); item.name = name; }
        if (item.priority !== priority) { addChangelogEntry(id, 'priority', item.priority, priority); item.priority = priority; }
        if (item.status !== status) { setStatusWithHistory(id, status); }
        if (item.notes !== notes) { addChangelogEntry(id, 'notes', item.notes, notes); item.notes = notes; }
        const prevStake = Array.isArray(item.stakeholders) ? item.stakeholders.join(', ') : (item.stakeholders || '');
        if (prevStake !== stakeholders.join(', ')) { addChangelogEntry(id, 'stakeholders', prevStake, stakeholders.join(', ')); item.stakeholders = stakeholders; }
        const prevDue = item.dueDate ? formatDate(item.dueDate) : '';
        const newDue = dueDate ? formatDate(dueDate) : '';
        if (prevDue !== newDue) { addChangelogEntry(id, 'due date', prevDue || '(none)', newDue || '(none)'); item.dueDate = dueDate; }
        const prevResourcesStr = resourcesToChangelogString(item.resources);
        const newResourcesStr = resourcesToChangelogString(resources);
        if (prevResourcesStr !== newResourcesStr) {
          addChangelogEntry(id, 'resources', prevResourcesStr || '(none)', newResourcesStr || '(none)', {
            oldResources: item.resources && item.resources.length ? item.resources : [],
            newResources: resources && resources.length ? resources : [],
          });
          item.resources = resources;
        }
      }
    } else {
      items.push({
        id: generateId(),
        trackerId: currentTrackerId || trackers[0]?.id,
        name,
        priority,
        status,
        notes,
        stakeholders,
        resources,
        dueDate,
        createdAt: nowISO(),
        statusHistory: status ? [{ from: '', to: status, at: nowISO() }] : [],
        changelog: [],
      });
    }
    saveItems();
    document.getElementById('item-modal').close();
    renderBoard();
    renderBacklog();
  }

  function openColumnModal(column) {
    document.getElementById('column-modal-title').textContent = column ? 'Edit column' : 'Add column';
    document.getElementById('column-edit-id').value = column ? column.id : '';
    document.getElementById('column-name').value = column ? column.name : '';
    document.getElementById('column-color').value = column && column.color ? column.color : '#c4b5fd';
    document.getElementById('column-modal').showModal();
  }

  function saveColumnForm(e) {
    e.preventDefault();
    const editId = document.getElementById('column-edit-id').value;
    const name = document.getElementById('column-name').value.trim();
    const color = document.getElementById('column-color').value;

    if (editId) {
      const col = columns.find((c) => c.id === editId);
      if (col) {
        col.name = name;
        col.color = color;
      }
    } else {
      const id = 'col-' + Date.now();
      const order = Math.max(0, ...columns.map((c) => c.order ?? 0)) + 1;
      columns.push({ id, name, color, order });
    }
    saveColumns();
    document.getElementById('column-modal').close();
    renderBoard();
    updateStatusSelects();
  }

  function removeColumn(columnId) {
    if (!confirm('Remove this column? Items in it will move to Backlog.')) return;
    items.forEach((i) => { if (i.status === columnId) i.status = ''; });
    columns = columns.filter((c) => c.id !== columnId);
    saveColumns();
    saveItems();
    renderBoard();
    renderBacklog();
    updateStatusSelects();
  }

  function openAddTrackerModal() {
    document.getElementById('tracker-modal-title').textContent = 'Add workstream';
    document.getElementById('tracker-form').reset();
    document.getElementById('tracker-edit-id').value = '';
    document.getElementById('tracker-color').value = DEFAULT_TRACKER_COLOR;
    document.getElementById('tracker-delete').style.display = 'none';
    document.getElementById('tracker-modal').showModal();
  }

  function openEditTrackerModal(tracker) {
    document.getElementById('tracker-modal-title').textContent = 'Edit workstream';
    document.getElementById('tracker-edit-id').value = tracker.id;
    document.getElementById('tracker-name').value = tracker.name || '';
    document.getElementById('tracker-color').value = tracker.color || DEFAULT_TRACKER_COLOR;
    document.getElementById('tracker-goal').value = tracker.goal != null && tracker.goal !== '' ? String(tracker.goal) : '';
    document.getElementById('tracker-delete').style.display = 'inline-block';
    document.getElementById('tracker-delete').dataset.trackerId = tracker.id;
    document.getElementById('tracker-modal').showModal();
  }

  function saveTrackerForm(e) {
    e.preventDefault();
    const editId = document.getElementById('tracker-edit-id').value;
    const name = document.getElementById('tracker-name').value.trim();
    const color = document.getElementById('tracker-color').value || DEFAULT_TRACKER_COLOR;
    const goalRaw = document.getElementById('tracker-goal').value.trim();
    const goal = goalRaw === '' ? null : parseInt(goalRaw, 10);

    if (editId) {
      const t = trackers.find((tr) => tr.id === editId);
      if (t) {
        t.name = name;
        t.color = color;
        t.goal = Number.isFinite(goal) ? goal : null;
      }
    } else {
      const id = 'tracker-' + Date.now();
      trackers.push({ id, name, color, goal: Number.isFinite(goal) ? goal : null, goalMetWeeks: [] });
      currentTrackerId = id;
      mainView = 'board';
      localStorage.setItem(STORAGE_MAIN_VIEW, mainView);
      saveTrackers();
      applyMainView();
    }
    saveTrackers();
    document.getElementById('tracker-modal').close();
    renderWorkstreamPicker();
    renderTrackerPill();
    applyWorkstreamBackground();
    renderDashboard();
    if (currentTrackerId) {
      renderBoard();
      renderBacklog();
    }
  }

  let deleteTrackerId = null;

  function openDeleteTrackerModal(trackerId) {
    const tracker = trackers.find((t) => t.id === trackerId);
    if (!tracker) return;
    document.getElementById('tracker-modal').close();
    deleteTrackerId = trackerId;
    const count = getItemsForTracker(trackerId).length;
    document.getElementById('tracker-delete-message').textContent =
      `Delete "${tracker.name}"? It has ${count} item(s). Move them to another workstream or delete all.`;
    const moveTo = document.getElementById('tracker-delete-move-to');
    const others = trackers.filter((t) => t.id !== trackerId);
    moveTo.innerHTML = others.map((t) => `<option value="${escapeAttr(t.id)}">${escapeHtml(t.name)}</option>`).join('');
    document.getElementById('tracker-delete-move-wrap').style.display = others.length ? 'block' : 'none';
    document.getElementById('tracker-delete-move').style.display = others.length ? 'inline-block' : 'none';
    document.getElementById('tracker-delete-modal').showModal();
  }

  function confirmDeleteTracker(moveToId) {
    if (!deleteTrackerId) return;
    if (moveToId) {
      items.filter((i) => i.trackerId === deleteTrackerId).forEach((i) => { i.trackerId = moveToId; });
    } else {
      items = items.filter((i) => i.trackerId !== deleteTrackerId);
    }
    trackers = trackers.filter((t) => t.id !== deleteTrackerId);
    if (currentTrackerId === deleteTrackerId) {
      currentTrackerId = trackers.length ? trackers[0].id : null;
      if (trackers.length === 0) mainView = 'dashboard';
      saveTrackers();
    }
    saveItems();
    saveTrackers();
    document.getElementById('tracker-delete-modal').close();
    deleteTrackerId = null;
    renderWorkstreamPicker();
    renderTrackerPill();
    renderDashboard();
    if (mainView === 'board') {
      renderBoard();
      renderBacklog();
    }
  }

  function updateStatusSelects() {
    // Next time modals open they'll use current columns
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function switchView(view) {
    document.querySelectorAll('.view-tabs .tab').forEach((t) => t.classList.toggle('active', t.dataset.view === view));
    document.getElementById('view-backlog').classList.toggle('hidden', view !== 'backlog');
    document.getElementById('view-board').classList.toggle('hidden', view !== 'board');
    if (view === 'backlog') renderBacklog();
    if (view === 'board') renderBoard();
  }

  const CHART_BACKLOG_COLOR = '#94a3b8';

  function buildDashboardCharts(m, sortedColumns) {
    const segments = [
      { label: 'Backlog', count: m.backlogCount, color: CHART_BACKLOG_COLOR },
      ...sortedColumns.map((c) => ({ label: c.name, count: m.byStatus[c.id] || 0, color: c.color || '#c4b5fd' })),
    ];
    const total = segments.reduce((s, x) => s + x.count, 0);
    const legendRows = segments.map((s) =>
      `<div class="dashboard-donut-legend-row">
        <span class="dashboard-donut-legend-label">${escapeHtml(s.label)}</span>
        <span class="dashboard-donut-legend-count">${s.count}</span>
      </div>`
    ).join('');
    let donutStyle = 'background: var(--border);';
    if (total > 0) {
      let acc = 0;
      const parts = segments.map((s) => {
        const pct = (s.count / total) * 100;
        const start = acc;
        acc += pct;
        return `${s.color} ${start}% ${acc}%`;
      }).join(', ');
      donutStyle = `background: conic-gradient(${parts});`;
    }
    return `
      <div class="dashboard-charts">
        <div class="dashboard-donut-legend">${legendRows}</div>
        <div class="dashboard-donut-wrap">
          <div class="dashboard-donut" style="${donutStyle}"></div>
        </div>
      </div>
    `;
  }

  function renderDashboard() {
    const agg = getAggregateMetrics();
    const kpiEl = document.getElementById('dashboard-kpi');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="dashboard-kpi-box kpi-total"><span class="dashboard-kpi-label">TOTAL</span><span class="dashboard-kpi-value">${agg.total}</span></div>
        <div class="dashboard-kpi-box kpi-backlog"><span class="dashboard-kpi-label">BACKLOG</span><span class="dashboard-kpi-value">${agg.backlog}</span></div>
        <div class="dashboard-kpi-box kpi-todo"><span class="dashboard-kpi-label">TO DO</span><span class="dashboard-kpi-value">${agg.todo}</span></div>
        <div class="dashboard-kpi-box kpi-progress"><span class="dashboard-kpi-label">IN PROGRESS</span><span class="dashboard-kpi-value">${agg.inProgress}</span></div>
        <div class="dashboard-kpi-box kpi-done"><span class="dashboard-kpi-label">DONE</span><span class="dashboard-kpi-value">${agg.done}</span></div>
      `;
    }
    const grid = document.getElementById('dashboard-grid');
    grid.innerHTML = '';
    const sortedColumns = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    trackers.forEach((tracker) => {
      const m = getTrackerMetrics(tracker.id);
      const card = document.createElement('div');
      card.className = 'dashboard-card';
      const color = tracker.color || DEFAULT_TRACKER_COLOR;
      const goal = tracker.goal != null && tracker.goal !== '' ? parseInt(tracker.goal, 10) : null;
      const goalNum = Number.isFinite(goal) ? goal : null;
      const progressPct = goalNum && goalNum > 0 ? Math.min(100, (m.doneCount / goalNum) * 100) : 0;
      const chartsHtml = buildDashboardCharts(m, sortedColumns);
      card.innerHTML = `
        <div class="dashboard-card-header" style="background: ${escapeAttr(color)}; color: inherit;">${escapeHtml(tracker.name)}</div>
        <div class="dashboard-card-body">
          <div class="dashboard-metrics">
            <div class="dashboard-metric"><span>Backlog</span><span class="count">${m.backlogCount}</span></div>
            ${sortedColumns.map((c) => `<div class="dashboard-metric"><span>${escapeHtml(c.name)}</span><span class="count">${m.byStatus[c.id] || 0}</span></div>`).join('')}
            <div class="dashboard-metric"><span>Total</span><span class="count">${m.total}</span></div>
          </div>
          ${chartsHtml}
          ${goalNum != null ? `
          <div class="dashboard-goal">
            <span class="goal-label">Goal (Done): </span><span class="goal-value">${m.doneCount} / ${goalNum}</span>
            <div class="goal-progress"><div class="goal-progress-fill" style="width: ${progressPct}%"></div></div>
          </div>
          ` : ''}
          <div class="dashboard-card-actions">
            <button type="button" class="btn btn-secondary btn-sm open-tracker-btn" data-tracker-id="${escapeAttr(tracker.id)}">Open</button>
            <button type="button" class="btn btn-ghost btn-sm edit-tracker-btn" data-tracker-id="${escapeAttr(tracker.id)}">Edit</button>
          </div>
        </div>
      `;
      card.querySelector('.open-tracker-btn').addEventListener('click', () => {
        currentTrackerId = tracker.id;
        mainView = 'board';
        localStorage.setItem(STORAGE_MAIN_VIEW, mainView);
        saveTrackers();
        renderWorkstreamPicker();
        renderTrackerPill();
        applyMainView();
        applyWorkstreamBackground();
      });
      card.querySelector('.edit-tracker-btn').addEventListener('click', () => openEditTrackerModal(tracker));
      grid.appendChild(card);
    });
    const goalsEl = document.getElementById('dashboard-goals');
    if (goalsEl) {
      const withGoals = trackers.filter((t) => t.goal != null && t.goal !== '');
      if (withGoals.length === 0) {
        goalsEl.innerHTML = '<p class="dashboard-goals-empty">No workstreams with goals set. Edit a workstream to set a Done goal.</p>';
      } else {
        goalsEl.innerHTML = withGoals.map((t) => {
          const m = getTrackerMetrics(t.id);
          const goalNum = parseInt(t.goal, 10);
          const met = Number.isFinite(goalNum) && m.doneCount >= goalNum;
          const metThisWeek = isGoalMetThisWeek(t);
          const weeksCount = (t.goalMetWeeks || []).length;
          return `
            <div class="dashboard-goal-card" data-tracker-id="${escapeAttr(t.id)}">
              <div class="dashboard-goal-card-header" style="background: ${escapeAttr(t.color || DEFAULT_TRACKER_COLOR)};">${escapeHtml(t.name)}</div>
              <div class="dashboard-goal-card-body">
                <div class="dashboard-goal-week">
                  <span class="dashboard-goal-week-label">This week:</span>
                  <span class="dashboard-goal-week-status ${metThisWeek ? 'met' : 'not-met'}">${metThisWeek ? 'Met' : 'Not met'}</span>
                  ${!metThisWeek && met ? `<button type="button" class="btn btn-sm btn-primary mark-goal-met-btn" data-tracker-id="${escapeAttr(t.id)}">Mark as met</button>` : ''}
                </div>
                <div class="dashboard-goal-weeks-total">Weeks goal met: ${weeksCount}</div>
              </div>
            </div>`;
        }).join('');
        goalsEl.querySelectorAll('.mark-goal-met-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            markGoalMetForWeek(btn.dataset.trackerId || '');
            renderDashboard();
          });
        });
      }
    }
  }

  function renderWorkstreamPicker() {
    const triggerName = document.getElementById('workstream-trigger-name');
    const triggerColor = document.getElementById('workstream-trigger-color');
    const dropdown = document.getElementById('workstream-picker-dropdown');
    if (!triggerName || !dropdown) return;
    if (!currentTrackerId && trackers.length) currentTrackerId = trackers[0].id;
    const current = trackers.find((t) => t.id === currentTrackerId);
    if (current) {
      triggerName.textContent = current.name;
      triggerColor.style.background = current.color || DEFAULT_TRACKER_COLOR;
      triggerColor.style.display = 'block';
    } else {
      triggerName.textContent = '—';
      triggerColor.style.display = 'none';
    }
    dropdown.innerHTML = trackers.map((t) => {
      const isSelected = t.id === currentTrackerId;
      return `<button type="button" class="workstream-picker-item ${isSelected ? 'selected' : ''}" data-tracker-id="${escapeAttr(t.id)}" role="option" aria-selected="${isSelected}">
        <span class="workstream-picker-item-color" style="background: ${escapeAttr(t.color || DEFAULT_TRACKER_COLOR)};"></span>
        <span>${escapeHtml(t.name)}</span>
      </button>`;
    }).join('') + `<button type="button" class="workstream-picker-item workstream-picker-add" data-action="add-workstream" role="option">
      <span class="workstream-picker-item-color" style="background: transparent; border: 1px dashed var(--border);"></span>
      <span>+ Add workstream</span>
    </button>`;
    dropdown.querySelectorAll('.workstream-picker-item[data-tracker-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentTrackerId = btn.dataset.trackerId || null;
        saveTrackers();
        document.getElementById('workstream-picker').classList.remove('open');
        document.getElementById('workstream-picker-trigger').setAttribute('aria-expanded', 'false');
        applyWorkstreamBackground();
        renderWorkstreamPicker();
        renderBoard();
        renderBacklog();
      });
    });
    const addBtn = dropdown.querySelector('.workstream-picker-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        document.getElementById('workstream-picker').classList.remove('open');
        document.getElementById('workstream-picker-trigger').setAttribute('aria-expanded', 'false');
        openAddTrackerModal();
      });
    }
  }

  function setupWorkstreamPicker() {
    const wrap = document.getElementById('workstream-picker');
    const trigger = document.getElementById('workstream-picker-trigger');
    const dropdown = document.getElementById('workstream-picker-dropdown');
    if (!wrap || !trigger || !dropdown) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrap.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen);
    });
    dropdown.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => {
      wrap.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function renderTrackerPill() {
    renderWorkstreamPicker();
  }

  function applyMainView() {
    if (mainView === 'board' && trackers.length === 0) {
      mainView = 'dashboard';
      localStorage.setItem(STORAGE_MAIN_VIEW, mainView);
    }
    const isDashboard = mainView === 'dashboard';
    document.querySelectorAll('.main-tab').forEach((t) => t.classList.toggle('active', t.dataset.mainView === mainView));
    document.getElementById('view-dashboard').classList.toggle('hidden', !isDashboard);
    document.getElementById('view-board').classList.toggle('hidden', isDashboard);
    document.getElementById('view-backlog').classList.toggle('hidden', isDashboard);
    const boardArea = document.getElementById('board-header-area');
    if (boardArea) boardArea.classList.toggle('visible', !isDashboard);
    document.getElementById('tracker-view-tabs').style.display = isDashboard ? 'none' : '';
    if (isDashboard) {
      applyWorkstreamBackground();
      renderDashboard();
    } else {
      if (!currentTrackerId && trackers.length) currentTrackerId = trackers[0].id;
      renderWorkstreamPicker();
      renderTrackerPill();
      applyWorkstreamBackground();
      switchView('board');
    }
  }

  function switchAppView() {
    applyMainView();
  }

  function initTheme() {
    const stored = localStorage.getItem(STORAGE_THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem(STORAGE_THEME)) return;
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_THEME, next);
  }

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
  }

  function applyWorkstreamBackground() {
    const tintOpacity = 0.1;
    if (mainView !== 'board' || !currentTrackerId) {
      document.documentElement.style.setProperty('--workstream-tint', 'none');
      return;
    }
    const tracker = trackers.find((t) => t.id === currentTrackerId);
    const hex = tracker && tracker.color ? tracker.color : DEFAULT_TRACKER_COLOR;
    const rgb = hexToRgb(hex);
    if (!rgb) {
      document.documentElement.style.setProperty('--workstream-tint', 'none');
      return;
    }
    const [r, g, b] = rgb;
    const tint = `linear-gradient(rgba(${r},${g},${b},${tintOpacity}), rgba(${r},${g},${b},${tintOpacity}))`;
    document.documentElement.style.setProperty('--workstream-tint', tint);
  }

  function init() {
    loadItems();
    loadTrackers();
    migrateItemsToTrackers();
    migrateChangelogResourcesToLinks();
    loadColumns();
    initTheme();
    setupBacklogDrop();

    document.getElementById('backlog-add-btn').addEventListener('click', () => openAddModal());
    setupActionsMenu();
    document.querySelectorAll('.add-tracker-btn').forEach((btn) => btn.addEventListener('click', openAddTrackerModal));
    document.querySelectorAll('.main-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        mainView = tab.dataset.mainView || 'dashboard';
        localStorage.setItem(STORAGE_MAIN_VIEW, mainView);
        if (mainView === 'board' && !currentTrackerId && trackers.length) currentTrackerId = trackers[0].id;
        saveTrackers();
        applyMainView();
      });
    });
    setupWorkstreamPicker();
    document.getElementById('edit-current-tracker-btn').addEventListener('click', () => {
      const t = trackers.find((tr) => tr.id === currentTrackerId);
      if (t) openEditTrackerModal(t);
    });
    document.getElementById('tracker-delete').addEventListener('click', (e) => {
      const id = e.target.dataset.trackerId;
      if (id) openDeleteTrackerModal(id);
    });
    document.getElementById('tracker-delete-cancel').addEventListener('click', () => document.getElementById('tracker-delete-modal').close());
    document.getElementById('tracker-delete-all').addEventListener('click', () => confirmDeleteTracker(null));
    document.getElementById('tracker-delete-move').addEventListener('click', () => {
      const moveToId = document.getElementById('tracker-delete-move-to').value || null;
      confirmDeleteTracker(moveToId);
    });
    document.getElementById('item-resources-add').addEventListener('click', () => {
      addResourceRow(document.getElementById('item-resources-list'), {});
    });
    document.getElementById('item-form').addEventListener('submit', saveItemForm);
    document.getElementById('column-form').addEventListener('submit', saveColumnForm);
    document.getElementById('tracker-form').addEventListener('submit', saveTrackerForm);
    document.getElementById('modal-cancel').addEventListener('click', () => document.getElementById('item-modal').close());
    document.getElementById('column-cancel').addEventListener('click', () => document.getElementById('column-modal').close());
    document.getElementById('tracker-cancel').addEventListener('click', () => document.getElementById('tracker-modal').close());
    document.getElementById('detail-close').addEventListener('click', () => document.getElementById('detail-modal').close());
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('date-filter').addEventListener('change', () => { renderBoard(); renderBacklog(); });

    let importFile = null;
    const importModal = document.getElementById('import-modal');
    const importFileInput = document.getElementById('import-file-input');
    const importFileName = document.getElementById('import-file-name');
    const importConfirm = document.getElementById('import-confirm');

    function openImportModal() {
      importFile = null;
      if (importFileInput) importFileInput.value = '';
      if (importFileName) importFileName.textContent = 'No file chosen';
      if (importConfirm) importConfirm.disabled = true;
      if (importModal) importModal.showModal();
    }

    function setupActionsMenu() {
      const wrap = document.getElementById('actions-menu');
      const trigger = document.getElementById('actions-menu-trigger');
      const dropdown = document.getElementById('actions-menu-dropdown');
      if (!wrap || !trigger || !dropdown) return;
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        wrap.classList.toggle('open');
        trigger.setAttribute('aria-expanded', wrap.classList.contains('open'));
      });
      dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.actions-menu-item');
        if (!item) return;
        const action = item.dataset.action;
        wrap.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        if (action === 'add-item') openAddModal();
        else if (action === 'add-column') openColumnModal(null);
        else if (action === 'add-workstream') openAddTrackerModal();
        else if (action === 'export') exportData();
        else if (action === 'import') openImportModal();
      });
      document.addEventListener('click', () => {
        wrap.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    }

    document.getElementById('import-cancel').addEventListener('click', () => { if (importModal) importModal.close(); });
    if (importFileInput) {
      importFileInput.addEventListener('change', () => {
        const file = importFileInput.files && importFileInput.files[0];
        importFile = file || null;
        if (importFileName) importFileName.textContent = file ? file.name : 'No file chosen';
        if (importConfirm) importConfirm.disabled = !importFile;
      });
    }
    if (importConfirm) {
      importConfirm.addEventListener('click', () => {
        if (!importFile) return;
        const reader = new FileReader();
        reader.onload = () => {
          const result = importData(reader.result);
          if (result.ok) {
            if (importModal) importModal.close();
            window.location.reload();
          } else {
            alert(result.error || 'Import failed.');
          }
        };
        reader.readAsText(importFile);
      });
    }

    document.querySelectorAll('.view-tabs .tab').forEach((tab) => {
      tab.addEventListener('click', () => switchView(tab.dataset.view));
    });

    renderWorkstreamPicker();
    applyWorkstreamBackground();
    applyMainView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
