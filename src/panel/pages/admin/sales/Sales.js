import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, IconButton } from '@material-ui/core';
import PageHeader from '../../../components/features/PageHeader';
import useTable from '../../../components/features/useTable';
import { Search } from "@material-ui/icons";
import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import Controls from '../../../components/controls/Controls';
import { GetAllSales } from '../../../components/services/pointOfSale';
import VisibilityIcon from '@material-ui/icons/Visibility';
import View from "./View";
import Popup from '../../../components/features/Popup';
import GetAppIcon from '@material-ui/icons/GetApp';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import * as XLSX from 'xlsx';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(2),
        padding: theme.spacing(1)
    },
    searchInput: {
        width: '30%'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    grow: {
        flexGrow: 1,
    },
    newButton: {
        position: 'absolute',
        right: '2px'
    }
}))

const headCells = [
    { id: 'id', label: '#' },
    { id: 'date', label: 'Date' },
    { id: 'products', label: 'Products' },
    { id: 'total', label: 'TotalAmount' },
    { id: 'paid', label: 'Amount Paid' },
    { id: 'method', label: 'Method' },
    { id: 'phone', label: 'Customer' },
    { id: 'cashier', label: 'Cashier' },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Sales() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [recordForView, setRecordForView] = useState(null)
    const [open, setOpen] = useState(false)
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [startDate, setStartDate] = useState(new Date(''));
    const [endDate, setEndDate] = useState(new Date(''));
    const [report, setReport] = useState('');
    const [disabled, setDisable] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const mobileMenuId = 'primary-search-account-menu-mobile';

    //retrieve all sales
    const getSalesData = async () => {
        try {
            let response = await GetAllSales();
            setRecords(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getSalesData();
    }, []);

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    //set date fields false
    useEffect(() => {
        if (report !== "Select dates") {
            setDisable(false);
            setEnabled(false);
        }
    }, [report]);


    const handleReportChange = e => {
        setReport(e.target.value);
        //daily report
        if (e.target.value === "Daily") {
            let daily = new Date(new Date().setDate(new Date().getDate())).toISOString().substring(0, 10);
            const today = new Date(daily).toDateString();
            setFilterFn({
                fn: items => {
                    return items.filter(x => new Date(x.date).toDateString().includes(today));
                }
            })
        }
        //previous day
        else if (e.target.value === "Previously") {
            let daily = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().substring(0, 10);
            const newDay = new Date(daily).toDateString();
            setFilterFn({
                fn: items => {
                    return items.filter(x => new Date(x.date).toDateString() === newDay)
                }
            });
        }
        //weekly report
        else if (e.target.value === "Weekly") {
            let lastday = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10);
            const last = new Date(lastday).getTime();
            const today = new Date(new Date()).getTime();
            setFilterFn({
                fn: items => {
                    return items.filter(x => new Date(x.date).getTime() >= last && new Date(x.date).getTime() <= today);
                }
            })
        }
        //monthly report
        else if (e.target.value === "Monthly") {
            let monthly = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().substring(0, 10);
            const monthy = new Date(monthly).getTime();
            setFilterFn({
                fn: items => {
                    return items.filter(x => new Date(x.date).getTime() >= monthy && new Date(x.date).getTime() <= new Date(new Date()).getTime())
                }
            })
        }
        //select dates
        else if (e.target.value === "Select dates") {
            setDisable(true);
        }
        //all reports
        else {
            setFilterFn({
                fn: items => {
                    return items;
                }
            })
        }
    }

    //search by customer
    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.phone.toLowerCase().includes(target.value))
            }
        })
    }

    //start of between dates
    const handleStartDateSearch = e => {
        let target = e.target;
        setStartDate(target.value);
        const start = new Date(target.value).toDateString();
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else {
                    return items.filter(x => new Date(x.date).toDateString() >= start)
                }
            }
        });
        setEnabled(true);
    }
    //end of start date

    //start of end date
    const handleEndDateSearch = e => {
        let target = e.target;
        setEndDate(target.value);
        const start = new Date(startDate).toDateString();
        const end = new Date(target.value).toDateString();
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => new Date(x.date).toDateString() >= start && new Date(x.date).toDateString() <= end);
            }
        });
    }
    //end of between dates

    const openInWindow = sell => {
        setRecordForView(sell)
        setOpen(true)
    }

    //exporting data
    const handleOnExport = () => {
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(recordsAfterPagingAndSorting());
        XLSX.utils.book_append_sheet(wb, ws, report + "Sales");
        XLSX.writeFile(wb, new Date(new Date()) + ".xls");
    }
    //mobile view
    const renderMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}>
            <MenuItem>
                <TextField
                    id="startDate"
                    label="From"
                    type='date'
                    defaultValue={startDate}
                    inputProps={{
                        min: new Date().toISOString().slice(0, 16)
                    }}
                    variant="outlined"
                    name='startDate'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleStartDateSearch}
                    disabled={!disabled}
                />
                <div><h3>-</h3></div>
                <TextField
                    id="endDate"
                    label="To"
                    type='date'
                    defaultValue={endDate}
                    inputProps={{
                        min: startDate
                    }}
                    variant="outlined"
                    name='endDate'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleEndDateSearch}
                    disabled={!enabled}
                />
            </MenuItem>
            <MenuItem>
                <Controls.Button
                    text="Export"
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={handleOnExport}
                />
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <PageHeader
                title="Total Sales"
                subTitle="Daily, Weekly, Monthly"
                icon={<TrendingUpTwoToneIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search sold products by customer phone"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Choose report</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={report}
                            onChange={handleReportChange}
                            label="Choose report"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value='Daily'>Daily</MenuItem>
                            <MenuItem value='Previously'>Previous day</MenuItem>
                            <MenuItem value='Weekly'>Weekly</MenuItem>
                            <MenuItem value='Monthly'>Monthly</MenuItem>
                            <MenuItem value='Select dates'>Select dates</MenuItem>
                        </Select>
                    </FormControl>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <TextField
                            id="startDate"
                            label="From"
                            type='date'
                            defaultValue={startDate}
                            inputProps={{
                                min: new Date().toISOString().slice(0, 16)
                            }}
                            variant="outlined"
                            name='startDate'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleStartDateSearch}
                            disabled={!disabled}
                        />
                        <div><h3>-</h3></div>
                        <TextField
                            id="endDate"
                            label="To"
                            type='date'
                            defaultValue={endDate}
                            inputProps={{
                                min: startDate
                            }}
                            variant="outlined"
                            name='endDate'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleEndDateSearch}
                            disabled={!enabled}
                        />
                        <Controls.Button
                            text="Export"
                            variant="outlined"
                            startIcon={<GetAppIcon />}
                            onClick={handleOnExport}
                        />
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
                {renderMenu}
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {recordsAfterPagingAndSorting().map(sell => (
                            <TableRow key={sell.id}>
                                <TableCell>{sell.id}</TableCell>
                                <TableCell>{sell.date}</TableCell>
                                <TableCell>{sell.soldItems?.map((element) => (
                                    <tr>{element.product}</tr>
                                ))}
                                </TableCell>
                                <TableCell>{sell.totalAmount}</TableCell>
                                <TableCell>{sell.paidAmount}</TableCell>
                                <TableCell>{sell.method}</TableCell>
                                <TableCell>{sell.phone}</TableCell>
                                <TableCell>{sell.employee.firstName + ' ' + sell.employee.lastName}</TableCell>
                                <TableCell>
                                    <Controls.ActionButton
                                        onClick={() => { openInWindow(sell) }}    >
                                        <VisibilityIcon fontSize="small" />
                                    </Controls.ActionButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Sold Items"
                openPopup={open}
                setOpenPopup={setOpen}>
                <View sell={recordForView} />
            </Popup>
        </>
    )
}
