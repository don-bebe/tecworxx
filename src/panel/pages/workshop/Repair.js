import React, { useState, useEffect } from 'react';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography } from '@material-ui/core';
import PageHeader from '../../components/features/PageHeader';
import SettingsInputComponentTwoToneIcon from '@material-ui/icons/SettingsInputComponentTwoTone';
import Controls from '../../components/controls/Controls';
import useTable from '../../components/features/useTable';
import { Search } from "@material-ui/icons";
import Notification from '../../components/features/Notification';
import { useDispatch, useSelector } from "react-redux";
import { GetWorkCardForRepair, UpdateWorkCard, reset } from '../../components/services/workSlice';
import EditIcon from '@material-ui/icons/Edit';
import Popup from '../../components/features/Popup';
import RepairEdit from './RepairEdit';

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(2),
    padding: theme.spacing(1)
  },
  searchInput: {
    width: '75%'
  }
}));

const headCells = [
  { id: 'id', label: '#' },
  { id: 'date', label: 'Date' },
  { id: 'cardNo', label: 'CardNO' },
  { id: 'category', label: 'Category' },
  { id: 'model', label: 'Model' },
  { id: 'problemDesc', label: 'Fault' },
  { id: 'diagnosisResults', label: 'Diagnosis' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Repair() {
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

  const getWorkCardData = async () => {
    try {
      let response = await GetWorkCardForRepair();
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWorkCardData();
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
      await dispatch(UpdateWorkCard({ id: work.id, work: work }))
      console.log(work)
    } catch (error) {
      console.log(error);
    }
    let response = await GetWorkCardForRepair();
    setRecords(response.data);
  }

  const openInPopup = works => {
    setRecordForEdit(works)
    setOpenPopup(true)
  }

  return (
    <>
      <PageHeader
        title="Work cards"
        subTitle="Available work cards for repair"
        icon={<SettingsInputComponentTwoToneIcon fontSize="large" />}
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
              recordsAfterPagingAndSorting().map(works => (
                <TableRow key={works.id}>
                  <TableCell>{works.id}</TableCell>
                  <TableCell>{works.date}</TableCell>
                  <TableCell>{works.cardNo}</TableCell>
                  <TableCell>{works.jobcard.manufacturer.repaircategory.repair + ' ' + works.jobcard.manufacturer.manufacture}</TableCell>
                  <TableCell>{works.jobcard.model}</TableCell>
                  <TableCell>{works.jobcard.problemDesc}</TableCell>
                  <TableCell>{works.diagnosisResults}</TableCell>
                  <TableCell>{works.requirements?.map(element => (<tr>{element.product}</tr>))}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => { openInPopup(works) }}>
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
        title="Repair device"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
        <RepairEdit
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
