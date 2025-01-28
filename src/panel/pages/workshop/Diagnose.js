import React, { useState, useEffect } from 'react';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography } from '@material-ui/core';
import PageHeader from '../../components/features/PageHeader';
import TuneTwoToneIcon from '@material-ui/icons/TuneTwoTone';
import Controls from '../../components/controls/Controls';
import useTable from '../../components/features/useTable';
import { Search } from "@material-ui/icons";
import Popup from '../../components/features/Popup';
import AddorEdit from './AddorEdit';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from "react-redux";
import { getAllJobCardsToDiagnose } from '../../components/services/jobcardSlice';
import { AddNewWorkCard, reset } from '../../components/services/workSlice';
import Notification from '../../components/features/Notification';

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
}));

const headCells = [
  { id: 'id', label: '#' },
  { id: 'date', label: 'Date' },
  { id: 'cardNo', label: 'CardNO' },
  { id: 'category', label: 'Category' },
  { id: 'model', label: 'Model' },
  { id: 'problemDesc', label: 'Fault' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Diagnose() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false)
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

  const dispatch = useDispatch();

  const { work, isError, isSuccess, message } = useSelector(
    (state) => state.work
  );

  const getJobCardData = async () => {
    try {
      let response = await getAllJobCardsToDiagnose();
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getJobCardData();
  }, []);

  useEffect(() => {
    if (work || isSuccess) {
      setRecordForEdit(null);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  }, [work, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);

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
          return items.filter(x => x.customerID.toLowerCase().includes(target.value))
      }
    })
  }

  const addOrEdit = async (work) => {
    try {
      await dispatch(AddNewWorkCard(work))
    } catch (error) {
      console.log(error);
    }
    let response = await getAllJobCardsToDiagnose();
    setRecords(response.data);
  }

  const openInPopup = cust => {
    setRecordForEdit(cust)
    setOpenPopup(true)
  }
  return (
    <>
      <PageHeader
        title="Job cards"
        subTitle="Available job cards for diagnosis"
        icon={<TuneTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search jobcard"
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
              recordsAfterPagingAndSorting().map(job => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.date}</TableCell>
                  <TableCell>{job.cardNo}</TableCell>
                  <TableCell>{job.manufacturer.repaircategory.repair + ' ' + job.manufacturer.manufacture}</TableCell>
                  <TableCell>{job.model}</TableCell>
                  <TableCell>{job.problemDesc}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => { openInPopup(job) }}>
                      <EditIcon fontSize="small" />
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
        title="Job Card"
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
