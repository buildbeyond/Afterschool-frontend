import { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelExporter = ({
  data,
  fileName = 'export',
  sheetName = 'Sheet1',
  sheets = null,
  styling = null,
  buttonText = 'Export to Excel',
  buttonClassName = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
}: {
  data: any;
  fileName?: string;
  sheetName?: string;
  sheets?: any[] | null;
  styling?: any | null;
  buttonText?: string;
  buttonClassName?: string;
}) => {
  const [exporting, setExporting] = useState<boolean>(false);

  const exportToExcel = async () => {
    try {
      setExporting(true);

      console.log(data);

      XLSX.writeFile(data, `${fileName}.xlsx`, { type: 'binary' });
      return;

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Handle multiple sheets
      if (sheets && Array.isArray(sheets)) {
        for (const sheet of sheets) {
          if (!sheet.data) continue;

          const ws = createWorksheet(sheet.data);

          if (sheet.styling) {
            applyStyling(ws, sheet.styling);
          }

          XLSX.utils.book_append_sheet(
            wb,
            ws,
            sheet.name || `Sheet${sheets.indexOf(sheet) + 1}`
          );
        }
      }
      // Handle single sheet
      else if (data) {
        const ws = createWorksheet(data);

        if (styling) {
          applyStyling(ws, styling);
        }

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      } else {
        throw new Error('No data provided for export');
      }

      // Generate and download the Excel file
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Excel export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const createWorksheet = (data: any) => {
    // Handle data from Excel importer component
    if (
      Array.isArray(data) &&
      Array.isArray(data[0]) &&
      data[0][0] &&
      typeof data[0][0] === 'object' &&
      'value' in data[0][0]
    ) {
      // Create empty worksheet
      const ws = XLSX.utils.aoa_to_sheet([[]]);

      // Clear the empty cell
      delete ws['A1'];

      // Add data and formatting from import format
      for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
          const cellObj: any = data[r][c];
          if (cellObj.hidden) continue; // Skip hidden cells from merged regions

          const cellRef = XLSX.utils.encode_cell({ r, c });

          // Create the cell with value
          ws[cellRef] = {
            v: cellObj.value,
            t: guessValueType(cellObj.value),
          };

          // Add formula if exists
          if (cellObj.formula) {
            ws[cellRef].f = cellObj.formula;
          }

          // Add styles if exist
          if (cellObj.style && Object.keys(cellObj.style).length > 0) {
            ws[cellRef].s = convertToExcelStyle(cellObj.style);
          }
        }
      }

      // Handle merged cells
      ws['!merges'] = [];
      for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
          const cellObj: any = data[r][c];
          if (cellObj.merged) {
            ws['!merges'].push({
              s: { r, c },
              e: {
                r: r + cellObj.merged.rowspan - 1,
                c: c + cellObj.merged.colspan - 1,
              },
            });
          }
        }
      }

      // Set worksheet range
      const range = { s: { r: 0, c: 0 }, e: { r: data.length - 1, c: 0 } };
      // Find the maximum column index
      for (let r = 0; r < data.length; r++) {
        if (data[r].length > range.e.c) {
          range.e.c = data[r].length - 1;
        }
      }
      ws['!ref'] = XLSX.utils.encode_range(range);

      return ws;
    }
    // Handle array of arrays (2D matrix)
    else if (Array.isArray(data) && Array.isArray(data[0])) {
      return XLSX.utils.aoa_to_sheet(data);
    }
    // Handle array of objects (JSON)
    else if (Array.isArray(data) && typeof data[0] === 'object') {
      return XLSX.utils.json_to_sheet(data);
    }
    // Handle HTML table element
    else if (
      typeof window !== 'undefined' &&
      data instanceof HTMLElement &&
      data.tagName === 'TABLE'
    ) {
      return XLSX.utils.table_to_sheet(data);
    }

    throw new Error('Unsupported data format');
  };

  // Helper function to guess the cell type
  const guessValueType = (value: any): string => {
    if (value === null || value === undefined || value === '') return 's'; // String type for empty
    if (typeof value === 'number') return 'n'; // Number type
    if (typeof value === 'boolean') return 'b'; // Boolean type
    if (value instanceof Date) return 'd'; // Date type
    if (typeof value === 'string') {
      // Try to parse as number
      if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) return 'n';
      // Try to parse as date
      const date = new Date(value);
      if (!isNaN(date.getTime())) return 'd';
    }
    return 's'; // Default to string type
  };

  const applyStyling = (worksheet: any, styling: any) => {
    // Apply column widths
    if (styling.columns) {
      worksheet['!cols'] = styling.columns.map((col: any) => {
        return typeof col === 'number'
          ? { wch: col }
          : { wch: col.width || 10 };
      });
    }

    // Apply row heights
    if (styling.rows) {
      worksheet['!rows'] = styling.rows.map((row: any) => {
        return typeof row === 'number'
          ? { hpt: row }
          : { hpt: row.height || 15 };
      });
    }

    // Apply cell styling
    if (styling.cells) {
      Object.entries(styling.cells).forEach(
        ([cellId, cellStyle]: [string, any]) => {
          // Create cell if it doesn't exist
          if (!worksheet[cellId]) {
            worksheet[cellId] = { v: '' };
          }

          // Apply styling
          if (cellStyle) {
            worksheet[cellId].s = convertToExcelStyle(cellStyle);

            // Apply number format if specified
            if (cellStyle.numFmt) {
              worksheet[cellId].z = cellStyle.numFmt;
            }
          }
        }
      );
    }

    // Apply merged cells
    if (styling.merges && Array.isArray(styling.merges)) {
      worksheet['!merges'] = styling.merges
        .map((merge: any) => {
          // Handle { s: {r: 0, c: 0}, e: {r: 1, c: 1} } format
          if (merge.s && merge.e) {
            return merge;
          }

          // Handle { start: 'A1', end: 'B2' } format
          if (merge.start && merge.end) {
            return {
              s: XLSX.utils.decode_cell(merge.start),
              e: XLSX.utils.decode_cell(merge.end),
            };
          }

          // Handle { row: 0, col: 0, rowspan: 2, colspan: 2 } format
          if (
            merge.row !== undefined &&
            merge.col !== undefined &&
            merge.rowspan &&
            merge.colspan
          ) {
            return {
              s: { r: merge.row, c: merge.col },
              e: {
                r: merge.row + merge.rowspan - 1,
                c: merge.col + merge.colspan - 1,
              },
            };
          }

          return null;
        })
        .filter(Boolean);
    }
  };

  // Convert CSS/JS style objects to Excel format
  const convertToExcelStyle = (style: any) => {
    const excelStyle: any = {};

    // Font properties
    const font: any = {};
    let hasFont = false;

    if (style.bold || style.fontWeight === 'bold') {
      font.bold = true;
      hasFont = true;
    }

    if (style.italic || style.fontStyle === 'italic') {
      font.italic = true;
      hasFont = true;
    }

    if (style.underline || style.textDecoration === 'underline') {
      font.underline = true;
      hasFont = true;
    }

    if (style.fontFamily) {
      font.name = style.fontFamily;
      hasFont = true;
    }

    if (style.fontSize) {
      let fontSize = style.fontSize;
      if (typeof fontSize === 'string') {
        const match = fontSize.match(/(\d+)/);
        if (match) fontSize = parseInt(match[1]);
      }
      if (!isNaN(fontSize)) {
        font.sz = fontSize;
        hasFont = true;
      }
    }

    if (style.color) {
      let color = style.color;
      if (typeof color === 'string' && color.startsWith('#')) {
        color = color.substring(1);
      }
      font.color = { rgb: color };
      hasFont = true;
    }

    if (hasFont) {
      excelStyle.font = font;
    }

    // Background color
    if (style.backgroundColor) {
      let bgColor = style.backgroundColor;
      if (typeof bgColor === 'string' && bgColor.startsWith('#')) {
        bgColor = bgColor.substring(1);
      }

      excelStyle.fill = {
        patternType: 'solid',
        fgColor: { rgb: bgColor },
      };
    }

    // Alignment
    const alignment: any = {};
    let hasAlignment = false;

    if (style.textAlign) {
      alignment.horizontal = style.textAlign;
      hasAlignment = true;
    }

    if (style.verticalAlign) {
      alignment.vertical = style.verticalAlign;
      hasAlignment = true;
    }

    if (style.wrapText || style.whiteSpace === 'normal') {
      alignment.wrapText = true;
      hasAlignment = true;
    }

    if (hasAlignment) {
      excelStyle.alignment = alignment;
    }

    // Borders
    const border: any = {};
    let hasBorder = false;

    const borderSides = ['top', 'right', 'bottom', 'left'];
    borderSides.forEach((side) => {
      const borderProp = `border${side.charAt(0).toUpperCase()}${side.slice(
        1
      )}`;
      if (style[borderProp]) {
        border[side] = {
          style: 1, // Default to thin
          color: { rgb: '000000' }, // Default to black
        };
        hasBorder = true;
      }
    });

    if (hasBorder) {
      excelStyle.border = border;
    }

    return excelStyle;
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={exporting}
      className={buttonClassName}
    >
      {exporting ? 'Exporting...' : buttonText}
    </button>
  );
};

export default ExcelExporter;
