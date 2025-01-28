import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from '../../../panel/components/features/useTable';
import { Search } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { GetAllOrderedServices, UpdateOrderService } from '../../features/orderServiceSlice';
import Controls from '../../../panel/components/controls/Controls';
import CloseIcon from '@material-ui/icons/Close';
import Popup from '../../../panel/components/features/Popup';
import Edit from './Edit';
import ConfirmDialog from '../../../panel/components/features/ConfirmDialog';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
    { id: 'date', label: 'Date' },
    { id: 'category', label: 'Category' },
    { id: 'model', label: 'Model' },
    { id: 'services', label: 'Services' },
    { id: 'booked', label: 'BookedDate' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function MyOrders() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const dispatch = useDispatch();
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

    useEffect(() => {
        getMyServices();
    }, []);

    const getMyServices = async () => {
        try {
            let response = await GetAllOrderedServices();
            setRecords(response.data)
        } catch (error) {
            console.log(error)
        }
    }

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

    const openInPopup = cat => {
        setRecordForEdit(cat)
        setOpenPopup(true)
    }

    const onCancel = async (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        try {
            await dispatch(UpdateOrderService(id))
        } catch (error) {
            console.log(error)
        }
        let response = await GetAllOrderedServices();
        setRecords(response.data);
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
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.devicemodel.manufacturer.repaircategory.repair}</TableCell>
                                    <TableCell>{item.devicemodel.manufacturer.manufacture + " " + item.devicemodel.model}</TableCell>
                                    <TableCell>{item.orderedservices?.map((element) => (<tr>{element.problem}</tr>))}</TableCell>
                                    <TableCell>{item.bookedDate}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="primary"
                                            onClick={() => { openInPopup(item) }}>
                                            <VisibilityIcon fontSize="small" />
                                        </Controls.ActionButton>
                                        {!(item.status === "Cancelled" || item.status === "Repair" || item.status === "Complete") ?
                                            <>
                                                <Controls.ActionButton
                                                    color="secondary"
                                                    onClick={() => {
                                                        setConfirmDialog({
                                                            isOpen: true,
                                                            title: 'Are you sure to cancel this jobcard?',
                                                            subTitle: "You can't undo this operation",
                                                            onConfirm: () => { onCancel(item.id) }
                                                        })
                                                    }}>
                                                    <CloseIcon fontSize="small" />
                                                </Controls.ActionButton>
                                            </> : ''}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Order service details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <Edit
                    recordForEdit={recordForEdit} />
            </Popup>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}
