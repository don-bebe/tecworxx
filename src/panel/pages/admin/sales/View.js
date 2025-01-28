import React from 'react';
import Grid from '@material-ui/core/Grid';
import Controls from '../../../components/controls/Controls';
import { Form } from '../../../components/features/useForm';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function View({ sell }) {
    return (
        <Form>
            <Grid container>
                <Controls.Input
                    name="date"
                    label="Date"
                    value={sell.date}
                    inputProps={
                        { readOnly: true }
                    }
                />
                <Controls.Input
                    name="phone"
                    label="Customer phone"
                    value={sell.phone}
                    inputProps={
                        { readOnly: true }
                    }
                />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Product</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Quantity</strong></TableCell>
                                <TableCell><strong>Cost</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                sell.soldItems?.map((element) => (
                                    <TableRow key={element.keepingUnit}>
                                        <TableCell component="th" scope="row">{element.product}</TableCell>
                                        <TableCell>{element.price}</TableCell>
                                        <TableCell>{element.quantity}</TableCell>
                                        <TableCell>{element.cost}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Controls.Input
                    name="totalAmount"
                    label="Total Amount"
                    value={sell.totalAmount}
                    inputProps={
                        { readOnly: true }
                    }
                />
                <Controls.Input
                    name="method"
                    label="Payment method"
                    value={sell.method}
                    inputProps={
                        { readOnly: true }
                    }
                />
                <Controls.Input
                    name="newTotalAmount"
                    label="Final Total Amount"
                    value={sell.newTotalAmount}
                    inputProps={
                        { readOnly: true }
                    }
                />
                <Controls.Input
                    name="cashier"
                    label="Cashier"
                    value={sell.employee.firstName + ' ' + sell.employee.lastName}
                    inputProps={
                        { readOnly: true }
                    }
                />
            </Grid>
        </Form>
    )
}
