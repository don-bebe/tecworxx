import React, {useState, useEffect} from 'react'
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
import { AddNewProblem, UpdateProblem, getAllProblem, reset } from '../../../components/services/orderService/problemSlice';
import AddorEdit from './AddorEdit';

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
    { id: 'repairId', label: 'RepairType' },
    { id: 'manufactureId', label: 'Brand' },
    { id: 'modelId', label: 'Model' },
    { id: 'problem', label: 'Problem' },
    { id: 'repairCost', label: 'Cost' },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Problem() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [openPopup, setOpenPopup] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const dispatch = useDispatch();
      
    const { problem, isError, isSuccess, message } = useSelector(
        (state) => state.problem
      );

      
    useEffect(() => {
        getProblemData();
      }, []);
    
    const getProblemData = async () => {
        try {
            let response = await getAllProblem();
            setRecords(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (problem || isSuccess) {
          setRecordForEdit(null);
          setOpenPopup(false);
          setNotify({
            isOpen: true,
            message: "Submitted successfully",
            type: 'success'
          });
        }
        dispatch(reset());
      }, [problem, isSuccess, dispatch, setRecordForEdit, setOpenPopup, setNotify]);
      
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
                    return items.filter(x => x.model.toLowerCase().includes(target.value))
            }
        })
    }

    const addOrEdit = async (prob, resetForm) => {
        //update existing problem
        if (prob.id){
          try {
            await dispatch(UpdateProblem({id: prob.id, problem: prob}));
          } catch (error) {
            console.log(error);
          }
        }
    
        //add new brand
        else{
          try {
            await dispatch(AddNewProblem(prob));
          } catch (error) {
            console.log(error);
          }
        }
        let response = await getAllProblem();
        setRecords(response.data);
      }
    
    
      const openInPopup = prob => {
        setRecordForEdit(prob)
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
                    recordsAfterPagingAndSorting().map(prob =>(
                        <TableRow key={prob.id}>
                            <TableCell>{prob.id}</TableCell>
                            <TableCell>{prob.devicemodel.manufacturer.repaircategory.repair}</TableCell>
                            <TableCell>{prob.devicemodel.manufacturer.manufacture}</TableCell>
                            <TableCell>{prob.devicemodel.model}</TableCell>
                            <TableCell>{prob.problem}</TableCell>
                            <TableCell>{prob.repairCost}</TableCell>
                            <TableCell>
                                <Controls.ActionButton
                                     color="primary"
                                    onClick={() => { openInPopup(prob) }}>
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
        title={recordForEdit ? "Update Problem Statement" : "Add Problem Statrment"}
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
