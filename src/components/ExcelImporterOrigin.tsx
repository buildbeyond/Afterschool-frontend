import { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelImporter = ({ data, setData }: { data: any; setData: any }) => {
  const [workbook, setWorkbook] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Read with full options to preserve formatting
        const wb = XLSX.read(event.target.result, {
          type: 'array',
          cellStyles: true, // Colors and formatting
          cellFormula: true, // Preserve formulas
          cellDates: true, // Handle dates correctly
          cellNF: true, // Number formatting
          sheetStubs: true, // Handle empty cells
        });

        setWorkbook(wb);
        setSheetNames(wb.SheetNames);

        // Set first sheet as active by default
        if (wb.SheetNames.length > 0) {
          setActiveSheet(wb.SheetNames[0]);
          processSheet(wb, wb.SheetNames[0]);
        }
      } catch (error) {
        console.error('Error processing Excel file:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const processSheet = (wb: any, sheetName: string) => {
    const worksheet = wb.Sheets[sheetName];

    // Get the sheet range
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');

    // Create a data grid with proper dimensions
    const newData = [];
    for (let r = 0; r <= range.e.r; r++) {
      const row = [];
      for (let c = 0; c <= range.e.c; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        const cell = worksheet[cellRef];

        // Extract cell data and styling
        const cellData = {
          value: cell ? cell.w || cell.v || '' : '',
          style: {
            ...extractCellStyle(cell),
            overflow: 'visible',
            whiteSpace: 'nowrap',
            width: '10px',
          },
          formula: cell && cell.f ? cell.f : null,
          cellRef,
        };

        row.push(cellData);
      }
      newData.push(row);
    }

    // Handle merged cells
    const merges = worksheet['!merges'] || [];
    for (const merge of merges) {
      const { s, e } = merge; // start and end cells

      // Mark merged cells
      for (let r = s.r; r <= e.r; r++) {
        for (let c = s.c; c <= e.c; c++) {
          if (r === s.r && c === s.c) {
            // This is the main cell
            if (newData[r] && newData[r][c]) {
              newData[r][c].merged = {
                rowspan: e.r - s.r + 1,
                colspan: e.c - s.c + 1,
              };
            }
          } else {
            // These are the cells that should be hidden
            if (newData[r] && newData[r][c]) {
              newData[r][c].hidden = true;
            }
          }
        }
      }
    }

    setData(newData);
  };

  // Switch to another sheet
  const handleSheetChange = (e: any) => {
    const sheetName = e.target.value;
    setActiveSheet(sheetName);
    processSheet(workbook, sheetName);
  };

  // Helper function to extract and convert Excel styles to CSS
  const extractCellStyle = (cell: any) => {
    if (!cell || !cell.s) return {};

    const style = cell.s;
    const css: any = {};

    // Font styles
    if (style.font) {
      if (style.font.bold) css.fontWeight = 'bold';
      if (style.font.italic) css.fontStyle = 'italic';
      if (style.font.underline) css.textDecoration = 'underline';
      if (style.font.name) css.fontFamily = style.font.name;
      if (style.font.sz) css.fontSize = `${style.font.sz}pt`;

      // Font color
      if (style.font.color && style.font.color.rgb) {
        css.color = `#${style.font.color.rgb}`;
      }
    }

    // Cell fill/background
    if (style.fill && style.fill.fgColorRGB) {
      css.backgroundColor = `#${style.fill.fgColorRGB}`;
    }

    // Alignment
    if (style.alignment) {
      if (style.alignment.horizontal)
        css.textAlign = style.alignment.horizontal;
      if (style.alignment.vertical)
        css.verticalAlign = style.alignment.vertical;
      if (style.alignment.wrapText) css.whiteSpace = 'normal';
    }

    // Borders
    if (style.border) {
      const borderSides = ['top', 'right', 'bottom', 'left'];
      borderSides.forEach((side) => {
        const borderStyle = style.border[side];
        if (borderStyle && borderStyle.style) {
          // Convert Excel border style to CSS
          const width = borderStyle.style > 1 ? '2px' : '1px';
          const color =
            borderStyle.color && borderStyle.color.rgb
              ? `#${borderStyle.color.rgb}`
              : 'black';

          css[
            `border${side.charAt(0).toUpperCase() + side.slice(1)}`
          ] = `${width} solid ${color}`;
        }
      });
    }

    return css;
  };

  return (
    <div className="excel-importer">
      <div className="upload-container mb-4">
        <input
          type="file"
          accept=".xlsx,.xls,.xlsm,.xlsb"
          onChange={handleFileUpload}
          className="rounded border p-2"
        />
      </div>

      {sheetNames.length > 0 && (
        <div className="sheet-selector mb-4">
          <label className="mr-2">Sheet: </label>
          <select
            value={activeSheet}
            onChange={handleSheetChange}
            className="rounded border p-1"
          >
            {sheetNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {data.length > 0 && (
        <div className="excel-table-container overflow-auto">
          <table className="excel-table border-collapse">
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map(
                    (cell, colIndex) =>
                      !cell.hidden && (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          style={cell.style}
                          rowSpan={cell.merged ? cell.merged.rowspan : 1}
                          colSpan={cell.merged ? cell.merged.colspan : 1}
                          title={
                            cell.formula
                              ? `Formula: ${cell.formula}`
                              : undefined
                          }
                          className="border-gray-300 border p-1"
                        >
                          {cell.value}
                        </td>
                      )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// export default ExcelImporter;
