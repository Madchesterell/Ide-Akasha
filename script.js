/* ═══════════════════════════════════════════════════
   RUANG KERJA — App Logic
   localStorage · responsive · 3 themes
═══════════════════════════════════════════════════ */

const STORAGE_KEY = 'ruangkerja_v1';

/* ── Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const uid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const daysBetween = (a, b) => Math.round((new Date(b+'T00:00:00') - new Date(a+'T00:00:00')) / 864e5);
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};
const timeAgo = (iso) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'baru saja';
  if (s < 3600) return `${Math.floor(s/60)} menit lalu`;
  if (s < 86400) return `${Math.floor(s/3600)} jam lalu`;
  if (s < 172800) return 'Kemarin';
  return `${Math.floor(s/86400)} hari lalu`;
};
const escapeHtml = (str) => String(str ?? '').replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const initials = (name) => name.split(/[\s._-]+/).filter(Boolean).slice(0,2).map(x => x[0].toUpperCase()).join('') || 'U';

function toast(msg, type = 'info') {
  const c = $('#toastContainer');
  if (!c) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .3s';
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

/* ── Default Data ── */
function defaultData() {
  const today = todayStr();
  const d = (offset) => {
    const x = new Date();
    x.setDate(x.getDate() + offset);
    return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
  };

  // Generate habit history (last 15 weeks-ish of activity intensity 0-4)
  const hist = [];
  for (let i = 104; i >= 0; i--) {
    const day = d(-i);
    // Higher chance of activity on recent days
    const chance = i < 14 ? 0.7 : i < 40 ? 0.45 : 0.25;
    hist.push({ date: day, level: Math.random() < chance ? Math.ceil(Math.random() * 4) : 0 });
  }

  return {
    theme: 'light',
    user: {
      name: 'Farrel Ganteng',
      email: 'farrel@email.id',
      role: 'Member'
    },
    habits: [
      { id: 'h1', name: 'Ngoding 1 jam', streak: 12, longest: 21, doneToday: true },
      { id: 'h2', name: 'Olahraga', streak: 5, longest: 9, doneToday: true },
      { id: 'h3', name: 'Minum 8 gelas', streak: 8, longest: 14, doneToday: false },
      { id: 'h4', name: 'Baca 20 menit', streak: 3, longest: 7, doneToday: false }
    ],
    habitHistory: hist,
    moodToday: null,
    moodNote: '',
    moodHistory: (() => {
      const arr = [];
      for (let i = 20; i >= 1; i--) {
        arr.push({ date: d(-i), mood: 2 + Math.floor(Math.random() * 4) });
      }
      return arr;
    })(),
    dailyGoal: '',
    goalDate: '',
    tasks: [
      { id: 't1', title: 'Kuis basis data bab 4', workspace: 'Proyek Akhir RPL', division: 'Divisi Backend', status: 'todo', due: d(-1), difficulty: 'sedang', assignee: 'Farrel Ganteng' },
      { id: 't2', title: 'Laporan magang minggu 3', workspace: 'Ruang Magang SMK', division: '', status: 'review', due: today, difficulty: 'mudah', assignee: 'Farrel Ganteng' },
      { id: 't3', title: 'Revisi layout landing page', workspace: 'Proyek Akhir RPL', division: 'Divisi Frontend', status: 'progress', due: d(1), difficulty: 'mudah', assignee: 'Farrel Ganteng', revision: true },
      { id: 't4', title: 'Push fitur login ke repo', workspace: 'Proyek Akhir RPL', division: '', status: 'progress', due: d(3), difficulty: 'sedang', assignee: 'Farrel Ganteng' },
      { id: 't5', title: 'Rancang skema database', workspace: 'Proyek Akhir RPL', division: 'Divisi Backend', status: 'progress', due: d(3), difficulty: 'tinggi', assignee: 'Farrel Ganteng' },
      { id: 't6', title: 'Presentasi proyek akhir', workspace: 'Proyek Akhir RPL', division: 'Seluruh tim', status: 'todo', due: d(6), difficulty: 'sedang', assignee: 'Farrel Ganteng' },
      { id: 't7', title: 'Desain ikon aplikasi', workspace: 'Freelance Desain', division: '', status: 'done', due: d(-3), difficulty: 'mudah', assignee: 'Farrel Ganteng' },
      { id: 't8', title: 'Review PR rekan', workspace: 'Lomba Web Kampus', division: '', status: 'todo', due: d(4), difficulty: 'sedang', assignee: 'Farrel Ganteng' }
    ],
    workspaces: [
      { id: 'w1', name: 'Proyek Akhir RPL', members: 8, mentor: 'Pak Dimas', role: 'Member', code: 'K7M2QX', progress: 62, waiting: 3 },
      { id: 'w2', name: 'Magang SMK Nusantara', members: 14, mentor: 'Bu Rina', role: 'Member', code: 'T4P9WD', progress: 80, waiting: 1 },
      { id: 'w3', name: 'Komunitas Ngoding Madiun', members: 20, mentor: 'Kamu', role: 'Mentor', code: 'N2X8HB', progress: 45, waiting: 6 },
      { id: 'w4', name: 'Freelance Desain', members: 5, mentor: 'Mas Bagas', role: 'Member', code: 'F6J3RC', progress: 30, waiting: 2 },
      { id: 'w5', name: 'Lomba Web Kampus', members: 6, mentor: 'Kak Intan', role: 'Member', code: 'L9V5MA', progress: 15, waiting: 4 }
    ],
    activities: [
      { id: 'a1', name: 'Raka', action: 'mengirim laporan Desain ikon', time: new Date(Date.now() - 12*60*1000).toISOString() },
      { id: 'a2', name: 'Pak Dimas', action: 'memvalidasi Riset pengguna', time: new Date(Date.now() - 60*60*1000).toISOString() },
      { id: 'a3', name: 'Salsa', action: 'bergabung ke divisi Frontend', time: new Date(Date.now() - 24*60*60*1000).toISOString() },
      { id: 'a4', name: 'Farrel Ganteng', action: 'menyelesaikan Desain ikon', time: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
      { id: 'a5', name: 'Bu Rina', action: 'membuat tugas baru Laporan magang', time: new Date(Date.now() - 3*24*60*60*1000).toISOString() }
    ],
    announcements: [
      { id: 'an1', title: 'Presentasi proyek akhir dimajukan ke Senin', body: 'Siapkan demo 5 menit. Bawa laptop sendiri.', by: 'Pak Dimas', time: new Date(Date.now() - 2*60*60*1000).toISOString(), pinned: true, workspaceId: 'w1' },
      { id: 'an2', title: 'Meeting mingguan digeser', body: 'Jadwal baru: Kamis pukul 16.00 via Google Meet.', by: 'Bu Rina', time: new Date(Date.now() - 26*60*60*1000).toISOString(), pinned: false, workspaceId: 'w2' }
    ],
    notifications: [
      { id: 'n1', title: 'Tugas baru untukmu', body: 'Kuis basis data bab 4', read: false, time: new Date(Date.now() - 30*60*1000).toISOString() },
      { id: 'n2', title: 'Revisi diminta', body: 'Revisi layout landing page', read: false, time: new Date(Date.now() - 2*60*60*1000).toISOString() },
      { id: 'n3', title: 'Pengumuman baru', body: 'Presentasi proyek akhir dimajukan ke Senin', read: false, time: new Date(Date.now() - 3*60*60*1000).toISOString() },
      { id: 'n4', title: 'Tugas divalidasi', body: 'Desain ikon telah disetujui', read: true, time: new Date(Date.now() - 2*24*60*60*1000).toISOString() }
    ],
    currentWorkspaceId: null,
    members: [
      { id: 'm1', name: 'Farrel Ganteng', role: 'Member', division: 'Frontend' },
      { id: 'm2', name: 'Raka Pratama', role: 'Member', division: 'Design' },
      { id: 'm3', name: 'Salsa Putri', role: 'Member', division: 'Frontend' },
      { id: 'm4', name: 'Pak Dimas', role: 'Mentor', division: 'Umum' },
      { id: 'm5', name: 'Dewi Lestari', role: 'Member', division: 'Backend' },
      { id: 'm6', name: 'Bima Sakti', role: 'Member', division: 'Backend' },
      { id: 'm7', name: 'Nadya', role: 'Member', division: 'Design' },
      { id: 'm8', name: 'Andi Wijaya', role: 'Member', division: 'Frontend' }
    ]
  };
}

/* ── State ── */
let state = null;
let calMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedMood = null;
let confirmResolve = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
      // Ensure critical keys exist
      const def = defaultData();
      for (const k of Object.keys(def)) {
        if (state[k] === undefined) state[k] = def[k];
      }
      return;
    }
  } catch (e) { console.warn(e); }
  state = defaultData();
  saveState();
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn('Gagal simpan:', e); }
}

/* ── Theme ── */
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  state.theme = theme;
  saveState();
  $$('.theme-btn').forEach(b => {
    const active = b.dataset.theme === theme;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active);
  });
  $$('.theme-option').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
}

/* ── Navigation ── */
function navigate(page, opts = {}) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const el = $(`#page-${page}`);
  if (el) el.classList.add('active');

  $$('.nav-item[data-page], .bottom-nav-item[data-page]').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });

  const back = $('#backBtn');
  const titles = {
    dashboard: ['Dashboard', greeting()],
    workspaces: ['Ruang Kerja Saya', 'Semua ruang yang kamu ikuti sebagai mentor atau anggota.'],
    notifications: ['Notifikasi', 'Pembaruan tugas dan aktivitas untukmu.'],
    account: ['Akun', 'Profil dan preferensi tampilan.'],
    'workspace-detail': [opts.name || 'Ruang Kerja', opts.info || '']
  };
  const [title, sub] = titles[page] || ['Ruang Kerja', ''];
  $('#pageTitle').textContent = title;
  $('#pageSubtitle').textContent = sub || '';
  back.classList.toggle('hidden', page !== 'workspace-detail');

  if (page === 'dashboard') renderDashboard();
  if (page === 'workspaces') renderWorkspaces();
  if (page === 'notifications') renderNotifications();
  if (page === 'account') renderAccount();
  if (page === 'workspace-detail') renderWorkspaceDetail();
}

function greeting() {
  const h = new Date().getHours();
  const name = state.user.name.split(' ')[0];
  let g = 'Selamat malam';
  if (h < 11) g = 'Selamat pagi';
  else if (h < 15) g = 'Selamat siang';
  else if (h < 18) g = 'Selamat sore';
  const need = state.tasks.filter(t => t.status !== 'done' && daysBetween(todayStr(), t.due) <= 0).length;
  return `${g}, ${name} · ${need} tugas perlu kamu selesaikan hari ini`;
}

/* ── Status helpers ── */
function statusBadge(t) {
  if (t.status === 'done') return '<span class="badge badge-done">Selesai</span>';
  if (t.status === 'review') return '<span class="badge badge-check">Siap dicek</span>';
  if (t.status === 'progress' && t.revision) return '<span class="badge badge-review">Revisi</span>';
  if (t.status === 'progress') return '<span class="badge badge-progress">Berjalan</span>';
  return '<span class="badge badge-todo">Belum dimulai</span>';
}
function dueBadge(t) {
  if (t.status === 'done') return '<span class="badge badge-normal">—</span>';
  const left = daysBetween(todayStr(), t.due);
  if (left < 0) return `<span class="badge badge-overdue">Terlambat ${-left} hari</span>`;
  if (left === 0) return '<span class="badge badge-today">Hari ini</span>';
  if (left === 1) return '<span class="badge badge-today">Besok</span>';
  return `<span class="badge badge-normal">H-${left}</span>`;
}
function diffBadge(d) {
  const map = { mudah: 'badge-easy', sedang: 'badge-medium', tinggi: 'badge-hard' };
  const label = { mudah: 'Mudah', sedang: 'Sedang', tinggi: 'Sulit' };
  return `<span class="badge ${map[d] || 'badge-normal'}">${label[d] || d}</span>`;
}

/* ── Render Dashboard ── */
function renderDashboard() {
  const tasks = state.tasks;
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const soon = tasks.filter(t => t.status !== 'done' && daysBetween(todayStr(), t.due) >= 0 && daysBetween(todayStr(), t.due) <= 7).length;
  const overdue = tasks.filter(t => t.status !== 'done' && daysBetween(todayStr(), t.due) < 0).length;

  $('#statTotal').textContent = total;
  $('#statDone').textContent = done;
  $('#statSoon').textContent = soon;
  $('#statOverdue').textContent = overdue;

  renderHabits();
  renderMood();
  renderTaskList();
  renderDeadlines();
  renderActivity($('#activityList'), state.activities.slice(0, 5));
}

function renderHabits() {
  const list = $('#habitList');
  list.innerHTML = state.habits.map(h => `
    <div class="habit-item ${h.doneToday ? 'done' : ''}" data-id="${h.id}" role="button" tabindex="0">
      <span class="habit-check">${h.doneToday ? '✓' : ''}</span>
      <span class="habit-name">${escapeHtml(h.name)}</span>
      <span class="habit-days">${h.streak} hari</span>
    </div>
  `).join('');

  list.querySelectorAll('.habit-item').forEach(el => {
    el.addEventListener('click', () => toggleHabit(el.dataset.id));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleHabit(el.dataset.id); } });
  });

  const top = state.habits.reduce((a, b) => a.streak > b.streak ? a : b, state.habits[0] || { streak: 0, longest: 0, name: '' });
  $('#habitStreakInfo').textContent = top ? `${top.name} · ${top.streak} hari beruntun · terpanjang ${top.longest}` : '';

  // Contribution graph (last 105 days ≈ 15 weeks)
  const graph = $('#contribGraph');
  const recent = state.habitHistory.slice(-105);
  graph.innerHTML = recent.map(c =>
    `<div class="contrib-cell lv${c.level}" title="${c.date}"></div>`
  ).join('');
}

function toggleHabit(id) {
  const h = state.habits.find(x => x.id === id);
  if (!h) return;
  h.doneToday = !h.doneToday;
  if (h.doneToday) {
    h.streak += 1;
    if (h.streak > h.longest) h.longest = h.streak;
  } else {
    h.streak = Math.max(0, h.streak - 1);
  }
  // Update today's history level
  const today = todayStr();
  let cell = state.habitHistory.find(c => c.date === today);
  if (!cell) {
    cell = { date: today, level: 0 };
    state.habitHistory.push(cell);
  }
  const doneCount = state.habits.filter(x => x.doneToday).length;
  cell.level = Math.min(4, Math.ceil((doneCount / Math.max(1, state.habits.length)) * 4));
  saveState();
  renderHabits();
  toast(h.doneToday ? `✓ ${h.name}` : `Dibatalkan: ${h.name}`, 'success');
}

function renderMood() {
  $$('.mood-btn').forEach(b => {
    b.classList.toggle('selected', Number(b.dataset.mood) === selectedMood || Number(b.dataset.mood) === state.moodToday);
  });
  if (state.moodNote) $('#moodNote').value = state.moodNote;

  // Simple SVG line chart
  const chart = $('#moodChart');
  const hist = state.moodHistory.slice(-14);
  if (!hist.length) { chart.innerHTML = ''; return; }
  const w = 280, h = 70, pad = 8;
  const maxM = 5, minM = 1;
  const pts = hist.map((m, i) => {
    const x = pad + (i / Math.max(1, hist.length - 1)) * (w - pad * 2);
    const y = h - pad - ((m.mood - minM) / (maxM - minM)) * (h - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${pts[pts.length-1][0]},${h} L${pts[0][0]},${h} Z`;
  chart.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#EA580C" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#EA580C" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#moodGrad)"/>
      <path d="${line}" fill="none" stroke="#EA580C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#EA580C"/>`).join('')}
    </svg>
  `;
}

function renderTaskList(filter = '') {
  const q = (filter || $('#taskSearch')?.value || '').toLowerCase().trim();
  let tasks = [...state.tasks].sort((a, b) => a.due.localeCompare(b.due));
  if (q) tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.workspace || '').toLowerCase().includes(q));

  const tbody = $('#taskTableBody');
  tbody.innerHTML = tasks.length ? tasks.map(t => `
    <tr data-id="${t.id}">
      <td>
        <span class="task-title">${escapeHtml(t.title)}</span>
        <span class="task-meta">${escapeHtml(t.division || t.workspace || '')}</span>
      </td>
      <td><span class="task-meta">${escapeHtml(t.workspace)}</span></td>
      <td class="col-center">${statusBadge(t)}</td>
      <td class="col-center">${dueBadge(t)}</td>
      <td class="col-center">${diffBadge(t.difficulty)}</td>
    </tr>
  `).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:1.5rem">Tidak ada tugas.</td></tr>';

  tbody.querySelectorAll('tr[data-id]').forEach(tr => {
    tr.addEventListener('click', () => openTaskDetail(tr.dataset.id));
  });

  // Mobile cards
  const cards = $('#taskCards');
  cards.innerHTML = tasks.map(t => `
    <div class="task-card" data-id="${t.id}">
      <div class="task-card-title">${escapeHtml(t.title)}</div>
      <div class="task-card-badges">
        ${statusBadge(t)}
        ${dueBadge(t)}
      </div>
    </div>
  `).join('');
  cards.querySelectorAll('.task-card').forEach(c => {
    c.addEventListener('click', () => openTaskDetail(c.dataset.id));
  });
}

function renderDeadlines() {
  const list = $('#deadlineList');
  const upcoming = state.tasks
    .filter(t => t.status !== 'done' && daysBetween(todayStr(), t.due) >= 0 && daysBetween(todayStr(), t.due) <= 7)
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 5);

  if (!upcoming.length) {
    list.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted)">Tidak ada tenggat dalam 7 hari.</p>';
    return;
  }
  list.innerHTML = upcoming.map(t => {
    const d = new Date(t.due + 'T00:00:00');
    const day = d.getDate();
    const dow = d.toLocaleDateString('id-ID', { weekday: 'short' });
    return `
      <div class="deadline-item">
        <div class="deadline-date"><span class="day">${day}</span><span class="dow">${dow}</span></div>
        <div class="deadline-info">
          <div class="title">${escapeHtml(t.title)}</div>
          <div class="ctx">${escapeHtml(t.workspace || t.division || '')}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderActivity(container, items) {
  if (!container) return;
  container.innerHTML = items.map(a => `
    <div class="activity-item">
      <div class="act-avatar">${initials(a.name)}</div>
      <div class="act-body">
        <div class="act-text"><strong>${escapeHtml(a.name)}</strong> ${escapeHtml(a.action)}</div>
        <div class="act-time">${timeAgo(a.time)}</div>
      </div>
    </div>
  `).join('') || '<p style="font-size:0.85rem;color:var(--text-muted)">Belum ada aktivitas.</p>';
}

/* ── Workspaces ── */
function renderWorkspaces() {
  const grid = $('#wsGrid');
  grid.innerHTML = state.workspaces.map(w => `
    <div class="ws-card" data-id="${w.id}">
      <div class="ws-card-top">
        <div>
          <div class="ws-card-name">${escapeHtml(w.name)}</div>
          <div class="ws-card-meta">${w.members} anggota · ${escapeHtml(w.mentor)}</div>
        </div>
        <span class="badge ${w.role === 'Mentor' ? 'badge-mentor' : 'badge-role'}">${w.role}</span>
      </div>
      <div>
        <div class="ws-progress"><div class="ws-progress-fill" style="width:${w.progress}%"></div></div>
        <div class="ws-progress-text">${w.progress}% selesai · ${w.waiting} tugas menunggu kamu</div>
      </div>
      <div class="ws-card-foot">
        <span class="ws-code">KODE ${w.code}</span>
        <button class="btn btn-outline btn-sm open-ws-btn" data-id="${w.id}">Buka ruang</button>
      </div>
    </div>
  `).join('') + `
    <div class="ws-card ws-join-card">
      <h3>Punya kode undangan?</h3>
      <p>Masukkan 6 karakter dari mentormu.</p>
      <div class="ws-join-form">
        <input type="text" id="inlineJoinCode" maxlength="6" class="code-input" placeholder="K7M2QX" />
        <button class="btn btn-primary btn-sm" id="inlineJoinBtn">Gabung</button>
      </div>
    </div>
  `;

  grid.querySelectorAll('.open-ws-btn').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      openWorkspace(b.dataset.id);
    });
  });
  grid.querySelectorAll('.ws-card[data-id]').forEach(c => {
    c.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      openWorkspace(c.dataset.id);
    });
  });
  $('#inlineJoinBtn')?.addEventListener('click', () => {
    const code = $('#inlineJoinCode').value.trim().toUpperCase();
    if (code.length === 6) tryJoinWorkspace(code);
    else toast('Kode harus 6 karakter', 'error');
  });
}

function openWorkspace(id) {
  const ws = state.workspaces.find(w => w.id === id);
  if (!ws) return;
  state.currentWorkspaceId = id;
  saveState();
  navigate('workspace-detail', {
    name: ws.name,
    info: `${ws.members} anggota · Mentor: ${ws.mentor} · Kode ${ws.code}`
  });
}

/* ── Workspace Detail ── */
function renderWorkspaceDetail() {
  const ws = state.workspaces.find(w => w.id === state.currentWorkspaceId);
  if (!ws) { navigate('workspaces'); return; }

  $('#wsDetailName').textContent = ws.name;
  $('#wsDetailInfo').textContent = `${ws.members} anggota · Mentor: ${ws.mentor} · Kode ${ws.code}`;

  // Daily goal
  if (state.goalDate === todayStr() && state.dailyGoal) {
    $('#goalDisplay').textContent = state.dailyGoal;
    $('#dailyGoalInput').value = '';
  } else {
    $('#goalDisplay').textContent = '';
  }

  renderWsTasks();
  renderCalendar();
  renderActivity($('#wsActivityList'), state.activities);
  renderActivity($('#sideActivityList'), state.activities.slice(0, 4));
  renderAnnouncements();
  renderTeam();
  renderMiniCal();
}

function renderWsTasks(filter = '') {
  const q = (filter || $('#wsTaskSearch')?.value || '').toLowerCase().trim();
  const ws = state.workspaces.find(w => w.id === state.currentWorkspaceId);
  let tasks = state.tasks.filter(t => t.workspace === ws?.name);
  if (q) tasks = tasks.filter(t => t.title.toLowerCase().includes(q));
  tasks.sort((a, b) => a.due.localeCompare(b.due));

  const tbody = $('#wsTaskTableBody');
  tbody.innerHTML = tasks.length ? tasks.map(t => `
    <tr data-id="${t.id}">
      <td><span class="task-title">${escapeHtml(t.title)}</span></td>
      <td class="col-center">${statusBadge(t)}</td>
      <td class="col-center">${dueBadge(t)}</td>
      <td class="col-center">${diffBadge(t.difficulty)}</td>
    </tr>
  `).join('') : '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:1.5rem">Belum ada tugas di ruang ini.</td></tr>';

  tbody.querySelectorAll('tr[data-id]').forEach(tr => {
    tr.addEventListener('click', () => openTaskDetail(tr.dataset.id));
  });

  const cards = $('#wsTaskCards');
  cards.innerHTML = tasks.map(t => `
    <div class="task-card" data-id="${t.id}">
      <div class="task-card-title">${escapeHtml(t.title)}</div>
      <div class="task-card-badges">${statusBadge(t)} ${dueBadge(t)}</div>
    </div>
  `).join('');
  cards.querySelectorAll('.task-card').forEach(c => {
    c.addEventListener('click', () => openTaskDetail(c.dataset.id));
  });
}

function renderCalendar() {
  const grid = $('#calGrid');
  if (!grid) return;
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  $('#calTitle').textContent = calMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const today = todayStr();
  const ws = state.workspaces.find(w => w.id === state.currentWorkspaceId);
  const tasks = state.tasks.filter(t => t.workspace === ws?.name && t.endDate || t.due);
  const byDay = {};
  tasks.forEach(t => {
    const key = t.due || t.endDate;
    if (key) (byDay[key] = byDay[key] || []).push(t);
  });

  let html = '<div class="cal-cell empty"></div>'.repeat(offset);
  for (let d = 1; d <= days; d++) {
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const list = byDay[key] || [];
    const isToday = key === today;
    html += `<div class="cal-cell ${isToday ? 'today' : ''} ${list.length ? 'has-task' : ''}">
      <span class="cal-day">${d}</span>
      ${list.slice(0, 2).map(t => `<button type="button" class="cal-chip" data-id="${t.id}">${escapeHtml(t.title)}</button>`).join('')}
      ${list.length > 2 ? `<span style="font-size:0.6rem;color:var(--text-muted);padding:0 3px">+${list.length-2}</span>` : ''}
    </div>`;
  }
  grid.innerHTML = html;
  grid.querySelectorAll('.cal-chip').forEach(c => {
    c.addEventListener('click', () => openTaskDetail(c.dataset.id));
  });
}

function renderMiniCal() {
  const el = $('#miniCal');
  if (!el) return;
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const today = todayStr();
  const ws = state.workspaces.find(w => w.id === state.currentWorkspaceId);
  const dueSet = new Set(state.tasks.filter(t => t.workspace === ws?.name).map(t => t.due));
  let html = '';
  for (let d = 1; d <= days; d++) {
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const cls = key === today ? 'today' : dueSet.has(key) ? 'has' : '';
    html += `<div class="mini-cal-day ${cls}">${d}</div>`;
  }
  el.innerHTML = html;
}

function renderAnnouncements() {
  const list = $('#announceList');
  const side = $('#sideAnnounceList');
  const wsId = state.currentWorkspaceId;
  const items = state.announcements.filter(a => a.workspaceId === wsId || !a.workspaceId);
  const html = items.length ? items.map(a => `
    <article class="announce-item ${a.pinned ? 'pinned' : ''}">
      <h4>${a.pinned ? '📌 ' : ''}${escapeHtml(a.title)}</h4>
      <p>${escapeHtml(a.body)}</p>
      <small>${escapeHtml(a.by)} · ${timeAgo(a.time)}</small>
    </article>
  `).join('') : '<p style="font-size:0.85rem;color:var(--text-muted)">Belum ada pengumuman.</p>';
  if (list) list.innerHTML = html;
  if (side) side.innerHTML = items.slice(0, 2).map(a => `
    <div style="padding:0.5rem 0;border-bottom:1px solid var(--border-subtle);font-size:0.85rem">
      <strong>${escapeHtml(a.title)}</strong>
      <div style="color:var(--text-muted);font-size:0.75rem;margin-top:2px">${escapeHtml(a.by)} · ${timeAgo(a.time)}</div>
    </div>
  `).join('') || '<p style="font-size:0.8rem;color:var(--text-muted)">Kosong</p>';
}

function renderTeam() {
  const grid = $('#teamGrid');
  if (!grid) return;
  grid.innerHTML = state.members.map(m => `
    <div class="team-card">
      <div class="team-avatar">${initials(m.name)}</div>
      <div class="team-info">
        <div class="name">${escapeHtml(m.name)}</div>
        <div class="meta">${m.role} · ${escapeHtml(m.division)}</div>
      </div>
    </div>
  `).join('');
}

/* ── Notifications ── */
function renderNotifications() {
  updateNotifBadges();
  const list = $('#notifList');
  list.innerHTML = state.notifications.length ? state.notifications.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
      <div class="notif-body">
        <div class="notif-title">${escapeHtml(n.title)}</div>
        <div class="notif-text">${escapeHtml(n.body)}</div>
        <div class="notif-time">${timeAgo(n.time)}</div>
      </div>
    </div>
  `).join('') : '<p style="color:var(--text-muted);padding:1rem 0">Tidak ada notifikasi.</p>';

  list.querySelectorAll('.notif-item').forEach(el => {
    el.addEventListener('click', () => {
      const n = state.notifications.find(x => x.id === el.dataset.id);
      if (n) { n.read = true; saveState(); renderNotifications(); }
    });
  });
}

function updateNotifBadges() {
  const count = state.notifications.filter(n => !n.read).length;
  ['#notifBadge', '#notifTopBadge', '#bottomNotifBadge'].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    el.textContent = count;
    el.classList.toggle('hidden', count === 0);
  });
}

/* ── Account ── */
function renderAccount() {
  $('#accountName').value = state.user.name;
  $('#accountEmail').value = state.user.email;
  $$('.theme-option').forEach(b => b.classList.toggle('active', b.dataset.theme === state.theme));
}

/* ── Task Detail Modal ── */
function openTaskDetail(id) {
  const t = state.tasks.find(x => x.id === id);
  if (!t) return;
  $('#taskDetailTitle').textContent = t.title;
  $('#taskDetailBody').innerHTML = `
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem">
      ${statusBadge(t)} ${dueBadge(t)} ${diffBadge(t.difficulty)}
    </div>
    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.75rem">
      ${escapeHtml(t.workspace)}${t.division ? ' · ' + escapeHtml(t.division) : ''}
    </p>
    <p style="font-size:0.9rem;margin-bottom:1rem">Tenggat: <strong>${fmtDate(t.due)}</strong></p>
    ${t.revision ? '<div style="background:var(--warning-bg);border:1px solid var(--warning-border);border-radius:8px;padding:0.75rem;margin-bottom:1rem;font-size:0.85rem;color:var(--warning)"><strong>Catatan revisi</strong><p style="color:var(--text);margin-top:0.3rem">Perbaiki bagian layout yang masih belum sesuai mockup.</p></div>' : ''}
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      ${t.status !== 'done' ? `<button class="btn btn-primary btn-sm" id="markDoneBtn">Tandai selesai</button>` : ''}
      <button class="btn btn-ghost btn-sm" data-close="taskDetailModal">Tutup</button>
    </div>
  `;
  $('#taskDetailModal').classList.remove('hidden');
  $('#markDoneBtn')?.addEventListener('click', () => {
    t.status = 'done';
    saveState();
    $('#taskDetailModal').classList.add('hidden');
    toast('Tugas ditandai selesai', 'success');
    renderDashboard();
    if (state.currentWorkspaceId) renderWsTasks();
  });
}

/* ── Modals helpers ── */
function openModal(id) { $(`#${id}`)?.classList.remove('hidden'); }
function closeModal(id) { $(`#${id}`)?.classList.add('hidden'); }

function askConfirm(message, title = 'Konfirmasi') {
  return new Promise(resolve => {
    confirmResolve = resolve;
    $('#confirmTitle').textContent = title;
    $('#confirmMessage').textContent = message;
    openModal('confirmModal');
  });
}

/* ── Workspace create / join ── */
function tryJoinWorkspace(code) {
  const ws = state.workspaces.find(w => w.code === code.toUpperCase());
  if (ws) {
    toast(`Berhasil bergabung ke ${ws.name}`, 'success');
    closeModal('joinWsModal');
    openWorkspace(ws.id);
  } else {
    // Demo: create a temporary one
    toast('Kode tidak ditemukan. Coba kode yang ada di kartu ruang kerja.', 'error');
  }
}

/* ── Events ── */
function setupEvents() {
  // Nav
  $$('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });
  $('#backBtn')?.addEventListener('click', () => navigate('workspaces'));
  $('#profileBtn')?.addEventListener('click', () => navigate('account'));
  $('#notifTopBtn')?.addEventListener('click', () => navigate('notifications'));

  // Theme
  $$('.theme-btn, .theme-option').forEach(b => {
    b.addEventListener('click', () => applyTheme(b.dataset.theme));
  });

  // Search
  $('#taskSearch')?.addEventListener('input', e => renderTaskList(e.target.value));
  $('#wsTaskSearch')?.addEventListener('input', e => renderWsTasks(e.target.value));

  // Habits
  $('#addHabitBtn')?.addEventListener('click', () => openModal('addHabitModal'));
  $('#addHabitForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#habitName').value.trim();
    if (!name) return;
    state.habits.push({ id: uid(), name, streak: 0, longest: 0, doneToday: false });
    saveState();
    closeModal('addHabitModal');
    e.target.reset();
    renderHabits();
    toast('Kebiasaan ditambahkan', 'success');
  });

  // Mood
  $$('.mood-btn').forEach(b => {
    b.addEventListener('click', () => {
      selectedMood = Number(b.dataset.mood);
      $$('.mood-btn').forEach(x => x.classList.toggle('selected', Number(x.dataset.mood) === selectedMood));
    });
  });
  $('#saveMoodBtn')?.addEventListener('click', () => {
    if (!selectedMood && !state.moodToday) {
      toast('Pilih mood dulu', 'error');
      return;
    }
    const mood = selectedMood || state.moodToday;
    state.moodToday = mood;
    state.moodNote = $('#moodNote').value.trim();
    const today = todayStr();
    const existing = state.moodHistory.find(m => m.date === today);
    if (existing) existing.mood = mood;
    else state.moodHistory.push({ date: today, mood });
    saveState();
    renderMood();
    toast('Mood hari ini disimpan', 'success');
  });

  // Daily goal
  $('#saveGoalBtn')?.addEventListener('click', () => {
    const goal = $('#dailyGoalInput').value.trim();
    if (!goal) { toast('Tulis target dulu', 'error'); return; }
    state.dailyGoal = goal;
    state.goalDate = todayStr();
    saveState();
    $('#goalDisplay').textContent = goal;
    $('#dailyGoalInput').value = '';
    toast('Target hari ini disimpan', 'success');
  });

  // Workspace tabs
  $$('.ws-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.ws-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      $$('.ws-tab-panel').forEach(p => p.classList.remove('active'));
      $(`#tab-${tab.dataset.tab}`)?.classList.add('active');
      if (tab.dataset.tab === 'calendar') renderCalendar();
    });
  });

  // Calendar nav
  $('#calPrev')?.addEventListener('click', () => {
    calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  $('#calNext')?.addEventListener('click', () => {
    calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
    renderCalendar();
  });
  $('#calToday')?.addEventListener('click', () => {
    calMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    renderCalendar();
  });

  // Create / Join workspace
  $('#createWsBtn')?.addEventListener('click', () => openModal('createWsModal'));
  $('#joinWsBtn')?.addEventListener('click', () => openModal('joinWsModal'));
  $('#createWsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#newWsName').value.trim();
    const code = $('#newWsCode').value.trim().toUpperCase();
    if (code.length !== 6) { toast('Kode harus 6 karakter', 'error'); return; }
    if (state.workspaces.some(w => w.code === code)) { toast('Kode sudah dipakai', 'error'); return; }
    const ws = {
      id: uid(), name, members: 1, mentor: state.user.name,
      role: 'Mentor', code, progress: 0, waiting: 0
    };
    state.workspaces.unshift(ws);
    saveState();
    closeModal('createWsModal');
    e.target.reset();
    toast(`Ruang "${name}" dibuat`, 'success');
    renderWorkspaces();
  });
  $('#joinWsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    tryJoinWorkspace($('#joinCode').value.trim());
  });

  // Announce
  $('#announceForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const title = $('#announceTitle').value.trim();
    const body = $('#announceBody').value.trim();
    if (!title || !body) return;
    state.announcements.unshift({
      id: uid(), title, body, by: state.user.name,
      time: new Date().toISOString(), pinned: false,
      workspaceId: state.currentWorkspaceId
    });
    saveState();
    e.target.reset();
    renderAnnouncements();
    toast('Pengumuman terkirim', 'success');
  });

  // Account
  $('#accountForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#accountName').value.trim();
    if (!name) return;
    state.user.name = name;
    saveState();
    $('#userName').textContent = name;
    $('#userAvatar').textContent = initials(name);
    toast('Profil diperbarui', 'success');
  });

  $('#resetDataBtn')?.addEventListener('click', async () => {
    const ok = await askConfirm('Semua data lokal akan dihapus dan dikembalikan ke data awal. Lanjutkan?', 'Reset data');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultData();
    saveState();
    applyTheme(state.theme);
    navigate('dashboard');
    toast('Data direset', 'info');
  });

  // Mark all read
  $('#markAllReadBtn')?.addEventListener('click', () => {
    state.notifications.forEach(n => n.read = true);
    saveState();
    renderNotifications();
    toast('Semua ditandai dibaca', 'success');
  });

  // Logout (demo)
  $('#logoutBtn')?.addEventListener('click', async () => {
    const ok = await askConfirm('Keluar dari sesi ini? Data lokal tetap tersimpan.', 'Keluar');
    if (ok) toast('Demo: kamu tetap di aplikasi (tidak ada backend auth)', 'info');
  });

  // Modal close
  $$('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  $$('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) {
        if (m.id === 'confirmModal') {
          closeModal('confirmModal');
          if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
        } else m.classList.add('hidden');
      }
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      $$('.modal:not(.hidden)').forEach(m => {
        if (m.id === 'confirmModal') {
          closeModal('confirmModal');
          if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
        } else m.classList.add('hidden');
      });
    }
  });

  $('#confirmOk')?.addEventListener('click', () => {
    closeModal('confirmModal');
    if (confirmResolve) { confirmResolve(true); confirmResolve = null; }
  });
  $('#confirmCancel')?.addEventListener('click', () => {
    closeModal('confirmModal');
    if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
  });
}

/* ── Init ── */
function init() {
  loadState();
  applyTheme(state.theme);
  $('#userName').textContent = state.user.name;
  $('#userAvatar').textContent = initials(state.user.name);
  $('#userRole').textContent = state.user.role;
  selectedMood = state.moodToday;
  setupEvents();
  updateNotifBadges();
  navigate('dashboard');
}

init();
