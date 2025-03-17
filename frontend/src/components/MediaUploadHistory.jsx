import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

const MediaUploadHistory = ({ rows, onRowClick }) => {

      const headers = ["ID", "Nombre", "Tamaño", "Idioma", "Fecha", "Hora"];
      const fixedHeaderContent = () => (
            <TableRow className='bg-mintDark'>
                  {headers.map((header, index) => (
                        <TableCell key={index}><span className='text-white font-semibold'>{header}</span></TableCell>
                  ))}
            </TableRow>
      );

      const rowContent = (index, row) => (
            <>
                {[
                    row.id, 
                    row.name, 
                    row.size, 
                    row.language, 
                    row.date, 
                    row.time
                ].map((cell, cellIndex) => (
                    <TableCell
                        key={cellIndex}
                        className="row-hover-effect"
                        onClick={() => onRowClick(row)}
                    >
                        {cell}
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
            <div className='bg-white w-full p-5 rounded-lg shadow-lg shadow-blueMetal/50'>
                  <Paper sx={{ height: '100%', width: '100%' }}>
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