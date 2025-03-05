// src/components/ExcelProcessor.tsx
import React from 'react';
import { useExcelProcessor } from '../hooks/useExelProcessor';

const ExcelProcessor: React.FC = () => {
  const {
    files,
    activeFile,
    searchConfig,
    searchResults,
    handleFileUpload,
    handleFileSelect,
    handleFileStop,
    handleFileDelete,
    handleColumnSelect,
    handleSearchValuesChange,
    performSearch,
  } = useExcelProcessor();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const onSearchValuesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const values = event.target.value
      .split('\n')
      .filter((v) => v.trim() !== '');
    handleSearchValuesChange(values);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Excel Processor
      </h1>

      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Upload Excel File
        </h2>
        <label className="block">
          <span className="sr-only">Choose file</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                "
          />
        </label>
      </div>

      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Saved Files
        </h2>
        {files.length > 0 ? (
          <ul className="space-y-2">
            {files.map((file) => (
               <li key={file.id} className={`flex justify-between items-center p-3 rounded-md ${activeFile?.id === file.id ? 'bg-blue-100' : 'bg-gray-50'}`}>
               <span className={`font-medium ${activeFile?.id === file.id ? 'text-blue-700' : 'text-gray-700'}`}>
                 {file.name}
               </span>
               <div>
                 {activeFile?.id === file.id ? (
                   <button 
                     onClick={handleFileStop} 
                     className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm mr-2 hover:bg-yellow-600 transition duration-300"
                   >
                     Stop
                   </button>
                 ) : (
                   <button 
                     onClick={() => handleFileSelect(file.id)} 
                     className="bg-green-500 text-white px-3 py-1 rounded-md text-sm mr-2 hover:bg-green-600 transition duration-300"
                   >
                     Use
                   </button>
                 )}
                 <button 
                   onClick={() => handleFileDelete(file.id)} 
                   className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition duration-300"
                 >
                   Delete
                 </button>
               </div>
             </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No files uploaded yet.</p>
        )}
      </div>

      {activeFile && (
        <div className="mb-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Selected File: {activeFile.name}
          </h2>
          <select
            onChange={(e) => handleColumnSelect(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a column</option>
            {activeFile.headers.map((header, index) => (
              <option key={index} value={index}>
                {header}
              </option>
            ))}
          </select>
        </div>
      )}

      {searchConfig && (
        <div className="mb-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Search Values
          </h2>
          <textarea
            value={searchConfig.searchValues.join('\n')}
            onChange={onSearchValuesChange}
            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Enter search values, one per line"
          />
          <button
            onClick={performSearch}
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Search
          </button>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="flex flex-col justify-center items-center">
          <div className="w-[150%] bg-white shadow-md rounded-lg p-6 ">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Search Results
            </h2>
            <p className="mb-4 text-gray-600">
              Found {searchResults.length} matches
            </p>
            <div className="overflow-auto max-h-[500px]"> {/* Adicionado container com scroll */}
            <table className="w-full border-collapse table-auto">
              <thead className="sticky top-0 bg-gray-100 shadow-sm">
                <tr>
                  {activeFile?.headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchResults.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelProcessor;
