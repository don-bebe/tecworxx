import React, {useEffect, useState} from 'react';
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
import { AddNewInventory, UpdateInventory, getAllProducts, reset } from '../../../components/services/stockSlice';

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
  yellow:{
    backgroundColor: '#ffc107'
  },
  red:{
    backgroundColor: '#f44336',
  }

}));



const headCells = [
  { id: 'id', label: '#' },
  { id: 'category', label: 'Category' },
  { id: 'product', label: 'Product (model)' },
  { id: 'description', label: 'Description' },
  { id: 'keepingUnit', label: 'SKU' },
  { id: 'price', label: 'Price ($)' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Stock() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
  const [openPopup, setOpenPopup] = useState(false)
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const dispatch = useDispatch();
    
  const { stock, isError, isSuccess, message } = useSelector(
      (state) => state.stock
    );

  useEffect(() => {
    getProductData();
  }, []);

const getProductData = async () => {
    try {
        let response = await getAllProducts();
        setRecords(response.data);
    } catch (error) {
        console.log(error);
    }
};

useEffect(() => {
  if (stock || isSuccess) {
    setRecordForEdit(null);
    setOpenPopup(false);
    setNotify({
      isOpen: true,
      message: "Submitted successfully",
      type: 'success'
    });
  }
  dispatch(reset());
}, [stock, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);

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
                return items.filter(x => x.product.toLowerCase().includes(target.value))
        }
    })
  }

  const addOrEdit = async (stock, resetForm) => {
    //update existing product
    if (stock.id){
      try {
        await dispatch(UpdateInventory({id: stock.id, stock: stock}));
      } catch (error) {
        console.log(error);
      }
    }

    //add new brand
    else{
      try {
        await dispatch(AddNewInventory(stock));
      } catch (error) {
        console.log(error);
      }
    }
    let response = await getAllProducts();
    setRecords(response.data);
  }


  const openInPopup = stock => {
    setRecordForEdit(stock)
    setOpenPopup(true)
  }

  return (
    <>
      <Paper className={classes.pageContent}>
      <Toolbar>
        <Controls.Input
          label="Search product"
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
          recordsAfterPagingAndSorting().map(stock =>
          (
            <TableRow key={stock.id} className={stock.quantity <=5 ? classes.red : stock.quantity <=8 && stock.quantity >5 ? classes.yellow : ''}>
              <TableCell>{stock.id}</TableCell>
              <TableCell>{stock.brand.category.category +" "+ stock.brand.make}</TableCell>
              <TableCell>{stock.product}</TableCell>
              <TableCell>{stock.description}</TableCell>
              <TableCell>{stock.keepingUnit}</TableCell>
              <TableCell>{stock.price}</TableCell>
              <TableCell>{stock.quantity}</TableCell>
              <TableCell>
                <Controls.ActionButton
                  color="primary"
                  onClick={() => { openInPopup(stock)}}>
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
        title={recordForEdit ? "Update Product" : "Add Product"}
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
