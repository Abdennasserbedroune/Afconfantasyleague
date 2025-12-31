import React from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  align?: 'left' | 'right';
}

interface LeaderboardTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  getRowClassName?: (row: T) => string;
  getRowKey?: (row: T) => string | number;
}

export default function LeaderboardTable<T>({
  columns,
  data,
  onRowClick,
  getRowClassName,
  getRowKey
}: LeaderboardTableProps<T>) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={col.align === 'right' ? 'right' : ''}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => {
          const key = getRowKey ? getRowKey(row) : idx;

          return (
            <tr
              key={key}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              data-clickable={Boolean(onRowClick)}
              className={getRowClassName ? getRowClassName(row) : ''}
              tabIndex={onRowClick ? 0 : -1}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
            >
              {columns.map((col) => (
                <td key={col.key} className={col.align === 'right' ? 'right' : ''}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
