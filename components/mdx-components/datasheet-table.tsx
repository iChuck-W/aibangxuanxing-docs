import React from 'react';

interface DatasheetTableProps {
  data: (string | null)[][];
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    overflowX: 'auto',
    margin: '20px 0',
  },
  table: {
    width: 'auto',
    borderCollapse: 'collapse',
    fontSize: '14px',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  headerRow: {
    backgroundColor: '#f8f9fa',
  },
  paramHeader: {
    padding: '12px 8px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
    borderRight: '1px solid #dee2e6',
    width: '200px',
    position: 'sticky',
    left: 0,
    backgroundColor: '#f8f9fa',
    zIndex: 10,
  },
  modelHeader: {
    padding: '12px 8px',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
    borderRight: '1px solid #dee2e6',
    minWidth: '150px',
    backgroundColor: '#f8f9fa',
  },
  categoryRow: {
    padding: '10px 8px',
    textAlign: 'left',
    borderBottom: '1px solid #dee2e6',
    fontWeight: 'bold',
    paddingLeft: '16px',
  },
  paramCell: {
    padding: '10px 8px',
    fontWeight: '500',
    borderBottom: '1px solid #dee2e6',
    borderRight: '1px solid #dee2e6',
    position: 'sticky',
    left: 0,
    zIndex: 5,
    whiteSpace: 'pre-wrap',
  },
  dataCell: {
    padding: '10px 8px',
    textAlign: 'center',
    borderBottom: '1px solid #dee2e6',
    borderRight: '1px solid #dee2e6',
    whiteSpace: 'pre-wrap',
  },
};

export const DatasheetTable: React.FC<DatasheetTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>暂无数据</div>;
  }

  // 检查数据是按行还是按列组织
  const isRowOriented = data[0] && data[0].length > 1 && data[0][0] !== '参数';

  if (isRowOriented) {
    // 按行组织的数据
    const [headerRow, ...dataRows] = data;
    const modelNames = headerRow?.slice(1) || [];

    return (
      <div className="datasheet-table-container" style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.paramHeader}>{headerRow?.[0] || '参数'}</th>
              {modelNames.map((modelName, index) => (
                <th key={index} style={styles.modelHeader}>
                  {modelName || '未知型号'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => {
              const paramName = row[0];
              const rowValues = row.slice(1);
              const nonEmptyValues = rowValues.filter(
                (val) => val !== null && val !== undefined && val !== '',
              );

              const isCategoryRow = nonEmptyValues.length === 0;

              if (isCategoryRow) {
                return (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor:
                        rowIndex % 2 === 0 ? '#f0f2f5' : '#e9ecef',
                    }}
                  >
                    <td
                      colSpan={modelNames.length + 1}
                      style={styles.categoryRow}
                    >
                      {paramName}
                    </td>
                  </tr>
                );
              }

              const rowStyle = {
                backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8f9fa',
              };

              return (
                <tr key={rowIndex} style={rowStyle}>
                  <td
                    style={{
                      ...styles.paramCell,
                      backgroundColor: rowStyle.backgroundColor,
                    }}
                  >
                    {paramName}
                  </td>

                  {(() => {
                    const cells = [];
                    for (let i = 0; i < rowValues.length; ) {
                      const cellValue = rowValues[i];

                      if (
                        cellValue === null ||
                        cellValue === undefined ||
                        cellValue === ''
                      ) {
                        cells.push(
                          <td key={i} style={styles.dataCell}>
                            {' - '}
                          </td>,
                        );
                        i++;
                      } else {
                        let colSpan = 1;
                        for (let j = i + 1; j < rowValues.length; j++) {
                          if (
                            rowValues[j] === null ||
                            rowValues[j] === undefined ||
                            rowValues[j] === ''
                          ) {
                            colSpan++;
                          } else {
                            break;
                          }
                        }

                        cells.push(
                          <td
                            key={i}
                            colSpan={colSpan}
                            style={{
                              ...styles.dataCell,
                              fontWeight: colSpan > 1 ? '500' : 'normal',
                            }}
                          >
                            {cellValue === '●'
                              ? '●'
                              : cellValue === '√'
                                ? '✓'
                                : cellValue}
                          </td>,
                        );
                        i += colSpan;
                      }
                    }
                    return cells;
                  })()}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    // 按列组织的数据（原有逻辑）
    const [paramColumn, ...modelColumns] = data;
    const modelNames = modelColumns.map((column) => column[0] || '未知型号');

    return (
      <div className="datasheet-table-container" style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.paramHeader}>{paramColumn[0] || '参数'}</th>
              {modelNames.map((modelName, index) => (
                <th key={index} style={styles.modelHeader}>
                  {modelName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paramColumn.slice(1).map((paramName, rowIndex) => {
              const actualRowIndex = rowIndex + 1;
              const rowValues = modelColumns.map(
                (column) => column[actualRowIndex],
              );
              const nonEmptyValues = rowValues.filter(
                (val) => val !== null && val !== undefined && val !== '',
              );

              const isCategoryRow = nonEmptyValues.length === 0;

              if (isCategoryRow) {
                return (
                  <tr
                    key={actualRowIndex}
                    style={{
                      backgroundColor:
                        rowIndex % 2 === 0 ? '#f0f2f5' : '#e9ecef',
                    }}
                  >
                    <td
                      colSpan={modelColumns.length + 1}
                      style={styles.categoryRow}
                    >
                      {paramName}
                    </td>
                  </tr>
                );
              }

              const rowStyle = {
                backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8f9fa',
              };

              return (
                <tr key={actualRowIndex} style={rowStyle}>
                  <td
                    style={{
                      ...styles.paramCell,
                      backgroundColor: rowStyle.backgroundColor,
                    }}
                  >
                    {paramName}
                  </td>

                  {(() => {
                    const cells = [];
                    for (let i = 0; i < rowValues.length; ) {
                      const cellValue = rowValues[i];

                      if (
                        cellValue === null ||
                        cellValue === undefined ||
                        cellValue === ''
                      ) {
                        cells.push(
                          <td key={i} style={styles.dataCell}>
                            {' - '}
                          </td>,
                        );
                        i++;
                      } else {
                        let colSpan = 1;
                        for (let j = i + 1; j < rowValues.length; j++) {
                          if (
                            rowValues[j] === null ||
                            rowValues[j] === undefined ||
                            rowValues[j] === ''
                          ) {
                            colSpan++;
                          } else {
                            break;
                          }
                        }

                        cells.push(
                          <td
                            key={i}
                            colSpan={colSpan}
                            style={{
                              ...styles.dataCell,
                              fontWeight: colSpan > 1 ? '500' : 'normal',
                            }}
                          >
                            {cellValue === '●'
                              ? '●'
                              : cellValue === '√'
                                ? '✓'
                                : cellValue}
                          </td>,
                        );
                        i += colSpan;
                      }
                    }
                    return cells;
                  })()}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};
