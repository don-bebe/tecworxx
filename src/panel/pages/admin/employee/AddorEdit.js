import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';
import { userRoles } from '../../../components/services/employeeSlice';

const initialFValues = {
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
    role: 'User',
}

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('firstName' in fieldValues)
            temp.firstName = fieldValues.firstName ? "" : "First name is required."
        if ('lastName' in fieldValues)
            temp.lastName = fieldValues.lastName ? "" : "Last name is required."
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        if ('phone' in fieldValues)
            temp.phone = fieldValues.phone.length > 9 ? "" : "Minimum 10 numbers required."
        if ('address' in fieldValues)
            temp.address = fieldValues.address ? "" : "This field is required."
        if ('role' in fieldValues)
            temp.role = fieldValues.role ? "" : "User role is required."
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
            console.log(values);
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
                    name="firstName"
                    label="Firstname"
                    value={values.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                />
                <Controls.Input
                    label="Lastname"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
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
                        error={errors.phone}
                    />
                <Controls.Input
                    label="Email Address"
                    name="email"
                    value={values.email}
                    onChange={handleInputChange}
                    error={errors.email}
                />
            </Grid>
            <Grid  item xs={6}>   
                <Controls.Input
                    name="address"
                    label="Home Address"
                    multiline
                    rows={5}
                    value={values.address}
                    onChange={handleInputChange}
                    error={errors.address}
                />
                 <Controls.UserSelect
                    name="role"
                    label="User role"
                    value={values.role}
                    onChange={handleInputChange}
                    options={userRoles()}
                    error={errors.role}
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
