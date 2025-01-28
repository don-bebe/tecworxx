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
import AddorEdit from './AddorEdit';
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@material-ui/core/Avatar'
import { AddNewManufacturer, UpdateManufacturer, getAllManufacturer, reset } from '../../../components/services/orderService/manufactureSlice';

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
  { id: 'manufacture', label: 'Brand' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Manufacturer() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

  const dispatch = useDispatch();

  const { manufacturer, isError, isSuccess, message } = useSelector(
    (state) => state.manufacturer
  );

  useEffect(() => {
    getManufacturerData();
  }, []);

  const getManufacturerData = async () => {
    try {
      let response = await getAllManufacturer();
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (manufacturer || isSuccess) {
      setRecordForEdit(null);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  }, [manufacturer, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);


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
          return items.filter(x => x.manufacture.toLowerCase().includes(target.value))
      }
    })
  }

  const addOrEdit = async (make) => {
    //add new brand
    try {
      await dispatch(AddNewManufacturer((make)));
    } catch (error) {
      console.log(error);
    }
    let response = await getAllManufacturer();
    setRecords(response.data);
  }

  const EditRecord = async (make) => {
    //update existing brand
    try {
      await dispatch(UpdateManufacturer(({ id: make.id, manufacturer: make })));
    } catch (error) {
      console.log(error);
    }
    let response = await getAllManufacturer();
    setRecords(response.data);
  }

  const openInPopup = make => {
    setRecordForEdit(make)
    setOpenPopup(true)
  }
  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search manufacturer"
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
              recordsAfterPagingAndSorting().map(brand => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell><Avatar src={`${url}/${brand.image}`} /></TableCell>
                  <TableCell>{brand.repaircategory.repair}</TableCell>
                  <TableCell>{brand.manufacture}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => { openInPopup(brand) }}>
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
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <Popup
        title={recordForEdit ? "Update Device Manufacture" : "Add Device Manufacture"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
        <AddorEdit
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          EditRecord={EditRecord} />
        <Typography variant="inherit" color="textSecondary">
          {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
        </Typography>
      </Popup>
    </>
  )
}
