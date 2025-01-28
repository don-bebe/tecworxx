import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import { Search } from "@material-ui/icons";
import GetAppIcon from '@material-ui/icons/GetApp';
import Controls from '../../../components/controls/Controls'
import useTable from '../../../components/features/useTable';
import { FindAllPaymentStatus } from '../../../components/services/cardPaymentSlice';
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
  { id: 'Jobcard', label: 'Jobcard' },
  { id: 'totalAmount', label: 'Total Amount ($)' },
  { id: 'paidAmount', label: 'Paid Amount' },
]

export default function JobPayments() {
  const classes = useStyles();
  const [recordsSum, setRecordsSum] = useState([]);
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });

  const getPayments = async () => {
    try {
      const response = await FindAllPaymentStatus();
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

  //exporting data
  const handleOnExport = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(recordsAfterPagingAndSorting());
    XLSX.utils.book_append_sheet(wb, ws, "Card payments");
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
                <TableRow key={item.cardNo}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.cardNo}</TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                  <TableCell>{item.paidSum}</TableCell>
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
