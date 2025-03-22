import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

const MediaUploadHistory = ({ rows, onRowClick, columns }) => {
      const fixedHeaderContent = () => (
            <TableRow className='bg-mintDark'>
                  {columns.map((column, index) => (
                        <TableCell key={index} style={{ width: column.width }}>
                              <span className='text-white font-semibold'>{column.label}</span>
                        </TableCell>
                  ))}
            </TableRow>
      );

      const rowContent = (index, row) => (
            <>
                  {columns.map((column, cellIndex) => (
                        <TableCell
                              key={cellIndex}
                              className="row-hover-effect"
                              onClick={() => onRowClick(row)}
                        >
                              {column.render ? column.render(row[column.field]) : row[column.field]}
                        </TableCell>
                  ))}
            </>
      );

      const VirtuosoTableComponents = {
            Scroller: React.forwardRef((props, ref) => (
                  <TableContainer component={Paper} {...props} ref={ref} />
            )),
            Table: (props) => (
                  <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
            ),
            TableHead: React.forwardRef((props, ref) => (
                  <TableHead {...props} ref={ref} sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }} />
            )),
            TableRow,
            TableBody: React.forwardRef((props, ref) => (
                  <TableBody {...props} ref={ref} />
            )),
      };

      return (
            <div className='bg-white w-full p-5 rounded-lg shadow-lg shadow-blueMetal/50 flex-grow'>
                  <Paper sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <TableVirtuoso
                              data={rows}
                              components={VirtuosoTableComponents}
                              fixedHeaderContent={fixedHeaderContent}
                              itemContent={rowContent}
                        />
                  </Paper>

            </div>
      );
};

export default MediaUploadHistory;