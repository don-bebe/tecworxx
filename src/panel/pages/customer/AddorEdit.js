import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/features/useForm';

const initialFValues = {
    customerID: '',
    fullName: '',
    phone: '',
    address: '',
    email: '',
    contactPerson: '',
    contactPersonCell: '',
    role: 'Individual'
}

const custRole = [
    { id: 'Company', title: 'Company' },
    { id: 'Individual', title: 'Individual' },
    { id: 'Other', title: 'Other' },
]

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('fullName' in fieldValues)
            temp.fullName = fieldValues.fullName ? "" : "Full name is required."
        // if ('phone' in fieldValues)
        //     temp.phone = fieldValues.phone.length > 9 ? "" : "Minimum 10 numbers required."
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
            console.log(values.phone);
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
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                        name="customerID"
                        value={values.customerID}
                        onChange={handleInputChange}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        label="Full name"
                        name="fullName"
                        value={values.fullName}
                        onChange={handleInputChange}
                        error={errors.fullName}
                    />
                    <Controls.PhoneInputs
                        label="Phone number"
                        name="phone"
                        id="phone"
                        enableSearch={true}
                        value={values.phone}
                        onChange={e=>handleInputChange({target: {value: e, name: 'phone'}})}
                        inputProps={{
                            required: true
                        }}
                    />
                    <Controls.Input
                        label="Email Address"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controls.Input
                        label="Address"
                        name="address"
                        value={values.address}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                    />
                    <Controls.Input
                        label="Contact Person"
                        name="contactPerson"
                        value={values.contactPerson}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        label="Contact Person Cell"
                        name="contactPersonCell"
                        value={values.contactPersonCell}
                        onChange={handleInputChange}
                    />
                    <Controls.RadioGroup
                        name="role"
                        label="Role"
                        value={values.role}
                        onChange={handleInputChange}
                        items={custRole}
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
