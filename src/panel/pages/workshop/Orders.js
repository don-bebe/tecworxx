import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Typography } from '@material-ui/core';
import PageHeader from '../../components/features/PageHeader';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import Controls from '../../components/controls/Controls';
import useTable from '../../components/features/useTable';
import { Search } from "@material-ui/icons";
import { GetMyWorkingOrders, UpdateAssignedOrder, RepairAssignedOrder, reset } from '../../components/services/orderService/assignSlice';
import { useDispatch, useSelector } from "react-redux";
import EditIcon from '@material-ui/icons/Edit';
import Popup from '../../components/features/Popup';
import EditOrders from './EditOrders';
import Notification from '../../components/features/Notification';
import BuildIcon from '@material-ui/icons/Build';
import RepairOrder from './RepairOrder';

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
}));

const headCells = [
    { id: 'id', label: '#' },
    { id: 'orderId', label: 'OrderId' },
    { id: 'bookedDate', label: 'BookedDate' },
    { id: 'repairId', label: 'Category' },
    { id: 'model', label: 'Model' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Orders() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [recordForRepair, setRecordForRepair] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [open, setOpen] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const dispatch = useDispatch();

    const { assign, isError, isSuccess, message } = useSelector(
        (state) => state.assign
    );

    const GetMyWorkingData = async () => {
        try {
            let response = await GetMyWorkingOrders();
            setRecords(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        GetMyWorkingData();
    }, [])

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    useEffect(() => {
        if (assign || isSuccess) {
            setRecordForEdit(null);
            setOpenPopup(false);
            setRecordForRepair(null);
            setOpen(false);
            setNotify({
                isOpen: true,
                message: "Submitted successfully",
                type: 'success'
            });
        }
        dispatch(reset())
    }, [assign, isSuccess, dispatch, setOpenPopup, setNotify, setOpen, setRecordForRepair])

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.orderId.toLowerCase().includes(target.value))
            }
        })
    }

    const addOrEdit = async (work) => {
        try {
            if (work.id) {
                dispatch(UpdateAssignedOrder({ id: work.id, order: work }))
            }
        } catch (error) {
            console.log(error);
        }
        let response = await GetMyWorkingOrders();
        setRecords(response.data);
    }

    const repairWork = async (work) => {
        try {
            if (work.id) {
                dispatch(RepairAssignedOrder({ id: work.id, order: work }))
            }
        } catch (error) {
            console.log(error);
        }
        const response = await GetMyWorkingOrders();
        setRecords(response.data);
    }

    const openInPopup = work => {
        setRecordForEdit(work)
        setOpenPopup(true)
    }

    const openInWorkRepair = work => {
        setRecordForRepair(work)
        setOpen(true)
    }


    return (
        <>
            <PageHeader
                title="Work orders"
                subTitle="Assigned orders"
                icon={<GroupWorkIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search jobcard"
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
                            recordsAfterPagingAndSorting().map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.orderId}</TableCell>
                                    <TableCell>{order.orderservice.bookedDate}</TableCell>
                                    <TableCell>{order.orderservice.devicemodel.manufacturer.repaircategory.repair}</TableCell>
                                    <TableCell>{order.orderservice.devicemodel.manufacturer.manufacture + ' ' + order.orderservice.devicemodel.model}</TableCell>
                                    <TableCell>{order.orderservice.status}</TableCell>
                                    <TableCell>
                                        {
                                            order.orderservice.status === "Approved" ? <>
                                                <Controls.ActionButton
                                                    color="primary"
                                                    onClick={() => { openInPopup(order) }}>
                                                    <EditIcon fontSize="small" />
                                                </Controls.ActionButton>
                                            </> : order.orderservice.status === "Repair" ? <>
                                                <Controls.ActionButton
                                                    onClick={() => { openInWorkRepair(order) }}>
                                                    <BuildIcon fontSize="small" />
                                                </Controls.ActionButton>
                                            </> : ''
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Work Orders"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <EditOrders
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit}
                />
                <Typography variant="inherit" color="textSecondary">
                    {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
                </Typography>
            </Popup>
            <Popup
                title="Repair order"
                openPopup={open}
                setOpenPopup={setOpen}>
                <RepairOrder
                    recordForRepair={recordForRepair}
                    repairWork={repairWork} />
            </Popup>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}
