import { toBlob } from 'html-to-image'
import type { ExportScale, OutputTheme } from '../../types'

interface ExportOptions {
  scale: ExportScale
  transparent: boolean
  outputTheme: OutputTheme
}

export async function createPngBlob(
  element: HTMLElement,
  options: ExportOptions,
): Promise<Blob> {
  const blob = await toBlob(element, {
    pixelRatio: options.scale,
    cacheBust: true,
    backgroundColor: options.transparent
      ? undefined
      : options.outputTheme === 'dark'
        ? '#0d1117'
        : '#ffffff',
  })

  if (!blob) {
    throw new Error('PNGの生成に失敗しました。')
  }

  return blob
}

export async function copyPngToClipboard(blob: Blob): Promise<void> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
    throw new Error('このブラウザは画像のクリップボードコピーに対応していません。PNG保存をご利用ください。')
  }

  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ])
}

export function downloadPng(blob: Blob, filename = 'md-table-shot.png'): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
