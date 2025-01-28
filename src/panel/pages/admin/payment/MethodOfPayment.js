import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography } from '@material-ui/core';
import Controls from '../../../components/controls/Controls'
import { Search } from '@material-ui/icons'
import useTable from '../../../components/features/useTable';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector } from "react-redux";
import Popup from '../../../components/features/Popup';
import AddorEdit from './AddorEdit';
import Notification from '../../../components/features/Notification';
import { AddNewPaymentMethod, UpdatePaymentMethod, GetllAllPaymentMethods, reset } from '../../../components/services/paymentMethodSlice';

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
  },
  green: {
    backgroundColor: '#4caf50'
  },
  red: {
    backgroundColor: '#f44336'
  }
}))

const headCells = [
  { id: 'id', label: '#' },
  { id: 'method', label: 'Method' },
  { id: 'rate', label: 'Rate' },
  { id: 'updatedAt', label: 'updatedAt' },
  { id: 'isActive', label: 'isActive' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function MethodOfPayment() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const dispatch = useDispatch();

  const { method, isError, isSuccess, message } = useSelector(
    (state) => state.method
  );

  useEffect(() => {
    Methods()
  }, [])

  const Methods = async () => {
    try {
      let response = await GetllAllPaymentMethods();
      setRecords(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (method || isSuccess) {
      setRecordForEdit(null)
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset())
  }, [method, isSuccess, dispatch, setOpenPopup, setNotify])

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
          return items.filter(x => x.method.toLowerCase().includes(target.value))
      }
    })
  }

  const addOrEdit = async (way) => {
    //update existing category
    if (way.id) {
      try {
        await dispatch(UpdatePaymentMethod({ id: way.id, method: way }));
      } catch (error) {
        console.log(error);
      }
    }
    //add new category
    else {
      try {
        await dispatch(AddNewPaymentMethod(way));
      } catch (error) {
        console.log(error);
      }
    }
    let response = await GetllAllPaymentMethods();
    setRecords(response.data);
  }

  const openInPopup = way => {
    setRecordForEdit(way)
    setOpenPopup(true)
  }
  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search by method"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (<InputAdornment position="start">
                <Search />
              </InputAdornment>)
            }}
            onChange={handleSearch}
          />
          <Controls.Button
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {
              recordsAfterPagingAndSorting().map(way => (
                <TableRow key={way.id}>
                  <TableCell>{way.id}</TableCell>
                  <TableCell>{way.method}</TableCell>
                  <TableCell>{way.rate}</TableCell>
                  <TableCell>{way.updatedAt}</TableCell>
                  <TableCell className={way.isActive === true ? classes.green : classes.red}>{way.isActive === true ? "True" : "False"}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => { openInPopup(way) }}>
                      <EditOutlinedIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="secondary">
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        title={recordForEdit ? "Update Method of Payment" : "Add Method of Payment"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
        <AddorEdit
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit} />
        <Typography variant="inherit" color="textSecondary">
          {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
        </Typography>
      </Popup>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  )
}
