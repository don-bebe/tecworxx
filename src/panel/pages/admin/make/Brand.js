import React, {useState, useEffect} from 'react'
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
import { AddNewMake, UpdateMake, getAllBrands, reset } from '../../../components/services/makeSlice';

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
    { id: 'id', label: '#'},
    { id: 'catId', label: 'Category' },
    { id: 'make', label: 'Brand (make)' },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Brand() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    const dispatch = useDispatch();
    
    const { make, isError, isSuccess, message } = useSelector(
      (state) => state.make
    );

    useEffect(() => {
        getMakeData();
      }, []);

    const getMakeData = async () => {
        try {
            let response = await getAllBrands();
            setRecords(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
      if (make || isSuccess) {
        setRecordForEdit(null);
        setOpenPopup(false);
        setNotify({
          isOpen: true,
          message: "Submitted successfully",
          type: 'success'
        });
      }
      dispatch(reset());
    }, [make, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);

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
                    return items.filter(x => x.make.toLowerCase().includes(target.value))
            }
        })
      }


      const addOrEdit = async (brand) => {
        //update existing brand
        if (brand.id){
          try {
            await dispatch(UpdateMake(({id: brand.id, make: brand})));
          } catch (error) {
            console.log(error);
          }
        }
    
        //add new brand
        else{
          try {
            await dispatch(AddNewMake((brand)));
          } catch (error) {
            console.log(error);
          }
        }
        let response = await getAllBrands();
        setRecords(response.data);
      }

    const openInPopup = brand => {
        setRecordForEdit(brand)
        setOpenPopup(true)
      }
  return (
    <>
        <Paper className={classes.pageContent}>
        <Toolbar>
            <Controls.Input
                label="Search brand"
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
                    recordsAfterPagingAndSorting().map(brand =>
                    (
                        <TableRow key={brand.id}>
                            <TableCell>{brand.id}</TableCell>
                            <TableCell>{brand.category.category}</TableCell>
                            <TableCell>{brand.make}</TableCell>
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
        <Popup
        title={recordForEdit ? "Update Stock Brand" : "Add Stock Brand"}
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
