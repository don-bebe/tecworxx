import React, {useState, useEffect} from 'react'
import PageHeader from '../../../components/features/PageHeader';
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography } from '@material-ui/core';
import Controls from '../../../components/controls/Controls';
import useTable from '../../../components/features/useTable';
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Popup from '../../../components/features/Popup';
import AddorEdit from './AddorEdit';
import Notification from '../../../components/features/Notification';
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployee, UpdateEmployee, AddNewEmployee, reset } from '../../../components/services/employeeSlice';

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
  { id: 'firstName', label: 'First name' },
  { id: 'lastName', label: 'Last name' },
  { id: 'userName', label: 'Username' },
  { id: 'email', label: 'Email Address ' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'role', label: 'Role' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Employee() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false)
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const dispatch = useDispatch();
    
  const { employee, isError, isSuccess, message } = useSelector(
    (state) => state.employee
  );

  const getEmplData = async () => {
    try {
        let response = await getAllEmployee();
        setRecords(response.data);
    } catch (error) {
        console.log(error);
    }
  };
  useEffect(() => {
    getEmplData();
  }, []);

  useEffect(() => {
    if (employee || isSuccess) {
      setRecordForEdit(null);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  }, [employee, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);

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
                return items.filter(x => x.firstName.toLowerCase().includes(target.value))
        }
    })
  }
  
  const addOrEdit = async (employee, resetForm) => {
    //update existing employee
    if (employee.id){
      try {
        await dispatch(UpdateEmployee({id: employee.id, employee: employee}))
      } catch (error) {
        console.log(error);
      }
    }
    //add new employee
    else{
      try {
        await dispatch(AddNewEmployee(employee))
      } catch (error) {
        console.log(error);
      }
    }
    let response = await getAllEmployee();
    setRecords(response.data);
  }

  const openInPopup = empl => {
    setRecordForEdit(empl)
    setOpenPopup(true)
  }

  return (
    <>
      <PageHeader
        title="Employee list"
        subTitle="New Employee"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
      <Toolbar>
        <Controls.Input
          label="Search employees"
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
          recordsAfterPagingAndSorting().map(empl =>
          (
            <TableRow key={empl.id}>
              <TableCell>{empl.id}</TableCell>
              <TableCell>{empl.firstName}</TableCell>
              <TableCell>{empl.lastName}</TableCell>
              <TableCell>{empl.userName}</TableCell>
              <TableCell>{empl.email}</TableCell>
              <TableCell>{empl.phone}</TableCell>
              <TableCell>{empl.role}</TableCell>
              <TableCell>
                <Controls.ActionButton
                  color="primary"
                  onClick={() => { openInPopup(empl) }}>
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
        title={recordForEdit ? "Update Employee Details" : "Add Employee"}
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
