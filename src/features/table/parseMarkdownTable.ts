import DOMPurify from 'dompurify'
import { marked, type Tokens } from 'marked'
import type { Alignment, TableCellModel, TableModel } from '../../types'

export interface ParseResult {
  table: TableModel | null
  error: string | null
  extraTableCount: number
}

const allowedInlineTags = ['strong', 'b', 'em', 'i', 'code', 'del', 'br']

function renderCell(cell: Tokens.TableCell): TableCellModel {
  const rendered = marked.parseInline(cell.text, {
    gfm: true,
    breaks: false,
  }) as string

  const html = DOMPurify.sanitize(rendered, {
    ALLOWED_TAGS: allowedInlineTags,
    ALLOWED_ATTR: [],
  })

  return { html, text: cell.text }
}

export function parseMarkdownTable(source: string): ParseResult {
  if (!source.trim()) {
    return {
      table: null,
      error: 'Markdownテーブルを入力してください。',
      extraTableCount: 0,
    }
  }

  try {
    const tokens = marked.lexer(source, { gfm: true, breaks: false })
    const tables = tokens.filter(
      (token): token is Tokens.Table => token.type === 'table',
    )

    if (tables.length === 0) {
      return {
        table: null,
        error: 'GFM形式のテーブルを見つけられませんでした。区切り行（| --- | --- |）を確認してください。',
        extraTableCount: 0,
      }
    }

    const table = tables[0]
    const alignments = table.align.map((value) =>
      value === 'left' || value === 'center' || value === 'right'
        ? value
        : null,
    ) as Alignment[]

    return {
      table: {
        headers: table.header.map(renderCell),
        rows: table.rows.map((row) => row.map(renderCell)),
        alignments,
      },
      error: null,
      extraTableCount: Math.max(0, tables.length - 1),
    }
  } catch {
    return {
      table: null,
      error: 'テーブルを解析できませんでした。Markdownの記法を確認してください。',
      extraTableCount: 0,
    }
  }
}
