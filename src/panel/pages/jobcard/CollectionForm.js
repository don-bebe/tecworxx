import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/features/useForm';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

const initialFValues = {
    customerID: '',
    cardNo: '',
    model: '',
    fullName: '',
    phone: '',
}

export default function CollectionForm(props) {
    const { collectedBy, job } = props;
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
        if ('cardNo' in fieldValues)
            temp.cardNo = fieldValues.cardNo ? "" : "Card number is required."
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
                formData.append('customerID', job.customerID)
                formData.append('cardNo', job.cardNo)
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
            formData.append('customerID', job.customerID)
            formData.append('cardNo', job.cardNo)
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
        if (job != null)
            setValues({
                ...job
            })
        // eslint-disable-next-line
    }, [job]);

    return (
        <Form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
            <Grid container>
                <Grid item xs={12}>
                    <Controls.Input
                        name="customerID"
                        label="customerID"
                        value={values.customerID}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="cardNo"
                        label="CardNo"
                        value={values.cardNo}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="model"
                        label="Model"
                        value={values.model}
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
