import React, { useEffect, useState } from 'react'
import Controls from '../../components/controls/Controls';
import { Paper, makeStyles, IconButton, OutlinedInput, Table, TableHead, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Grid, Container, Typography } from '@material-ui/core';
import { Search, RemoveCircle, Done } from "@material-ui/icons";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import clsx from 'clsx';
import InputLabel from '@material-ui/core/InputLabel';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import ChromeReaderModeOutlinedIcon from '@material-ui/icons/ChromeReaderModeOutlined';
import { getJobCardByCardId } from '../../components/services/jobcardSlice';
import { getOrderServiceByOrder } from '../../components/services/orderService/assignSlice';
import { GetAllActivePaymentMethod } from '../../components/services/paymentMethodSlice';
import { Paycard, GetPaymentStatus, FindOrderPaymentStatus, UpdatePayCard, UpdatePayOrders, PaymentOrder, reset } from '../../components/services/cardPaymentSlice';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { useDispatch, useSelector } from "react-redux";
import Notification from '../../components/features/Notification';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(0.5)
    },
    container: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 700,
    },
    searchInput: {
        width: '60%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    },
    table: {
        marginTop: theme.spacing(1),
        '& thead th': {
            fontWeight: '400',
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.light,
        },
        '& tbody td': {
            fontWeight: '100',
        },
        '& tbody tr:hover': {
            backgroundColor: '#a1cff0',
            cursor: 'pointer',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
        position: 'absolute',
        right: '10px'
    },
    root: {
        flexGrow: 1,
    },
    roots: {
        maxWidth: 125,
        maxHeight: 125
    },
}));

export default function CardorOrderPay() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [value, setValue] = useState('');
    const [cardId, setCardId] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [allow, setAllow] = useState(false);
    const [record, setRecord] = useState([]);
    const [labour, setLabour] = useState(0);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalSum, setTotalSum] = useState(0);
    const [way, setWay] = useState([]);
    const [rate, setRate] = useState(1);
    const [method, setMethod] = useState('');
    const [amount, setAmount] = useState(0);
    const [amountPay, setAmountPay] = useState(0);
    const [finalAmount, setfinalAmount] = useState(0);
    const [change, setChange] = useState(0);

    const [existingTotalAmount, setExistingTotalAmount] = useState(0);
    const [existingPaidAmount, setExistingPaidAmount] = useState(0);
    const [owing, setOwing] = useState(0);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const dispatch = useDispatch();

    let newCart = [];
    let addingProduct;

    const { cardpay, isError, isSuccess, message } = useSelector(
        (state) => state.cardpay
    );

    const handleChange = (event) => {
        setValue(event.target.value);
        if (event.target.value === "Jobcard") {
            setEnabled(true)
        }
        else if (event.target.value === "Order service") {
            setAllow(true)
        }
        else {
            setEnabled(false)
            setAllow(false)
        }
    };

    const handleCardNo = (e) => {
        const getCard = e.target.value;
        setCardId(getCard);
        e.preventDefault();
    }

    //search job card || order service
    useEffect(() => {
        if (cardId != null && cardId.length > 7) {
            if (value === "Jobcard") {
                const searchJobCard = async () => {
                    try {
                        const response = await getJobCardByCardId(cardId);
                        setRecord(response.data)
                    } catch (error) {
                        console.log(error)
                    }
                }
                searchJobCard();
            }
            else if (value === "Order service") {
                const searchOrder = async () => {
                    try {
                        const response = await getOrderServiceByOrder(cardId);
                        setRecord(response.data)
                    } catch (error) {
                        console.log(error)
                    }
                }
                searchOrder();
            }
        }
    }, [cardId, value, setRecord]);

    //set record for order service and jobcard # add to cart
    useEffect(() => {
        if (record.length !== 0 && value === "Jobcard") {
            if (record && record.workshop?.labourCharge !== null) {
                setLabour(record.workshop?.labourCharge);
                record.workshop?.requirements?.map(async (element) => {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    addingProduct = {
                        ...element,
                        'quantity': 1,
                        'totalAmount': element.price * parseInt(1)
                    }
                    newCart.push(addingProduct)
                });
                setCart(newCart)
                //retrieving payment info
                const GetPaymentStatusForCard = async () => {
                    try {
                        const response = await GetPaymentStatus(cardId);
                        if (response.data?.map(x => x.cardNo).length !== 0) {
                            setExistingTotalAmount(response.data?.map(x => x.totalAmount))
                            setExistingPaidAmount(response.data?.map(x => x.paidSum))
                        }
                        else {
                            setExistingTotalAmount(0);
                            setExistingPaidAmount(0);
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                GetPaymentStatusForCard();
            }
        }
        //ordered service
        if (record.length !== 0 && value === "Order service") {
            if (record && record.orderswork?.labourCharge !== null) {
                record.orderswork?.partsrequireds?.map(async (element) => {
                    addingProduct = {
                        ...element,
                        'quantity': 1,
                        'totalAmount': element.price * parseInt(1)
                    }
                    newCart.push(addingProduct)
                });
                setCart(newCart)
                setLabour(record.orderswork?.labourCharge)
                //retrieving payment info
                const GetOrderPaymentsStatus = async () => {
                    try {
                        const response = await FindOrderPaymentStatus(cardId)
                        if (response.data?.map(x => x.orderId).length !== 0) {
                            setExistingTotalAmount(response.data?.map(x => x.totalAmount))
                            setExistingPaidAmount(response.data?.map(x => x.paidSum))
                        } else {
                            setExistingTotalAmount(0);
                            setExistingPaidAmount(0);
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                GetOrderPaymentsStatus();
            }
        }
    }, [value, record, cardId, setCart, setExistingPaidAmount, setExistingTotalAmount, setLabour])

    // //calculate amount owing
    useEffect(() => {
        let change = 0;
        if (existingTotalAmount !== 0) {
            change = parseFloat(existingTotalAmount).toFixed(2) - parseFloat(existingPaidAmount).toFixed(2)
            setOwing(parseFloat(change).toFixed(2))
        }
        else {
            setOwing(change);
        }
    }, [existingPaidAmount, existingTotalAmount])

    //remove from cart
    async function removeProduct(product) {
        const newCart = cart.filter(cartItem => cartItem.keepingUnit !== product.keepingUnit);
        setCart(newCart);
    }

    //payment methods
    async function GetMethod() {
        try {
            let response = await GetAllActivePaymentMethod();
            setWay(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    //finding total for job card
    useEffect(() => {
        let newTotalAmount = 0;
        cart.forEach(icart => {
            newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
        })
        if (value === 'Jobcard' || value === 'Order service') {
            setTotalSum(newTotalAmount);
            if (labour !== null) {
                let finalAmount = 0;
                finalAmount = parseFloat(newTotalAmount) + parseFloat(labour)
                setTotalAmount(parseFloat(finalAmount).toFixed(2));
            }
        }
        else {
            setTotalAmount(0)
        }
        GetMethod();
    }, [cart, labour, value]);

    useEffect(() => {
        if (cardpay || isSuccess) {
            setNotify({
                isOpen: true,
                message: "Transcation is completed",
                type: 'success'
            });
            window.location.reload(false);
        }
        dispatch(reset());
    }, [cardpay, isSuccess, dispatch, setNotify])

    //amount to paid in US
    useEffect(() => {
        let balance = 0;
        if (amount !== 0 && amount !== '' && rate !== '') {
            balance = parseFloat(amount).toFixed(2) / parseFloat(rate).toFixed(2)
            setAmountPay(parseFloat(balance).toFixed(2))
        }
    }, [amount, rate])

    //setFinal Amount
    useEffect(() => {
        let balance = 0;
        if (amount !== 0 && amount !== '' && rate !== '') {
            balance = parseFloat(amount).toFixed(2)
            setfinalAmount(parseFloat(balance).toFixed(2))
        }
    }, [amount, rate])

    //calculate change for new payment
    const CalculateChange = () => {
        let balance = 0;
        let paAmount = 0;
        paAmount = parseFloat(amount).toFixed(2);
        if (paAmount >= finalAmount) {
            try {
                balance = parseFloat(amount).toFixed(2) - parseFloat(finalAmount).toFixed(2)
                setChange(parseFloat(balance).toFixed(2))
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        if (amount !== 0 && amount !== '') {
            CalculateChange();
        }
    });

    //pay for jobcard
    const ProcessJobcard = async (carts) => {
        try {
            dispatch(Paycard({ products: carts, totalAmount: totalAmount, paidAmount: amountPay, cardNo: cardId, method: method, rate: rate, phone: record.customer?.phone }))
        } catch (error) {
            console.log(error)
        }
    }
    //update jobcard
    const UpdateJobcard = () => {
        try {
            dispatch(UpdatePayCard({ amount: amountPay, cardNo: cardId, method: method, rate: rate, phone: record.customer?.phone }))
        } catch (error) {
            console.log(error)
        }
    }

    //pay for order
    const ProcessOrderService = async (carts) => {
        try {
            dispatch(PaymentOrder({ products: carts, totalAmount: totalAmount, paidAmount: amountPay, orderId: cardId, method: method, rate: rate, phone: record.customer?.phone }))
        } catch (error) {
            console.log(error)
        }
    }

    //update order pay
    const UpdateOrderPay = () => {
        try {
            dispatch(UpdatePayOrders({ amount: amountPay, orderId: cardId, method: method, rate: rate, phone: record.customer?.phone }))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <main className={classes.pageContent}>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={8}>
                            <Paper className={fixedHeightPaper}>
                                <Grid item xs={12}>
                                    {/* choose option that is either jobcard or order service*/}
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Payment for</FormLabel>
                                        <RadioGroup row aria-label="pay" name="pay" value={value} onChange={handleChange}>
                                            <FormControlLabel value="Jobcard" disabled={allow} control={<Radio />} label="Jobcard" />
                                            <FormControlLabel value="Order service" disabled={enabled} control={<Radio />} label="Order service" />
                                            <FormControlLabel value="other" disabled control={<Radio />} label="(Other)" />
                                        </RadioGroup>
                                    </FormControl>
                                    {/* provide card #*/}
                                    <Toolbar>
                                        <Controls.Input
                                            label={value === "Jobcard" ? "Search jobcard number" : value === "Order service" ? "Search order number" : "Search"}
                                            className={classes.searchInput}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>)
                                            }}
                                            onChange={handleCardNo}
                                        />
                                    </Toolbar>
                                    <div><p></p></div>
                                    {/* display customer & device details*/}
                                    <Grid container className={classes.root} spacing={2}>
                                        {value === "Jobcard" || value === "Order service" ? <> <Grid item xs={12} md={4}>
                                            <Controls.Input
                                                name='customerID'
                                                label='CustomerID'
                                                value={value === 'Order service' ? record.customer?.customerID : value === 'Jobcard' ? record.customerID : ''}
                                                inputProps={
                                                    { readOnly: true }
                                                }
                                                InputProps={{
                                                    startAdornment: (<InputAdornment position="start">
                                                        <PersonOutlineOutlinedIcon />
                                                    </InputAdornment>)
                                                }}
                                            />
                                        </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Controls.Input
                                                    name='phone'
                                                    label='Phone number'
                                                    value={record.customer?.phone}
                                                    inputProps={
                                                        { readOnly: true }
                                                    }
                                                    InputProps={{
                                                        startAdornment: (<InputAdornment position="start">
                                                            <PhoneOutlinedIcon />
                                                        </InputAdornment>)
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Controls.Input
                                                    name='model'
                                                    label='Model'
                                                    value={value === 'Order service' ? record.devicemodel?.model : value === "Jobcard" ? record.model : ''}
                                                    inputProps={
                                                        { readOnly: true }
                                                    }
                                                    InputProps={{
                                                        startAdornment: (<InputAdornment position="start">
                                                            <ChromeReaderModeOutlinedIcon />
                                                        </InputAdornment>)
                                                    }}
                                                />
                                            </Grid></> : ''}
                                    </Grid>
                                    {/* display due balance if payment once made */}
                                    <Grid item xs={12}>
                                        {value !== "" ? <>
                                            {/* show portal if an payment was once made */}
                                            {existingTotalAmount !== 0 && (
                                                <>
                                                    <p></p>
                                                    <Typography variant="h6" component="h6" color='primary' align='center'>Payment portal</Typography>
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell rowSpan={3} />
                                                                <TableCell colSpan={3}><b>TotalAmount</b></TableCell>
                                                                <TableCell align="right"><b>${existingTotalAmount}</b></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell colSpan={3}>PaidAmount</TableCell>
                                                                <TableCell align='right'>${existingPaidAmount}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell colSpan={3}>Outstanding Amount</TableCell>
                                                                <TableCell align='right'><b>${owing}</b></TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </>
                                            )}
                                            {/* show table of items if no payment was made initially */}
                                            {existingTotalAmount === 0 && (
                                                <>
                                                    <Table className={classes.table} size='small'>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Product</TableCell>
                                                                <TableCell>Price($)</TableCell>
                                                                <TableCell>Quantity</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                cart ? cart.map((element) =>
                                                                    <TableRow key={element.id}>
                                                                        <TableCell>{element.product}</TableCell>
                                                                        <TableCell>{element.price}</TableCell>
                                                                        <TableCell>{element.quantity}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => removeProduct(element)} color='secondary'>
                                                                                <RemoveCircle />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ) : ''
                                                            }
                                                            <TableRow>
                                                                <TableCell rowSpan={3} />
                                                                <TableCell colSpan={2}>Subtotal</TableCell>
                                                                <TableCell align="right">${totalSum}</TableCell>
                                                            </TableRow>
                                                            {
                                                                labour ?
                                                                    <>
                                                                        <TableRow>
                                                                            <TableCell colSpan={2}>Labour charge</TableCell>
                                                                            <TableCell align='right'>${labour}</TableCell>
                                                                        </TableRow>
                                                                        <TableRow>
                                                                            <TableCell colSpan={2}><b>TotalAmount</b></TableCell>
                                                                            <TableCell align='right'><b>${totalAmount}</b></TableCell>
                                                                        </TableRow>
                                                                    </>
                                                                    :
                                                                    ''
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </>
                                            )
                                            }
                                        </> : ''}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4}>
                            <Paper className={fixedHeightPaper}>
                                <Grid container spacing={2}>
                                    {
                                        value !== "" ?
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" component="h6" color='primary'>Payment method</Typography>
                                                </Grid>
                                                {
                                                    way.map(items => (
                                                        <Grid item key={items.id} xs={12} md={4} lg={4}>
                                                            <Card className={classes.roots}>
                                                                <CardActionArea onClick={() => { setRate(items.rate); setMethod(items.method) }}>
                                                                    <CardContent><Typography variant='caption' color='primary'>{items.method}</Typography></CardContent>
                                                                </CardActionArea>
                                                            </Card>
                                                        </Grid>
                                                    ))
                                                }
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell rowSpan={5} />
                                                            <TableCell colSpan={3}>Amount in $</TableCell>
                                                            <TableCell align='right'>{amountPay}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={3}>Method of payment</TableCell>
                                                            <TableCell align='right'>{method}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={3}><b>Final Amount</b></TableCell>
                                                            <TableCell align='right'><b>{finalAmount}</b></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={3}><b>Entered Amount</b></TableCell>
                                                            <TableCell align="right"><b>{amount}</b></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={2}>Change</TableCell>
                                                            <TableCell align='right'>{change}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                                <FormControl fullWidth variant="outlined" style={{ marginTop: '15px' }}>
                                                    <InputLabel>Enter Amount</InputLabel>
                                                    <OutlinedInput
                                                        id="paid"
                                                        value={amount}
                                                        disabled={method === ''}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        startAdornment={<InputAdornment position="start">{method.toLowerCase() === 'zwl' || method === 'rtgs' ? 'ZWL' : method.toLowerCase() === 'rands' ? 'R' : '$'}</InputAdornment>}
                                                        labelWidth={60}
                                                    />
                                                </FormControl>
                                                {
                                                    amount !== 0 && amount !== '' ?
                                                        <>
                                                            <Controls.Button
                                                                text='Paynow'
                                                                variant='contained'
                                                                startIcon={<Done />}
                                                                disabled={parseFloat(amount).toFixed(2) < finalAmount}
                                                                onClick={() => {
                                                                    value === "Jobcard" && (existingTotalAmount !== 0 ? UpdateJobcard() : ProcessJobcard(cart));
                                                                    value === "Order service" && (existingTotalAmount !== 0 ? UpdateOrderPay() : ProcessOrderService(cart))
                                                                }}
                                                            />
                                                            <div>
                                                                <Typography variant="inherit" color="textSecondary">
                                                                    {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
                                                                </Typography>
                                                            </div>
                                                        </> : ''
                                                }
                                            </> : ''
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </main>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}
