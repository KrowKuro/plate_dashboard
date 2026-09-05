/** Client-side exporters. PDF is handled via the browser print dialog. */

function download(filename, text, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const escapeCsv = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Excel opens CSV natively, so this covers "Excel export" without an xlsx dep.
 *
 * @param {Array<object>} rows
 * @param {Array<[string, string]>} columns  [[objectKey, columnHeader], …]
 * @param {string} filename
 */
export function exportCsv(rows, columns, filename = 'export.csv') {
  const header = columns.map(([, label]) => label).join(',');
  const body = rows.map((row) => columns.map(([key]) => escapeCsv(row[key])).join(','));
  download(filename, [header, ...body].join('\n'), 'text/csv;charset=utf-8');
}

/** Dump any serialisable value as a .json download. */
export function exportJson(data, filename = 'export.json') {
  download(filename, JSON.stringify(data, null, 2), 'application/json');
}
