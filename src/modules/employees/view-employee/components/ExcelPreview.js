import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelPreview = ({ fileUrl }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Failed to fetch file');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setData(jsonData);
      } catch (err) {
        console.error('Excel preview error:', err);
        Error('Failed to load or parse Excel file.');
      }
    };

    if (fileUrl) fetchExcel();
  }, [fileUrl]);

  return (
    <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
      {data?.length === 0 ? (
        <p>Loading Excel data...</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      background: rowIndex === 0 ? '#f0f0f0' : 'white'
                    }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelPreview;

ExcelPreview.propTypes = {
  fileUrl: PropTypes.string.isRequired
};
