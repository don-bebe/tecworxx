import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';
import TextField from '@material-ui/core/TextField';

const initialFValues = {
    orderId: '',
    bookedDate: '',
}

export default function Editorder(props) {
    const { reScheduleDate, recordForEdit } = props;
    const [value, setValue] = useState(new Date(''))
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('orderId' in fieldValues)
            temp.orderId = fieldValues.orderId ? "" : "Order id is required."
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
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const formData = new FormData();
            formData.append('id', values.id)
            formData.append('reschedule', value)
            let userData = {}
            formData.forEach(function (value, key) {
                userData[key] = value
            })
            reScheduleDate(userData, resetForm);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
        // eslint-disable-next-line
    }, [recordForEdit])
    return (
        <Form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
            <Grid container>
                <Grid item xs={12}>
                    <Controls.Input
                        name="date"
                        label="Date ordered"
                        value={values.date}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="orderId"
                        label="orderID"
                        value={values.orderId}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        label="Date for appointment"
                        value={values.bookedDate}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <TextField
                        id="datetime-local"
                        label="Appointment date"
                        inputProps={{
                            min: new Date().toISOString().slice(0, 16)
                        }}
                        variant="outlined"
                        name='bookedDate'
                        type="datetime-local"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        InputLabelProps={{
                            shrink: true,
                        }}
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
