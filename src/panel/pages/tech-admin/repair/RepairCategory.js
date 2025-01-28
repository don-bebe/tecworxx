import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography } from '@material-ui/core';
import Controls from '../../../components/controls/Controls';
import useTable from '../../../components/features/useTable';
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Popup from '../../../components/features/Popup';
import Notification from '../../../components/features/Notification';
import { useDispatch, useSelector } from "react-redux";
import AddOrEdit from './AddOrEdit';
import Avatar from '@material-ui/core/Avatar'
import { getAllRepairCategory, AddNewRepairCategory, UpdateRepairCategory, reset } from '../../../components/services/orderService/repairSlice';

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
}))

const headCells = [
  { id: 'id', label: '#' },
  { id: 'image', label: 'Image' },
  { id: 'repair', label: 'RepairType' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

const url = process.env.REACT_APP_BASE_URL;

export default function RepairCategory() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const dispatch = useDispatch();

  const { repair, isError, isSuccess, message } = useSelector(
    (state) => state.repairCat
  );

  useEffect(() => {
    getRepairCategoryData();
  }, []);

  const getRepairCategoryData = async () => {
    try {
      let response = await getAllRepairCategory();
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (repair || isSuccess) {
      setRecordForEdit(null);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  }, [repair, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);

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
          return items.filter(x => x.repair.toLowerCase().includes(target.value))
      }
    })
  }

  const addOrEdit = async (repairs) => {
    //add new category
    try {
      await dispatch(AddNewRepairCategory(repairs));
    } catch (error) {
      console.log(error);
    }
    let response = await getAllRepairCategory();
    setRecords(response.data);
  }

  const EditRecord = async (repairs) => {
    //update existing category
    try {
      await dispatch(UpdateRepairCategory({ id: repairs.id, repair: repairs }));
    } catch (error) {
      console.log(error);
    }
    let response = await getAllRepairCategory();
    setRecords(response.data);
  }

  const openInPopup = repairs => {
    setRecordForEdit(repairs)
    setOpenPopup(true)
  }

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search repair category"
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
              recordsAfterPagingAndSorting().map(repairs => (
                <TableRow key={repairs.id}>
                  <TableCell>{repairs.id}</TableCell>
                  <TableCell><Avatar src={`${url}/${repairs.image}` }/></TableCell>
                  <TableCell>{repairs.repair}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => { openInPopup(repairs) }}>
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
        title={recordForEdit ? "Update Repair Category" : "Add Repair Category"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
        <AddOrEdit
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          EditRecord={EditRecord} />
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
