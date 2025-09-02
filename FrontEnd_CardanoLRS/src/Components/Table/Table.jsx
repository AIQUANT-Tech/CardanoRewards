import React from "react";
import "./Table.css";

const Table = ({
  data,
  columns,
  actions,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="table-container-customer">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {actions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={
                    column.key === "status"
                      ? row[column.key] === "Active"
                        ? "status-active"
                        : "status-inactive"
                      : ""
                  }
                >
                  {row[column.key]}
                </td>
              ))}
              {actions && (
                <td>
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      className={action.className}
                      onClick={() => action.onClick(row.id)}
                    >
                      {action.icon}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            className="next-btn-customer"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Table;
