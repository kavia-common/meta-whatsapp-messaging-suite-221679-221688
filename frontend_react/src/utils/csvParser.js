//
// Minimal CSV parser utility for client-side previews.
// Supports configurable delimiter, quoted fields, headers, and trimming.
//

// PUBLIC_INTERFACE
export function parseCsv(text, { delimiter = ',', header = true, limitRows = 100 } = {}) {
  /**
   * Parses CSV text into rows.
   * Returns { headers: string[], rows: string[][] }
   * This is intentionally minimal; for complicated CSVs consider PapaParse server-side.
   */
  const rows = [];
  const headers = [];

  if (!text || typeof text !== 'string') {
    return { headers, rows };
  }

  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          // Possible escaped quote
          if (line[i + 1] === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result.map((c) => c.trim());
  };

  let startIdx = 0;
  if (header && lines.length > 0) {
    const head = parseLine(lines[0]);
    head.forEach((h, idx) => {
      headers.push(h || `col_${idx + 1}`);
    });
    startIdx = 1;
  }

  for (let i = startIdx; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    rows.push(parseLine(line));
    if (limitRows && rows.length >= limitRows) break;
  }

  return { headers, rows };
}
