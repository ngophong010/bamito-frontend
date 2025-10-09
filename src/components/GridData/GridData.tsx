"use client";
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import ModalDelete from '../ModalDelete/ModalDelete'; // Assuming this is a simple confirm modal
import './GridData.scss';

// --- PROPS DEFINITION ---
// This component is now generic. It can render a table for ANY type of data.
interface GridDataProps<T extends { id: number }> {
    headerString: string;
    tableData: T[];
    tableColumns: {
        label: string;
        // The 'render' function is the key to making this component reusable
        render: (item: T, index: number) => React.ReactNode;
    }[];
    // Optional functions passed from the parent for actions
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

const GridData = <T extends { id: number }>({
    headerString,
    tableData,
    tableColumns,
    onEdit,
    onDelete,
}: GridDataProps<T>) => {
    
    return (
        <div className="GridData-Global">
            <div className="GridData-Header">
                <h1>{headerString}</h1>
                {/* The "Add New" button is now handled by the parent page */}
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr className="Table-Header">
                            {tableColumns.map((col, index) => <th key={index}>{col.label}</th>)}
                            {(onEdit || onDelete) && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => (
                            <tr className="Table-Element" key={item.id}>
                                {tableColumns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {/* Call the custom render function for each cell */}
                                        {col.render(item, index)}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="actions-cell">
                                        {onEdit && (
                                            <button onClick={() => onEdit(item)} className="action-btn edit">
                                                <FontAwesomeIcon icon={faPencil} />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <ModalDelete handleDelete={() => onDelete(item)} />
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {tableData.length === 0 && (
                <div className="no-data-message">No data found.</div>
            )}

            {/* The Pagination component is now handled by the parent page */}
        </div>
    );
};

export default GridData;
