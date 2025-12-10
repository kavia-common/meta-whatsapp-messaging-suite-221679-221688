import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple Table component with accessible semantics.
 * columns: [{ key, header, align }]
 * data: array of records; uses column.key to read values (function or key string)
 */
// PUBLIC_INTERFACE
export default function Table({ columns = [], data = [], emptyMessage = 'No data', dense = false }) {
  return (
    <div className="table-wrapper">
      <table className={`table ${dense ? 'table--dense' : ''}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align || 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => {
                  const value = typeof col.key === 'function' ? col.key(row) : row[col.key];
                  return (
                    <td key={String(col.key)} style={{ textAlign: col.align || 'left' }}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      header: PropTypes.node.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right'])
    })
  ),
  data: PropTypes.arrayOf(PropTypes.object),
  emptyMessage: PropTypes.node,
  dense: PropTypes.bool
};
