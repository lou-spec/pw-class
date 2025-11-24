import { Table as TableReact } from "reactstrap";
import _ from "lodash";

const Table = ({ columns = [], rows = {
    data: [],
    pagination: {}
}}) => {
    const formatValue = (column, value) => {
        if (column === "date" && value) {
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return value;
    };

    return (
        <TableReact hover>
            <thead>
                <tr>
                    {columns.map((colum, index) => (
                        <th key={`${index}_${colum}`}>{colum}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows?.data?.map((row, index) => {
                    return (
                        <tr key={`${row.id || index}_row`}>
                            {
                                columns.map((column) => {
                                    const value = _.get(row, column);
                                    return <td key={`${column}_${index}_row_column`}>{formatValue(column, value)}</td>
                                })
                            }
                        </tr>
                    );
                })}
            </tbody>
        </TableReact>
    );
};

export default Table;
