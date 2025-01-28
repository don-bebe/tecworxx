import React, { useEffect, useState } from 'react';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography } from '@material-ui/core';
import useTable from '../../../components/features/useTable';
import { Edit, Search } from "@material-ui/icons";
import { GetAllOrderedServices } from "../../../components/services/orderService/problemSlice";
import PageHeader from '../../../components/features/PageHeader';
import Controls from '../../../components/controls/Controls';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Popup from '../../../components/features/Popup';
import { useSelector, useDispatch } from "react-redux";
import { RescheduleAppointment, CollectionOrder, RepairOrder,reset } from "../../../components/services/orderService/assignSlice";
import { OrderServiceForCustomer } from '../../../components/services/orderService/assignSlice';
import Notification from '../../../components/features/Notification';
import ViewOrder from './ViewOrder';
import TextField from '@material-ui/core/TextField';
import DnsTwoToneIcon from '@material-ui/icons/DnsTwoTone';
import Editorder from './Editorder';
import AddIcon from '@material-ui/icons/Add';
import AddOrder from './AddOrder';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import OrderCollectionForm from './OrderCollectionForm';
import BuildIcon from '@material-ui/icons/Build';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    searchInput: {
        width: '60%'
    },
    appointment: {
        position: 'absolute',
        right: '10px'
    },
    green: {
        backgroundColor: '#4caf50'
    },
    red: {
        backgroundColor: '#f44336'
    },
    newButton: {
        position: 'absolute',
        right: '220px'
    }
}))


const headCells = [
    { id: "Id", label: '#' },
    { id: 'category', label: 'Category' },
    { id: 'model', label: 'Model' },
    { id: 'services', label: 'Services' },
    { id: 'booked', label: 'BookedDate' },
    { id: 'AssignedTo', label: 'AssignedTo' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function OrdersView() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [recordForView, setRecordForView] = useState(null)
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [recordForCollection, setRecordForCollection] = useState(null)
    const [openPopup, setOpenPopup] = useState(false);
    const [open, setOpen] = useState(false);
    const [close, setClose] = useState(false);
    const [openCollection, setOpenCollection] = useState(false)
    const [day, setDay] = useState(new Date(''));
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { assign, isSuccess, isError, message } = useSelector((state) => state.assign);

    useEffect(() => {
        getAllServices();
    }, []);

    useEffect(() => {
        if (assign || isSuccess) {
            setRecordForEdit(null);
            setOpenPopup(false);
            setOpenCollection(false);
            setClose(false);
            setNotify({
                isOpen: true,
                message: "Submitted successfully",
                type: 'success'
            });
        }
        dispatch(reset());
    }, [assign, dispatch, isSuccess, setRecordForEdit, setOpenPopup, setNotify, setClose, setOpenCollection])

    const getAllServices = async () => {
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
                    return items.filter(x => x.devicemodel.model.toLowerCase().includes(target.value))
            }
        })
        alert(day)
    }

    const handleDateSearch = e => {
        let target = e.target;
        setDay(target.value);
        const start = new Date(target.value).toDateString();
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else {
                    return items.filter(x => new Date(x.bookedDate).toDateString().includes(start))
                }
            }
        })
    }

    const openInWindow = detail => {
        setRecordForView(detail)
        setOpen(true)
    }

    const openForEdit = detail => {
        setRecordForEdit(detail)
        setOpenPopup(true)
    }

    const reScheduleDate = async (detail) => {
        try {
            dispatch(RescheduleAppointment({ id: detail.id, reschedule: detail.reschedule }))
        } catch (error) {
            console.log(error)
        }
        let response = await GetAllOrderedServices();
        setRecords(response.data)
    }

    const addNewOrder = async (modelId, checked, selectedDate, custId) => {
        try {
            dispatch(OrderServiceForCustomer({ modelId: modelId, services: checked, bookedDate: selectedDate, customerId: custId }));
        } catch (error) {
            console.log(error)
        }
        let response = await GetAllOrderedServices();
        setRecords(response.data)
    }

    //collection form
    const collectedBy = async (card) => {
        try {
            dispatch(CollectionOrder((card)));
        } catch (error) {
            console.log(error);
        }
        let response = await GetAllOrderedServices();
        setRecords(response.data);
    }

    const openForCollection = job => {
        setRecordForCollection(job)
        setOpenCollection(true)
    }

    const onRepair = async (id) => {
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        })
        try {
          await RepairOrder(id);
        } catch (error) {
          console.log(error);
        }
        let response = await getAllServices();
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
                title="Order services"
                subTitle="All orders"
                icon={<DnsTwoToneIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search by device model"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    {user && user.role === "User" && (
                        <Controls.Button
                            text="Add New"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            className={classes.newButton}
                            onClick={() => { setClose(true) }}
                        />
                    )}
                    <TextField
                        className={classes.appointment}
                        id="bookedDate"
                        label="Booked date"
                        inputProps={{
                            min: new Date().toISOString().slice(0, 16)
                        }}
                        variant="outlined"
                        name='bookedDate'
                        type='date'
                        defaultValue={day}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleDateSearch}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.orderId}</TableCell>
                                    <TableCell>{item.devicemodel.manufacturer.repaircategory.repair}</TableCell>
                                    <TableCell>{item.devicemodel.manufacturer.manufacture + " " + item.devicemodel.model}</TableCell>
                                    <TableCell>{item.orderedservices?.map((element) => (<tr>{element.problem}</tr>))}</TableCell>
                                    <TableCell>{item.bookedDate}</TableCell>
                                    <TableCell>{item.orderswork?.employee.firstName + " " + item.orderswork?.employee.lastName}</TableCell>
                                    <TableCell className={item.status === 'Complete' ? classes.green : item.status === null && new Date(item.bookedDate).getDate() < new Date(new Date()).getDate() ? classes.red : ''}>{item.status}</TableCell>
                                    <TableCell>
                                        {
                                            user && user.role === "User" && (
                                                <>
                                                    {
                                                        item.status === 'Approved' || item.status === null ?
                                                            <Controls.ActionButton
                                                                color="primary"
                                                                onClick={() => { openForEdit(item) }}>
                                                                <Edit fontSize='small' />
                                                            </Controls.ActionButton>
                                                            : ''
                                                    }
                                                    {
                                                        item.isCollected === false && (item.status === 'Complete' || item.status === 'Cancelled') ?
                                                            <Controls.ActionButton
                                                                onClick={() => { openForCollection(item) }}>
                                                                <PlaylistAddCheckIcon fontSize='small' />
                                                            </Controls.ActionButton> : ''
                                                    }
                                                    <Controls.ActionButton
                                                        onClick={() => { openInWindow(item) }}>
                                                        <VisibilityIcon fontSize="small" />
                                                    </Controls.ActionButton>
                                                    {item.isCollected === false && item.status === 'Pending' ?
                                                        <Controls.ActionButton
                                                        onClick={() => {
                                                            setConfirmDialog({
                                                                isOpen: true,
                                                                title: 'Are you sure to set this jobcard ready for repair?',
                                                                subTitle: "You can't undo this operation",
                                                                onConfirm: () => { onRepair(item.id) }
                                                            })
                                                        }}
                                                        >
                                                            <BuildIcon fontSize="small" />
                                                        </Controls.ActionButton>
                                                        : ''}
                                                </>
                                            )
                                        }
                                        {user && user.role === "Admin" && (
                                            <>
                                                <Controls.ActionButton
                                                    onClick={() => { openInWindow(item) }}>
                                                    <VisibilityIcon fontSize="small" />
                                                </Controls.ActionButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Order"
                openPopup={open}
                setOpenPopup={setOpen}>
                <ViewOrder item={recordForView} />
            </Popup>
            <Popup
                title="Reschedule appointment"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <Editorder reScheduleDate={reScheduleDate} recordForEdit={recordForEdit} />
                <Typography variant="inherit" color="textSecondary">
                    {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
                </Typography>
            </Popup>
            <Popup
                title="Order Service"
                openPopup={close}
                setOpenPopup={setClose}>
                <AddOrder addNewOrder={addNewOrder} />
                <Typography variant="inherit" color="textSecondary">
                    {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
                </Typography>
            </Popup>
            <Popup
                title="Collection form"
                openPopup={openCollection}
                setOpenPopup={setOpenCollection}>
                <OrderCollectionForm
                    order={recordForCollection}
                    collectedBy={collectedBy} />
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
