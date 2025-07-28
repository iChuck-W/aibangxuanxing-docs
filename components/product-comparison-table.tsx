'use client';

import React from 'react';

interface ProductData {
  models?: Record<string, string[]> | string[];
  sections?: Record<string, Record<string, any>> | any[];
  notes?: string[];
}

interface ProductComparisonTableProps {
  data: ProductData;
}

// Render array format data
const renderArrayFormat = (sectionsArray: any[], notes: string[] = []) => {
  if (!sectionsArray || sectionsArray.length === 0) {
    return <div>No data available</div>;
  }
  
  // Get all fields from the first object as column headers
  const columns = Object.keys(sectionsArray[0]);
  
  return (
    <>
      <style jsx>{`
        .product-comparison-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ddd;
          font-family: Arial, sans-serif;
          margin: 20px 0;
        }
        
        .product-comparison-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        
        .product-comparison-table td.center {
          text-align: center;
        }
        
        .product-comparison-table td:first-child {
          background-color: #f8f9fa;
          font-weight: 500;
          min-width: 120px;
        }
        
        .header-cell {
          background-color: #f1f3f4;
          font-weight: bold;
          text-align: center;
        }
        
        .notes-row {
          background-color: #f8f9fa;
          font-size: 0.9em;
          color: #666;
        }
      `}</style>
      
      <table className="product-comparison-table">
        {/* Header row */}
        <tr>
          {columns.map((column, index) => (
            <td key={index} className="header-cell">
              <strong>{column}</strong>
            </td>
          ))}
        </tr>
        
        {/* Data rows */}
        {sectionsArray.map((item, index) => (
          <tr key={index}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>{item[column] || ''}</td>
            ))}
          </tr>
        ))}
        
        {/* Notes row */}
        {notes.map((note, index) => (
          <tr key={`note-${index}`}>
            <td colSpan={columns.length} className="notes-row">{note}</td>
          </tr>
        ))}
      </table>
    </>
  );
};

export const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ 
  data, 
}) => {
  const { models, sections, notes = [] } = data;
  
  // Auto detect data format and handle
  if (Array.isArray(sections)) {
    // Format 1: Simple Feature Comparison
    return renderArrayFormat(sections, notes);
  }
  
  // Format 2: Advanced Technical Specifications
  const { headerLabel, modelList } = models 
    ? (Array.isArray(models) 
        ? { headerLabel: '', modelList: models }
        : { headerLabel: Object.keys(models)[0], modelList: Object.values(models)[0] })
    : { headerLabel: '', modelList: [] };

  const renderCellContent = (specData: any, sectionName: string, specName: string) => {
    if (Array.isArray(specData)) {

      return (
        <tr key={`${sectionName}-${specName}`}>
          <td dangerouslySetInnerHTML={{__html: specName.replace(/\n/g, '<br />')}} />
          {specData.map((value, index) => (
            <td key={`${sectionName}-${specName}-${index}`}>{value}</td>
          ))}
        </tr>
      );
    } else if (specData.type === 'fullspan') {

      return (
        <tr key={`${sectionName}-${specName}`}>
          <td dangerouslySetInnerHTML={{__html: specName.replace(/\n/g, '<br />')}} />
          <td colSpan={modelList.length} dangerouslySetInnerHTML={{__html: specData.data}} />
        </tr>
      );
    } else if (specData.type === 'colspan') {

      return (
        <tr key={`${sectionName}-${specName}`}>
          <td dangerouslySetInnerHTML={{__html: specName.replace(/\n/g, '<br />')}} />
          {specData.data.map((value: string, index: number) => (
            <td 
              key={`${sectionName}-${specName}-${index}`}
              colSpan={specData.spans[index]}
              className={specData.className || ''}
              dangerouslySetInnerHTML={{__html: value}}
            />
          ))}
        </tr>
      );
    } else if (specData.type === 'multirow') {

      return specData.data.map((rowData: string, rowIndex: number) => (
        <tr key={`${sectionName}-${specName}-${rowIndex}`}>
          {rowIndex === 0 && (
            <td rowSpan={specData.rowspan}>{specName}</td>
          )}
          <td colSpan={modelList.length} dangerouslySetInnerHTML={{__html: rowData}} />
        </tr>
      ));
    }
    return null;
  };

  return (
    <>
      <style jsx>{`
        .product-comparison-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ddd;
          font-family: Arial, sans-serif;
          margin: 20px 0;
        }
        
        .product-comparison-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        
        .product-comparison-table td.center {
          text-align: center;
        }
        
        .product-comparison-table td:first-child {
          background-color: #f8f9fa;
          font-weight: 500;
          min-width: 120px;
        }
        
        .section-header {
          background-color: #e9ecef;
          font-weight: bold;
          text-align: center;
        }
        
        .header-cell {
          background-color: #f1f3f4;
          font-weight: bold;
          text-align: center;
        }
        
        .notes-row {
          background-color: #f8f9fa;
          font-size: 0.9em;
          color: #666;
        }
      `}</style>
      
      <table className="product-comparison-table">
        {/* Header row */}
        <tr>
          <td className="header-cell">
            {headerLabel && <strong>{headerLabel}</strong>}
          </td>
          {modelList.map((model, index) => (
            <td key={index} className="header-cell">{model}</td>
          ))}
        </tr>
        
        {/* Dynamic generation of various sections */}
        {sections && Object.entries(sections).map(([sectionName, sectionData]) => (
          <React.Fragment key={`fragment-${sectionName}`}>
            {/* Section title row */}
            <tr key={`section-${sectionName}`}>
              <td colSpan={modelList.length + 1} className="section-header">
                <strong>{sectionName}</strong>
              </td>
            </tr>
            
            {Object.entries(sectionData).map(([specName, specData]) => 
              renderCellContent(specData, sectionName, specName)
            )}
          </React.Fragment>
        ))}
        
        {/* Notes row */}
        {notes.map((note, index) => (
          <tr key={`note-${index}`}>
            <td colSpan={modelList.length + 1} className="notes-row">{note}</td>
          </tr>
        ))}
      </table>
    </>
  );
};
