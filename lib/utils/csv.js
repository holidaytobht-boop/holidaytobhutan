function escapeCsvCell(value) {
  const text = value == null ? '' : String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function toCsv(rows, columns) {
  const header = columns.map((col) => escapeCsvCell(col.header)).join(',')
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsvCell(typeof col.value === 'function' ? col.value(row) : row[col.value])).join(',')
  )
  return [header, ...lines].join('\r\n')
}
