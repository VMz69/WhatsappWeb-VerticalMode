const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 550,
    height: 800,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.resolve(__dirname, "build/icons/512x512.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.webContents.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  win.loadURL("https://web.whatsapp.com");

  let hackApplied = false;

  function applyHack() {
    if (hackApplied) return;
    hackApplied = true;

    win.webContents.executeJavaScript(`
      (function () {
        const app = document.querySelector('#app');
        if (!app) return;

        app.style.display = 'flex';
        app.style.flexDirection = 'row';
        app.style.width = '200%';

        const children = app.children;
        for (let c of children) {
          c.style.width = '100%';
          c.style.flexShrink = '0';
        }

        const scrollContainer = document.documentElement;

        let ignore = false;
        let lockScroll = false;
        let chatPanelLeft = 0;

        // ================================
        // BOTÓN ATRÁS
        // ================================
        const backBtn = document.createElement('button');
        backBtn.id = 'back-btn';
        backBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        Object.assign(backBtn.style, {
          position:       'fixed',
          top:            '4.1rem',
          right:          '14px',
          width:          '46px',
          height:         '46px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          borderRadius:   '50%',
          border:         'none',
          background:     '#25D366',
          cursor:         'pointer',
          zIndex:         '9999',
          boxShadow:      '0 8px 18px rgba(0,0,0,0.25)',
          transition:     'transform 0.15s ease, box-shadow 0.15s ease',
          opacity:        '0',
          pointerEvents:  'none',
        });

        backBtn.onmouseenter = () => {
          backBtn.style.transform = 'scale(1.08)';
          backBtn.style.boxShadow = '0 10px 22px rgba(0,0,0,0.3)';
        };
        backBtn.onmouseleave = () => {
          backBtn.style.transform = 'scale(1)';
          backBtn.style.boxShadow = '0 8px 18px rgba(0,0,0,0.25)';
        };

        document.body.appendChild(backBtn);

        // ================================
        // BOTÓN TOGGLE NAVBAR
        // ================================
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-navbar-btn';
        toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6H20M4 12H20M4 18H20" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>';

        // altura del botón: 40px. dos veces hacia arriba = bottom: 18 + 40*2 + gap = ~106px
        Object.assign(toggleBtn.style, {
          position:       'fixed',
          bottom:         '106px',
          left:           '14px',
          width:          '40px',
          height:         '40px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          borderRadius:   '50%',
          border:         'none',
          background:     '#25D366',
          cursor:         'pointer',
          zIndex:         '9999',
          boxShadow:      '0 8px 18px rgba(0,0,0,0.25)',
          transition:     'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease',
          opacity:        '0.75',
        });

        toggleBtn.onmouseenter = () => {
          toggleBtn.style.transform = 'scale(1.08)';
          toggleBtn.style.boxShadow = '0 10px 22px rgba(0,0,0,0.3)';
          toggleBtn.style.opacity   = '1';
        };
        toggleBtn.onmouseleave = () => {
          toggleBtn.style.transform = 'scale(1)';
          toggleBtn.style.boxShadow = '0 8px 18px rgba(0,0,0,0.25)';
          toggleBtn.style.opacity   = '0.75';
        };

        document.body.appendChild(toggleBtn);

        let navbarVisible = true;

        function showToggleBtn() {
          toggleBtn.style.opacity      = '0.75';
          toggleBtn.style.pointerEvents = 'auto';
          toggleBtn.style.display      = 'flex';
        }

        function hideToggleBtn() {
          toggleBtn.style.opacity      = '0';
          toggleBtn.style.pointerEvents = 'none';
          toggleBtn.style.display      = 'none';
        }

        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const navbar     = document.querySelector('[data-testid="chatlist-header"]');
          const drawerLeft = document.querySelector('[data-testid="drawer-left"]');
          if (!navbar) return;

          navbarVisible = !navbarVisible;

          if (navbarVisible) {
            navbar.style.display     = '';
            if (drawerLeft) drawerLeft.style.display = '';
            toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6H20M4 12H20M4 18H20" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>';
          } else {
            navbar.style.display     = 'none';
            if (drawerLeft) drawerLeft.style.display = 'none';
            toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6H20M4 12H14" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>';
          }
        });

        // ================================
        // NAVEGACIÓN
        // ================================
        function goRight() {
          lockScroll = false;
          const width = window.innerWidth;
          scrollContainer.scrollLeft = width;
          chatPanelLeft = scrollContainer.scrollLeft;
          setTimeout(() => { lockScroll = true; }, 400);
          // mostrar botón atrás, ocultar toggle
          backBtn.style.opacity      = '1';
          backBtn.style.pointerEvents = 'auto';
          hideToggleBtn();
        }

        function goLeft() {
          lockScroll = false;
          scrollContainer.scrollLeft = 0;
          chatPanelLeft = 0;
          // ocultar botón atrás, mostrar toggle
          backBtn.style.opacity      = '0';
          backBtn.style.pointerEvents = 'none';
          showToggleBtn();
        }

        window.addEventListener('scroll', () => {
          if (!lockScroll) return;
          if (scrollContainer.scrollLeft < chatPanelLeft - 10) {
            scrollContainer.scrollLeft = chatPanelLeft;
          }
        }, { passive: false });

        document.addEventListener('click', (e) => {
          if (e.target.closest('#back-btn')) return;
          if (e.target.closest('#toggle-navbar-btn')) return;
          if (e.target.closest('#main')) return;

          if (e.target.closest('[role="dialog"]')) return;
          if (e.target.closest('[role="menu"]')) return;
          if (e.target.closest('[data-testid="popup-contents"]')) return;

          if (ignore) {
            ignore = false;
            return;
          }

          goRight();
        });

        backBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          goLeft();
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          setTimeout(() => { ignore = false; }, 50);
        });

        // ================================
        // TECLA ESCAPE: volver al panel izq
        // ================================
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && chatPanelLeft > 0) {
            goLeft();
          }
        });

        // ================================
        // FIX: ANCLAR expressions-panel
        // ================================
        const panelObserver = new MutationObserver(() => {
          const panel = document.querySelector('[data-testid="expressions-panel"]');
          if (!panel || panel._fixed) return;
          panel._fixed = true;

          const parent = panel.parentElement;
          parent.style.left  = 'auto';
          parent.style.right = '0px';

          const unmountObserver = new MutationObserver(() => {
            if (!document.contains(panel)) {
              panel._fixed = false;
              unmountObserver.disconnect();
            }
          });
          unmountObserver.observe(document.body, { childList: true, subtree: true });
        });

        panelObserver.observe(document.body, { childList: true, subtree: true });

        // ================================
        // MANEJO DE RESIZE / MAXIMIZAR
        // ================================
        const BREAKPOINT = 768;

        function enableHackLayout() {
          app.style.display       = 'flex';
          app.style.flexDirection = 'row';
          app.style.width         = '200%';
          for (let c of app.children) {
            c.style.width      = '100%';
            c.style.flexShrink = '0';
          }
          backBtn.style.display = 'flex';
          showToggleBtn();
        }

        function disableHackLayout() {
          app.style.display       = '';
          app.style.flexDirection = '';
          app.style.width         = '';
          for (let c of app.children) {
            c.style.width      = '';
            c.style.flexShrink = '';
          }
          lockScroll    = false;
          chatPanelLeft = 0;
          scrollContainer.scrollLeft = 0;
          backBtn.style.opacity      = '0';
          backBtn.style.pointerEvents = 'none';
          backBtn.style.display      = 'none';
          hideToggleBtn();
        }

        let wideMode = window.innerWidth >= BREAKPOINT;
        if (wideMode) disableHackLayout();

        window.addEventListener('resize', () => {
          const isWide = window.innerWidth >= BREAKPOINT;
          if (isWide && !wideMode) {
            wideMode = true;
            disableHackLayout();
          } else if (!isWide && wideMode) {
            wideMode = false;
            enableHackLayout();
          }
        });

      })();
    `);
  }

  win.webContents.on('did-finish-load', () => {

    const interval = setInterval(async () => {

      const hasMain = await win.webContents.executeJavaScript(
        "!!document.querySelector('#main')"
      );

      if (hasMain) {
        clearInterval(interval);
        setTimeout(applyHack, 3000);
      }

    }, 1000);
  });
}

app.whenReady().then(createWindow);