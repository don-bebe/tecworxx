import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import { Typography } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import Tecworx from '../../../start/tecworx.png';
import Grid from '@material-ui/core/Grid';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    const { cart, totalAmount, paid, phone, method, finalAmount, change } = props;
    return (
        <div style={{ width: '75%', margin: '25px' }} ref={ref} >
            <Grid container>
                <Grid item xs={6} align='left'>
                    <img src={Tecworx} alt="logo" sx={{ width: 100, height: 100 }} />
                </Grid>
                <Grid item xs={6} align='right' style={{ marginTop: '50px' }}>
                    <Typography>Avondale Shops,</Typography>
                    <Typography>Nando Buidling, Downstairs</Typography>
                    <Typography>Harare Zimbabwe</Typography>
                    <Typography>Call: 086 7721 0051</Typography>
                    <Typography>www.tec-worx.com</Typography>
                </Grid>
            </Grid>
            <div>
                <Typography >Customer phone: {phone}</Typography>
                <Typography >{new Date(new Date()).toDateString()}</Typography>
            </div>
            <div className="p-5">
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Product</TableCell>
                            <TableCell align="right">Price($)</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Total($)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            cart ? cart.map((cartProduct) =>
                                <TableRow key={cartProduct.id}>
                                    <TableCell>{cartProduct.brand.category.category + " " + cartProduct.brand.make}</TableCell>
                                    <TableCell align='right'>{cartProduct.product}</TableCell>
                                    <TableCell align="right">{cartProduct.price}</TableCell>
                                    <TableCell align="right">{cartProduct.quantity}</TableCell>
                                    <TableCell align="right">{cartProduct.totalAmount}</TableCell>
                                </TableRow>)
                                : ''}
                        <TableRow>
                            <TableCell rowSpan={5} />
                            <TableCell colSpan={3}><b>Subtotal</b></TableCell>
                            <TableCell align="right">${totalAmount}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell ><b>Method</b></TableCell>
                            <TableCell align='right'>{method}</TableCell>
                            <TableCell align='right'></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3}><b>Total</b></TableCell>
                            <TableCell align="right"><b>{finalAmount}</b></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3}><b>Paid</b></TableCell>
                            <TableCell align="right">{paid}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3}><b>Change</b></TableCell>
                            <TableCell align="right"><b>{change}</b></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
});
