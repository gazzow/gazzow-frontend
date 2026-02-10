'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, X, Filter } from 'lucide-react';

// Type definitions
interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface SortConfig<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

interface DataRow {
  id: number | string;
}

interface AdvancedTableProps<T extends DataRow> {
  data: T[];
  columns: Column<T>[];
}

// Sample data structure
interface SampleDataType extends DataRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
}

type SortableValue = string | number | boolean | Date;

export default function AdvancedTable<T extends DataRow>({ 
  data, 
  columns
}: AdvancedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({});
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Get unique values for each filterable column
  const getUniqueValues = (key: keyof T): string[] => {
    return [...new Set(data.map(item => String(item[key])))].filter(Boolean);
  };

  // Handle sorting
  const handleSort = (key: keyof T): void => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof T, value: string): void => {
    setFilters(prev => {
      if (!value) {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      return { ...prev, [key]: value };
    });
  };

  // Clear all filters
  const clearFilters = (): void => {
    setFilters({});
    setSearchTerm('');
  };

  // Type guard for sortable values
  const isSortableValue = (value: unknown): value is SortableValue => {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value instanceof Date
    );
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(item =>
        (Object.keys(item) as Array<keyof T>).some(key => {
          const value = item[key];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply column filters
    (Object.entries(filters) as Array<[keyof T, string]>).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => String(item[key]) === value);
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof T];
        const bVal = b[sortConfig.key as keyof T];
        
        if (!isSortableValue(aVal) || !isSortableValue(bVal)) return 0;
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortConfig]);

  const activeFilterCount = Object.keys(filters).length + (searchTerm ? 1 : 0);

  // Helper to render cell content
  const renderCellContent = (row: T, columnKey: keyof T): string => {
    const value = row[columnKey];
    return String(value);
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      {/* Header with search and filter toggle */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {columns.filter(col => col.filterable).map(col => (
                <div key={String(col.key)}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {col.label}
                  </label>
                  <select
                    value={filters[col.key] || ''}
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    {getUniqueValues(col.key).map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`w-3 h-3 ${
                            sortConfig.key === col.key && sortConfig.direction === 'asc'
                              ? 'text-blue-500'
                              : 'text-gray-400'
                          }`}
                        />
                        <ChevronDown
                          className={`w-3 h-3 -mt-1 ${
                            sortConfig.key === col.key && sortConfig.direction === 'desc'
                              ? 'text-blue-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedData.length > 0 ? (
              processedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {col.key === 'status' ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row[col.key] === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {renderCellContent(row, col.key)}
                        </span>
                      ) : (
                        renderCellContent(row, col.key)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {processedData.length} of {data.length} results
      </div>
    </div>
  );
}