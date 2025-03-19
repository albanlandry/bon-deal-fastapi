import React, { useState } from "react";
import { JsonObject } from "../../utils/global";

type Column<T extends JsonObject> = {
  key: string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
};

type TableComponentProps<T extends JsonObject> = {
  data: T[];
  columns: Column<T>[];
  showRowNumber?: boolean;
  noDataMessage?: Record<string, string>;
  language?: string;
  selectionMode?: "single" | "multiple";
  collapseRow?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
};

const ListTableUI = <T extends JsonObject>({
    data,
    columns,
    showRowNumber = false,
    noDataMessage = { en: "Data not found" },
    language = "en",
    selectionMode = "multiple",
    collapseRow = true,
    onSelectionChange,
}: TableComponentProps<T>) => {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedItems, setSelectedItems] = useState<T[]>([]);

    // Sorting logic
    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;

        const valA = a[sortKey];
        const valB = b[sortKey];
        
        if (valA === undefined || valB === undefined) return 0;

        if (typeof valA === "number" && typeof valB === "number") {
            return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        return sortOrder === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const toggleSelection = (item: T) => {
        if (selectionMode === "multiple") {
            const exists = selectedItems.includes(item);
            const updated = exists
                ? selectedItems.filter((i) => i !== item)
                : [...selectedItems, item];
            setSelectedItems(updated);
            onSelectionChange?.(updated);
        } else if (selectionMode === "single") {
            const updated = selectedItems.includes(item) ? [] : [item];
            setSelectedItems(updated);
            onSelectionChange?.(updated);
        }
    };

    const isSelected = (item: T) => selectedItems.includes(item);

    return (
        <div 
            // className="border border-gray-300 rounded overflow-hidden w-full"
            className="border-gray-300 rounded overflow-hidden w-full"
        >
          {/* Header */}
          <ul 
            className="hidden sm:flex bg-gray-100 font-semibold border-gray-300"
            >
            {selectionMode === "multiple" && (
              <li className="w-12 p-2 border-gray-300 text-center">
                {/* Optional Select All checkbox */}
              </li>
            )}
            {showRowNumber && (
              <li className="flex-1 p-2 sm:max-w-12 border-r border-gray-300 text-center">#</li>
            )}
            {columns.map((column) => (
              <li
                key={column.key}
                className={`flex-1 p-2 last:border-r-0 border-gray-300 cursor-pointer select-none ${column.sortable ? "hover:bg-gray-200" : ""}`}
                // className={`flex-1 p-2 border-r last:border-r-0 border-gray-300 cursor-pointer select-none ${column.sortable ? "hover:bg-gray-200" : ""}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center justify-between">
                  {column.header}
                  {column.sortable && sortKey === column.key && (
                    <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
    
          {/* Data Rows */}
          {sortedData.length === 0 ? (
            <ul className="flex justify-center items-center p-4 text-gray-500">
              <li className="text-center w-full">
                {noDataMessage[language] || noDataMessage["en"]}
              </li>
            </ul>
          ) : (
            sortedData.map((item, rowIndex) => (
              <ul
                key={rowIndex}
                className={`flex flex-col border sm:flex-row ${collapseRow ? 'mb-0' : 'mb-2'} py-[0.2em] last:mb-0 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-white" // "bg-gray-50"
                } hover:bg-gray-200 border-b border-gray-200 ${
                  isSelected(item) ? "bg-blue-100" : ""
                } cursor-pointer`}
                onClick={() => toggleSelection(item)}
              >
                {selectionMode === "multiple" && (
                  <li 
                    // className="w-12 p-2 border-b sm:border-r sm:border-b-0 border-gray-300 text-center hidden sm:block"
                    className="w-12 p-2 border-b sm:border-b-0 border-gray-300 text-center hidden sm:block"
                    >
                    <input
                      type="checkbox"
                      checked={isSelected(item)}
                      onChange={() => toggleSelection(item)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </li>
                )}
                {showRowNumber && (
                  <li 
                    // className="flex-1 p-2 sm:max-w-12 border-b sm:border-r sm:border-b-0 border-gray-300 text-center"
                    className="flex-1 p-2 sm:max-w-12 border-b sm:border-b-0 border-gray-300 text-center"
                    >
                    <strong className="sm:hidden block">#</strong> {rowIndex + 1}
                  </li>
                )}
                {columns.map((column) => (
                  <li
                    key={column.key}
                    // className="flex-1 p-2 border-b sm:border-r sm:border-b-0 last:border-r-0 border-gray-300 sm:text-left"
                    className="flex-1 p-2 border-b  sm:border-b-0 last:border-r-0 border-gray-300 sm:text-left"
                  >
                    <strong className="sm:hidden block mb-1">{column.header}:</strong>
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key] ?? "-"}
                  </li>
                ))}
              </ul>
            ))
          )}
        </div>
    );
};

export default ListTableUI;