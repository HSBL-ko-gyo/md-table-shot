import { describe, expect, it } from 'vitest'
import {
  LEGACY_SAMPLE_MARKDOWN,
  migrateMarkdownInput,
  SAMPLE_MARKDOWN,
} from './constants'

describe('migrateMarkdownInput', () => {
  it('replaces only the legacy sample containing a URL', () => {
    expect(migrateMarkdownInput(LEGACY_SAMPLE_MARKDOWN)).toBe(SAMPLE_MARKDOWN)
    expect(migrateMarkdownInput(LEGACY_SAMPLE_MARKDOWN)).not.toContain('http')
  })

  it('keeps user input unchanged', () => {
    const userInput = '| 自分の表 | 内容 |\n| --- | --- |\n| A | B |'
    expect(migrateMarkdownInput(userInput)).toBe(userInput)
  })
})
