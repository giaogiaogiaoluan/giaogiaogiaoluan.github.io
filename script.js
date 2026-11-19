(() => {
  const SITE_URL = 'https://giaogiaogiaoluan.github.io/';
  const GITHUB_URL = 'https://github.com/giaogiaogiaoluan';
  const LAB_URL = 'https://github.com/giaogiaogiaoluan/LabAssistant';
  const PDF_URL = 'https://github.com/giaogiaogiaoluan/zhiyi-pdf';

  const root = document.documentElement;
  const themeBtn = document.querySelector('.theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const savedTheme = (() => {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch {
      return null;
    }
  })();

  function setTheme(theme) {
    const isLight = theme === 'light';
    root.dataset.theme = isLight ? 'light' : 'dark';
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', isLight ? '切换到终端暗色模式' : '切换到蓝图浅色模式');
      themeBtn.setAttribute('aria-pressed', String(!isLight));
    }
    if (metaTheme) {
      metaTheme.content = isLight ? '#f2f4ef' : '#0b0e0d';
    }
  }

  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch {
      /* Storage unavailable */
    }
    return next;
  }

  setTheme(savedTheme === 'light' ? 'light' : 'dark');
  if (themeBtn) {
    themeBtn.hidden = false;
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Footer year & live telemetry clock
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Interactive project schematic tabs: LabAssistant
  const labTabs = document.querySelectorAll('[data-lab-tab]');
  const labPanes = document.querySelectorAll('[data-lab-pane]');
  labTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.labTab;
      labTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      labPanes.forEach((pane) => {
        const active = pane.dataset.labPane === target;
        pane.classList.toggle('is-active', active);
        pane.hidden = !active;
      });
    });
  });

  // Interactive project schematic mode: Zhiyi PDF
  const pdfTabs = document.querySelectorAll('[data-pdf-mode]');
  const pdfStage = document.getElementById('pdf-stage');
  pdfTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.pdfMode;
      pdfTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      if (pdfStage) {
        pdfStage.dataset.mode = mode;
      }
    });
  });

  // Copy homepage URL button
  const copyBtn = document.getElementById('copy-url');
  const copyText = document.getElementById('copy-url-text');
  let copyTimer = null;

  function copySiteUrl() {
    const done = () => {
      if (!copyText) return;
      copyText.textContent = '已复制地址';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copyText.textContent = '复制主页链接';
      }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SITE_URL).then(done).catch(() => {
        fallbackCopy(SITE_URL);
        done();
      });
    } else {
      fallbackCopy(SITE_URL);
      done();
    }
  }

  function fallbackCopy(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
    } catch {
      /* Ignore copy failure */
    }
    document.body.removeChild(area);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', copySiteUrl);
  }

  // Interactive Terminal Emulator
  const termOutput = document.getElementById('term-output');
  const termForm = document.getElementById('term-form');
  const termInput = document.getElementById('term-input');
  const termClear = document.getElementById('term-clear');
  const cmdHistory = [];
  let historyIdx = -1;

  function appendLine(nodesOrText, className = 'term-line') {
    if (!termOutput) return;
    const div = document.createElement('div');
    div.className = className;
    if (typeof nodesOrText === 'string') {
      div.textContent = nodesOrText;
    } else if (Array.isArray(nodesOrText)) {
      nodesOrText.forEach((n) => div.appendChild(n));
    } else {
      div.appendChild(nodesOrText);
    }
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function span(text, cls) {
    const el = document.createElement('span');
    el.textContent = text;
    if (cls) el.className = cls;
    return el;
  }

  function link(text, href) {
    const a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'term-link';
    return a;
  }

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;

    cmdHistory.push(cmd);
    historyIdx = cmdHistory.length;

    appendLine([span('lewisluan@io:~$', 'term-prompt'), span(cmd)]);

    const lower = cmd.toLowerCase();

    if (lower === 'help' || lower === '?') {
      appendLine([span('COMMANDS: ', 'term-amber'), span('whoami · ls projects · cat labassistant · cat zhiyi-pdf · stack · neofetch · theme · open github · clear')]);
      return;
    }

    if (lower === 'clear' || lower === 'cls') {
      if (termOutput) termOutput.innerHTML = '';
      appendLine('# Terminal cleared. Type "help" for commands.', 'term-line term-muted');
      return;
    }

    if (lower === 'whoami') {
      appendLine([span('lewisluan', 'term-accent'), span(' — 围绕阅读、研究与日常效率，把具体问题做成顺手的开源工具。')]);
      return;
    }

    if (lower === 'ls' || lower === 'ls projects' || lower === 'projects') {
      appendLine([span('drwxr-xr-x  01  ', 'term-muted'), link('LabAssistant', LAB_URL), span('  — 实验室时间与日程助手 (Python / PySide6)')]);
      appendLine([span('drwxr-xr-x  02  ', 'term-muted'), link('zhiyi-pdf', PDF_URL), span('     — Zotero 论文 PDF 双语翻译插件')]);
      return;
    }

    if (lower === 'cat labassistant' || lower === 'labassistant') {
      appendLine([span('[LabAssistant] ', 'term-amber'), span('把实验室打卡、课程、待办与时间统计整合在本地优先桌面工具中。')]);
      appendLine([span('REPO -> ', 'term-muted'), link(LAB_URL, LAB_URL)]);
      return;
    }

    if (lower === 'cat zhiyi-pdf' || lower === 'zhiyi-pdf' || lower === 'cat zhiyi') {
      appendLine([span('[知译 PDF] ', 'term-amber'), span('在 Zotero 中翻译论文 PDF，输出译文与双语对照，独立兼容 PDF2zh 生态。')]);
      appendLine([span('REPO -> ', 'term-muted'), link(PDF_URL, PDF_URL)]);
      return;
    }

    if (lower === 'stack') {
      appendLine([span('CORE_STACK: ', 'term-amber'), span('Python · PySide6 · JavaScript · Zotero Plugin · HTML/CSS · Local-First')]);
      return;
    }

    if (lower === 'neofetch') {
      appendLine([span('USER: ', 'term-amber'), span('lewisluan  |  '), span('HOST: ', 'term-amber'), span('giaogiaogiaoluan.github.io')]);
      appendLine([span('MODULES: ', 'term-amber'), span('LabAssistant, zhiyi-pdf  |  '), span('TRACKERS: ', 'term-amber'), span('0')]);
      return;
    }

    if (lower === 'theme') {
      const next = toggleTheme();
      appendLine([span('THEME -> ', 'term-amber'), span(next === 'dark' ? 'dark (terminal phosphor)' : 'light (blueprint datasheet)', 'term-accent')]);
      return;
    }

    if (lower === 'open github' || lower === 'github') {
      appendLine([span('GITHUB -> ', 'term-muted'), link(GITHUB_URL, GITHUB_URL)]);
      window.open(GITHUB_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    if (lower === 'copy') {
      copySiteUrl();
      appendLine([span('COPIED -> ', 'term-accent'), span(SITE_URL)]);
      return;
    }

    appendLine([span(`zsh: command not found: ${cmd}. `, 'term-amber'), span('输入 help 查看可用命令。', 'term-muted')]);
  }

  if (termForm && termInput) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = termInput.value;
      termInput.value = '';
      runCommand(val);
    });

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && cmdHistory.length > 0) {
        e.preventDefault();
        historyIdx = Math.max(0, historyIdx - 1);
        termInput.value = cmdHistory[historyIdx] || '';
      } else if (e.key === 'ArrowDown' && cmdHistory.length > 0) {
        e.preventDefault();
        historyIdx = Math.min(cmdHistory.length, historyIdx + 1);
        termInput.value = cmdHistory[historyIdx] || '';
      }
    });
  }

  if (termClear) {
    termClear.addEventListener('click', () => runCommand('clear'));
  }

  document.querySelectorAll('[data-run]').forEach((chip) => {
    chip.addEventListener('click', () => {
      runCommand(chip.dataset.run);
      if (termInput) termInput.focus();
    });
  });

  // Command Palette (⌘K / Ctrl+K)
  const paletteBackdrop = document.getElementById('cmd-palette');
  const paletteInput = document.getElementById('palette-input');
  const paletteList = document.getElementById('palette-list');
  const paletteOpenBtn = document.getElementById('cmd-open');
  const footerCmdBtn = document.getElementById('footer-cmd');
  const paletteCloseBtn = document.getElementById('palette-close');

  const actions = [
    { label: '跳转到 01 / 开源作品选集', hint: '#projects', keywords: 'projects works 作品 项目', run: () => location.hash = '#projects' },
    { label: '跳转到 02 / 个人手册 MAN(1)', hint: '#about', keywords: 'about man 关于 介绍', run: () => location.hash = '#about' },
    { label: '跳转到 03 / 建立联系 PING', hint: '#contact', keywords: 'contact ping 联系', run: () => location.hash = '#contact' },
    { label: '打开 LabAssistant 仓库', hint: 'GitHub ↗', keywords: 'labassistant python pyside6 repo', run: () => window.open(LAB_URL, '_blank', 'noopener,noreferrer') },
    { label: '打开 知译 PDF 仓库', hint: 'GitHub ↗', keywords: 'zhiyi pdf zotero translate repo', run: () => window.open(PDF_URL, '_blank', 'noopener,noreferrer') },
    { label: '访问 GitHub 主页', hint: 'giaogiaogiaoluan ↗', keywords: 'github profile', run: () => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer') },
    { label: '切换 终端暗色 / 蓝图浅色 主题', hint: 'theme', keywords: 'theme dark light 主题 暗色 浅色', run: () => toggleTheme() },
    { label: '在终端运行 neofetch', hint: 'terminal', keywords: 'neofetch terminal 终端', run: () => { window.scrollTo({ top: 0 }); runCommand('neofetch'); if (termInput) termInput.focus(); } },
    { label: '复制本站主页链接', hint: 'clipboard', keywords: 'copy url link 复制 链接', run: () => copySiteUrl() }
  ];

  let filteredActions = actions.slice();
  let selectedIdx = 0;

  function renderPalette() {
    if (!paletteList) return;
    paletteList.innerHTML = '';
    if (filteredActions.length === 0) {
      const li = document.createElement('li');
      li.className = 'palette-empty';
      li.textContent = '没有匹配的命令';
      paletteList.appendChild(li);
      return;
    }

    filteredActions.forEach((act, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'palette-item' + (idx === selectedIdx ? ' is-selected' : '');
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', String(idx === selectedIdx));

      const left = document.createElement('span');
      left.textContent = act.label;
      const right = document.createElement('small');
      right.textContent = act.hint;

      btn.appendChild(left);
      btn.appendChild(right);
      btn.addEventListener('click', () => {
        closePalette();
        act.run();
      });
      li.appendChild(btn);
      paletteList.appendChild(li);
    });
  }

  function openPalette() {
    if (!paletteBackdrop || !paletteInput) return;
    paletteBackdrop.hidden = false;
    paletteInput.value = '';
    filteredActions = actions.slice();
    selectedIdx = 0;
    renderPalette();
    paletteInput.focus();
  }

  function closePalette() {
    if (!paletteBackdrop) return;
    paletteBackdrop.hidden = true;
  }

  if (paletteOpenBtn) paletteOpenBtn.addEventListener('click', openPalette);
  if (footerCmdBtn) footerCmdBtn.addEventListener('click', openPalette);
  if (paletteCloseBtn) paletteCloseBtn.addEventListener('click', closePalette);

  if (paletteBackdrop) {
    paletteBackdrop.addEventListener('click', (e) => {
      if (e.target === paletteBackdrop) closePalette();
    });
  }

  if (paletteInput) {
    paletteInput.addEventListener('input', () => {
      const q = paletteInput.value.trim().toLowerCase();
      filteredActions = actions.filter((a) =>
        `${a.label} ${a.hint} ${a.keywords}`.toLowerCase().includes(q)
      );
      selectedIdx = 0;
      renderPalette();
    });

    paletteInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && filteredActions.length > 0) {
        e.preventDefault();
        selectedIdx = (selectedIdx + 1) % filteredActions.length;
        renderPalette();
      } else if (e.key === 'ArrowUp' && filteredActions.length > 0) {
        e.preventDefault();
        selectedIdx = (selectedIdx - 1 + filteredActions.length) % filteredActions.length;
        renderPalette();
      } else if (e.key === 'Enter' && filteredActions[selectedIdx]) {
        e.preventDefault();
        const act = filteredActions[selectedIdx];
        closePalette();
        act.run();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteBackdrop && paletteBackdrop.hidden) {
        openPalette();
      } else {
        closePalette();
      }
      return;
    }

    if (e.key === 'Escape' && paletteBackdrop && !paletteBackdrop.hidden) {
      e.preventDefault();
      closePalette();
      return;
    }

    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    if (e.key === '/' && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA' && (!paletteBackdrop || paletteBackdrop.hidden)) {
      if (termInput) {
        e.preventDefault();
        termInput.focus();
      }
    }
  });
})();
