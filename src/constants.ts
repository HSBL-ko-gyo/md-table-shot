import type { AppSettings } from './types'

export const SAMPLE_MARKDOWN = `| 項目 | 内容 |
| :--- | :--- |
| CPU | **QRB2210** |
| RAM | 4GB |
| 詳細 | \`省電力モデル\` / 製品情報 |`

export const DEFAULT_SETTINGS: AppSettings = {
  uiTheme: 'light',
  outputTheme: 'light',
  transparent: false,
  fontSize: 'medium',
  cellPadding: 'normal',
  exportScale: 2,
  maxWidth: 960,
}

export const STORAGE_KEYS = {
  markdown: 'md-table-shot:markdown',
  settings: 'md-table-shot:settings',
} as const
