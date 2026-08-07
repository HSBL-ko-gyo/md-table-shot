import { useMemo, useRef, useState } from 'react'
import { Icon } from './components/Icon'
import { SegmentedControl } from './components/SegmentedControl'
import { TablePreview } from './components/TablePreview'
import {
  DEFAULT_SETTINGS,
  migrateMarkdownInput,
  SAMPLE_MARKDOWN,
  STORAGE_KEYS,
} from './constants'
import {
  copyPngToClipboard,
  createPngBlob,
  downloadPng,
} from './features/export/exportPng'
import { parseMarkdownTable } from './features/table/parseMarkdownTable'
import { usePersistentState } from './hooks/usePersistentState'
import type { AppSettings } from './types'

type Notice = { kind: 'success' | 'error'; message: string } | null

export function App() {
  const [markdown, setMarkdown] = usePersistentState(
    STORAGE_KEYS.markdown,
    SAMPLE_MARKDOWN,
    migrateMarkdownInput,
  )
  const [settings, setSettings] = usePersistentState<AppSettings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
  )
  const [notice, setNotice] = useState<Notice>(null)
  const [isExporting, setIsExporting] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)
  const parsed = useMemo(() => parseMarkdownTable(markdown), [markdown])

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => setSettings((current) => ({ ...current, [key]: value }))

  const showNotice = (next: Notice) => {
    setNotice(next)
    window.setTimeout(() => setNotice(null), 4_000)
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text) throw new Error('クリップボードにテキストがありません。')
      setMarkdown(text)
      showNotice({ kind: 'success', message: 'クリップボードから貼り付けました。' })
    } catch (error) {
      showNotice({
        kind: 'error',
        message: error instanceof Error ? error.message : '貼り付けに失敗しました。',
      })
    }
  }

  const exportPng = async (action: 'copy' | 'download') => {
    if (!captureRef.current || !parsed.table) return
    setIsExporting(true)
    try {
      const blob = await createPngBlob(captureRef.current, {
        scale: settings.exportScale,
        transparent: settings.transparent,
        outputTheme: settings.outputTheme,
      })
      if (action === 'copy') {
        await copyPngToClipboard(blob)
        showNotice({ kind: 'success', message: 'PNGをクリップボードにコピーしました。' })
      } else {
        downloadPng(blob)
        showNotice({ kind: 'success', message: 'PNGを保存しました。' })
      }
    } catch (error) {
      showNotice({
        kind: 'error',
        message: error instanceof Error ? error.message : 'PNGの作成に失敗しました。',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const reset = () => {
    setMarkdown(SAMPLE_MARKDOWN)
    setSettings(DEFAULT_SETTINGS)
    showNotice({ kind: 'success', message: '入力と設定をリセットしました。' })
  }

  return (
    <div className="app" data-ui-theme={settings.uiTheme}>
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <h1>MD Table Shot</h1>
            <p>Markdownの表を、そのまま使えるPNG画像へ。</p>
          </div>
        </div>
        <button
          type="button"
          className="icon-button theme-toggle"
          onClick={() => updateSetting('uiTheme', settings.uiTheme === 'light' ? 'dark' : 'light')}
          aria-label={`画面を${settings.uiTheme === 'light' ? 'ダーク' : 'ライト'}テーマにする`}
          title="画面テーマを切り替え"
        >
          <Icon name={settings.uiTheme === 'light' ? 'moon' : 'sun'} />
        </button>
      </header>

      <main>
        <section className="workspace-card input-card" aria-labelledby="input-heading">
          <div className="section-heading">
            <div>
              <span className="step-label">STEP 1</span>
              <h2 id="input-heading">Markdownを貼り付け</h2>
            </div>
            <div className="heading-actions">
              <button type="button" className="quiet-button" onClick={pasteFromClipboard}>
                <Icon name="clipboard" />
                貼り付け
              </button>
              <button type="button" className="quiet-button" onClick={reset}>
                <Icon name="reset" />
                リセット
              </button>
            </div>
          </div>
          <label className="sr-only" htmlFor="markdown-input">Markdownテーブル</label>
          <textarea
            id="markdown-input"
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            spellCheck={false}
            placeholder="| 項目 | 内容 |&#10;| --- | --- |&#10;| CPU | QRB2210 |"
          />
          <div className="input-meta">
            <span>入力内容はブラウザ内だけで処理されます</span>
            <span>{markdown.length.toLocaleString('ja-JP')} 文字</span>
          </div>
        </section>

        <section className="workspace-card preview-card" aria-labelledby="preview-heading">
          <div className="section-heading preview-heading">
            <div>
              <span className="step-label">STEP 2</span>
              <h2 id="preview-heading">プレビュー</h2>
            </div>
            {parsed.table && (
              <span className="live-status"><span />リアルタイム更新</span>
            )}
          </div>

          <div className="preview-stage">
            {parsed.table ? (
              <TablePreview ref={captureRef} table={parsed.table} settings={settings} />
            ) : (
              <div className="empty-preview">
                <div className="empty-table-icon" aria-hidden="true"><span /><span /><span /><span /></div>
                <p>{parsed.error}</p>
              </div>
            )}
          </div>
          {parsed.extraTableCount > 0 && (
            <p className="inline-note">先頭のテーブルをプレビューしています（ほか {parsed.extraTableCount} 件）。</p>
          )}

          <div className="settings-panel" aria-label="出力設定">
            <div className="setting-grid">
              <SegmentedControl
                label="画像テーマ"
                value={settings.outputTheme}
                options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
                onChange={(value) => updateSetting('outputTheme', value)}
              />
              <SegmentedControl
                label="文字サイズ"
                value={settings.fontSize}
                options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]}
                onChange={(value) => updateSetting('fontSize', value)}
              />
              <SegmentedControl
                label="セル余白"
                value={settings.cellPadding}
                options={[{ value: 'compact', label: 'Compact' }, { value: 'normal', label: 'Normal' }, { value: 'relaxed', label: 'Relaxed' }]}
                onChange={(value) => updateSetting('cellPadding', value)}
              />
              <SegmentedControl
                label="出力倍率"
                value={settings.exportScale}
                options={[{ value: 1, label: '1x' }, { value: 2, label: '2x' }, { value: 3, label: '3x' }]}
                onChange={(value) => updateSetting('exportScale', value)}
              />
              <label className="setting-field width-setting">
                <span>表の最大幅</span>
                <div className="number-input-wrap">
                  <input
                    type="number"
                    value={settings.maxWidth}
                    min={320}
                    max={1600}
                    step={40}
                    onChange={(event) => updateSetting('maxWidth', Math.min(1600, Math.max(320, Number(event.target.value) || 320)))}
                  />
                  <span>px</span>
                </div>
              </label>
              <label className="setting-field toggle-setting">
                <span>背景</span>
                <span className="toggle-row">
                  <button
                    type="button"
                    className={`switch ${settings.transparent ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={settings.transparent}
                    onClick={() => updateSetting('transparent', !settings.transparent)}
                  ><span /></button>
                  {settings.transparent ? '透過' : '不透明'}
                </span>
              </label>
            </div>
          </div>

          <div className="export-actions">
            <button
              type="button"
              className="primary-button"
              disabled={!parsed.table || isExporting}
              onClick={() => exportPng('copy')}
            >
              <Icon name="copy" />
              {isExporting ? '作成中…' : 'PNGをコピー'}
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={!parsed.table || isExporting}
              onClick={() => exportPng('download')}
            >
              <Icon name="download" />
              PNGを保存
            </button>
          </div>
        </section>
      </main>

      <footer>
        <p>すべての処理はこのブラウザ内で完結します。入力データが外部へ送信されることはありません。</p>
      </footer>

      {notice && (
        <div className={`toast ${notice.kind}`} role="status">
          {notice.kind === 'success' && <Icon name="check" />}
          {notice.message}
        </div>
      )}
    </div>
  )
}
