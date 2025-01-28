import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from '../../../panel/components/features/useTable';
import { Search } from "@material-ui/icons";
import Controls from '../../../panel/components/controls/Controls';
import { GetAllSalesPayments } from '../../features/orderServiceSlice';
import GetAppIcon from '@material-ui/icons/GetApp';
import * as XLSX from 'xlsx'

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))

const headCells = [
    { id: 'date', label: 'Date' },
    { id: 'products', label: 'Products' },
    { id: 'totalAmount', label: 'Total Amount ($)' },
    { id: 'paidAmount', label: 'Paid Amount' },
    { id: 'method', label: 'Method' },
]

export default function SalesPayments() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.cardNo.toLowerCase().includes(target.value))
            }
        })
    }

    const getPayments = async () => {
        try {
            const response = await GetAllSalesPayments();
            setRecords(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPayments()
    }, [])

    //exporting data
    const handleOnExport = () => {
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(recordsAfterPagingAndSorting());
        XLSX.utils.book_append_sheet(wb, ws, "Items bought");
        XLSX.writeFile(wb, new Date(new Date()) + ".xls");
    }
    return (
        <>
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search cardNo"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    <Controls.Button
                        text="Export to CSV"
                        className={classes.newButton}
                        variant="outlined"
                        startIcon={<GetAppIcon />}
                        onClick={handleOnExport}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{<table>
                                        <tr>
                                            <td><b>Product</b></td>
                                            <td><b>Price ($)</b></td>
                                        </tr>
                                        {item.soldItems?.map(element => (
                                            <tr key={element.id}>
                                                <td>{element.product}</td>
                                                <td>{element.price}</td>
                                            </tr>))}
                                    </table>}
                                    </TableCell>
                                    <TableCell>{item.totalAmount}</TableCell>
                                    <TableCell>{item.paidAmount}</TableCell>
                                    <TableCell>{item.method}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
        </>
    )
}
