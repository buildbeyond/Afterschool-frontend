import { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelImporter = ({ workbook, setWorkbook }) => {
  const [data, setData] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Read with full options to preserve formatting
        // Use the SheetJS binary string format for better style support
        const wb = XLSX.read(event.target.result, {
          type: 'binary',
          cellStyles: true, // Colors and formatting
          cellFormula: true, // Preserve formulas
          cellDates: true, // Handle dates correctly
          cellNF: true, // Number formatting
          sheetStubs: true, // Handle empty cells
          cellText: false, // Don't convert to text to preserve raw values
          cellHTML: false, // Don't generate HTML (not needed)
          WTF: true, // Enable full error reporting
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

  const processSheet = (wb, sheetName) => {
    const worksheet = wb.Sheets[sheetName];

    // Get the sheet range
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');

    // Extract workbook styles if available
    const workbookStyles = wb.Styles || {};
    const fills = workbookStyles.Fills || [];
    const fonts = workbookStyles.Fonts || [];
    const borders = workbookStyles.Borders || [];
    const numFmts = workbookStyles.NumFmts || {};
    const cellXf = workbookStyles.CellXf || [];

    // Create a data grid with proper dimensions
    const newData = [];
    for (let r = 0; r <= range.e.r; r++) {
      const row = [];
      for (let c = 0; c <= range.e.c; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        const cell = worksheet[cellRef];

        // Get extra style information from the full style collections if cell has a style index
        let extendedStyle: any = {};
        // Map style index to fills, fonts, etc.
        const xf = cellXf[cell.s];
        if (xf) {
          // Get fill from fill index
          if (xf.fillId !== undefined && fills[xf.fillId]) {
            extendedStyle.fill = fills[xf.fillId];
          }

          // Get font from font index
          if (xf.fontId !== undefined && fonts[xf.fontId]) {
            extendedStyle.font = fonts[xf.fontId];
          }

          // Get border from border index
          if (xf.borderId !== undefined && borders[xf.borderId]) {
            extendedStyle.border = borders[xf.borderId];
          }

          // Get number format
          if (xf.numFmtId !== undefined) {
            extendedStyle.numFmt = numFmts[xf.numFmtId] || xf.numFmtId;
          }

          // Get alignment
          if (xf.alignment) {
            extendedStyle.alignment = xf.alignment;
          }
        }

        // Extract cell data and styling
        const cellData = {
          value: cell ? cell.w || cell.v || '' : '',
          style: extractCellStyle(cell, extendedStyle),
          formula: cell && cell.f ? cell.f : null,
          cellRef,
          // For debugging: include the raw style data
          rawStyle: cell && cell.s ? cell.s : null,
          extStyle: extendedStyle,
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
  const handleSheetChange = (e) => {
    const sheetName = e.target.value;
    setActiveSheet(sheetName);
    processSheet(workbook, sheetName);
  };

  // Helper function to extract and convert Excel styles to CSS
  const extractCellStyle = (cell: any, extendedStyle: any = {}) => {
    if (!cell) return {};

    const css: any = {};

    // Combine regular cell styles with extended styles
    const cellStyle = typeof cell.s === 'object' ? cell.s : {};

    // Common indexed color map
    const indexedColors = [
      '#000000',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF',
      '#000000',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF',
      '#800000',
      '#008000',
      '#000080',
      '#808000',
      '#800080',
      '#008080',
      '#C0C0C0',
      '#808080',
      '#9999FF',
      '#993366',
      '#FFFFCC',
      '#CCFFFF',
      '#660066',
      '#FF8080',
      '#0066CC',
      '#CCCCFF',
      '#000080',
      '#FF00FF',
      '#FFFF00',
      '#00FFFF',
      '#800080',
      '#800000',
      '#008080',
      '#0000FF',
      '#00CCFF',
      '#CCFFFF',
      '#CCFFCC',
      '#FFFF99',
      '#99CCFF',
      '#FF99CC',
      '#CC99FF',
      '#FFCC99',
      '#3366FF',
      '#33CCCC',
      '#99CC00',
      '#FFCC00',
      '#FF9900',
      '#FF6600',
      '#666699',
      '#969696',
      '#003366',
      '#339966',
      '#003300',
      '#333300',
      '#993300',
      '#993366',
      '#333399',
      '#333333',
    ];

    // Helper function to extract color correctly
    const getColorValue = (color) => {
      if (!color) return null;

      // Handle direct RGB value (most common)
      if (color.rgb) return `#${color.rgb}`;

      // Handle indexed colors
      if (color.indexed !== undefined) {
        return indexedColors[color.indexed] || '#000000';
      }

      // Handle theme colors
      if (color.theme !== undefined) {
        // Simplified theme color mapping (can be expanded)
        const themeColors = {
          0: '#FFFFFF', // Light 1
          1: '#000000', // Dark 1
          2: '#E7E6E6', // Light 2
          3: '#44546A', // Dark 2
          4: '#4472C4', // Accent 1
          5: '#ED7D31', // Accent 2
          6: '#A5A5A5', // Accent 3
          7: '#FFC000', // Accent 4
          8: '#5B9BD5', // Accent 5
          9: '#70AD47', // Accent 6
          10: '#787878', // Hyperlink
          11: '#3E8853', // Followed Hyperlink
        };
        const baseColor = themeColors[color.theme] || '#000000';

        // Apply tint if provided (simplified)
        if (color.tint !== undefined) {
          // Simple tint implementation
          return baseColor;
        }

        return baseColor;
      }

      return null;
    };

    // Get the font from extended style or cell style
    const font = extendedStyle.font || cellStyle.font || {};
    if (font) {
      if (font.bold) css.fontWeight = 'bold';
      if (font.italic) css.fontStyle = 'italic';
      if (font.underline) css.textDecoration = 'underline';
      if (font.name) css.fontFamily = font.name;
      if (font.sz) css.fontSize = `${font.sz}pt`;

      // Font color
      const fontColor = getColorValue(font.color);
      if (fontColor) css.color = fontColor;
    }

    // Get fill from extended style or cell style
    const fill = cellStyle;
    if (fill) {
      // Handle different fill patterns - patternType 'solid' is most common
      const fgColor = getColorValue(fill.fgColor);
      const bgColor = getColorValue(fill.bgColor);

      // Prefer foreground color for background
      if (fgColor) {
        css.backgroundColor = fgColor;
      }

      if (bgColor) {
        css.color = bgColor;
      }
    }

    // Alignment from extended style or cell style
    const alignment = extendedStyle.alignment || cellStyle.alignment || {};
    if (alignment) {
      if (alignment.horizontal) css.textAlign = alignment.horizontal;
      if (alignment.vertical)
        css.verticalAlign =
          alignment.vertical === 'center' ? 'middle' : alignment.vertical;
      if (alignment.wrapText) css.whiteSpace = 'normal';
    }

    // Get border from extended style or cell style
    const border = extendedStyle.border || cellStyle.border || {};
    if (border) {
      const borderSides = ['top', 'right', 'bottom', 'left'];
      const borderStyles = {
        thin: '1px solid',
        medium: '2px solid',
        thick: '3px solid',
        hair: '1px dotted',
        dashed: '1px dashed',
        dotted: '1px dotted',
        double: '3px double',
        slantDashDot: '1px dashed',
        dashDot: '1px dashed',
        dashDotDot: '1px dashed',
        mediumDashed: '2px dashed',
        mediumDashDot: '2px dashed',
        mediumDashDotDot: '2px dashed',
      };

      borderSides.forEach((side) => {
        const borderStyle = border[side];
        if (borderStyle && borderStyle.style && borderStyle.style !== 'none') {
          const styleValue = borderStyles[borderStyle.style] || '1px solid';
          const colorValue = getColorValue(borderStyle.color) || '#000000';

          css[
            `border${side.charAt(0).toUpperCase() + side.slice(1)}`
          ] = `${styleValue} ${colorValue}`;
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

export default ExcelImporter;
