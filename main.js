const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 550,
    height: 800,
    resizable: false,
    autoHideMenuBar: true,
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

        function findScrollable() {
          const all = document.querySelectorAll('*');
          for (let el of all) {
            if (el.scrollWidth > el.clientWidth + 50) return el;
          }
          return null;
        }

        const scrollContainer = findScrollable();
        if (!scrollContainer) return;

        let ignore = false;

        // ================================
        // BOTÓN ATRÁS (FIX VISUAL LIMPIO)
        // ================================
        const backBtn = document.createElement('button');
        backBtn.id = 'back-btn';

        backBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        // posición
        backBtn.style.position = 'fixed';
        backBtn.style.top = '4.1rem';
        backBtn.style.right = '14px';

        // tamaño perfecto círculo
        backBtn.style.width = '46px';
        backBtn.style.height = '46px';
        backBtn.style.display = 'flex';
        backBtn.style.alignItems = 'center';
        backBtn.style.justifyContent = 'center';

        // diseño
        backBtn.style.borderRadius = '50%';
        backBtn.style.border = 'none';
        backBtn.style.background = '#25D366';
        backBtn.style.cursor = 'pointer';
        backBtn.style.zIndex = '9999';

        // sombra suave (mejor estética)
        backBtn.style.boxShadow = '0 8px 18px rgba(0,0,0,0.25)';

        // animación hover suave
        backBtn.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';

        backBtn.onmouseenter = () => {
          backBtn.style.transform = 'scale(1.08)';
          backBtn.style.boxShadow = '0 10px 22px rgba(0,0,0,0.3)';
        };

        backBtn.onmouseleave = () => {
          backBtn.style.transform = 'scale(1)';
          backBtn.style.boxShadow = '0 8px 18px rgba(0,0,0,0.25)';
        };

        // estado inicial oculto
        backBtn.style.opacity = '0';
        backBtn.style.pointerEvents = 'none';

        document.body.appendChild(backBtn);

        function goRight() {
          const width = scrollContainer.getBoundingClientRect().width;
          scrollContainer.scrollTo({
            left: Math.round(width),
            behavior: 'smooth'
          });
        }

        function goLeft() {
          scrollContainer.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }

        document.addEventListener('click', (e) => {
          if (e.target.closest('#back-btn')) return;

          if (ignore) {
            ignore = false;
            return;
          }

          setTimeout(() => {
            goRight();

            backBtn.style.opacity = '1';
            backBtn.style.pointerEvents = 'auto';
          }, 300);
        });

        backBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          ignore = true;

          goLeft();

          backBtn.style.opacity = '0';
          backBtn.style.pointerEvents = 'none';
        });

      })();
    `);
  }

  // 🔥 DETECCIÓN FUERA DEL DOM (SIN LOOP DE JS INTERNO)
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