import React, {useState, useEffect} from 'react'
import PageHeader from '../../components/features/PageHeader';
import GroupTwoToneIcon from '@material-ui/icons/GroupTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography } from '@material-ui/core';
import Controls from '../../components/controls/Controls';
import useTable from '../../components/features/useTable';
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Popup from '../../components/features/Popup';
import AddorEdit from './AddorEdit';
import Notification from '../../components/features/Notification';
import { useDispatch, useSelector } from "react-redux";
import { AddNewCustomer, UpdateCustomer, getAllCustomers, reset } from '../../components/services/customerSlice';

const useStyles = makeStyles(theme => ({
  pageContent: {
      margin: theme.spacing(2),
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
  { id: 'id', label: '#' },
  { id: 'customerId', label: 'Customer'},
  { id: 'fullName', label: 'Fullname' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'contactPersonCell', label: 'ContactPersonCell' },
  { id: 'role', label: 'Role' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Customer() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false)
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const dispatch = useDispatch();
    
    const { customer, isError, isSuccess, message } = useSelector(
      (state) => state.customer
    );

  const getCustData = async () => {
    try {
        let response = await getAllCustomers();
        setRecords(response.data);
    } catch (error) {
        console.log(error);
    }
  };
  useEffect(() => {
    getCustData();
  }, []);

  useEffect(() => {
    if (customer || isSuccess) {
      setRecordForEdit(null);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  }, [customer, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);

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
                return items.filter(x => x.phone.toLowerCase().includes(target.value))
        }
    })
  }
  
  const addOrEdit = async (cust, resetForm) => {
    //update existing customer
    if (cust.id){
      try {
        await dispatch(UpdateCustomer({id: cust.id, customer: cust}));
      } catch (error) {
        console.log(error);
      }
    }
    //add new customer
    else{
      try {
        await dispatch(AddNewCustomer(cust));
      } catch (error) {
        console.log(error);
      }
    }
    let response = await getAllCustomers();
    setRecords(response.data);
  }

  const openInPopup = cust => {
    setRecordForEdit(cust)
    setOpenPopup(true)
  }

  return (
    <>
      <PageHeader
        title="Customers list"
        subTitle="Individual and organisations"
        icon={<GroupTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
      <Toolbar>
        <Controls.Input
          label="Search customer"
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
          recordsAfterPagingAndSorting().map(cust =>
          (
            <TableRow key={cust.id}>
              <TableCell>{cust.id}</TableCell>
              <TableCell>{cust.customerID}</TableCell>
              <TableCell>{cust.fullName}</TableCell>
              <TableCell>{cust.phone}</TableCell>
              <TableCell>{cust.email}</TableCell>
              <TableCell>{cust.contactPersonCell}</TableCell>
              <TableCell>{cust.role}</TableCell>
              <TableCell>
                <Controls.ActionButton
                  color="primary"
                  onClick={() => { openInPopup(cust) }}>
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
        title={recordForEdit ? "Update Customer Details" : "Add Customer"}
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
