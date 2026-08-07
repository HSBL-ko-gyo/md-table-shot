export type Alignment = 'left' | 'center' | 'right' | null
export type UiTheme = 'light' | 'dark'
export type OutputTheme = 'light' | 'dark'
export type FontSize = 'small' | 'medium' | 'large'
export type CellPadding = 'compact' | 'normal' | 'relaxed'
export type ExportScale = 1 | 2 | 3

export interface TableCellModel {
  html: string
  text: string
}

export interface TableModel {
  headers: TableCellModel[]
  rows: TableCellModel[][]
  alignments: Alignment[]
}

export interface AppSettings {
  uiTheme: UiTheme
  outputTheme: OutputTheme
  transparent: boolean
  fontSize: FontSize
  cellPadding: CellPadding
  exportScale: ExportScale
  maxWidth: number
}
