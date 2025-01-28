import React, { useEffect } from 'react'
import Controls from "../../components/controls/Controls";
import { Grid } from '@material-ui/core';
import { useForm, Form } from '../../components/features/useForm';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const initialFValues = {
    orderId: '',
    model: '',
    requirements: [],
    jobdone: '',
    partsUsed: [],
    timeTaken: ''
}

export default function RepairOrder(props) {
    const { repairWork, recordForRepair } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('orderId' in fieldValues)
            temp.orderId = fieldValues.orderId ? "" : "Order should be available."
        if ('jobdone' in fieldValues)
            temp.jobdone = fieldValues.jobdone ? "" : "work done required."
        if ('partsUsed' in fieldValues)
            temp.partsUsed = fieldValues.partsUsed ? "" : "Provide parts used."
        if ('timeTaken' in fieldValues)
            temp.timeTaken = fieldValues.timeTaken ? "" : "Provide time taken to finish repairing device."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            repairWork(values, resetForm);
        }
    }

    useEffect(() => {
        if (recordForRepair != null)
            setValues({
                ...recordForRepair
            })
        // eslint-disable-next-line
    }, [recordForRepair]);

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                        name="orderId"
                        label="Order Id"
                        value={values.orderId}
                        onChange={handleInputChange}
                        inputProps={
                            { readOnly: true }
                        }
                        error={errors.cardNo}
                    />
                    <Controls.Input
                        name="modelId"
                        label="Model"
                        value={values.orderservice?.devicemodel.manufacturer.manufacture + ' ' + values.orderservice?.devicemodel.model}
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
                                values.orderservice?.orderedservices.map((element) => (
                                    <TableRow key={element.id}>
                                        <TableCell>{element.problem}</TableCell>
                                        <TableCell>{element.repairCost}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    <Controls.Input
                        name="otherRequirements"
                        label="Other requirements"
                        value={values.otherParts}
                        multiline
                        rows={2}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controls.PartsSelect
                        name="partsUsed"
                        label="Parts used"
                        options={values?.partsrequireds}
                        value={values?.partsUsed}
                        onChange={handleInputChange}
                        error={errors.partsUsed}
                    />
                    <Controls.Input
                        name="otherPartsUsed"
                        label="Other requirements used"
                        value={values.otherPartsUsed}
                        multiline
                        rows={2}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="jobdone"
                        label="Work done"
                        multiline
                        rows={3}
                        value={values.jobdone}
                        onChange={handleInputChange}
                        error={errors.jobdone}
                    />
                    <Controls.Input
                        name="timeTaken"
                        label="Time taken"
                        value={values.timeTaken}
                        onChange={handleInputChange}
                        error={errors.timeTaken}
                    />
                    <div>
                        <Controls.Button
                            type="submit"
                            text="Submit" />
                        <Controls.Button
                            text="Reset"
                            color="default"
                            onClick={resetForm} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
