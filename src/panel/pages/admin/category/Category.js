import React, { useState, useEffect } from 'react';
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
import { AddNewCategory, UpdateCategory, getAllCategory, reset } from '../../../components/services/categorySlice';

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
  }
}))

const headCells = [
  { id: 'id', label: '#' },
  { id: 'category', label: 'Category name' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Category() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const dispatch = useDispatch();

  const { category, isError, isSuccess, message } = useSelector(
    (state) => state.caty
  );

  useEffect(() => {
    getCatData();
  }, []);

  const getCatData = async () => {
    try {
      let response = await getAllCategory();
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (category || isSuccess) {
      setRecordForEdit(null);
      setOpenPopup(false);
      setNotify({
        isOpen: true,
        message: "Submitted successfully",
        type: 'success'
      });
    }
    dispatch(reset());
  }, [category, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);

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
          return items.filter(x => x.category.toLowerCase().includes(target.value))
      }
    })
  }
  const addOrEdit = async (caty) => {
    //update existing category
    if (caty.id) {
      try {
        await dispatch(UpdateCategory({ id: caty.id, category: caty }));
      } catch (error) {
        console.log(error);
      }
    }
    //add new category
    else {
      try {
        await dispatch(AddNewCategory(caty));
      } catch (error) {
        console.log(error);
      }
    }
    let response = await getAllCategory();
    setRecords(response.data);
  }

  const openInPopup = cat => {
    setRecordForEdit(cat);
    setOpenPopup(true);
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
              recordsAfterPagingAndSorting().map(cat =>
              (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.category}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => { openInPopup(cat) }}>
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
        title={recordForEdit ? "Update Stock Category": "Add New Stock Category"}
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
