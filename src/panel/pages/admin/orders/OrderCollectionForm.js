import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import Controls from '../../../components/controls/Controls';
import { useForm, Form } from '../../../components/features/useForm';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

const initialFValues = {
    customerID: '',
    orderId: '',
    model: '',
    fullName: '',
    phone: '',
}

export default function OrderCollectionForm(props) {
    const { collectedBy, order } = props;
    const [selectedValue, setSelectedValue] = useState('');
    const [isCollected] = useState(true);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('fullName' in fieldValues)
            temp.fullName = fieldValues.fullName ? "" : "Provide fullname."
        if ('phone' in fieldValues)
            temp.phone = fieldValues.phone > 9 ? "" : "Minimum number should be 9."
        if ('orderId' in fieldValues)
            temp.orderId = fieldValues.orderId ? "" : "Order number is required."
        if ('customerID' in fieldValues)
            temp.customerID = fieldValues.customerID ? "" : "Customer id must appear"
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        errors,
        setValues,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault();
        if (selectedValue === "Other") {
            if (validate) {
                const formData = new FormData();
                formData.append('customerID', order.customerID)
                formData.append('orderId', order.orderId)
                formData.append('collectedBy', selectedValue)
                formData.append('fullName', values.fullName)
                formData.append('phone', values.phone)
                formData.append('id', values.id)
                formData.append('isCollected', isCollected)
                let userData = {}
                formData.forEach(function (value, key) {
                    userData[key] = value
                })
                collectedBy(userData, resetForm);
            }
        }
        else if (selectedValue === "Owner") {
            const formData = new FormData();
            formData.append('customerID', order.customerID)
            formData.append('orderId', order.orderId)
            formData.append('collectedBy', selectedValue)
            formData.append('id', values.id)
            formData.append('isCollected', isCollected)
            let userData = {}
            formData.forEach(function (value, key) {
                userData[key] = value
            })
            collectedBy(userData, resetForm);
        }
        else {
            alert('Choose the collector');
        }
    }

    useEffect(() => {
        if (order != null)
            setValues({
                ...order
            })
        // eslint-disable-next-line
    }, [order]);
    return (
        <Form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
            <Grid container>
                <Grid item xs={12}>
                    <Controls.Input
                        name="customerID"
                        label="customerID"
                        value={values.customer?.customerID}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="orderId"
                        label="Order id"
                        value={values.orderId}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="model"
                        label="Model"
                        value={values.devicemodel?.model}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <div>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Collected by</FormLabel>
                            <RadioGroup row aria-label="role" name="role" value={selectedValue} onChange={handleChange}>
                                <FormControlLabel value="Owner" control={<Radio />} label="Owner" />
                                <FormControlLabel value="Other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    {
                        selectedValue === "Other" ?
                            <>
                                <Controls.Input
                                    name="fullName"
                                    label="Full name"
                                    id="fullName"
                                    value={values.fullName}
                                    onChange={handleInputChange}
                                    error={errors.fullName} />

                                <Controls.Input
                                    name="phone"
                                    label="phone"
                                    id="phone"
                                    value={values.phone}
                                    onChange={handleInputChange}
                                    error={errors.phone}
                                />
                            </>
                            : ''
                    }
                    <div>
                        <Controls.Button
                            type="submit"
                            text="Submit"
                        />
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
