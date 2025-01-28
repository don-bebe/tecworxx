import React, { useState, useEffect } from 'react'
import { Grid, InputAdornment } from '@material-ui/core';
import { useForm, Form } from '../../components/features/useForm';
import Controls from '../../components/controls/Controls';
import { getAllProducts } from '../../components/services/stockSlice';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const initialFValues = {
    orderId: '',
    modelId: '',
    repairId: '',
    bookedDate: '',
    services: '',
    timeEstimate: '',
    requirements: [],
    otherParts: '',
    labourCharge: ''
}

export default function EditOrders(props) {
    const { addOrEdit, recordForEdit } = props;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProductData();
    }, []);

    const getProductData = async () => {
        try {
            let response = await getAllProducts();
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('orderId' in fieldValues)
            temp.orderId = fieldValues.orderId ? "" : "Order ID should be available."
        if ('timeEstimate' in fieldValues)
            temp.timeEstimate = fieldValues.timeEstimate ? "" : "Please enter time estimate to repair device."
        if ('labourCharge' in fieldValues)
            temp.labourCharge = fieldValues.labourCharge ? "" : "labourCharge is required"
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
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
        // eslint-disable-next-line
    }, [recordForEdit]);

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                        name="orderId"
                        value={values.orderId}
                        onChange={handleInputChange}
                        inputProps={
                            { readOnly: true }
                        }
                        error={errors.orderId}
                    />
                    <Controls.Input
                        name="bookedDate"
                        label="Appointment date"
                        value={values.orderservice?.bookedDate}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="repairId"
                        label="Repair category"
                        value={values.orderservice?.devicemodel.manufacturer.repaircategory.repair}
                        inputProps={
                            { readOnly: true }
                        }
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
                </Grid>
                <Grid item xs={6}>
                    <Controls.MultipleSelect
                        name="requirements"
                        label="requirements"
                        options={products}
                        value={values.requirements}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="otherParts"
                        label="Other parts"
                        multiline
                        rows={2}
                        value={values.other}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="labourCharge"
                        label="Labour Charge"
                        value={values.labourCharge}
                        onChange={handleInputChange}
                        error={errors.labourCharge}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                $
                            </InputAdornment>)
                        }}
                    />
                    <Controls.Input
                        name="timeEstimate"
                        label="Time Estimate"
                        value={values.timeEstimate}
                        onChange={handleInputChange}
                        error={errors.timeEstimate}
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
