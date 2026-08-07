import { describe, expect, it } from 'vitest'
import { parseMarkdownTable } from './parseMarkdownTable'

describe('parseMarkdownTable', () => {
  it('parses GFM alignment markers', () => {
    const result = parseMarkdownTable(`| 左 | 中央 | 右 |\n| :--- | :---: | ---: |\n| A | B | C |`)

    expect(result.error).toBeNull()
    expect(result.table?.alignments).toEqual(['left', 'center', 'right'])
  })

  it('renders simple inline markdown and sanitizes unsafe html', () => {
    const result = parseMarkdownTable(`| 項目 | 内容 |\n| --- | --- |\n| **太字** | [link](javascript:alert(1)) \`code\` |`)

    expect(result.table?.rows[0][0].html).toContain('<strong>太字</strong>')
    expect(result.table?.rows[0][1].html).toContain('<code>code</code>')
    expect(result.table?.rows[0][1].html).not.toContain('javascript:')
  })

  it('returns a helpful error for non-table input', () => {
    const result = parseMarkdownTable('これは普通の文章です。')
    expect(result.table).toBeNull()
    expect(result.error).toContain('テーブル')
  })
})
