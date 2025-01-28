import React, { useState, useEffect } from 'react'
import PageHeader from '../../components/features/PageHeader';
import WorkTwoToneIcon from '@material-ui/icons/WorkTwoTone';
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
import ConfirmDialog from '../../components/features/ConfirmDialog';
import { getAllJobCards, AddNewJobCard, CancelJobCard, Collection, UpdateJobCard, RepairJobCard, reset } from '../../components/services/jobcardSlice';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import View from './View';
import BuildIcon from '@material-ui/icons/Build';
import CollectionForm from './CollectionForm';


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
  },
  green: {
    backgroundColor: '#4caf50'
  },
  red: {
    backgroundColor: '#f44336'
  },
  blue: {
    backgroundColor: '#2196f3'
  },
  textDisplay: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis !important",
    width: "160px",
    display: "block",
    overflow: "hidden !important",
    alignItems: 'center',
    marginTop: theme.spacing(2.5),
  }

}));


const headCells = [
  { id: 'id', label: '#' },
  { id: 'date', label: 'Date' },
  { id: 'customerID', label: 'Customer' },
  { id: 'cardNo', label: 'CardNO' },
  { id: 'category', label: 'Category' },
  { id: 'model', label: 'Model' },
  { id: 'isCollected', label: 'Collected' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function JobCard() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [recordForView, setRecordForView] = useState(null)
  const [recordForCollection, setRecordForCollection] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false)
  const [open, setOpen] = useState(false)
  const [openCollection, setOpenCollection] = useState(false)
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const dispatch = useDispatch();

  const { card, isError, isSuccess, message } = useSelector(
    (state) => state.card
  );


  const getJobCardData = async () => {
    try {
      let response = await getAllJobCards();
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getJobCardData();
  }, []);

  useEffect(() => {
    if (card || isSuccess) {
      setRecordForEdit(null);
      setRecordForCollection(null);
      setOpenCollection(false);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  }, [card, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify, setOpenCollection]);

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

  //record new job card
  const addOrEdit = async (card) => {
    //add new jobcard
    try {
      await dispatch(AddNewJobCard(card));
    } catch (error) {
      console.log(error);
    }
    let response = await getAllJobCards();
    setRecords(response.data);
  }

  const editOrAdd = async (card) => {
    //update existing jobcard
    try {
      await dispatch(UpdateJobCard(({ id: card.id, card: card })))
    } catch (error) {
      console.log(error);
    }
    let response = await getAllJobCards();
    setRecords(response.data);
  }

  //collection form
  const collectedBy = async (card) => {
    try {
      dispatch(Collection((card)));
    } catch (error) {
      console.log(error);
    }
    let response = await getAllJobCards();
    setRecords(response.data);
  }

  //record for edit
  const openInPopup = job => {
    setRecordForEdit(job)
    setOpenPopup(true)
  }

  //record to view
  const openInWindow = job => {
    setRecordForView(job)
    setOpen(true)
  }

  //record for collection
  const openForCollection = job => {
    setRecordForCollection(job)
    setOpenCollection(true)
  }

  const onCancel = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    try {
      await CancelJobCard(id);
    } catch (error) {
      console.log(error);
    }
    let response = await getAllJobCards();
    setRecords(response.data);
    setNotify({
      isOpen: true,
      message: 'Job card cancellation was an success',
      type: 'error'
    })
  }

  const onRepair = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    try {
      await RepairJobCard(id);
    } catch (error) {
      console.log(error);
    }
    let response = await getAllJobCards();
    setRecords(response.data);
    setNotify({
      isOpen: true,
      message: 'Job card status update was a success',
      type: 'success'
    })
  }

  return (
    <>
      <PageHeader
        title="Job card"
        subTitle="Available job cards"
        icon={<WorkTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search jobcard by customer"
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
              recordsAfterPagingAndSorting().map(job =>
              (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.date}</TableCell>
                  <TableCell>{job.customerID}</TableCell>
                  <TableCell>{job.cardNo}</TableCell>
                  <TableCell>{job.manufacturer.repaircategory.repair + ' ' + job.manufacturer.manufacture}</TableCell>
                  <TableCell>{job.model}</TableCell>
                  <TableCell className={job.isCollected === true ? classes.green : ''}>{job.isCollected === true && (job.status === 'Complete' || job.status === 'Cancelled') ? 'Yes' : job.isCollected === false && (job.status === 'Complete' || job.status === 'Cancelled') ? 'No' : ''}</TableCell>
                  <TableCell className={job.status === 'Complete' ? classes.green : job.status === 'Cancelled' ? classes.red : job.status === 'Repair' ? classes.blue : ''}>{job.status}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="success"
                      onClick={() => { openInWindow(job) }}>
                      <VisibilityIcon fontSize="small" />
                    </Controls.ActionButton>

                    {job.isCollected === false && (job.status === 'Cancelled' || job.status === null) ?
                      <Controls.ActionButton
                        color="primary"
                        onClick={() => { openInPopup(job) }}>
                        <EditOutlinedIcon fontSize="small" />
                      </Controls.ActionButton> : ''
                    }

                    {job.isCollected === false && (job.status === 'Complete' || job.status === 'Cancelled') ?
                      <Controls.ActionButton
                        onClick={() => { openForCollection(job) }}>
                        <PlaylistAddCheckIcon fontSize='small' />
                      </Controls.ActionButton> : ''}

                    {job.isCollected === false && (job.status === 'Cancelled' || job.status === 'Diagonized') ?
                      <Controls.ActionButton
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure to set this jobcard ready for repair?',
                            subTitle: "You can't undo this operation",
                            onConfirm: () => { onRepair(job.id) }
                          })
                        }}>
                        <BuildIcon fontSize="small" />
                      </Controls.ActionButton>
                      : ''}

                    {job.isCollected === false && !(job.status === 'Complete' || job.status === 'Cancelled') ?
                      <Controls.ActionButton
                        color="secondary"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure to cancel this jobcard?',
                            subTitle: "You can't undo this operation",
                            onConfirm: () => { onCancel(job.id) }
                          })
                        }}>
                        <CloseIcon fontSize="small" />
                      </Controls.ActionButton>
                      : ''}

                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        title={recordForEdit ? "Update jobcard" : "Add jobcard"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
        <AddorEdit
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          editOrAdd={editOrAdd} />
        <Typography variant="inherit" color="textSecondary">
          {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
        </Typography>
      </Popup>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <Popup
        title="Job Card"
        openPopup={open}
        setOpenPopup={setOpen}>
        <View job={recordForView} />
      </Popup>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <Popup
        title="Collection form"
        openPopup={openCollection}
        setOpenPopup={setOpenCollection}>
        <CollectionForm
          job={recordForCollection}
          collectedBy={collectedBy} />
        <Typography variant="inherit" color="textSecondary">
          {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
        </Typography>
      </Popup>
    </>
  )
}
