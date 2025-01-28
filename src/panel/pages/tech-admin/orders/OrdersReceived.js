import React, {useEffect, useState} from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography} from '@material-ui/core';
import useTable from '../../../components/features/useTable';
import { Search } from "@material-ui/icons";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Controls from '../../../components/controls/Controls';
import {GetAllOrderedServices} from "../../../components/services/orderService/problemSlice";
import Popup from '../../../components/features/Popup';
import AssignTo from './AssignTo';
import {AssignTechnician, reset} from '../../../components/services/orderService/assignSlice';
import { useDispatch, useSelector } from "react-redux";
import Notification from '../../../components/features/Notification';

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
    backgroundColor: '#76ff03'
  },
  red: {
    backgroundColor: '#f44336'
  }
}))

const headCells = [
  { id: "Id", label: '#'},
  { id: 'date', label: 'Date'},
  { id: 'category', label: 'Category' },
  { id: 'model', label: 'Model' },
  { id: 'services', label: 'Services'},
  { id: 'booked', label: 'BookedDate'},
  { id: 'AssignedTo', label: 'AssignedTo'},
  { id: 'status', label: 'Status'},
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function OrdersReceived() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const dispatch = useDispatch()

    const { assign, isError, isSuccess, message } = useSelector(
      (state) => state.assign
    );

    useEffect(()=>{
      getAllServices();
  },[]);

  const getAllServices =async ()=>{
      try {
          let response = await GetAllOrderedServices();
          setRecords(response.data)
      } catch (error) {
         console.log(error) 
      }
  }

  useEffect(()=>{
    if(assign || isSuccess){
      setRecordForEdit(null);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  },[assign, isSuccess,setNotify, dispatch, setRecordForEdit, setOpenPopup])

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells,filterFn);

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value === "")
                return items;
            else
                return items.filter(x => x.repaircategory.toLowerCase().includes(target.value))
        }
    })
  }

  const openInPopup = item => {
    setRecordForEdit(item)
    setOpenPopup(true)
  }

  const addOrEdit = async (workorder) =>{
    try {
      await dispatch(AssignTechnician(workorder))
    } catch (error) {
      console.log(error)
    }
    let response = await GetAllOrderedServices();
    setRecords(response.data);
  }

  return (
    <>
      <Paper className={classes.pageContent}>
      <Toolbar>
        <Controls.Input
          label="Search category"
          className={classes.searchInput}
          InputProps={{
          startAdornment: (<InputAdornment position="start">
            <Search />
          </InputAdornment>)
          }}
          onChange={handleSearch}
        />
      </Toolbar>
      <TblContainer>
        <TblHead />
        <TableBody>
          {
            recordsAfterPagingAndSorting().map(item=>(
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.devicemodel.manufacturer.repaircategory.repair}</TableCell>
                <TableCell>{item.devicemodel.manufacturer.manufacture +" "+ item.devicemodel.model}</TableCell>
                <TableCell>{item.orderedservices?.map((element)=>(<tr>{element.problem}</tr>))}</TableCell>
                <TableCell>{item.bookedDate}</TableCell>
                <TableCell>{item.orderswork?.employee.firstName +" "+ item.orderswork?.employee.lastName}</TableCell>
                <TableCell className={item.status === 'Complete' ? classes.green : item.status !== 'Complete' && new Date(item.bookedDate).getDate() < new Date(new Date()).getDate() ? classes.red : ''}>{item.status}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => { openInPopup(item) }}>
                    <EditOutlinedIcon fontSize="small" />
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
        title="order"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
        <AssignTo
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
