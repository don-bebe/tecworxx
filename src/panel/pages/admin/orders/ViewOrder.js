import React from 'react'
import Grid from '@material-ui/core/Grid';
import Controls from '../../../components/controls/Controls';
import { Form } from '../../../components/features/useForm';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function ViewOrder({item}) {
  return (
    <Form>
        <Grid container>
            <Grid item xs={6}>
                <Typography varient='h6' color='primary'>Order details</Typography>
                <Controls.Input
                    name="date"
                    label="Date ordered"
                    value = { item.date}
                    inputProps={
					{ readOnly: true }
				    }
                />
                <Controls.Input
                    name="orderId"
                    label="orderID"
                    value = { item.orderId}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="repairId"
                    label="repair category"
                    value = { item.devicemodel?.manufacturer.repaircategory.repair}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="model"
                    label="Model"
                    value = { item.devicemodel?.manufacturer.manufacture +' '+ item.devicemodel?.model}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Problem</strong></TableCell>
                            <TableCell><strong>Cost ($)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            item.orderedservices?.map((element)=>(
                                <TableRow key={element.id}>
                                    <TableCell>{element.problem}</TableCell>
                                    <TableCell>{element.repairCost}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <Typography varient='h6' color='primary'>Assigned technician</Typography>
                <Controls.Input
                    name="fullName"
                    label="Full name"
                    value = { item.orderswork?.employee.firstName +' '+ item.orderswork?.employee.lastName}
                    inputProps={
					    { readOnly: true }
				    }
                />
            </Grid>
            <Grid time xs={6}>
                <Typography varient='h6' color='primary'>Workshop services</Typography>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Product</strong></TableCell>
                            <TableCell><strong>Price ($)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            item.orderswork?.partsrequireds?.map((element)=>(
                                <TableRow key={element.id}>
                                    <TableCell>{element.product}</TableCell>
                                    <TableCell>{element.price}</TableCell>
                                </TableRow>
                            ))
                        }
                        <TableRow>
                            <TableCell>Labour Charge</TableCell>
                            <TableCell>{item.orderswork?.labourCharge}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Controls.Input
                    name="otherParts"
                    label="Other req"
                    value = { item.orderswork?.otherParts}
                    multiline
                    rows={2}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="timeEstimate"
                    label="time estimate"
                    value = { item.orderswork?.timeEstimate}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Typography varient='h6' color='primary'>Customer info</Typography>
                <Controls.Input
                    name="customerID"
                    label="customerID"
                    value = { item.customer?.customerID}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="fullName"
                    label="Full name"
                    value = { item.customer?.fullName}
                    inputProps={
					    { readOnly: true }
				    }
                />
            </Grid>
        </Grid>
    </Form>
  )
}
