import { forwardRef } from 'react'
import type { AppSettings, TableModel } from '../types'

interface TablePreviewProps {
  table: TableModel
  settings: AppSettings
}

export const TablePreview = forwardRef<HTMLDivElement, TablePreviewProps>(
  function TablePreview({ table, settings }, ref) {
    return (
      <div
        ref={ref}
        className="capture-surface"
        data-output-theme={settings.outputTheme}
        data-transparent={settings.transparent ? 'true' : 'false'}
        data-font-size={settings.fontSize}
        data-cell-padding={settings.cellPadding}
        style={{ '--table-max-width': `${settings.maxWidth}px` } as React.CSSProperties}
      >
        <table className="output-table">
          <thead>
            <tr>
              {table.headers.map((cell, columnIndex) => (
                <th
                  key={columnIndex}
                  style={{ textAlign: table.alignments[columnIndex] ?? 'left' }}
                  dangerouslySetInnerHTML={{ __html: cell.html }}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {table.headers.map((_, columnIndex) => {
                  const cell = row[columnIndex]
                  return (
                    <td
                      key={columnIndex}
                      style={{ textAlign: table.alignments[columnIndex] ?? 'left' }}
                      dangerouslySetInnerHTML={{ __html: cell?.html ?? '' }}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
)
