import React, { useEffect, useState } from 'react'
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
import { AddNewModel, UpdateModel, getAllModel, reset } from '../../../components/services/orderService/modelSlice';
import AddorEdit from './AddorEdit';
import Avatar from '@material-ui/core/Avatar'

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

const url = process.env.REACT_APP_BASE_URL;

const headCells = [
  { id: 'id', label: '#' },
  { id: 'image', label: 'Image' },
  { id: 'repairId', label: 'RepairType' },
  { id: 'manufactureId', label: 'Manufacture' },
  { id: 'model', label: 'Model' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Model() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false)
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const dispatch = useDispatch();

  const { model, isError, isSuccess, message } = useSelector(
    (state) => state.model
  );

  useEffect(() => {
    getModelData();
  }, []);

  const getModelData = async () => {
    try {
      let response = await getAllModel();
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (model || isSuccess) {
      setRecordForEdit(null);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  }, [model, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);

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
          return items.filter(x => x.model.toLowerCase().includes(target.value))
      }
    })
  }

  const addOrEdit = async (modelz, resetForm) => {
    //add new brand
    try {
      await dispatch(AddNewModel(modelz));
    } catch (error) {
      console.log(error);
    }
    let response = await getAllModel();
    setRecords(response.data);
  }

  const editOrAdd = async (modelz, resetForm) => {
    //update existing product
    try {
      await dispatch(UpdateModel({ id: modelz.id, model: modelz }));
    } catch (error) {
      console.log(error);
    }
    let response = await getAllModel();
    setRecords(response.data);
  }


  const openInPopup = modelz => {
    setRecordForEdit(modelz)
    setOpenPopup(true)
  }
  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search model"
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
              recordsAfterPagingAndSorting().map(mode => (
                <TableRow key={mode.id}>
                  <TableCell>{mode.id}</TableCell>
                  <TableCell><Avatar src={`${url}/${mode.image}`} /></TableCell>
                  <TableCell>{mode.manufacturer.repaircategory.repair}</TableCell>
                  <TableCell>{mode.manufacturer.manufacture}</TableCell>
                  <TableCell>{mode.model}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => { openInPopup(mode) }}>
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
        title={recordForEdit ? "Update Model" : "Add Model"}
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
    </>
  )
}
