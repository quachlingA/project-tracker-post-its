(function () {
  'use strict';

  const STORAGE_ITEMS = 'todo-tracker-items';
  const STORAGE_COLUMNS = 'todo-tracker-columns';
  const STORAGE_TRACKERS = 'todo-tracker-trackers';
  const STORAGE_CURRENT_TRACKER = 'todo-tracker-current';
  const STORAGE_MAIN_VIEW = 'todo-tracker-main-view';
  const STORAGE_THEME = 'todo-tracker-theme';
  const STORAGE_SORT_BY = 'todo-tracker-sort-by';
  const STORAGE_WELCOME_SEEN = 'post-its-welcome-seen';
  const DEFAULT_TRACKER_COLOR = '#bfdbfe';

  /** Inspirational "did you know" facts: person did X at age Y (young achievers). What are you gonna do? */
  const INSPIRATIONAL_FACTS = [
    { person: 'Malala Yousafzai', achievement: 'won the Nobel Peace Prize', age: 17 },
    { person: 'Louis Braille', achievement: 'invented the Braille reading system', age: 15 },
    { person: 'Anne Frank', achievement: 'wrote her diary that would inspire millions', age: 13 },
    { person: 'Mozart', achievement: 'composed his first symphony', age: 8 },
    { person: 'Steve Jobs', achievement: 'co-founded Apple', age: 21 },
    { person: 'Bill Gates', achievement: 'founded Microsoft', age: 20 },
    { person: 'Mark Zuckerberg', achievement: 'launched Facebook', age: 19 },
    { person: 'Mary Shelley', achievement: 'wrote Frankenstein', age: 18 },
    { person: 'Emma Watson', achievement: 'landed the role of Hermione in Harry Potter', age: 9 },
    { person: 'Shirley Temple', achievement: 'won an Academy Award', age: 6 },
    { person: 'Pablo Picasso', achievement: 'painted his first major work', age: 15 },
    { person: 'Tiger Woods', achievement: 'won the U.S. Junior Amateur championship', age: 15 },
    { person: 'Greta Thunberg', achievement: 'addressed the UN Climate Action Summit', age: 16 },
    { person: 'Elon Musk', achievement: 'sold his first video game', age: 12 },
    { person: 'Oprah Winfrey', achievement: 'got her first job in radio', age: 16 },
    { person: 'Beyoncé', achievement: 'formed Destiny\'s Child', age: 9 },
    { person: 'Lady Gaga', achievement: 'played open mics in New York', age: 14 },
    { person: 'Taylor Swift', achievement: 'signed her first record deal', age: 15 },
    { person: 'Justin Bieber', achievement: 'was discovered on YouTube', age: 12 },
    { person: 'Albert Einstein', achievement: 'wrote his first scientific paper', age: 16 },
    { person: 'Marie Curie', achievement: 'graduated from high school at the top of her class', age: 15 },
    { person: 'Ada Lovelace', achievement: 'designed the first algorithm for a computer', age: 27 },
    { person: 'Orville Wright', achievement: 'built and sold kites with his brother', age: 7 },
    { person: 'Thomas Edison', achievement: 'set up his first lab in a train car', age: 12 },
    { person: 'Nikola Tesla', achievement: 'invented a device to catch frogs', age: 5 },
    { person: 'Neil Armstrong', achievement: 'earned his pilot\'s license', age: 16 },
    { person: 'Sally Ride', achievement: 'became the first American woman in space', age: 32 },
    { person: 'Maya Angelou', achievement: 'wrote her first poem', age: 9 },
    { person: 'Zendaya', achievement: 'starred in Disney\'s Shake It Up', age: 14 },
    { person: 'Millie Bobby Brown', achievement: 'was cast in Stranger Things', age: 12 },
    { person: 'Simone Biles', achievement: 'won her first national all-around title', age: 16 },
    { person: 'Serena Williams', achievement: 'won her first major tennis title', age: 17 },
    { person: 'Venus Williams', achievement: 'turned professional in tennis', age: 14 },
    { person: 'Michael Phelps', achievement: 'competed in his first Olympics', age: 15 },
    { person: 'Usain Bolt', achievement: 'won his first Olympic gold', age: 22 },
    { person: 'Jackie Robinson', achievement: 'lettered in four sports in high school', age: 17 },
    { person: 'Pelé', achievement: 'won his first World Cup', age: 17 },
    { person: 'Lionel Messi', achievement: 'signed with FC Barcelona', age: 13 },
    { person: 'Cristiano Ronaldo', achievement: 'signed with Sporting CP', age: 12 },
    { person: 'Kobe Bryant', achievement: 'was drafted to the NBA', age: 17 },
    { person: 'LeBron James', achievement: 'appeared on the cover of Sports Illustrated', age: 17 },
    { person: 'Stephen Curry', achievement: 'led his high school to state playoffs', age: 18 },
    { person: 'Bobby Fischer', achievement: 'became the youngest grandmaster in chess', age: 15 },
    { person: 'Judit Polgár', achievement: 'defeated a grandmaster in chess', age: 10 },
    { person: 'Magnus Carlsen', achievement: 'became a chess grandmaster', age: 13 },
    { person: 'Pharrell Williams', achievement: 'formed his first band', age: 12 },
    { person: 'Bruno Mars', achievement: 'performed as Little Elvis in Hawaii', age: 4 },
    { person: 'Adele', achievement: 'enrolled at the BRIT School', age: 14 },
    { person: 'Ed Sheeran', achievement: 'moved to London to pursue music', age: 16 },
    { person: 'Billie Eilish', achievement: 'released her first single', age: 15 },
    { person: 'Olivia Rodrigo', achievement: 'released drivers license', age: 17 },
    { person: 'Tim Berners-Lee', achievement: 'built his first computer', age: 18 },
    { person: 'Larry Page', achievement: 'built a working printer from Legos', age: 12 },
    { person: 'Sergey Brin', achievement: 'immigrated to the U.S. and learned programming', age: 6 },
    { person: 'Jeff Bezos', achievement: 'won the state science fair', age: 18 },
    { person: 'Reid Hoffman', achievement: 'co-founded LinkedIn', age: 36 },
    { person: 'Travis Kalanick', achievement: 'dropped out of UCLA to start his first company', age: 21 },
    { person: 'Brian Chesky', achievement: 'founded Airbnb', age: 27 },
    { person: 'Drew Houston', achievement: 'founded Dropbox', age: 24 },
    { person: 'Kevin Systrom', achievement: 'created Instagram', age: 27 },
    { person: 'Evan Spiegel', achievement: 'co-founded Snapchat', age: 21 },
    { person: 'Whitney Wolfe Herd', achievement: 'founded Bumble', age: 24 },
    { person: 'Sara Blakely', achievement: 'founded Spanx', age: 29 },
    { person: 'Coco Chanel', achievement: 'opened her first boutique', age: 27 },
    { person: 'Walt Disney', achievement: 'drew cartoons for his school paper', age: 16 },
    { person: 'Steven Spielberg', achievement: 'made his first short film', age: 12 },
    { person: 'Quentin Tarantino', achievement: 'wrote his first screenplay', age: 14 },
    { person: 'Christopher Nolan', achievement: 'made his first short film', age: 7 },
    { person: 'Ava DuVernay', achievement: 'directed her first feature film', age: 40 },
    { person: 'Jordan Peele', achievement: 'released Get Out', age: 38 },
    { person: 'Greta Gerwig', achievement: 'wrote and directed Lady Bird', age: 34 },
    { person: 'Emma Stone', achievement: 'moved to LA to pursue acting', age: 15 },
    { person: 'Jennifer Lawrence', achievement: 'was nominated for an Oscar', age: 22 },
    { person: 'Dakota Fanning', achievement: 'starred in I Am Sam', age: 7 },
    { person: 'Hailee Steinfeld', achievement: 'was nominated for an Oscar for True Grit', age: 14 },
    { person: 'Florence Welch', achievement: 'formed Florence and the Machine', age: 21 },
    { person: 'Lorde', achievement: 'released Royals', age: 16 },
    { person: 'Dua Lipa', achievement: 'moved to London to become a singer', age: 15 },
    { person: 'H.E.R.', achievement: 'signed her first record deal', age: 14 },
    { person: 'Doja Cat', achievement: 'released her first single', age: 20 },
    { person: 'Megan Thee Stallion', achievement: 'released her first mixtape', age: 21 },
    { person: 'Lizzo', achievement: 'moved to Minneapolis to pursue music', age: 21 },
    { person: 'Ruth Bader Ginsburg', achievement: 'graduated first in her class from Cornell', age: 21 },
    { person: 'Sonia Sotomayor', achievement: 'graduated from Princeton', age: 22 },
    { person: 'Amanda Gorman', achievement: 'became the first National Youth Poet Laureate', age: 19 },
    { person: 'Malcolm X', achievement: 'gave his first major speech', age: 27 },
    { person: 'Martin Luther King Jr.', achievement: 'entered college', age: 15 },
    { person: 'Rosa Parks', achievement: 'joined the NAACP', age: 43 },
    { person: 'Frida Kahlo', achievement: 'painted her first self-portrait', age: 18 },
    { person: 'Yayoi Kusama', achievement: 'moved to New York to pursue art', age: 29 },
    { person: 'Banksy', achievement: 'started making street art in Bristol', age: 14 },
    { person: 'Takashi Murakami', achievement: 'studied Nihonga painting in Tokyo', age: 22 },
    { person: 'Jean-Michel Basquiat', achievement: 'sold his first painting', age: 19 },
    { person: 'Andy Warhol', achievement: 'had his first solo exhibition', age: 34 },
    { person: 'J.K. Rowling', achievement: 'wrote the first draft of Harry Potter', age: 25 },
    { person: 'Stephen King', achievement: 'sold his first story', age: 18 },
    { person: 'Octavia Butler', achievement: 'won her first Hugo Award', age: 37 },
    { person: 'Neil Gaiman', achievement: 'wrote his first professional piece', age: 22 },
    { person: 'Ta-Nehisi Coates', achievement: 'published his first book', age: 33 },
    { person: 'Rupi Kaur', achievement: 'self-published Milk and Honey', age: 21 },
    { person: 'Elizabeth Gilbert', achievement: 'published her first short story', age: 19 },
    { person: 'Chimamanda Ngozi Adichie', achievement: 'published her first play', age: 19 },
    { person: 'Zadie Smith', achievement: 'published White Teeth', age: 24 },
    { person: 'Celeste Ng', achievement: 'published Everything I Never Told You', age: 34 },
    { person: 'Angie Thomas', achievement: 'published The Hate U Give', age: 29 },
    { person: 'Jason Reynolds', achievement: 'published his first novel', age: 24 },
    { person: 'John Green', achievement: 'published Looking for Alaska', age: 31 },
    { person: 'Mindy Kaling', achievement: 'was hired as a writer on The Office', age: 24 },
    { person: 'Lin-Manuel Miranda', achievement: 'wrote the first draft of In the Heights', age: 19 },
    { person: 'Lin-Manuel Miranda', achievement: 'won a Tony for Hamilton', age: 36 },
    { person: 'Dave Chappelle', achievement: 'performed his first stand-up set', age: 14 },
    { person: 'Tina Fey', achievement: 'joined Saturday Night Live', age: 27 },
    { person: 'Amy Poehler', achievement: 'founded the Upright Citizens Brigade', age: 24 },
    { person: 'Trevor Noah', achievement: 'hosted his first TV show in South Africa', age: 24 },
    { person: 'Hasan Minhaj', achievement: 'joined The Daily Show', age: 29 },
    { person: 'John Legend', achievement: 'sang in his church choir', age: 4 },
    { person: 'Alicia Keys', achievement: 'signed her first record deal', age: 15 },
    { person: 'Ariana Grande', achievement: 'starred on Broadway in 13', age: 15 },
    { person: 'Selena Gomez', achievement: 'starred on Barney & Friends', age: 10 },
    { person: 'Demi Lovato', achievement: 'starred in Camp Rock', age: 15 },
    { person: 'Miley Cyrus', achievement: 'landed the role of Hannah Montana', age: 12 },
    { person: 'Nicki Minaj', achievement: 'released her first mixtape', age: 24 },
    { person: 'Cardi B', achievement: 'went viral on Vine and Instagram', age: 22 },
    { person: 'Kendrick Lamar', achievement: 'released his first mixtape', age: 16 },
    { person: 'Drake', achievement: 'starred on Degrassi', age: 15 },
    { person: 'Post Malone', achievement: 'released White Iverson', age: 20 },
    { person: 'Travis Scott', achievement: 'released his first mixtape', age: 20 },
    { person: 'Billie Joe Armstrong', achievement: 'formed Green Day', age: 14 },
    { person: 'Kurt Cobain', achievement: 'formed his first band', age: 14 },
    { person: 'Dave Grohl', achievement: 'joined Nirvana', age: 21 },
    { person: 'Hayley Williams', achievement: 'formed Paramore', age: 15 },
    { person: 'Halsey', achievement: 'posted her first song on Tumblr', age: 18 },
    { person: 'Lil Nas X', achievement: 'released Old Town Road', age: 19 },
    { person: 'Claudia Conway', achievement: 'went viral for her political activism', age: 15 },
    { person: 'Marley Dias', achievement: 'started the #1000BlackGirlBooks campaign', age: 11 },
    { person: 'Mikaila Ulmer', achievement: 'founded Me & the Bees Lemonade', age: 4 },
    { person: 'Moziah Bridges', achievement: 'started Mo\'s Bows', age: 9 },
    { person: 'Alina Morse', achievement: 'invented Zollipops sugar-free lollipops', age: 7 },
    { person: 'Ryan Hickman', achievement: 'started a recycling business', age: 3 },
    { person: 'Easton LaChappelle', achievement: 'built his first robotic arm', age: 14 },
    { person: 'Jack Andraka', achievement: 'invented a cancer detection method', age: 15 },
    { person: 'Kelvin Doe', achievement: 'built a radio station from scrap', age: 13 },
    { person: 'Sylvia Todd', achievement: 'hosted a web show about science', age: 12 },
    { person: 'Gitanjali Rao', achievement: 'was named Time Kid of the Year', age: 15 },
  ];

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
    return currentTrackerId ? items.filter((i) => i.trackerId === currentTrackerId) : items;
  }

  /** Apply date filter to a list of items by doneAt (for Done column only). */
  function applyDoneDateFilter(list) {
    const filter = document.getElementById('date-filter').value;
    if (!filter || filter === 'all') return list;
    if (filter === 'this-week') {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      return list.filter((i) => {
        const at = i.doneAt || i.createdAt || '';
        const t = new Date(at).getTime();
        return t >= startOfWeek.getTime() && t < endOfWeek.getTime();
      });
    }
    const days = parseInt(filter, 10);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return list.filter((i) => {
      const at = i.doneAt || i.createdAt || '';
      return new Date(at).getTime() >= cutoff;
    });
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

  function getDoneColumnId() {
    const c = columns.find((col) => col.default === 'done' || col.id === 'done');
    return c ? c.id : 'done';
  }

  function backfillDoneAt() {
    const doneColId = getDoneColumnId();
    let changed = false;
    items.forEach((item) => {
      if (item.status !== doneColId || item.doneAt) return;
      const history = item.statusHistory || [];
      const lastDone = history.filter((h) => h.to === doneColId).pop();
      if (lastDone && lastDone.at) {
        item.doneAt = lastDone.at;
        changed = true;
      } else {
        item.doneAt = item.createdAt || new Date().toISOString();
        changed = true;
      }
    });
    if (changed) saveItems();
  }

  function priorityRank(p) {
    if (!p || p === '') return 0;
    const r = { critical: 4, high: 3, medium: 2, low: 1 }[p.toLowerCase()];
    return r != null ? r : 0;
  }

  function sortColumnItems(colItems, isBacklog, doneColId, colId) {
    if (colId === doneColId) return colItems;
    return [...colItems].sort((a, b) => {
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      if (aDue !== bDue) return aDue - bDue;
      return priorityRank(b.priority) - priorityRank(a.priority);
    });
  }

  function getSortBy() {
    const v = localStorage.getItem(STORAGE_SORT_BY);
    return (v === 'default' || v === 'created' || v === 'priority' || v === 'name') ? v : 'default';
  }

  function applySortBy(colItems, sortBy) {
    if (sortBy === 'default') return colItems;
    const list = [...colItems];
    if (sortBy === 'created') {
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    if (sortBy === 'priority') {
      return list.sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority));
    }
    if (sortBy === 'name') {
      return list.sort((a, b) => (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase()));
    }
    return list;
  }

  function setDoneAtIfDone(item, newStatus) {
    if (newStatus === getDoneColumnId()) item.doneAt = nowISO();
  }

  function setStatusWithHistory(itemId, newStatus) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const prev = item.status || '';
    if (prev === newStatus) return;
    item.status = newStatus;
    setDoneAtIfDone(item, newStatus);
    item.statusHistory = item.statusHistory || [];
    item.statusHistory.push({
      from: prev,
      to: newStatus,
      at: nowISO(),
    });
    saveItems();
  }

  function deleteItem(itemId) {
    items = items.filter((i) => i.id !== itemId);
    saveItems();
    document.getElementById('detail-modal').close();
    document.getElementById('item-modal').close();
    renderBoard();
    renderBacklog();
    if (mainView === 'board') renderWorkstreamPicker();
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
      const doneColId = getDoneColumnId();
      let count;
      if (isBacklog) {
        count = filtered.filter((i) => isInBacklog(i)).length;
      } else if (col.id === doneColId) {
        const doneItems = filtered.filter((i) => i.status === col.id && !isInBacklog(i));
        count = applyDoneDateFilter(doneItems).length;
      } else {
        count = filtered.filter((i) => i.status === col.id && !isInBacklog(i)).length;
      }
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
      let colItems = isBacklog
        ? filtered.filter((i) => isInBacklog(i))
        : filtered.filter((i) => i.status === col.id && !isInBacklog(i));
      if (!isBacklog && col.id === doneColId) colItems = applyDoneDateFilter(colItems);
      const sortBy = getSortBy();
      if (sortBy === 'default') {
        if (!isBacklog && col.id === doneColId) {
          colItems = [...colItems].sort((a, b) => {
            const aAt = a.doneAt || '';
            const bAt = b.doneAt || '';
            return aAt > bAt ? -1 : aAt < bAt ? 1 : 0;
          });
        } else {
          colItems = sortColumnItems(colItems, isBacklog, doneColId, col.id === BACKLOG_COLUMN_ID ? '' : col.id);
        }
      } else {
        colItems = applySortBy(colItems, sortBy);
      }
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
    const isDone = item.status === getDoneColumnId();
    const dateLabel = isDone ? `Done ${formatDate(item.doneAt || item.createdAt)}` : `Created ${formatDate(item.createdAt)}`;
    const showDue = item.dueDate && !isDone;
    div.innerHTML = `
      ${item.priority ? `<div class="card-priority-header" data-priority="${escapeAttr(item.priority)}">${escapeHtml(item.priority)}</div>` : ''}
      <div class="card-body">
        <div class="card-name">${escapeHtml(item.name || 'Untitled')}</div>
        <div class="card-meta">
          <span class="card-created">${dateLabel}</span>
          ${showDue ? `<span class="card-due">Due ${formatDate(item.dueDate)}</span>` : ''}
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
    setDoneAtIfDone(item, columnId);
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
    let backlogItems = filtered.filter((i) => isInBacklog(i));
    const sortBy = getSortBy();
    if (sortBy === 'default') {
      backlogItems = sortColumnItems(backlogItems, true, getDoneColumnId(), '');
    } else {
      backlogItems = applySortBy(backlogItems, sortBy);
    }
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
    document.getElementById('item-delete').style.display = 'none';
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
    const deleteBtn = document.getElementById('item-delete');
    deleteBtn.style.display = 'inline-block';
    deleteBtn.onclick = () => {
      if (confirm('Delete this item? This cannot be undone.')) deleteItem(itemId);
    };
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
    const detailDoneEl = document.getElementById('detail-done');
    const isInDone = item.status === getDoneColumnId();
    if (isInDone) {
      detailDoneEl.textContent = `Done ${formatDate(item.doneAt || item.createdAt)}`;
      detailDoneEl.style.display = '';
    } else {
      detailDoneEl.textContent = '';
      detailDoneEl.style.display = 'none';
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
    document.getElementById('detail-delete').onclick = () => {
      if (confirm('Delete this item? This cannot be undone.')) deleteItem(itemId);
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
      const newItem = {
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
      };
      if (status === getDoneColumnId()) newItem.doneAt = nowISO();
      items.push(newItem);
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
    const barRows = segments.map((s) => {
      const pct = total ? (s.count / total) * 100 : 0;
      return `<div class="dashboard-bar-row">
        <span class="dashboard-bar-label" title="${escapeAttr(s.label)}">${escapeHtml(s.label)}</span>
        <div class="dashboard-bar-track"><div class="dashboard-bar-fill" style="width: ${pct}%; background: ${escapeAttr(s.color)};"></div></div>
        <span class="dashboard-bar-count">${s.count}</span>
      </div>`;
    }).join('');
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
        <div class="dashboard-bars">${barRows}</div>
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
    const inspirationEl = document.getElementById('dashboard-inspiration-wrap');
    if (inspirationEl && INSPIRATIONAL_FACTS.length > 0) {
      const hoursSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60));
      const fact = INSPIRATIONAL_FACTS[hoursSinceEpoch % INSPIRATIONAL_FACTS.length];
      const text = `Did you know ${fact.person} ${fact.achievement} at age ${fact.age}? What are you gonna do?`;
      inspirationEl.innerHTML = `
        <div class="dashboard-inspiration">
          <span class="dashboard-inspiration-icon" aria-hidden="true">✨</span>
          <p class="dashboard-inspiration-quote">${escapeHtml(text)}</p>
        </div>
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
      return `<div class="workstream-picker-row" data-tracker-id="${escapeAttr(t.id)}">
        <button type="button" class="workstream-picker-item ${isSelected ? 'selected' : ''}" data-tracker-id="${escapeAttr(t.id)}" role="option" aria-selected="${isSelected}">
          <span class="workstream-picker-item-color" style="background: ${escapeAttr(t.color || DEFAULT_TRACKER_COLOR)};"></span>
          <span class="workstream-picker-item-name">${escapeHtml(t.name)}</span>
        </button>
        <button type="button" class="workstream-picker-item-edit-btn" title="Edit workstream" data-tracker-id="${escapeAttr(t.id)}" aria-label="Edit workstream">✏️</button>
      </div>`;
    }).join('') + `<button type="button" class="workstream-picker-item workstream-picker-add" data-action="add-workstream" role="option">
      <span class="workstream-picker-item-color" style="background: transparent; border: 1px dashed var(--border);"></span>
      <span>+ Add workstream</span>
    </button>`;
    dropdown.querySelectorAll('.workstream-picker-row').forEach((row) => {
      const trackerId = row.dataset.trackerId;
      const mainBtn = row.querySelector('.workstream-picker-item');
      const editBtn = row.querySelector('.workstream-picker-item-edit-btn');
      mainBtn.addEventListener('click', () => {
        currentTrackerId = trackerId || null;
        saveTrackers();
        document.getElementById('workstream-picker').classList.remove('open');
        document.getElementById('workstream-picker-trigger').setAttribute('aria-expanded', 'false');
        applyWorkstreamBackground();
        renderWorkstreamPicker();
        renderBoard();
        renderBacklog();
      });
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tracker = trackers.find((tr) => tr.id === trackerId);
          if (tracker) {
            document.getElementById('workstream-picker').classList.remove('open');
            document.getElementById('workstream-picker-trigger').setAttribute('aria-expanded', 'false');
            openEditTrackerModal(tracker);
          }
        });
      }
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

  function showWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.showModal();
  }

  function init() {
    loadItems();
    loadTrackers();
    migrateItemsToTrackers();
    migrateChangelogResourcesToLinks();
    loadColumns();
    backfillDoneAt();
    initTheme();
    setupBacklogDrop();

    const welcomeModal = document.getElementById('welcome-modal');
    const welcomeDismiss = document.getElementById('welcome-dismiss');
    if (welcomeDismiss && welcomeModal) {
      welcomeDismiss.addEventListener('click', () => {
        welcomeModal.close();
        try { localStorage.setItem(STORAGE_WELCOME_SEEN, '1'); } catch (_) {}
      });
    }
    document.getElementById('help-btn').addEventListener('click', showWelcomeModal);
    if (!localStorage.getItem(STORAGE_WELCOME_SEEN)) showWelcomeModal();

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
    const sortByEl = document.getElementById('sort-by');
    if (sortByEl) {
      sortByEl.value = getSortBy();
      sortByEl.addEventListener('change', () => {
        const v = sortByEl.value;
        if (v === 'default' || v === 'created' || v === 'priority' || v === 'name') {
          localStorage.setItem(STORAGE_SORT_BY, v);
          renderBoard();
          renderBacklog();
        }
      });
    }

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
        else if (action === 'edit-workstream') {
          const t = trackers.find((tr) => tr.id === currentTrackerId);
          if (t) openEditTrackerModal(t);
        } else if (action === 'export') exportData();
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
