const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 550,
    height: 800,
    resizable: true,

    autoHideMenuBar: true, // extra seguridad

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.webContents.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  );

  win.loadURL("https://web.whatsapp.com");

  win.webContents.on("did-finish-load", () => {
    win.webContents.setZoomFactor(0.9);

    win.webContents.executeJavaScript(`
      setTimeout(() => {
        const app = document.querySelector('#app');
        if (!app) return;

        // ================================
        // 🔥 BLOQUEO TOTAL DE SCROLL BARS
        // ================================
        const style = document.createElement('style');
        style.innerHTML = \`
          html, body {
            overflow: hidden !important;
          }

          *::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
          }

          * {
            scrollbar-width: none !important; /* Firefox */
          }
        \`;
        document.head.appendChild(style);

        // ================================
        // LAYOUT HACK
        // ================================
        app.style.display = 'flex';
        app.style.flexDirection = 'row';
        app.style.width = '200%';
        app.style.overflow = 'hidden';

        const children = app.children;
        for (let child of children) {
          child.style.width = '100%';
          child.style.flexShrink = '0';
          child.style.overflow = 'hidden';
        }

        // ================================
        // FIND SCROLL CONTAINER
        // ================================
        function findScrollable() {
          const all = document.querySelectorAll('*');
          for (let el of all) {
            if (el.scrollWidth > el.clientWidth + 50) {
              return el;
            }
          }
          return null;
        }

        const scrollContainer = findScrollable();
        if (!scrollContainer) return;

        scrollContainer.style.overflow = 'hidden';

        let ignoreNextClick = false;

        // ================================
        // BOTÓN ATRÁS
        // ================================
        const backBtn = document.createElement('button');
        backBtn.id = 'back-btn';

        backBtn.innerHTML = \`
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M15 18L9 12L15 6"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"/>
          </svg>
        \`;

        backBtn.style.position = 'fixed';
        backBtn.style.top = '4.1rem';
        backBtn.style.right = '12px';

        backBtn.style.width = '44px';
        backBtn.style.height = '44px';
        backBtn.style.display = 'flex';
        backBtn.style.alignItems = 'center';
        backBtn.style.justifyContent = 'center';
        backBtn.style.borderRadius = '50%';

        backBtn.style.zIndex = '9999';
        backBtn.style.border = 'none';
        backBtn.style.background = '#25D366';
        backBtn.style.cursor = 'pointer';
        backBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
        backBtn.style.transition = 'all 0.2s ease';

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

          if (ignoreNextClick) {
            ignoreNextClick = false;
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
          ignoreNextClick = true;

          goLeft();

          backBtn.style.opacity = '0';
          backBtn.style.pointerEvents = 'none';
        });

      }, 3000);
    `);
  });
}

app.whenReady().then(createWindow);
