(() => {
  'use strict';

  // ------------------------------------------------------------
  // Basic setup
  // ------------------------------------------------------------
  const W = 320, H = 192, T = 16;
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // ------------------------------------------------------------
  // Palette & sprite helpers
  // ------------------------------------------------------------
  const PAL = {
    B: '#1d1d2c', S: '#f6c9a0', R: '#e63946', J: '#3a5ba0', O: '#5a3a1e',
    H: '#f4a261', W: '#ffffff', G: '#5ad35a', g: '#2e8b3c', Y: '#ffd23f',
    y: '#d18f00', F: '#e63946', P: '#8a8a9a', K: '#1d1d2c',
  };

  function makeSprite(rows) {
    const h = rows.length, w = rows[0].length;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const col = PAL[rows[y][x]];
        if (!col) continue;
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }

  function flipSprite(src) {
    const c = document.createElement('canvas');
    c.width = src.width; c.height = src.height;
    const g = c.getContext('2d');
    g.translate(src.width, 0);
    g.scale(-1, 1);
    g.drawImage(src, 0, 0);
    return c;
  }

  const HERO_HEAD = [
    '....HHHHH...',
    '...HHHHHHH..',
    '...BSSSSSB..',
    '...BSKSSKB..',
    '...BSSSSSB..',
    '....SSSSS...',
  ];
  const HERO_BODY = [
    '..RRRRRRRR..',
    '.SRRRRRRRRS.',
    '.SRRRRRRRRS.',
    '..RRRRRRRR..',
  ];
  const HERO_LEGS_IDLE = [
    '...JJJJJJ...',
    '...JJJJJJ...',
    '...JJ..JJ...',
    '...JJ..JJ...',
    '..OOO..OOO..',
    '..OOO..OOO..',
  ];
  const HERO_LEGS_RUN1 = [
    '...JJJJJJ...',
    '...JJJJJJ...',
    '..JJ....JJ..',
    '.JJ......JJ.',
    'OOO......OOO',
    'OOO......OOO',
  ];
  const HERO_LEGS_RUN2 = [
    '...JJJJJJ...',
    '...JJJJJJ...',
    '....JJJJ....',
    '....JJJJ....',
    '...OOOOOO...',
    '...OOOOOO...',
  ];
  const HERO_JUMP = [
    '.S..HHHHH.S.',
    '.S.HHHHHHH.S',
    '.S.BSSSSSB.S',
    '.R.BSKSSKB.R',
    '.R.BSSSSSB.R',
    '.RR.SSSSS.RR',
    '..RRRRRRRR..',
    '..RRRRRRRR..',
    '..RRRRRRRR..',
    '..RRRRRRRR..',
    '...JJJJJJ...',
    '...JJJJJJ...',
    '..JJ....JJ..',
    '..OO....OO..',
    '..OOO..OOO..',
    '............',
  ];

  const SPR = {
    heroIdle: makeSprite([...HERO_HEAD, ...HERO_BODY, ...HERO_LEGS_IDLE]),
    heroRun1: makeSprite([...HERO_HEAD, ...HERO_BODY, ...HERO_LEGS_RUN1]),
    heroRun2: makeSprite([...HERO_HEAD, ...HERO_BODY, ...HERO_LEGS_RUN2]),
    heroJump: makeSprite(HERO_JUMP),
    slime1: makeSprite([
      '................',
      '................',
      '................',
      '................',
      '.....GGGGGG.....',
      '...GGGGGGGGGG...',
      '..GGGGGGGGGGGG..',
      '.GGGWGGGGGGWGGG.',
      '.GGGBGGGGGGBGGG.',
      '.GGGGGGGGGGGGGG.',
      '.gggggggggggggg.',
      '..gggggggggggg..',
    ]),
    slime2: makeSprite([
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '....GGGGGGGG....',
      '..GGGGGGGGGGGG..',
      '.GGGWGGGGGGWGGG.',
      '.GGGBGGGGGGBGGG.',
      'GGGGGGGGGGGGGGGG',
      'gggggggggggggggg',
    ]),
    slimeDead: makeSprite([
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '....GGGGGGGG....',
      '.GGGBGGGGGGBGGG.',
      'gggggggggggggggg',
    ]),
    coin: [
      makeSprite([
        '..YYYY..', '.YYyyYY.', 'YYyYYyYY', 'YYyYYyYY',
        'YYyYYyYY', 'YYyYYyYY', '.YYyyYY.', '..YYYY..',
      ]),
      makeSprite([
        '...YY...', '..YyyY..', '.YyYYyY.', '.YyYYyY.',
        '.YyYYyY.', '.YyYYyY.', '..YyyY..', '...YY...',
      ]),
      makeSprite([
        '...yy...', '...yy...', '...yy...', '...yy...',
        '...yy...', '...yy...', '...yy...', '...yy...',
      ]),
    ],
  };
  SPR.coin.push(SPR.coin[1]);
  for (const k of ['heroIdle', 'heroRun1', 'heroRun2', 'heroJump']) {
    SPR[k + 'L'] = flipSprite(SPR[k]);
  }
  SPR.slime1L = flipSprite(SPR.slime1);
  SPR.slime2L = flipSprite(SPR.slime2);

  // ------------------------------------------------------------
  // Tiny 3x5 bitmap font
  // ------------------------------------------------------------
  const FONT = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011',
    D: '110101101101110', E: '111100110100111', F: '111100110100100',
    G: '011100101101011', H: '101101111101101', I: '111010010010111',
    J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010',
    P: '110101110100100', Q: '010101101111011', R: '110101110101101',
    S: '011100010001110', T: '111010010010010', U: '101101101101111',
    V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111',
    0: '111101101101111', 1: '010110010010111', 2: '111001111100111',
    3: '111001111001111', 4: '101101111001001', 5: '111100111001111',
    6: '111100111101111', 7: '111001001001001', 8: '111101111101111',
    9: '111101111001111',
    ' ': '000000000000000', ':': '000010000010000', '-': '000000111000000',
    '!': '010010010000010', '.': '000000000000010', '/': '001001010100100',
    '>': '100010001010100', '<': '001010100010001', ',': '000000000010100',
    '+': '000010111010000', '(': '010100100100010', ')': '010001001001010',
  };

  function drawText(str, x, y, color, scale = 1) {
    str = String(str).toUpperCase();
    ctx.fillStyle = color;
    let cx = x;
    for (const ch of str) {
      const bits = FONT[ch] || FONT[' '];
      for (let i = 0; i < 15; i++) {
        if (bits[i] === '1') {
          ctx.fillRect(cx + (i % 3) * scale, y + Math.floor(i / 3) * scale, scale, scale);
        }
      }
      cx += 4 * scale;
    }
  }

  function textWidth(str, scale = 1) {
    return String(str).length * 4 * scale - scale;
  }

  function drawTextCentered(str, y, color, scale = 1) {
    drawText(str, Math.floor((W - textWidth(str, scale)) / 2), y, color, scale);
  }

  function drawTextShadow(str, x, y, color, scale = 1) {
    drawText(str, x + scale, y + scale, '#1d1d2c', scale);
    drawText(str, x, y, color, scale);
  }

  // ------------------------------------------------------------
  // Level
  // ------------------------------------------------------------
  // #: ground  =: brick  o: coin  e: slime  ^: spikes  P: player  F: flag
  const LEVEL_SRC = [
    '................................................................................',
    '................................................................................',
    '.....................................................o..........................',
    '.......................o.o.o........................===................o.o.o....',
    '..........o.o.........=====..............o.o.o................o.o.....=====.....',
    '.........=====......................o...=====...........o.o..=====..............',
    '................o.o.......o.o.....===...........o.o....=====..................F.',
    '...............=====.....=====..........e.....=====..........e.......o.o......##',
    '...P.....e..............................................^^.....e.....^^....e....',
    '###########################....###################....##########################',
    '###########################....###################....##########################',
    '###########################....###################....##########################',
  ];

  const level = {
    rows: 0, cols: 0, tiles: [], spawn: { x: 32, y: 96 },
    coins: [], enemies: [], flag: null,
  };

  function parseLevel(src) {
    level.rows = src.length;
    level.cols = Math.max(...src.map(r => r.length));
    level.tiles = [];
    level.coins = [];
    level.enemies = [];
    for (let y = 0; y < level.rows; y++) {
      const row = [];
      for (let x = 0; x < level.cols; x++) {
        const ch = src[y][x] || '.';
        switch (ch) {
          case 'P': level.spawn = { x: x * T + 3, y: y * T }; row.push('.'); break;
          case 'o': level.coins.push({ x: x * T + 4, y: y * T + 4, taken: false }); row.push('.'); break;
          case 'e': level.enemies.push({ x: x * T + 1, y: y * T + 4 }); row.push('.'); break;
          case 'F': level.flag = { x: x * T, y: y * T }; row.push('.'); break;
          default: row.push(ch);
        }
      }
      level.tiles.push(row);
    }
  }
  parseLevel(LEVEL_SRC);

  const tileAt = (tx, ty) => {
    if (ty < 0 || tx < 0 || tx >= level.cols) return '.';
    if (ty >= level.rows) return '.';
    return level.tiles[ty][tx];
  };
  const isSolid = ch => ch === '#' || ch === '=';

  // ------------------------------------------------------------
  // Audio (simple square-wave chiptune bleeps)
  // ------------------------------------------------------------
  let audioCtx = null;
  let muted = false;
  function initAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }
  function beep(freq, dur, type = 'square', vol = 0.08, slide = 0) {
    if (!audioCtx || muted) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const t0 = audioCtx.currentTime;
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(t0);
    o.stop(t0 + dur);
  }
  const SFX = {
    jump: () => beep(300, 0.15, 'square', 0.07, 300),
    coin: () => { beep(988, 0.08, 'square', 0.06); setTimeout(() => beep(1319, 0.14, 'square', 0.06), 70); },
    stomp: () => beep(200, 0.15, 'square', 0.08, -150),
    hurt: () => beep(180, 0.35, 'sawtooth', 0.08, -120),
    win: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.18, 'square', 0.07), i * 120)),
    gameover: () => [392, 349, 311, 262].forEach((f, i) => setTimeout(() => beep(f, 0.3, 'triangle', 0.09), i * 220)),
  };

  // ------------------------------------------------------------
  // Input
  // ------------------------------------------------------------
  const keys = { left: false, right: false, jump: false, start: false };
  let jumpPressed = false;   // edge trigger
  let startPressed = false;

  const KEYMAP = {
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'jump', KeyW: 'jump', Space: 'jump',
    Enter: 'start',
  };

  window.addEventListener('keydown', e => {
    initAudio();
    if (e.code === 'KeyM' && !e.repeat) { muted = !muted; return; }
    const k = KEYMAP[e.code];
    if (!k) return;
    e.preventDefault();
    if (!keys[k]) {
      if (k === 'jump') jumpPressed = true;
      if (k === 'start') startPressed = true;
    }
    keys[k] = true;
  });
  window.addEventListener('keyup', e => {
    const k = KEYMAP[e.code];
    if (!k) return;
    keys[k] = false;
  });

  // Touch buttons
  document.querySelectorAll('#touch button').forEach(btn => {
    const k = btn.dataset.key;
    const down = e => {
      e.preventDefault(); initAudio();
      if (!keys[k]) {
        if (k === 'jump') jumpPressed = true;
        if (k === 'start') startPressed = true;
      }
      keys[k] = true;
    };
    const up = e => { e.preventDefault(); keys[k] = false; };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('pointerleave', up);
  });
  canvas.addEventListener('pointerdown', () => { initAudio(); startPressed = true; });

  // ------------------------------------------------------------
  // Game state
  // ------------------------------------------------------------
  const G = {
    state: 'title',   // title | play | dead | over | win
    score: 0, lives: 3, time: 0, best: Number(localStorage.getItem('pixelquest.best') || 0),
    cam: 0, frame: 0, stateTimer: 0, shake: 0,
  };

  const player = {
    x: 0, y: 0, w: 10, h: 16, vx: 0, vy: 0,
    onGround: false, facing: 1, coyote: 0, jumpBuf: 0, inv: 0,
    anim: 0, safeX: 0, safeY: 0, safeTimer: 0,
  };
  let enemies = [];
  let coins = [];
  let particles = [];
  let floaters = [];

  const GRAVITY = 0.28, MAX_FALL = 5, RUN_SPEED = 1.5, ACCEL = 0.18, FRICTION = 0.75;
  const JUMP_V = -5.2, JUMP_CUT = -1.8, TIME_LIMIT = 150;

  function resetLevel() {
    coins = level.coins.map(c => ({ ...c, taken: false }));
    enemies = level.enemies.map(e => ({ x: e.x, y: e.y, w: 14, h: 8, vx: -0.45, vy: 0, dead: 0, alive: true, anim: Math.random() * 60 }));
    particles = []; floaters = [];
    G.time = TIME_LIMIT * 60;
    respawn(level.spawn.x, level.spawn.y);
    player.safeX = level.spawn.x; player.safeY = level.spawn.y;
    G.cam = 0;
  }

  function respawn(x, y) {
    player.x = x; player.y = y; player.vx = 0; player.vy = 0;
    player.onGround = false; player.facing = 1; player.inv = 90;
  }

  function newGame() {
    G.score = 0; G.lives = 3;
    resetLevel();
    G.state = 'play';
  }

  function loseLife() {
    G.lives--;
    SFX.hurt();
    G.shake = 12;
    if (G.lives <= 0) {
      G.state = 'over'; G.stateTimer = 0;
      SFX.gameover();
      saveBest();
    } else {
      G.state = 'dead'; G.stateTimer = 0;
    }
  }

  function saveBest() {
    if (G.score > G.best) {
      G.best = G.score;
      localStorage.setItem('pixelquest.best', String(G.best));
    }
  }

  function spawnParticles(x, y, color, n, spread = 2) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x, y, vx: (Math.random() - 0.5) * spread * 2, vy: -Math.random() * spread - 0.5,
        life: 20 + Math.random() * 20, color,
      });
    }
  }
  function floatText(text, x, y, color = '#ffffff') {
    floaters.push({ text, x, y, life: 40, color });
  }

  // ------------------------------------------------------------
  // Physics helpers
  // ------------------------------------------------------------
  function collides(x, y, w, h) {
    const x0 = Math.floor(x / T), x1 = Math.floor((x + w - 0.01) / T);
    const y0 = Math.floor(y / T), y1 = Math.floor((y + h - 0.01) / T);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (isSolid(tileAt(tx, ty))) return true;
      }
    }
    return false;
  }

  function touchesTile(x, y, w, h, ch) {
    const x0 = Math.floor(x / T), x1 = Math.floor((x + w - 0.01) / T);
    const y0 = Math.floor(y / T), y1 = Math.floor((y + h - 0.01) / T);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (tileAt(tx, ty) === ch) return true;
      }
    }
    return false;
  }

  // Move body with axis-separated tile collision
  function moveBody(b) {
    // horizontal
    b.x += b.vx;
    if (collides(b.x, b.y, b.w, b.h)) {
      if (b.vx > 0) b.x = Math.floor((b.x + b.w) / T) * T - b.w - 0.01;
      else if (b.vx < 0) b.x = Math.floor(b.x / T + 1) * T;
      b.hitWall = true;
      b.vx = 0;
    } else {
      b.hitWall = false;
    }
    // vertical
    b.y += b.vy;
    b.onGround = false;
    if (collides(b.x, b.y, b.w, b.h)) {
      if (b.vy > 0) {
        b.y = Math.floor((b.y + b.h) / T) * T - b.h - 0.01;
        b.onGround = true;
      } else if (b.vy < 0) {
        b.y = Math.floor(b.y / T + 1) * T;
      }
      b.vy = 0;
    }
  }

  const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  // ------------------------------------------------------------
  // Update
  // ------------------------------------------------------------
  function updatePlay() {
    // --- timer ---
    G.time--;
    if (G.time <= 0) { G.time = 0; loseLife(); return; }

    // --- player input ---
    const p = player;
    const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    if (dir !== 0) {
      p.vx += dir * ACCEL;
      p.vx = Math.max(-RUN_SPEED, Math.min(RUN_SPEED, p.vx));
      p.facing = dir;
    } else {
      p.vx *= FRICTION;
      if (Math.abs(p.vx) < 0.05) p.vx = 0;
    }

    if (p.onGround) p.coyote = 6; else if (p.coyote > 0) p.coyote--;
    if (jumpPressed) { p.jumpBuf = 6; jumpPressed = false; }
    else if (p.jumpBuf > 0) p.jumpBuf--;

    if (p.jumpBuf > 0 && p.coyote > 0) {
      p.vy = JUMP_V; p.coyote = 0; p.jumpBuf = 0; p.onGround = false;
      SFX.jump();
      spawnParticles(p.x + p.w / 2, p.y + p.h, '#ffffff', 4, 1);
    }
    if (!keys.jump && p.vy < JUMP_CUT) p.vy = JUMP_CUT;

    p.vy = Math.min(MAX_FALL, p.vy + GRAVITY);
    const wasGround = p.onGround;
    moveBody(p);
    if (p.onGround && !wasGround && p.vy === 0) spawnParticles(p.x + p.w / 2, p.y + p.h, '#c8b48a', 3, 1);

    if (p.inv > 0) p.inv--;
    if (p.onGround) p.anim += Math.abs(p.vx) * 0.25;

    // remember a safe spot for respawn after falling
    if (p.onGround && !touchesTile(p.x - 8, p.y, p.w + 16, p.h + 4, '^')) {
      if (++p.safeTimer > 20) { p.safeX = p.x; p.safeY = p.y; p.safeTimer = 0; }
    } else p.safeTimer = 0;

    // fell off the world
    if (p.y > H + 40) {
      G.lives--;
      G.shake = 10;
      SFX.hurt();
      if (G.lives <= 0) { G.state = 'over'; G.stateTimer = 0; SFX.gameover(); saveBest(); return; }
      respawn(p.safeX, p.safeY);
      return;
    }

    // spikes
    if (p.inv === 0 && touchesTile(p.x + 2, p.y + 4, p.w - 4, p.h - 4, '^')) {
      hurtPlayer();
      return;
    }

    // --- coins ---
    for (const c of coins) {
      if (c.taken) continue;
      if (overlap(p, { x: c.x, y: c.y, w: 8, h: 8 })) {
        c.taken = true;
        G.score += 10;
        SFX.coin();
        spawnParticles(c.x + 4, c.y + 4, '#ffd23f', 6, 1.5);
        floatText('+10', c.x, c.y - 4, '#ffd23f');
      }
    }

    // --- enemies ---
    for (const e of enemies) {
      if (!e.alive) continue;
      if (e.dead > 0) { e.dead--; if (e.dead === 0) e.alive = false; continue; }
      e.anim++;
      e.vy = Math.min(MAX_FALL, e.vy + GRAVITY);
      const dirE = Math.sign(e.vx) || -1;
      moveBody(e);
      // turn at walls or ledges
      const footX = dirE > 0 ? e.x + e.w + 1 : e.x - 1;
      const groundAhead = isSolid(tileAt(Math.floor(footX / T), Math.floor((e.y + e.h + 2) / T)));
      if (e.hitWall || (e.onGround && !groundAhead)) {
        e.vx = -dirE * 0.45;
      } else if (e.vx === 0) {
        e.vx = dirE * 0.45;
      }

      // player interaction
      if (overlap(p, e)) {
        const stomp = p.vy > 0 && (p.y + p.h) - e.y < 7;
        if (stomp) {
          e.dead = 25; e.vx = 0;
          p.vy = keys.jump ? -5 : -3.2;
          G.score += 100;
          SFX.stomp();
          G.shake = 4;
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#5ad35a', 8, 2);
          floatText('+100', e.x, e.y - 8, '#5ad35a');
        } else if (p.inv === 0) {
          hurtPlayer(e.x + e.w / 2 < p.x + p.w / 2 ? 1 : -1);
          return;
        }
      }
    }

    // --- flag ---
    const f = level.flag;
    if (f && overlap(p, { x: f.x + 4, y: f.y - 16, w: 8, h: 32 })) {
      const bonus = Math.floor(G.time / 60) * 10;
      G.score += bonus;
      G.bonus = bonus;
      G.state = 'win'; G.stateTimer = 0;
      SFX.win();
      saveBest();
      spawnParticles(f.x + 8, f.y, '#ffd23f', 30, 3);
      return;
    }

    // --- camera ---
    const target = p.x + p.w / 2 - W / 2 + p.facing * 24;
    G.cam += (target - G.cam) * 0.12;
    G.cam = Math.max(0, Math.min(level.cols * T - W, G.cam));
  }

  function hurtPlayer(knock = -player.facing) {
    player.vx = knock * 2.5;
    player.vy = -3;
    loseLife();
  }

  function updateEffects() {
    for (const q of particles) {
      q.x += q.vx; q.y += q.vy; q.vy += 0.15; q.life--;
      if (q.vy > 0 && isSolid(tileAt(Math.floor(q.x / T), Math.floor(q.y / T)))) q.life = 0;
    }
    particles = particles.filter(q => q.life > 0);
    for (const fl of floaters) { fl.y -= 0.4; fl.life--; }
    floaters = floaters.filter(fl => fl.life > 0);
    if (G.shake > 0) G.shake--;
  }

  function update() {
    G.frame++;
    switch (G.state) {
      case 'title':
        if (startPressed || jumpPressed) { newGame(); }
        break;
      case 'play':
        updatePlay();
        break;
      case 'dead':
        // short pause, keep physics running so the player gets knocked back
        G.stateTimer++;
        player.vy = Math.min(MAX_FALL, player.vy + GRAVITY);
        moveBody(player);
        if (G.stateTimer > 60) {
          respawn(player.safeX, player.safeY);
          G.state = 'play';
        }
        break;
      case 'over':
      case 'win':
        G.stateTimer++;
        if (G.stateTimer > 40 && (startPressed || jumpPressed)) {
          G.state = 'title';
        }
        break;
    }
    updateEffects();
    startPressed = false;
    if (G.state !== 'play') jumpPressed = false;
  }

  // ------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------
  function drawBackground() {
    // sky bands
    const bands = ['#5fb8ff', '#6cc6ff', '#7fd0ff', '#95dbff', '#b3e6ff'];
    const bh = Math.ceil(H / bands.length);
    bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, i * bh, W, bh); });

    // distant hills (parallax 0.25)
    const hx = -Math.floor(G.cam * 0.25) % 160;
    ctx.fillStyle = '#7ec8a0';
    for (let i = -1; i < 4; i++) {
      const bx = hx + i * 160;
      ctx.fillRect(bx + 10, 140, 60, 52);
      ctx.fillRect(bx + 20, 128, 40, 12);
      ctx.fillRect(bx + 30, 120, 20, 8);
      ctx.fillRect(bx + 90, 150, 60, 42);
      ctx.fillRect(bx + 100, 140, 40, 10);
    }
    ctx.fillStyle = '#5fb086';
    for (let i = -1; i < 4; i++) {
      const bx = hx + i * 160;
      ctx.fillRect(bx + 10, 160, 60, 32);
      ctx.fillRect(bx + 90, 168, 60, 24);
    }

    // clouds (parallax 0.5)
    const cx = -Math.floor(G.cam * 0.5) % 200;
    ctx.fillStyle = '#ffffff';
    for (let i = -1; i < 3; i++) {
      const bx = cx + i * 200;
      ctx.fillRect(bx + 20, 30, 40, 10);
      ctx.fillRect(bx + 28, 24, 20, 6);
      ctx.fillRect(bx + 120, 60, 50, 10);
      ctx.fillRect(bx + 132, 52, 24, 8);
      ctx.fillRect(bx + 80, 100, 30, 8);
    }
  }

  function drawTile(ch, tx, ty, sx, sy) {
    switch (ch) {
      case '#': {
        const top = !isSolid(tileAt(tx, ty - 1));
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(sx, sy, T, T);
        // dirt speckles (deterministic)
        ctx.fillStyle = '#6e4420';
        const s = (tx * 7 + ty * 13) % 5;
        ctx.fillRect(sx + 3 + s, sy + 6, 2, 2);
        ctx.fillRect(sx + 10 - s, sy + 11, 2, 2);
        ctx.fillRect(sx + 6, sy + 13 - s, 2, 1);
        if (top) {
          ctx.fillStyle = '#5ad35a';
          ctx.fillRect(sx, sy, T, 4);
          ctx.fillStyle = '#3aa848';
          ctx.fillRect(sx, sy + 4, T, 1);
          ctx.fillRect(sx + 2 + s, sy + 5, 2, 1);
          ctx.fillRect(sx + 11 - s, sy + 5, 2, 1);
        }
        break;
      }
      case '=': {
        ctx.fillStyle = '#c4713a';
        ctx.fillRect(sx, sy, T, T);
        ctx.fillStyle = '#8e4a22';
        ctx.fillRect(sx, sy + 7, T, 1);
        ctx.fillRect(sx, sy + 15, T, 1);
        ctx.fillRect(sx + 7, sy, 1, 7);
        ctx.fillRect(sx + 3, sy + 8, 1, 7);
        ctx.fillRect(sx + 11, sy + 8, 1, 7);
        ctx.fillStyle = '#e8945a';
        ctx.fillRect(sx, sy, T, 1);
        ctx.fillRect(sx, sy + 8, T, 1);
        break;
      }
      case '^': {
        ctx.fillStyle = '#c9ccd6';
        for (let i = 0; i < 4; i++) {
          const bx = sx + i * 4;
          ctx.fillRect(bx + 1, sy + 8, 2, 8);
          ctx.fillRect(bx, sy + 12, 4, 4);
          ctx.fillRect(bx + 1, sy + 6, 1, 2);
        }
        ctx.fillStyle = '#7d8190';
        for (let i = 0; i < 4; i++) ctx.fillRect(sx + i * 4 + 2, sy + 10, 1, 6);
        break;
      }
    }
  }

  function drawLevel() {
    const camX = Math.floor(G.cam);
    const tx0 = Math.floor(camX / T), tx1 = Math.min(level.cols - 1, tx0 + Math.ceil(W / T) + 1);
    for (let ty = 0; ty < level.rows; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        const ch = level.tiles[ty][tx];
        if (ch !== '.') drawTile(ch, tx, ty, tx * T - camX, ty * T);
      }
    }
  }

  function drawFlag(camX) {
    const f = level.flag;
    if (!f) return;
    const x = f.x - camX, y = f.y;
    ctx.fillStyle = PAL.P;
    ctx.fillRect(x + 6, y - 16, 2, 32);
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(x + 5, y - 18, 4, 3);
    const wave = Math.floor(G.frame / 10) % 2;
    ctx.fillStyle = PAL.F;
    ctx.fillRect(x + 8, y - 15, 8, 6 + wave);
    ctx.fillRect(x + 8, y - 15 + 6 + wave, 5, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 10, y - 13, 2, 2);
  }

  function drawEntities() {
    const camX = Math.floor(G.cam);

    for (const c of coins) {
      if (c.taken) continue;
      const fr = Math.floor((G.frame / 8 + c.x / 16) % 4);
      const bob = Math.round(Math.sin((G.frame + c.x) / 20) * 1.5);
      ctx.drawImage(SPR.coin[fr], Math.round(c.x - camX), Math.round(c.y + bob));
    }

    drawFlag(camX);

    for (const e of enemies) {
      if (!e.alive) continue;
      let spr;
      if (e.dead > 0) spr = SPR.slimeDead;
      else {
        const f = Math.floor(e.anim / 20) % 2;
        spr = e.vx > 0 ? (f ? SPR.slime2L : SPR.slime1L) : (f ? SPR.slime2 : SPR.slime1);
      }
      // sprite is 16x12; hitbox is bottom 14x8
      ctx.drawImage(spr, Math.round(e.x - 1 - camX), Math.round(e.y + e.h - 12));
    }

    // player
    const p = player;
    if (!(p.inv > 0 && Math.floor(G.frame / 4) % 2 === 0 && G.state === 'play')) {
      let name;
      if (!p.onGround) name = 'heroJump';
      else if (Math.abs(p.vx) > 0.2) name = Math.floor(p.anim) % 2 ? 'heroRun1' : 'heroRun2';
      else name = 'heroIdle';
      const spr = SPR[p.facing < 0 ? name + 'L' : name];
      ctx.drawImage(spr, Math.round(p.x - 1 - camX), Math.round(p.y));
    }

    for (const q of particles) {
      ctx.fillStyle = q.color;
      ctx.fillRect(Math.round(q.x - camX), Math.round(q.y), 2, 2);
    }
    for (const fl of floaters) {
      drawTextShadow(fl.text, Math.round(fl.x - camX), Math.round(fl.y), fl.color);
    }
  }

  function drawHUD() {
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, 0, W, 14);
    drawTextShadow('SCORE ' + String(G.score).padStart(5, '0'), 4, 4, '#ffffff');
    // lives as hearts
    drawTextShadow('LIVES', 120, 4, '#ffffff');
    for (let i = 0; i < G.lives; i++) drawHeart(146 + i * 8, 4);
    const sec = Math.ceil(G.time / 60);
    drawTextShadow('TIME ' + String(sec).padStart(3, '0'), 200, 4, sec <= 20 && G.frame % 30 < 15 ? '#e63946' : '#ffffff');
    const coinsLeft = coins.filter(c => !c.taken).length;
    ctx.drawImage(SPR.coin[0], 262, 2);
    drawTextShadow(String(coins.length - coinsLeft) + '/' + coins.length, 273, 4, '#ffd23f');
  }

  function drawHeart(x, y) {
    ctx.fillStyle = '#e63946';
    ctx.fillRect(x, y, 2, 2); ctx.fillRect(x + 3, y, 2, 2);
    ctx.fillRect(x, y + 1, 5, 2);
    ctx.fillRect(x + 1, y + 3, 3, 1);
    ctx.fillRect(x + 2, y + 4, 1, 1);
  }

  function drawOverlay(alpha = 0.55) {
    ctx.fillStyle = `rgba(10,10,20,${alpha})`;
    ctx.fillRect(0, 0, W, H);
  }

  function drawBox(x, y, w, h) {
    ctx.fillStyle = '#1b1a2a';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(x, y, w, 2); ctx.fillRect(x, y + h - 2, w, 2);
    ctx.fillRect(x, y, 2, h); ctx.fillRect(x + w - 2, y, 2, h);
    ctx.fillStyle = '#3d3b57';
    ctx.fillRect(x + 3, y + 3, w - 6, 1); ctx.fillRect(x + 3, y + h - 4, w - 6, 1);
  }

  function drawTitle() {
    drawOverlay(0.35);
    drawBox(40, 36, 240, 120);
    drawTextCentered('PIXEL QUEST', 50, '#1d1d2c', 4);
    drawTextCentered('PIXEL QUEST', 48, '#ffd23f', 4);
    drawTextCentered('A TINY PLATFORMER', 80, '#8f8ca8');
    drawTextCentered('ARROWS/WASD MOVE  SPACE JUMP', 98, '#ffffff');
    drawTextCentered('STOMP SLIMES  GRAB COINS', 108, '#ffffff');
    if (G.best > 0) drawTextCentered('BEST ' + G.best, 122, '#5ad35a');
    if (Math.floor(G.frame / 30) % 2 === 0) drawTextCentered('PRESS ENTER TO START', 138, '#ffd23f');

    // little hero demo in the corner
    const spr = Math.floor(G.frame / 8) % 2 ? SPR.heroRun1 : SPR.heroRun2;
    ctx.drawImage(spr, 52, 130);
    ctx.drawImage(Math.floor(G.frame / 20) % 2 ? SPR.slime2 : SPR.slime1, 244, 134);
  }

  function drawGameOver() {
    drawOverlay(0.6);
    drawBox(60, 56, 200, 80);
    drawTextCentered('GAME OVER', 68, '#e63946', 3);
    drawTextCentered('SCORE ' + G.score, 96, '#ffffff');
    if (G.score >= G.best && G.score > 0) drawTextCentered('NEW BEST!', 106, '#5ad35a');
    if (G.stateTimer > 40 && Math.floor(G.frame / 30) % 2 === 0) drawTextCentered('PRESS ENTER', 122, '#ffd23f');
  }

  function drawWin() {
    drawOverlay(0.5);
    drawBox(50, 46, 220, 100);
    drawTextCentered('YOU WIN!', 58, '#5ad35a', 3);
    drawTextCentered('TIME BONUS +' + (G.bonus || 0), 88, '#ffd23f');
    const got = coins.filter(c => c.taken).length;
    drawTextCentered('COINS ' + got + '/' + coins.length, 98, '#ffffff');
    drawTextCentered('SCORE ' + G.score, 110, '#ffffff', 2);
    if (G.stateTimer > 40 && Math.floor(G.frame / 30) % 2 === 0) drawTextCentered('PRESS ENTER', 132, '#ffd23f');
  }

  function render() {
    ctx.save();
    if (G.shake > 0) {
      ctx.translate(Math.round((Math.random() - 0.5) * G.shake * 0.6), Math.round((Math.random() - 0.5) * G.shake * 0.6));
    }
    drawBackground();
    drawLevel();
    drawEntities();
    ctx.restore();

    if (G.state === 'title') drawTitle();
    else {
      drawHUD();
      if (G.state === 'over') drawGameOver();
      else if (G.state === 'win') drawWin();
    }
    if (muted) drawTextShadow('MUTE', W - 20, H - 8, '#8f8ca8');
  }

  // ------------------------------------------------------------
  // Main loop (fixed 60 fps timestep)
  // ------------------------------------------------------------
  const STEP = 1000 / 60;
  let last = performance.now(), acc = 0;
  function loop(now) {
    acc += Math.min(100, now - last);
    last = now;
    while (acc >= STEP) { update(); acc -= STEP; }
    render();
    requestAnimationFrame(loop);
  }
  resetLevel();
  requestAnimationFrame(loop);
})();
