/* editor.css — Estilos del panel de edición y layout del editor */

:root {
  --editor-panel-width: 320px;
  --editor-bg: #0f0f0f;
  --editor-panel-bg: #1a1a1a;
  --editor-border: #2a2a2a;
  --editor-input-bg: #242424;
  --editor-text: #e0e0e0;
  --editor-text-muted: #777;
  --editor-accent: #b8860b;
  --editor-accent-hover: #d4a017;
  --editor-success: #4caf50;
  --editor-danger: #f44336;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  background: var(--editor-bg);
  font-family: 'Lato', -apple-system, sans-serif;
  color: var(--editor-text);
  font-size: 14px;
}

/* ─── Layout principal ─── */
.editor-layout {
  display: grid;
  grid-template-columns: var(--editor-panel-width) 1fr;
  grid-template-rows: 48px 1fr;
  height: 100vh;
  overflow: hidden;
}

/* ─── Topbar ─── */
.editor-topbar {
  grid-column: 1 / -1;
  background: var(--editor-panel-bg);
  border-bottom: 1px solid var(--editor-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 12px;
  z-index: 10;
}

.editor-topbar__logo {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--editor-accent);
  text-decoration: none;
}

.editor-topbar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  padding: 7px 14px;
  border: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn--primario {
  background: var(--editor-accent);
  color: #fff;
}
.btn--primario:hover:not(:disabled) { background: var(--editor-accent-hover); }

.btn--secundario {
  background: transparent;
  color: var(--editor-text-muted);
  border: 1px solid var(--editor-border);
}
.btn--secundario:hover:not(:disabled) {
  color: var(--editor-text);
  border-color: #444;
}

.btn--ghost {
  background: transparent;
  color: var(--editor-text-muted);
  padding: 7px 10px;
}
.btn--ghost:hover { color: var(--editor-text); }

/* ─── Panel lateral ─── */
.editor-panel {
  background: var(--editor-panel-bg);
  border-right: 1px solid var(--editor-border);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}

.editor-panel::-webkit-scrollbar { width: 4px; }
.editor-panel::-webkit-scrollbar-track { background: transparent; }
.editor-panel::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

/* ─── URL Panel ─── */
.url-panel {
  margin: 12px;
  padding: 12px;
  background: rgba(184,134,11,0.1);
  border: 1px solid rgba(184,134,11,0.3);
  display: none;
}

.url-panel__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--editor-accent);
  margin-bottom: 8px;
  display: block;
}

.url-panel__row {
  display: flex;
  gap: 6px;
}

.url-panel__input {
  flex: 1;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--editor-border);
  color: var(--editor-text);
  font-family: 'Courier New', monospace;
  font-size: 11px;
  padding: 6px 8px;
  outline: none;
}

/* ─── Secciones del panel ─── */
.panel-seccion {
  border-bottom: 1px solid var(--editor-border);
}

.panel-seccion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
  transition: background 0.1s;
}

.panel-seccion__header:hover { background: rgba(255,255,255,0.03); }

.panel-seccion__titulo {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--editor-text-muted);
}

.panel-seccion__chevron {
  color: var(--editor-text-muted);
  font-size: 10px;
  transition: transform 0.2s;
}

.panel-seccion.abierta .panel-seccion__chevron {
  transform: rotate(180deg);
}

.panel-seccion__body {
  padding: 0 16px 16px;
  display: none;
  flex-direction: column;
  gap: 10px;
}

.panel-seccion.abierta .panel-seccion__body {
  display: flex;
}

/* ─── Campos del panel ─── */
.campo {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.campo--horizontal {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.campo__label {
  font-size: 11px;
  color: var(--editor-text-muted);
  font-weight: 400;
}

.campo__input,
.campo__select,
.campo__textarea {
  background: var(--editor-input-bg);
  border: 1px solid var(--editor-border);
  color: var(--editor-text);
  font-family: inherit;
  font-size: 13px;
  padding: 8px 10px;
  outline: none;
  width: 100%;
  transition: border-color 0.15s;
}

.campo__input:focus,
.campo__select:focus,
.campo__textarea:focus {
  border-color: var(--editor-accent);
}

.campo__textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.campo__select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%23777' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
}

.campo__color {
  display: flex;
  align-items: center;
  gap: 8px;
}

.campo__color-swatch {
  width: 32px;
  height: 32px;
  border: 1px solid var(--editor-border);
  cursor: pointer;
  padding: 0;
  background: none;
  overflow: hidden;
  flex-shrink: 0;
}

.campo__color-swatch input[type="color"] {
  width: 150%;
  height: 150%;
  border: none;
  cursor: pointer;
  transform: translate(-17%, -17%);
}

.campo__color-value {
  flex: 1;
  background: var(--editor-input-bg);
  border: 1px solid var(--editor-border);
  color: var(--editor-text);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  padding: 8px 10px;
  outline: none;
  transition: border-color 0.15s;
}

.campo__color-value:focus { border-color: var(--editor-accent); }

/* Toggle switch */
.campo__toggle {
  position: relative;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
}

.campo__toggle input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.campo__toggle-slider {
  position: absolute;
  inset: 0;
  background: #333;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 20px;
}

.campo__toggle-slider::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 14px;
  height: 14px;
  background: #666;
  border-radius: 50%;
  transition: transform 0.2s, background 0.2s;
}

.campo__toggle input:checked + .campo__toggle-slider {
  background: rgba(184,134,11,0.3);
}

.campo__toggle input:checked + .campo__toggle-slider::before {
  transform: translateX(16px);
  background: var(--editor-accent);
}

/* Fila de fecha (3 columnas) */
.fecha-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
}

/* ─── Zona de preview ─── */
.editor-preview {
  background: var(--editor-bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 32px 24px;
}

.preview-phone {
  width: 375px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 40px;
  box-shadow:
    0 0 0 10px #1e1e1e,
    0 0 0 12px #111,
    0 32px 80px rgba(0,0,0,0.6);
  overflow: hidden;
  position: relative;
  min-height: 680px;
}

.preview-phone__notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 28px;
  background: #1e1e1e;
  border-radius: 0 0 18px 18px;
  z-index: 10;
}

.preview-phone__screen {
  padding-top: 28px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 80vh;
  scrollbar-width: none;
}

.preview-phone__screen::-webkit-scrollbar { display: none; }

#preview-root {
  width: 100%;
}

/* ─── Loading overlay ─── */
.editor-cargando {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
  flex-direction: column;
  gap: 16px;
}

.editor-cargando__spinner {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: var(--editor-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.editor-cargando__texto {
  font-size: 13px;
  color: #aaa;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Indicador de guardado ─── */
.indicador-guardado {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 10px 20px;
  font-size: 12px;
  letter-spacing: 0.5px;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  pointer-events: none;
  z-index: 200;
  white-space: nowrap;
}

.indicador-guardado.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ─── Presets grid ─── */
.presets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 4px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px 4px;
  background: var(--editor-input-bg);
  border: 1px solid var(--editor-border);
  cursor: pointer;
  transition: border-color 0.15s;
  font-family: inherit;
}

.preset-btn:hover {
  border-color: var(--editor-accent);
}

.preset-btn.activo {
  border-color: var(--editor-accent);
  background: rgba(184,134,11,0.08);
}

.preset-btn__muestra {
  display: flex;
  width: 100%;
  height: 20px;
  overflow: hidden;
}

.preset-btn__color {
  flex: 1;
  height: 100%;
}

.preset-btn__nombre {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: var(--editor-text-muted);
  text-align: center;
  white-space: nowrap;
}

.preset-btn:hover .preset-btn__nombre {
  color: var(--editor-text);
}

/* ─── Divisor panel ─── */
.panel-divisor {
  height: 1px;
  background: var(--editor-border);
  margin: 4px 0;
}
