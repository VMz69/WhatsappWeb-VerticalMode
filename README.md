# WhatsApp Web Wrapper (Electron)

Este proyecto es un **wrapper de escritorio basado en WhatsApp Web**, construido con Electron para ejecutarse como aplicación de escritorio en Linux (principalmente Ubuntu).

> ⚠️ **IMPORTANTE**:  
> Esta aplicación **NO es un cliente oficial de WhatsApp**.  
> Es simplemente una envoltura de la versión web oficial.

## 📌 ¿Qué es este proyecto?

Es una aplicación de escritorio que ejecuta [WhatsApp Web](https://web.whatsapp.com) dentro de una ventana de Electron, aplicando modificaciones de interfaz para mejorar la experiencia en pantallas verticales.

## 🎯 Objetivo

El objetivo principal del proyecto es:

- Mejorar la experiencia de WhatsApp Web en modo vertical.
- Forzar un comportamiento tipo "app móvil".
- Optimizar la navegación entre el panel de chats y el chat activo.
- Eliminar limitaciones de layout responsive en la versión web.

## ⚙️ Tecnologías usadas

- **Electron**: Framework para aplicaciones de escritorio.
- **JavaScript (Node.js)**: Lenguaje de programación.
- **WhatsApp Web**: Interfaz web utilizada como backend.

## 📋 Requisitos previos

- **Node.js** (versión 14 o superior).
- **npm** (viene incluido con Node.js).
- Sistema operativo Linux (probado en Ubuntu).

## 🚀 Instalación y ejecución

### 1. Clonar o descargar el proyecto

```bash
git clone <url-del-repositorio>
cd whatsapp-electron
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en desarrollo

```bash
npm start
```

Esto abrirá la aplicación de Electron con WhatsApp Web cargado.

## 📦 Construcción de aplicación instalable (Linux)

Para generar un archivo AppImage instalable:

1. Instalar electron-builder como dependencia de desarrollo:

```bash
npm install --save-dev electron-builder
```

2. Construir la aplicación:

```bash
npx electron-builder
```

3. Salida: El archivo `dist/whatsapp-electron.AppImage` se generará en la carpeta `dist/`.

## 🧠 Comportamiento de la app

- Siempre carga WhatsApp Web.
- No modifica servidores ni APIs.
- Solo manipula la interfaz en el cliente.
- Simula navegación tipo panel doble (lista de chats ↔ chat activo).
- Optimizada para uso en ventana vertical.

## ⚠️ Limitaciones

- Depende completamente de WhatsApp Web.
- Cambios en la estructura de WhatsApp pueden romper el layout hack.
- No es oficial ni soportado por Meta.
- Puede comportarse de forma inestable si WhatsApp actualiza su UI.

## 📱 Nota importante

Este proyecto:

- ❗ **NO es WhatsApp Desktop oficial**.
- ❗ **NO es una API ni cliente alternativo**.
- ❗ **SOLO es WhatsApp Web ejecutado dentro de Electron**.

## 🧩 Estado del proyecto

⚠️ **Experimental / Hack UI**

La estabilidad del layout depende de la versión actual de WhatsApp Web. Puede requerir actualizaciones periódicas.

## 📄 Licencia

Uso personal / educativo.

## 👨‍💻 Autor

Proyecto experimental para mejorar la UX de WhatsApp Web en escritorio Linux.