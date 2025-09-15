import React from "react";

export default function TableView({ tableData }) {
  return (
    <div className="overflow-auto rounded-xl shadow-xl border border-[#A6B1E1] p-4 bg-gradient-to-br from-[#424874] to-[#DCD6F7]">
      <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-[#424874] to-[#3A8EBB] text-white">
          <tr>
            {Object.keys(tableData[0] || {}).map((key) => (
              <th 
                key={key} 
                className="px-6 py-4 border-b border-[#A6B1E1] text-left font-semibold text-sm uppercase tracking-wider"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[#F4EEFF] bg-opacity-95">
          {tableData.map((row, idx) => (
            <tr 
              key={idx} 
              className={idx % 2 === 0 ? "bg-[#F4EEFF] hover:bg-[#E0ECFF]" : "bg-[#D6E6FF] hover:bg-[#C9DCFF]"}
            >
              {Object.values(row).map((val, i) => (
                <td 
                  key={i} 
                  className="px-6 py-4 border-b border-[#DCD6F7] text-[#424874] font-medium"
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {tableData.length === 0 && (
        <div className="text-center py-8 text-[#424874] bg-[#F4EEFF] bg-opacity-50">
          No data available
        </div>
      )}
    </div>
  );
}