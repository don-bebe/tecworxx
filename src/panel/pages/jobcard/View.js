import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Controls from '../../components/controls/Controls';
import { Form } from '../../components/features/useForm';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 150,
    },
});

export default function View({ job }) {
    const classes = useStyles();

    return (
        <Form>
            <Grid container>
                <Grid item xs={6}>
                    <Typography varient='h6' color='primary'>Customer details</Typography>
                    <Controls.Input
                        name="customerID"
                        label="customerID"
                        value={job.customerID}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="fullName"
                        label="Full name"
                        value={job.customer.fullName}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Typography varient='h6' color='primary'>Job card details</Typography>
                    <Controls.Input
                        name="date"
                        label="Date"
                        value={job.date}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="cardNo"
                        label="CardNo"
                        value={job.cardNo}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="category"
                        label="Category"
                        value={job.manufacturer.repaircategory.repair}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="make"
                        label="Make"
                        value={job.manufacturer.manufacture}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="model"
                        label="Model"
                        value={job.model}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="serialNo"
                        label="Serial no"
                        value={job.serialNo}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="problemDesc"
                        label="Problem Description"
                        value={job.problemDesc}
                        multiline
                        rows={3}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="comments"
                        label="Comments"
                        value={job.comments}
                        multiline
                        rows={3}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="status"
                        label="Status"
                        value={job.status}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="isCollected"
                        label="Collected"
                        value={job.isCollected}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <Typography varient='h6' color='primary'>Diagnosis information</Typography>
                    <Controls.Input
                        name="date"
                        label="Date"
                        value={job.workshop?.date}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="diagnosisResults"
                        label="Diagnosis Results"
                        value={job.workshop?.diagnosisResults}
                        multiline
                        rows={3}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Product</strong></TableCell>
                                <TableCell><strong>Price ($)</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                job.workshop?.requirements?.map((element => (
                                    <TableRow key={element.id}>
                                        <TableCell>{element.product}</TableCell>
                                        <TableCell>{element.price}</TableCell>
                                    </TableRow>
                                )))
                            }
                            <TableRow>
                                <TableCell>Labour charge</TableCell>
                                <TableCell>{job.workshop?.labourCharge}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Controls.Input
                        name="estimatedTime"
                        label="Time estimate"
                        value={job.workshop?.estimatedTime}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Typography varient='h6' color='primary'>Repair information</Typography>
                    <Controls.Input
                        name="jobdone"
                        label="Job done"
                        value={job.workshop?.jobdone}
                        multiline
                        rows={3}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="partsUsed"
                        label="Parts used"
                        value={job.workshop?.partsUsed}
                        multiline
                        rows={3}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="timeTaken"
                        label="time taken"
                        value={job.workshop?.timeTaken}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Typography varient='h6' color='primary'>Technician</Typography>
                    <Controls.Input
                        name="fullName"
                        label="Full name"
                        value={job.workshop?.employee.firstName + ' ' + job.workshop?.employee.lastName}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={job?.image}
                                title="Contemplative Reptile"
                            />
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    )
}
