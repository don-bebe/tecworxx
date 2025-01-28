import React, { useEffect, useState, useRef } from 'react'
import { Grid, Paper, makeStyles, IconButton, Typography, OutlinedInput, FormControl, InputLabel, Toolbar, Container } from '@material-ui/core';
import Controls from '../../components/controls/Controls';
import { Search, MonetizationOn, Label, RemoveCircle, Done } from "@material-ui/icons";
import InputAdornment from '@material-ui/core/InputAdornment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { GetProductBySku } from '../../components/services/stockSlice';
import { GetAllActivePaymentMethod } from '../../components/services/paymentMethodSlice';
import Card from '@material-ui/core/Card';
import { useDispatch, useSelector } from "react-redux";
import Notification from '../../components/features/Notification';
import { PointOfSale, reset } from "../../components/services/pointOfSale";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { ComponentToPrint } from './ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import clsx from 'clsx';

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
    root: {
        maxWidth: 125,
        maxHeight: 125
    },
    roots: {
        flexGrow: 1,
    },
}));

const min = 1;
const max = 250;

export default function SellItems() {
    const classes = useStyles();
    const [prod, setProd] = useState('');
    const [sku, setSku] = useState('');
    const [cart, setCart] = useState([]);
    const [way, setWay] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [qty, setQty] = useState(min);
    const [rate, setRate] = useState(1);
    const [method, setMethod] = useState('');
    const [change, setChange] = useState(0);
    const [phone, setPhone] = useState();
    const [paidAmount, setPaid] = useState(0);
    const [finalAmount, setfinalAmount] = useState(0);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const dispatch = useDispatch();
    const componentRef = useRef();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const { pos, isError, isSuccess, message } = useSelector(
        (state) => state.pos
    );

    const handleSkuChange = (e) => {
        e.preventDefault();
        const getSku = e.target.value;
        setSku(getSku);
    }


    useEffect(() => {
        GetMethod();
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (pos || isSuccess) {
            setNotify({
                isOpen: true,
                message: "Items successfully sold",
                type: 'success'
            });
            handlePrint();
            window.location.reload(false);
        }
        dispatch(reset());
    }, [pos, isSuccess, dispatch, setNotify, handlePrint]);

    const GetMethod = async () => {
        try {
            let response = await GetAllActivePaymentMethod();
            setWay(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const GetProduct = async () => {
            try {
                let response = await GetProductBySku(sku)
                setProd(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        GetProduct();
    }, [sku]);

    const addProductToCart = async (product) => {
        // check if the adding product exist
        let findProductInCart = await cart.find(i => {
            return i.keepingUnit === product.keepingUnit
        });

        if (findProductInCart) {
            let newCart = [];
            let newItem;

            cart.forEach(cartItem => {
                if (cartItem.keepingUnit === product.keepingUnit) {
                    newItem = {
                        ...cartItem,
                        quantity: cartItem.quantity + parseInt(qty),
                        totalAmount: cartItem.price * (cartItem.quantity + parseInt(qty))
                    }
                    newCart.push(newItem);
                } else {
                    newCart.push(cartItem);
                }
            });
            setCart(newCart);
            setQty(min);
        }
        else {
            let addingProduct = {
                ...product,
                'quantity': parseInt(qty),
                'totalAmount': product.price * parseInt(qty),
            }
            setCart([...cart, addingProduct]);
            setQty(min)
        }
    }

    const removeProduct = async (product) => {
        const newCart = cart.filter(cartItem => cartItem.keepingUnit !== product.keepingUnit);
        setCart(newCart);
    }

    useEffect(() => {
        let newTotalAmount = 0;
        cart.forEach(icart => {
            newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
        })
        setTotalAmount(newTotalAmount);
    }, [cart]);

    useEffect(() => {
        const finalSum = parseFloat(totalAmount) * parseFloat(rate)
        setfinalAmount(finalSum);
    }, [rate, totalAmount])


    const CalculateChange = () => {
        let balance = 0;
        if (paidAmount >= finalAmount) {
            try {
                balance = parseFloat(paidAmount).toFixed(2) - parseFloat(finalAmount).toFixed(2)
                setChange(parseFloat(balance).toFixed(2))
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        if (paidAmount !== 0) {
            CalculateChange();
        }
    });

    const SellProducts = async (carts) => {
        try {
            await dispatch(PointOfSale({ products: carts, totalAmount: totalAmount, paidAmount: paidAmount, phone: phone, newTotalAmount: finalAmount, method: method, rate: rate }));
        } catch (error) {
            console.log(error);
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
                                    <Toolbar>
                                        <Controls.Input
                                            label="Search product by name"
                                            className={classes.searchInput}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>)
                                            }}
                                            onChange={handleSkuChange}
                                        />
                                        <Controls.Button
                                            text="Add to cart"
                                            variant="outlined"
                                            startIcon={<AddShoppingCartIcon />}
                                            className={classes.newButton}
                                            onClick={() => addProductToCart(prod)}
                                            disabled={!prod}
                                        />
                                    </Toolbar>
                                    <div><p></p></div>
                                    <Grid container className={classes.roots} spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Controls.Input
                                                name='product'
                                                value={prod.product}
                                                inputProps={
                                                    { readOnly: true }
                                                }
                                                InputProps={{
                                                    startAdornment: (<InputAdornment position="start">
                                                        <Label />
                                                    </InputAdornment>)
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Controls.Input
                                                name='price'
                                                value={prod.price}
                                                inputProps={
                                                    { readOnly: true }
                                                }
                                                InputProps={{
                                                    startAdornment: (<InputAdornment position="start">
                                                        <MonetizationOn />
                                                    </InputAdornment>)
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Controls.Input
                                                type='number'
                                                name="quantity"
                                                label="Quantity"
                                                value={qty}
                                                inputProps={{ min, max }}
                                                onChange={(e) => { setQty(e.target.value) }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Table className={classes.table} size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>Price($)</TableCell>
                                                    <TableCell>Qty</TableCell>
                                                    <TableCell>Total($)</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    cart ? cart.map((cartProduct) =>
                                                        <TableRow key={cartProduct.id}>
                                                            <TableCell>{cartProduct.product}</TableCell>
                                                            <TableCell>{cartProduct.price}</TableCell>
                                                            <TableCell>{cartProduct.quantity}</TableCell>
                                                            <TableCell>{cartProduct.totalAmount}</TableCell>
                                                            <TableCell>
                                                                <IconButton onClick={() => removeProduct(cartProduct)} color='secondary'>
                                                                    <RemoveCircle />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>)
                                                        : 'No Item in Cart'}
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4}>
                            <Paper className={fixedHeightPaper}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" component="h2" color='primary'>Payment</Typography>
                                    </Grid>
                                    {totalAmount !== 0 ? way.map(items => (
                                        <Grid item key={items.id} xs={12} md={4} lg={4}>
                                            <Card className={classes.root}>
                                                <CardActionArea onClick={() => { setRate(items.rate); setMethod(items.method) }}>
                                                    <CardContent><Typography variant='h7' color='primary'>{items.method}</Typography></CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    ))
                                        : ''}
                                    <div>
                                        {totalAmount !== 0 ?
                                            <Grid>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell rowSpan={3} />
                                                            <TableCell colSpan={3}>Sub-total</TableCell>
                                                            <TableCell align="right">${totalAmount}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={3}><b>Total</b></TableCell>
                                                            <TableCell align='right'><b>{finalAmount}</b></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={3}>Change</TableCell>
                                                            <TableCell align='right'>{change}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel>Paid Amount</InputLabel>
                                                    <OutlinedInput
                                                        id="paid"
                                                        value={paidAmount}
                                                        onChange={(e) => setPaid(e.target.value)}
                                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                        labelWidth={60}
                                                        style={{marginLeft: 8, marginTop: 5, marginBottom: 10, width: '80%'}}
                                                    />
                                                </FormControl>
                                                <Controls.PhoneInputs
                                                    label="Phone number"
                                                    name="phone"
                                                    id="phone"
                                                    enableSearch={true}
                                                    value={phone}
                                                    onChange={e => setPhone(e)}
                                                    inputProps={{
                                                        required: true
                                                    }}
                                                />
                                                <Controls.Button
                                                    text='Paynow'
                                                    variant='contained'
                                                    startIcon={<Done />}
                                                    disabled={!phone || finalAmount > paidAmount}
                                                    onClick={() => { SellProducts(cart); handlePrint() }}
                                                />
                                            </Grid>
                                            : 'Please add a product to the cart'}
                                    </div>
                                    <div>
                                        <Typography variant="inherit" color="textSecondary">
                                            {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    <div style={{ display: "none" }}>
                        <ComponentToPrint ref={componentRef} cart={cart}
                            totalAmount={totalAmount} paid={paidAmount}
                            phone={phone} method={method}
                            finalAmount={finalAmount} change={change}
                        />
                    </div>
                </Container>
            </main>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}
