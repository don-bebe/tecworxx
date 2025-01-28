import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from '../../../panel/components/features/useTable';
import { Search } from "@material-ui/icons";
import Controls from '../../../panel/components/controls/Controls';
import { GetAllOrderPayments } from '../../features/orderServiceSlice';
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
  { id: 'orderId', label: 'OrderId' },
  { id: 'totalAmount', label: 'Total Amount ($)' },
  { id: 'paidAmount', label: 'Paid Amount' },
]
export default function OrderservicePayments() {
  const classes = useStyles();
  const [recordsSum, setRecordsSum] = useState([]);
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
          return items.filter(x => x.orderId.toLowerCase().includes(target.value))
      }
    })
  }

  const getPayments = async () => {
    try {
      const response = await GetAllOrderPayments();
      setRecordsSum(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPayments()
  }, [])

  useEffect(() => {
    var value = []
    if (recordsSum) {
      recordsSum.forEach((element) => {
        for (let index = 0; index < element.length; index++) {
          const item = element[index];
          value.push(item)
        }
        setRecords(value)
      })
    }
  }, [recordsSum, setRecords])

  //exporting data
  const handleOnExport = () => {
    var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.json_to_sheet(recordsAfterPagingAndSorting());
    XLSX.utils.book_append_sheet(wb, ws, "Order service payments");
    XLSX.writeFile(wb, new Date(new Date()) + ".xls");
  }

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search order"
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
                <TableRow key={item.orderId}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.orderId}</TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                  <TableCell>{item.paidAmount}</TableCell>
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
