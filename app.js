const APP_KEY = 'joinbite_room_';
const ACTIVE_KEY = 'joinbite_active_room';
const PROFILE_KEY = id => `joinbite_profile_${id}`;

const CUISINES = ['火鍋', '日式', '韓式', '義式', '美式', '台式', '燒肉', '咖啡廳', '都可以'];
const RESTRICTIONS = ['不吃牛', '不吃豬', '不吃生食', '不吃辣', '素食', '無限制'];
const BUDGETS = [
  { value: 400, label: '$', sub: 'NT$200–400' },
  { value: 600, label: '$$', sub: 'NT$400–600' },
  { value: 1000, label: '$$$', sub: 'NT$600–1,000' },
  { value: 99999, label: '不限', sub: '都可以' },
];

const img = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`;
const mapsUrl = (name, address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`;
const priceLabel = restaurant => restaurant.priceRange || restaurant.price;
const ALL_SUPPORT = ['不吃牛', '不吃豬', '不吃生食', '不吃辣', '素食'];
const RESTAURANTS = [
  { id:'daan-pot', name:'肉多多火鍋 古亭旗艦店', cuisine:'火鍋', priceMax:600, priceRange:'NT$400–600', rating:4.2, area:'大安區', address:'台北市大安區羅斯福路二段79號3樓', image:img('photo-1569718212165-3a8278d5f624'), supports:ALL_SUPPORT, verified:true },
  { id:'daan-pot-2', name:'石二鍋 台北信義店', cuisine:'火鍋', priceMax:400, priceRange:'NT$200–400', rating:4.1, area:'大安區', address:'台北市大安區信義路二段72號1樓', image:img('photo-1547592180-85f173990554'), supports:ALL_SUPPORT, verified:true },
  { id:'daan-pot-3', name:'聚 日式鍋物 台北SOGO忠孝店', cuisine:'火鍋', priceMax:600, priceRange:'NT$400–600', rating:4.7, area:'大安區', address:'台北市大安區忠孝東路四段45號12樓', image:img('photo-1603894584373-5ac82b2ae398'), supports:ALL_SUPPORT, verified:true },
  { id:'daan-sushi', name:'小春日和', cuisine:'日式', priceMax:520, price:'$$', rating:4.6, area:'大安區', distance:620, address:'台北市大安區延吉街 137 巷 6 號', image:img('photo-1579871494447-9811cf80d66c'), supports:ALL_SUPPORT },
  { id:'daan-pasta', name:'日光小巷', cuisine:'義式', priceMax:480, price:'$$', rating:4.5, area:'大安區', distance:380, address:'台北市大安區忠孝東路四段 216 巷 27 弄 8 號', image:img('photo-1473093295043-cdd812d0e601'), supports:ALL_SUPPORT },
  { id:'daan-korean', name:'首爾餐桌', cuisine:'韓式', priceMax:420, price:'$$', rating:4.4, area:'大安區', distance:710, address:'台北市大安區光復南路 280 巷 25 號', image:img('photo-1498654896293-37aacf113fd9'), supports:['不吃牛','不吃豬','不吃生食','素食'] },
  { id:'daan-taiwan', name:'巷口好食', cuisine:'台式', priceMax:280, price:'$', rating:4.6, area:'大安區', distance:260, address:'台北市大安區復興南路一段 107 巷 5 弄 2 號', image:img('photo-1541544741938-0af808871cc0'), supports:ALL_SUPPORT },
  { id:'daan-cafe', name:'留白咖啡', cuisine:'咖啡廳', priceMax:300, price:'$', rating:4.8, area:'大安區', distance:520, address:'台北市大安區泰順街 16 巷 4 號', image:img('photo-1501339847302-ac426a4a7cbb'), supports:ALL_SUPPORT },
  { id:'xinyi-pot', name:'石研室 微風南山店', cuisine:'火鍋', priceMax:400, priceRange:'NT$200–400', rating:4.4, area:'信義區', address:'台北市信義區松智路17號B2樓', image:img('photo-1569718212165-3a8278d5f624'), supports:ALL_SUPPORT, verified:true },
  { id:'xinyi-pot-2', name:'海底撈火鍋 信義店', cuisine:'火鍋', priceMax:1200, priceRange:'NT$800–1,200', rating:4.5, area:'信義區', address:'台北市信義區松壽路12號6樓', image:img('photo-1547592180-85f173990554'), supports:ALL_SUPPORT, verified:true },
  { id:'xinyi-pot-3', name:'橘色涮涮屋 A9館', cuisine:'火鍋', priceMax:3000, priceRange:'NT$1,600–3,000', rating:4.4, area:'信義區', address:'台北市信義區松壽路9號7樓', image:img('photo-1603894584373-5ac82b2ae398'), supports:ALL_SUPPORT, verified:true },
  { id:'xinyi-burger', name:'Good Day Burger', cuisine:'美式', priceMax:390, price:'$$', rating:4.5, area:'信義區', distance:550, address:'台北市信義區松高路 19 號', image:img('photo-1568901346375-23c9450c58cd'), supports:ALL_SUPPORT },
  { id:'xinyi-yaki', name:'炙間燒肉', cuisine:'燒肉', priceMax:980, price:'$$$', rating:4.8, area:'信義區', distance:680, address:'台北市信義區忠孝東路五段 68 號', image:img('photo-1529692236671-f1f6cf9683ba'), supports:['不吃牛','不吃豬','不吃生食','不吃辣'] },
  { id:'xinyi-pasta', name:'橄欖樹餐桌', cuisine:'義式', priceMax:560, price:'$$', rating:4.6, area:'信義區', distance:420, address:'台北市信義區基隆路一段 147 巷 5 弄 9 號', image:img('photo-1473093295043-cdd812d0e601'), supports:ALL_SUPPORT },
  { id:'xinyi-taiwan', name:'禾日食堂', cuisine:'台式', priceMax:290, price:'$', rating:4.4, area:'信義區', distance:320, address:'台北市信義區吳興街 118 巷 16 弄 3 號', image:img('photo-1541544741938-0af808871cc0'), supports:ALL_SUPPORT },
  { id:'xinyi-cafe', name:'午後製造所', cuisine:'咖啡廳', priceMax:280, price:'$', rating:4.7, area:'信義區', distance:740, address:'台北市信義區逸仙路 42 巷 12 號', image:img('photo-1501339847302-ac426a4a7cbb'), supports:ALL_SUPPORT },
  { id:'zhongshan-sushi', name:'魚町食事', cuisine:'日式', priceMax:590, price:'$$', rating:4.8, area:'中山區', distance:340, address:'台北市中山區中山北路二段 20 巷 1 號', image:img('photo-1579871494447-9811cf80d66c'), supports:ALL_SUPPORT },
  { id:'zhongshan-korean', name:'小首爾飯桌', cuisine:'韓式', priceMax:380, price:'$$', rating:4.6, area:'中山區', distance:490, address:'台北市中山區南京西路 18 巷 6 號', image:img('photo-1498654896293-37aacf113fd9'), supports:ALL_SUPPORT },
  { id:'zhongshan-pot', name:'青花驕麻辣鍋 台北中山北店', cuisine:'火鍋', priceMax:800, priceRange:'NT$600–800', rating:4.5, area:'中山區', address:'台北市中山區中山北路一段137號', image:img('photo-1569718212165-3a8278d5f624'), supports:ALL_SUPPORT, verified:true },
  { id:'zhongshan-pot-2', name:'這一鍋皇室祕藏鍋物 台北吉林殿', cuisine:'火鍋', priceMax:800, priceRange:'NT$600–800', rating:4.7, area:'中山區', address:'台北市中山區吉林路190號', image:img('photo-1547592180-85f173990554'), supports:ALL_SUPPORT, verified:true },
  { id:'zhongshan-pot-3', name:'聚 日式鍋物 台北南京東店', cuisine:'火鍋', priceMax:600, priceRange:'NT$400–600', rating:4.6, area:'中山區', address:'台北市中山區南京東路二段72號B1樓', image:img('photo-1603894584373-5ac82b2ae398'), supports:ALL_SUPPORT, verified:true },
  { id:'zhongshan-taiwan', name:'島嶼小吃', cuisine:'台式', priceMax:260, price:'$', rating:4.7, area:'中山區', distance:290, address:'台北市中山區民生東路一段 29 號', image:img('photo-1541544741938-0af808871cc0'), supports:ALL_SUPPORT },
  { id:'zhongshan-pasta', name:'麵日子', cuisine:'義式', priceMax:450, price:'$$', rating:4.4, area:'中山區', distance:650, address:'台北市中山區雙城街 17 巷 8 號', image:img('photo-1473093295043-cdd812d0e601'), supports:ALL_SUPPORT },
  { id:'zhongshan-cafe', name:'日日咖啡所', cuisine:'咖啡廳', priceMax:290, price:'$', rating:4.7, area:'中山區', distance:410, address:'台北市中山區長安西路 19 巷 2 弄 5 號', image:img('photo-1501339847302-ac426a4a7cbb'), supports:ALL_SUPPORT },
];

const SEED_PREFERENCES = [
  { budgetMax:600, cuisines:['日式','火鍋'], restrictions:['不吃生食'] },
  { budgetMax:600, cuisines:['火鍋','台式'], restrictions:['無限制'] },
  { budgetMax:1000, cuisines:['日式','義式'], restrictions:['不吃牛'] },
  { budgetMax:600, cuisines:['都可以'], restrictions:['不吃辣'] },
];

const $ = selector => document.querySelector(selector);
const app = $('#app');
let screen = 'home';
let room = null;
let currentParticipantId = null;
let draftPreference = { budgetMax:600, cuisines:[], restrictions:[] };
let selectedRestaurantId = null;
let toastTimer = null;
let remote = null;
let loading = false;

const icons = {
  bowl: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M7 20h10M8 7c-1-2 1-3 0-5M13 7c-1-2 1-3 0-5M18 7c-1-2 1-3 0-5"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>`,
  calendar:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>`,
  pin:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  users:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

function escapeHTML(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function uid(prefix='id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`;
}

function isoDate(offset=1) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0,10);
}

function dateLabel(date) {
  if (!date) return '';
  const d = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat('zh-TW',{month:'long',day:'numeric',weekday:'short'}).format(d);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

class SupabaseStore {
  constructor(config) { this.config = config || {}; this.client = null; this.channel = null; }
  get enabled() { return Boolean(this.config.url && this.config.anonKey); }
  async init() {
    if (!this.enabled) return false;
    try {
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      this.client = createClient(this.config.url, this.config.anonKey);
      return true;
    } catch (error) {
      console.warn('Supabase unavailable; using local mode.', error);
      return false;
    }
  }
  async get(id) {
    if (!this.client) return null;
    const { data, error } = await this.client.from('prototype_rooms').select('state').eq('id',id).maybeSingle();
    if (error) { console.warn(error); return null; }
    return data?.state || null;
  }
  async save(state) {
    if (!this.client || !state) return;
    const { error } = await this.client.from('prototype_rooms').upsert({ id:state.id, state, updated_at:new Date().toISOString() });
    if (error) console.warn('Supabase save failed:', error.message);
  }
  subscribe(id, callback) {
    if (!this.client) return;
    if (this.channel) this.client.removeChannel(this.channel);
    this.channel = this.client.channel(`room:${id}`)
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'prototype_rooms',filter:`id=eq.${id}`}, payload => callback(payload.new.state))
      .subscribe();
  }
}

function localGet(id) {
  try { return JSON.parse(localStorage.getItem(APP_KEY + id)); } catch { return null; }
}

async function persist() {
  if (!room) return;
  room.updatedAt = new Date().toISOString();
  localStorage.setItem(APP_KEY + room.id, JSON.stringify(room));
  localStorage.setItem(ACTIVE_KEY, room.id);
  if (remote?.client) await remote.save(room);
}

function setProfile(id, participantId) {
  currentParticipantId = participantId;
  sessionStorage.setItem(PROFILE_KEY(id), participantId);
}

function getProfile(id) { return sessionStorage.getItem(PROFILE_KEY(id)); }
function currentParticipant() { return room?.participants.find(p => p.id === currentParticipantId); }
function isHost() { return currentParticipantId === room?.hostParticipantId; }

function shell(content, options={}) {
  const { back=null, step=null, hideBrand=false } = options;
  const right = remote?.client ? `<span class="connection cloud"><i></i> Supabase</span>` : `<span class="connection"><i></i> 本機 Demo</span>`;
  return `<main class="app-shell">
    <div class="world-decor" aria-hidden="true"><i class="geo geo-circle"></i><i class="geo geo-triangle"></i><i class="geo geo-squiggle">〰</i></div>
    <header class="topbar">
      ${back ? `<button class="icon-button" data-action="${back}" aria-label="返回">${icons.back}</button>` : hideBrand ? '<span></span>' : `<button class="brand" data-action="home"><span class="brand-mark">${icons.bowl}</span><span>揪呷 <span class="brand-sub">JoinBite</span></span></button>`}
      ${step ? `<span class="micro">${step}</span>` : right}
    </header>
    ${content}
  </main>`;
}

function progress(step, total=4) {
  return `<div class="progress-wrap"><div class="progress-copy"><span>建立聚餐流程</span><span>Step ${step} of ${total}</span></div><div class="progress-track"><div class="progress-fill" style="width:${step/total*100}%"></div></div></div>`;
}

function eventSummary() {
  return `<div class="summary-card">
    <div class="event-title"><h3>${escapeHTML(room.title)}</h3><span class="host-badge">${escapeHTML(room.hostName)} 發起</span></div>
    <div class="detail-list">
      <div class="detail">${icons.calendar}<span>${dateLabel(room.date)}・${escapeHTML(room.time)}</span></div>
      <div class="detail">${icons.pin}<span>${escapeHTML(room.area)}</span></div>
      <div class="detail">${icons.users}<span>預計 ${room.expectedCount} 人（包含發起者）</span></div>
    </div>
  </div>`;
}

function renderHome() {
  const activeId = localStorage.getItem(ACTIVE_KEY);
  const active = activeId && localGet(activeId);
  app.innerHTML = shell(`<section class="page home">
    <span class="eyebrow"><i class="eyebrow-dot"></i> 不用再問「都可以嗎？」</span>
    <div class="hero-copy"><h1>今晚吃什麼，<br><em>3 分鐘決定。</em></h1><p class="lead">收集大家的預算與口味，只留下真正適合的 3 間餐廳。</p></div>
    <div class="hero-visual">
      <i class="hero-spark spark-one" aria-hidden="true"></i><i class="hero-spark spark-two" aria-hidden="true"></i>
      <div class="plate"><svg class="hero-dish" viewBox="0 0 180 180" role="img" aria-label="一碗熱騰騰的麵">
        <path d="M42 83h96c-2 42-20 61-48 61S44 125 42 83Z" fill="#8B5CF6" stroke="#1E293B" stroke-width="5"/>
        <path d="M47 84c13 16 72 17 86 0" fill="#FBBF24" stroke="#1E293B" stroke-width="5"/>
        <path d="M65 71c8-12 5-22 0-30M91 70c-7-12 5-19 1-31M116 70c8-12 3-21-1-29" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>
        <circle cx="73" cy="88" r="13" fill="#fff" stroke="#1E293B" stroke-width="4"/><circle cx="73" cy="88" r="6" fill="#FBBF24"/>
        <path d="m109 77 17-14M111 83l24-8" stroke="#F472B6" stroke-width="7" stroke-linecap="round"/>
        <path d="M61 145h58" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>
      </svg></div>
      <div class="float-card one"><span class="avatar-dot">安</span><span>我想吃火鍋！</span></div>
      <div class="float-card two"><span class="check-dot">✓</span><span>5 人偏好已整理</span></div>
    </div>
    <div class="steps-row"><div class="mini-step"><strong>01</strong><span>填偏好</span></div><div class="mini-step"><strong>02</strong><span>看推薦</span></div><div class="mini-step"><strong>03</strong><span>一起投票</span></div></div>
    <div class="button-stack"><button class="btn btn-primary" data-action="create">建立一場聚餐 <span>→</span></button>${active ? `<button class="btn btn-secondary" data-action="resume" data-room="${active.id}">繼續「${escapeHTML(active.title)}」</button>`:''}</div>
    <p class="timer-note">免登入・免下載・朋友點連結就能加入</p>
    <div class="ticker" aria-hidden="true"><div>少一點「都可以」 ✦ 多一點「就這間」 ✦ 少一點「都可以」 ✦ 多一點「就這間」 ✦</div></div>
  </section>`);
}

function renderCreate() {
  app.innerHTML = shell(`<section class="page">
    ${progress(1)}
    <h2>先定好基本資料</h2><p class="lead">剩下的選擇，交給大家一起完成。</p>
    <form id="create-form">
      <div class="field"><label for="host">你的暱稱 <span class="required">*</span></label><input id="host" name="host" maxlength="12" placeholder="例如：小安" required /></div>
      <div class="field"><label for="title">聚餐名稱 <span class="required">*</span></label><input id="title" name="title" maxlength="28" value="週五下班吃飯" required /></div>
      <div class="field-grid"><div class="field"><label for="date">日期</label><input id="date" name="date" type="date" value="${isoDate(1)}" required /></div><div class="field"><label for="time">時間</label><input id="time" name="time" type="time" value="19:00" required /></div></div>
      <div class="field"><label for="area">聚餐區域</label><select id="area" name="area"><option>大安區</option><option>信義區</option><option>中山區</option></select></div>
      <div class="field"><label>預計參與人數</label><div class="counter"><button type="button" data-action="count-down" aria-label="減少">−</button><strong id="guest-count">5</strong><button type="button" data-action="count-up" aria-label="增加">＋</button></div><p class="micro" style="margin:7px 2px 0">包含你，建議 3–8 人</p></div>
      <div class="sticky-actions"><button class="btn btn-primary" type="submit">建立聚餐 <span>→</span></button></div>
    </form>
  </section>`, { back:'home', step:'Step 1 of 4' });
}

function buildRoom(form) {
  const data = new FormData(form);
  const id = uid('room');
  const hostId = uid('person');
  const count = Number($('#guest-count').textContent);
  const names = ['Mina','阿哲','小宇','Jessie','大可','Nina','Leo'];
  const participants = [{ id:hostId, nickname:String(data.get('host')).trim(), isHost:true, status:'joined', preference:null }];
  names.slice(0, Math.max(0,count-1)).forEach((name,index) => {
    const complete = index < Math.min(2,count-1);
    participants.push({ id:uid('demo'), nickname:name, isHost:false, isDemo:true, status:complete?'preference_completed':'joined', preference:complete?SEED_PREFERENCES[index]:null });
  });
  return {
    id, title:String(data.get('title')).trim(), date:data.get('date'), time:data.get('time'), area:data.get('area'), expectedCount:count,
    hostParticipantId:hostId, hostName:String(data.get('host')).trim(), status:'collecting', participants, candidates:[], votes:{}, eligibleVoters:[],
    createdAt:new Date().toISOString(), recommendationStartedAt:null, completedAt:null, updatedAt:new Date().toISOString(), events:[{type:'room_created',at:new Date().toISOString()}]
  };
}

function shareUrl() {
  const base = location.href.split('?')[0].split('#')[0];
  return `${base}?room=${encodeURIComponent(room.id)}`;
}

function renderShare() {
  app.innerHTML = shell(`<section class="page">
    ${progress(2)}
    <div class="success-orbit">🥢</div><div class="center"><h2>聚餐建立好了！</h2><p class="lead">把連結丟進群組，朋友不必登入就能加入。</p></div>
    ${eventSummary()}
    <div class="link-box"><span>🔗</span><span>${escapeHTML(shareUrl())}</span></div>
    <div class="button-stack"><button class="btn btn-line" data-action="line-share">分享到 LINE</button><button class="btn btn-secondary" data-action="copy-link">複製聚餐連結</button></div>
    <div class="sticky-actions"><button class="btn btn-primary" data-action="host-preference">下一步：填我的偏好 <span>→</span></button></div>
  </section>`, { back:'create', step:'Step 2 of 4' });
}

function renderJoin() {
  app.innerHTML = shell(`<section class="page">
    <span class="eyebrow"><i class="eyebrow-dot"></i> ${escapeHTML(room.hostName)} 邀請你一起吃飯</span>
    <div style="margin-top:22px"><h2>要一起吃嗎？</h2><p class="lead">輸入暱稱，20 秒選好你的偏好。</p></div>
    ${eventSummary()}
    <form id="join-form"><div class="field"><label for="nickname">你的暱稱 <span class="required">*</span></label><input id="nickname" name="nickname" maxlength="12" placeholder="大家認得你的名字" required autocomplete="nickname" /></div><div class="sticky-actions"><button class="btn btn-primary" type="submit">加入並選偏好 <span>→</span></button></div></form>
  </section>`);
}

function renderPreferences() {
  const person = currentParticipant();
  if (person?.preference) draftPreference = JSON.parse(JSON.stringify(person.preference));
  app.innerHTML = shell(`<section class="page">
    ${progress(2)}
    <h2>${escapeHTML(person?.nickname || '')}，想吃什麼？</h2><p class="lead">直覺選就好，可以複選。</p>
    <div class="section-heading"><h3>每人預算</h3><span class="micro">單選</span></div>
    <div class="budget-grid">${BUDGETS.map(b=>`<button class="budget-choice ${draftPreference.budgetMax===b.value?'selected':''}" data-budget="${b.value}"><strong>${b.label}</strong><small>${b.sub}</small></button>`).join('')}</div>
    <div class="section-heading"><h3>想吃的料理</h3><span class="micro">可複選</span></div>
    <div class="chips">${CUISINES.map(item=>`<button class="chip ${draftPreference.cuisines.includes(item)?'selected':''}" data-cuisine="${item}">${item}</button>`).join('')}</div>
    <div class="section-heading"><h3>不吃／飲食限制</h3><span class="micro">可複選</span></div>
    <div class="chips">${RESTRICTIONS.map(item=>`<button class="chip ${draftPreference.restrictions.includes(item)?'selected':''}" data-restriction="${item}">${item}</button>`).join('')}</div>
    <p class="timer-note">⏱ 大多數人可在 20 秒內完成</p>
    <div class="sticky-actions"><button class="btn btn-primary" data-action="save-preference" ${draftPreference.cuisines.length?'':'disabled'}>完成偏好 <span>→</span></button></div>
  </section>`, { back: person?.isHost ? 'share' : 'join', step:'Step 2 of 4' });
}

function renderLobby() {
  const completed = room.participants.filter(p=>p.preference).length;
  const joined = room.participants.length;
  const pendingSeats = Math.max(0, room.expectedCount-joined);
  app.innerHTML = shell(`<section class="page">
    <div class="room-hero"><span class="micro" style="color:rgba(255,255,255,.75)">聚餐等待室</span><h2>${escapeHTML(room.title)}</h2><div class="detail">${icons.calendar}<span>${dateLabel(room.date)}・${escapeHTML(room.time)}</span></div><div class="detail" style="margin-top:8px">${icons.pin}<span>${escapeHTML(room.area)}</span></div><div class="room-progress"><strong>${completed} / ${room.expectedCount}</strong><span>人已完成偏好</span></div><div class="room-progress-track"><span style="width:${Math.min(100,completed/room.expectedCount*100)}%"></span></div></div>
    <div class="section-heading"><h3>成員狀態</h3><button class="btn btn-soft btn-compact" data-action="copy-link">＋ 邀請朋友</button></div>
    <div class="card member-list">${room.participants.map(p=>`<div class="member"><div class="member-avatar ${p.preference?'done':''}">${escapeHTML(p.nickname.slice(0,1))}</div><div class="member-copy"><strong>${escapeHTML(p.nickname)} ${p.isHost?'<span class="micro">（發起者）</span>':''}</strong><span>${p.preference?'已完成偏好':'還在想吃什麼⋯'}</span></div><span class="status-icon ${p.preference?'':'wait'}">${p.preference?'✓':'…'}</span></div>`).join('')}${pendingSeats?`<div class="member"><div class="member-avatar">＋</div><div class="member-copy"><strong>還有 ${pendingSeats} 個名額</strong><span>等待朋友透過連結加入</span></div><span class="status-icon wait">…</span></div>`:''}</div>
    ${isHost() && room.participants.some(p=>p.isDemo&&!p.preference) ? `<div class="demo-panel"><strong>Prototype 模擬控制</strong><p>A 版以單機模擬朋友回覆，點一下讓下一位朋友完成偏好。</p><button class="btn btn-secondary btn-compact" data-action="simulate-preference">模擬朋友完成</button></div>`:''}
    <div class="sticky-actions">${isHost()?`<button class="btn btn-primary" data-action="start-recommendation" ${completed<2?'disabled':''}>開始推薦 3 間餐廳 <span>→</span></button>`:`<button class="btn btn-secondary" disabled>等待發起者開始推薦</button>`}</div>
  </section>`, { step:'Step 3 of 4' });
}

function chooseCandidates() {
  const voters = room.participants.filter(p=>p.preference);
  const maxBudget = Math.min(...voters.map(p=>p.preference.budgetMax));
  const restrictions = [...new Set(voters.flatMap(p=>p.preference.restrictions).filter(r=>r!=='無限制'))];
  const cuisineCounts = {};
  voters.forEach(p=>p.preference.cuisines.filter(c=>c!=='都可以').forEach(c=>cuisineCounts[c]=(cuisineCounts[c]||0)+1));
  const topCuisine = Object.entries(cuisineCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || null;
  const cuisinePool = topCuisine ? RESTAURANTS.filter(r=>r.cuisine===topCuisine) : RESTAURANTS;
  const fitsGroup = r => r.priceMax<=maxBudget && restrictions.every(rule=>r.supports.includes(rule));
  const nearby = cuisinePool.filter(r=>r.area===room.area && fitsGroup(r));
  const otherAreas = cuisinePool.filter(r=>r.area!==room.area && fitsGroup(r));
  const eligible = [...nearby, ...otherAreas];
  return eligible.map(r=>({
    ...r,
    matchCount:cuisineCounts[r.cuisine]||0,
    score:(cuisineCounts[r.cuisine]||0)*30+r.rating*3+(r.area===room.area?12:0),
  })).sort((a,b)=>b.score-a.score).slice(0,3);
}

function recommendationReason(restaurant) {
  const total = room.eligibleVoters.length;
  if (restaurant.matchCount>0) return `${total} 人中有 ${restaurant.matchCount} 人想吃${restaurant.cuisine}，也符合共同預算與飲食限制。`;
  return `位於${restaurant.area}，每人約 ${priceLabel(restaurant)}，符合共同預算與飲食限制。`;
}

function voteCount(id) { return Object.values(room.votes).filter(value=>value===id).length; }

function renderVote() {
  const voted = Object.keys(room.votes).length;
  const total = room.eligibleVoters.length;
  const myVote = room.votes[currentParticipantId];
  if (myVote) selectedRestaurantId = myVote;
  app.innerHTML = shell(`<section class="page">
    ${progress(3)}
    <h2>最適合你們的 ${room.candidates.length} 間</h2><p class="lead">條件都符合，現在憑直覺選一間。</p>
    <p class="data-note">📍 店名、地址與價位區間已校正；點「地圖」可直接核對 Google Maps 店家位置。</p>
    <div class="vote-summary"><div class="avatar-stack">${room.eligibleVoters.slice(0,5).map(id=>{const p=room.participants.find(x=>x.id===id);return `<span>${escapeHTML(p?.nickname.slice(0,1)||'?')}</span>`}).join('')}</div><span class="live-pill"><i></i>${voted} / ${total} 人已投票</span></div>
    ${myVote && isHost() && voted<total ? `<div class="demo-panel" style="margin:0 0 16px"><strong>你的票已送出</strong><p>繼續模擬朋友投票，即可看到最終結果。</p><button class="btn btn-secondary btn-compact" data-action="simulate-vote">模擬下一位投票</button></div>`:''}
    <div class="restaurant-list">${room.candidates.map((id,index)=>{const r=RESTAURANTS.find(x=>x.id===id);const selected=selectedRestaurantId===id;return `<article class="restaurant-card ${selected?'selected':''}" data-restaurant-card="${id}"><img class="restaurant-image" src="${r.image}" alt="${escapeHTML(r.name)}" /><span class="restaurant-rank">推薦 #${index+1}</span><span class="vote-badge">${voteCount(id)} 票</span><div class="restaurant-body"><div class="restaurant-title"><div><h3>${escapeHTML(r.name)}</h3><div class="restaurant-meta">${r.cuisine}・${priceLabel(r)}／人・${r.area}</div></div><strong>★ ${r.rating}</strong></div><p class="reason"><span>💡</span><span>${recommendationReason({...r,matchCount:room.candidateMeta?.[id]?.matchCount||0})}</span></p><div class="restaurant-actions"><button class="select-restaurant" data-choose="${id}">${selected?'✓ 已選這間':'選這間'}</button><a class="map-link" href="${r.mapsUrl||mapsUrl(r.name,r.address)}" target="_blank" rel="noopener" aria-label="在 Google Maps 查看 ${escapeHTML(r.name)}">地圖 ↗</a></div></div></article>`}).join('')}</div>
    <div class="sticky-actions"><button class="btn btn-primary" data-action="submit-vote" ${selectedRestaurantId?'':'disabled'}>${myVote?'更新我的選擇':'送出這一票'} <span>→</span></button></div>
  </section>`, { step:'Step 3 of 4' });
}

function winner() {
  const candidates = room.candidates.map(id=>({ id, votes:voteCount(id), score:room.candidateMeta?.[id]?.score||0 }));
  return candidates.sort((a,b)=>b.votes-a.votes || b.score-a.score)[0];
}

function durationText() {
  const seconds = Math.max(1,Math.round((new Date(room.completedAt)-new Date(room.createdAt))/1000));
  const minutes = Math.floor(seconds/60);
  return minutes ? `${minutes} 分 ${seconds%60} 秒` : `${seconds} 秒`;
}

function renderResult() {
  const win = winner();
  const r = RESTAURANTS.find(x=>x.id===win.id);
  const scores = room.candidates.map(id=>RESTAURANTS.find(x=>x.id===id)).sort((a,b)=>voteCount(b.id)-voteCount(a.id));
  app.innerHTML = shell(`<section class="page">
    ${progress(4)}
    <div class="confetti">${'<i></i>'.repeat(6)}</div><div class="center"><span class="eyebrow"><i class="eyebrow-dot"></i> 決定完成</span><h2 style="margin-top:14px">🎉 今天就吃這間！</h2><p class="small">不用再滑訊息，大家的選擇都在這裡。</p></div>
    <article class="winner-card"><div class="winner-image-wrap"><img class="winner-image" src="${r.image}" alt="${escapeHTML(r.name)}"><span class="winner-votes">${win.votes} / ${room.eligibleVoters.length} 票</span></div><div class="winner-body"><h2>${escapeHTML(r.name)}</h2><div class="restaurant-meta">${r.cuisine}・${priceLabel(r)}／人・★ ${r.rating}</div><div class="address">${icons.pin}<span>${escapeHTML(r.address)}</span></div><a class="btn btn-secondary" href="${r.mapsUrl||mapsUrl(r.name,r.address)}" target="_blank" rel="noopener">在 Google Maps 查看正確位置</a></div></article>
    <div class="time-card"><div class="time-icon">⏱</div><div><strong>你們只花了 ${durationText()}</strong><span>從建立聚餐到完成共同決定</span></div></div>
    <div class="section-heading"><h3>投票結果</h3><span class="micro">共 ${room.eligibleVoters.length} 票</span></div><div class="score-list">${scores.map((item,index)=>`<div class="score-item"><strong>#${index+1}</strong><img src="${item.image}" alt=""><span class="score-name">${escapeHTML(item.name)}</span><span class="score-count">${voteCount(item.id)} 票</span></div>`).join('')}</div>
    <div class="button-stack" style="margin-top:24px"><button class="btn btn-primary" data-action="share-result">分享結果</button><button class="btn btn-secondary" data-action="reset">再開一場聚餐</button></div>
  </section>`, { step:'Step 4 of 4' });
}

function renderEmpty() {
  app.innerHTML = shell(`<section class="page empty"><div class="empty-emoji">🍽️</div><h2>找不到這場聚餐</h2><p class="lead">連結可能已失效，請向發起者索取新的連結。</p><button class="btn btn-primary" data-action="home">回到首頁</button></section>`);
}

function renderLoading() { app.innerHTML = shell(`<div class="loading"><div><div class="spinner"></div><span>正在準備聚餐房間…</span></div></div>`,{hideBrand:true}); }

function render() {
  window.scrollTo({top:0,behavior:'instant'});
  if (loading) return renderLoading();
  if (screen==='home') return renderHome();
  if (screen==='create') return renderCreate();
  if (!room) return renderEmpty();
  if (screen==='share') return renderShare();
  if (screen==='join') return renderJoin();
  if (screen==='preferences') return renderPreferences();
  if (screen==='lobby') return renderLobby();
  if (screen==='vote') return renderVote();
  if (screen==='result') return renderResult();
  renderHome();
}

function go(next) { screen=next; render(); }

async function copyText(text, success='已複製連結') {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const area=document.createElement('textarea'); area.value=text; area.style.position='fixed'; area.style.opacity='0'; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
  }
  showToast(success);
}

async function startRecommendation() {
  const incomplete = room.participants.filter(p=>!p.preference).length;
  if (incomplete && !confirm(`還有 ${incomplete} 人未完成。現在開始後，他們的偏好不會納入這一輪推薦，確定要開始嗎？`)) return;
  const choices = chooseCandidates();
  room.candidates = choices.map(r=>r.id);
  room.candidateMeta = Object.fromEntries(choices.map(r=>[r.id,{score:r.score,matchCount:r.matchCount}]));
  room.eligibleVoters = room.participants.filter(p=>p.preference).map(p=>p.id);
  room.status='voting'; room.recommendationStartedAt=new Date().toISOString(); room.events.push({type:'recommendation_started',at:room.recommendationStartedAt});
  selectedRestaurantId=null;
  await persist(); go('vote');
}

async function finishDecision() {
  clearTimeout(toastTimer);
  $('#toast').classList.remove('show');
  room.status='completed'; room.completedAt=new Date().toISOString(); room.events.push({type:'decision_completed',at:room.completedAt});
  await persist(); go('result');
}

app.addEventListener('submit', async event => {
  event.preventDefault();
  if (event.target.id==='create-form') {
    room=buildRoom(event.target); setProfile(room.id,room.hostParticipantId); await persist();
    if (remote?.client) remote.subscribe(room.id, applyRemoteUpdate);
    history.replaceState({},'',`?room=${encodeURIComponent(room.id)}`); go('share');
  }
  if (event.target.id==='join-form') {
    const nickname=String(new FormData(event.target).get('nickname')).trim();
    const person={id:uid('person'),nickname,isHost:false,status:'joined',preference:null}; room.participants.push(person); setProfile(room.id,person.id); room.events.push({type:'participant_joined',at:new Date().toISOString()}); await persist(); go('preferences');
  }
});

app.addEventListener('click', async event => {
  const budget=event.target.closest('[data-budget]');
  if (budget) { draftPreference.budgetMax=Number(budget.dataset.budget); renderPreferences(); return; }
  const cuisine=event.target.closest('[data-cuisine]');
  if (cuisine) {
    const value=cuisine.dataset.cuisine;
    if (value==='都可以') draftPreference.cuisines=['都可以'];
    else { draftPreference.cuisines=draftPreference.cuisines.filter(x=>x!=='都可以'); draftPreference.cuisines=draftPreference.cuisines.includes(value)?draftPreference.cuisines.filter(x=>x!==value):[...draftPreference.cuisines,value]; }
    renderPreferences(); return;
  }
  const restriction=event.target.closest('[data-restriction]');
  if (restriction) {
    const value=restriction.dataset.restriction;
    if (value==='無限制') draftPreference.restrictions=['無限制'];
    else { draftPreference.restrictions=draftPreference.restrictions.filter(x=>x!=='無限制'); draftPreference.restrictions=draftPreference.restrictions.includes(value)?draftPreference.restrictions.filter(x=>x!==value):[...draftPreference.restrictions,value]; }
    renderPreferences(); return;
  }
  const choice=event.target.closest('[data-choose]');
  if (choice) { selectedRestaurantId=choice.dataset.choose; renderVote(); return; }
  const action=event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action==='home') { history.replaceState({},'',location.pathname); room=null; currentParticipantId=null; go('home'); }
  if (action==='create') go('create');
  if (action==='share') go('share');
  if (action==='join') go('join');
  if (action==='count-down' || action==='count-up') { const el=$('#guest-count'); const delta=action==='count-up'?1:-1; el.textContent=Math.max(3,Math.min(8,Number(el.textContent)+delta)); }
  if (action==='copy-link') copyText(shareUrl());
  if (action==='line-share') window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl())}`,'_blank','noopener');
  if (action==='host-preference') { draftPreference={budgetMax:600,cuisines:[],restrictions:[]}; go('preferences'); }
  if (action==='save-preference') {
    const person=currentParticipant(); if (!person) return;
    person.preference={...draftPreference,restrictions:draftPreference.restrictions.length?draftPreference.restrictions:['無限制']}; person.status='preference_completed'; room.events.push({type:'preference_completed',participantId:person.id,at:new Date().toISOString()}); await persist(); go('lobby');
  }
  if (action==='simulate-preference') {
    const person=room.participants.find(p=>p.isDemo&&!p.preference); if (!person) return;
    const index=room.participants.filter(p=>p.isDemo&&p.preference).length; person.preference=SEED_PREFERENCES[index%SEED_PREFERENCES.length]; person.status='preference_completed'; await persist(); renderLobby(); showToast(`${person.nickname} 已完成偏好`);
  }
  if (action==='start-recommendation') startRecommendation();
  if (action==='submit-vote') {
    if (!selectedRestaurantId) return; room.votes[currentParticipantId]=selectedRestaurantId; room.events.push({type:'vote_submitted',participantId:currentParticipantId,at:new Date().toISOString()}); await persist();
    if (Object.keys(room.votes).length>=room.eligibleVoters.length) finishDecision(); else { renderVote(); showToast('投票已送出'); }
  }
  if (action==='simulate-vote') {
    const next=room.eligibleVoters.find(id=>!room.votes[id]); if (!next) return;
    const castCount=Object.keys(room.votes).length; room.votes[next]=castCount%3===2?room.candidates[1]:room.candidates[0]; await persist();
    const person=room.participants.find(p=>p.id===next); showToast(`${person?.nickname||'朋友'} 已投票`);
    if (Object.keys(room.votes).length>=room.eligibleVoters.length) setTimeout(finishDecision,500); else renderVote();
  }
  if (action==='share-result') {
    const win=winner(); const restaurant=RESTAURANTS.find(r=>r.id===win.id); const text=`🎉 ${room.title} 決定吃「${restaurant.name}」！${win.votes}/${room.eligibleVoters.length} 票勝出。`;
    if (navigator.share) { try { await navigator.share({title:'揪呷聚餐結果',text,url:shareUrl()}); } catch {} } else copyText(`${text}\n${shareUrl()}`,'結果已複製');
  }
  if (action==='reset') {
    if (!confirm('要建立一場新的聚餐嗎？目前結果仍會保存在這台裝置。')) return;
    history.replaceState({},'',location.pathname); room=null; currentParticipantId=null; draftPreference={budgetMax:600,cuisines:[],restrictions:[]}; selectedRestaurantId=null; go('create');
  }
  if (action==='resume') {
    const id=event.target.closest('[data-room]').dataset.room; room=localGet(id); if (!room) return;
    currentParticipantId=getProfile(id)||room.hostParticipantId; history.replaceState({},'',`?room=${id}`); if (room.status==='completed') go('result'); else if (room.status==='voting') go('vote'); else go(currentParticipant()?.preference?'lobby':'preferences');
  }
});

function applyRemoteUpdate(next) {
  if (!next || next.id!==room?.id) return;
  if (new Date(next.updatedAt||0) <= new Date(room.updatedAt||0)) return;
  room=next; localStorage.setItem(APP_KEY+room.id,JSON.stringify(room));
  if (room.status==='completed') screen='result'; else if (room.status==='voting') screen='vote';
  render();
}

async function init() {
  remote=new SupabaseStore(window.JOINBITE_CONFIG?.supabase);
  await remote.init();
  const id=new URLSearchParams(location.search).get('room');
  if (!id) { renderHome(); return; }
  loading=true; render();
  room=(await remote.get(id)) || localGet(id);
  loading=false;
  if (!room) { renderEmpty(); return; }
  currentParticipantId=getProfile(id);
  if (remote.client) remote.subscribe(id,applyRemoteUpdate);
  if (!currentParticipantId) screen='join';
  else if (room.status==='completed') screen='result';
  else if (room.status==='voting') screen='vote';
  else screen=currentParticipant()?.preference?'lobby':'preferences';
  render();
}

init();
