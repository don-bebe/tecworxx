import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../components/features/useForm';

const initialFValues = {
    current: '',
    newpass: '',
    confirmNew: ''
}

export default function ChangePassword(props) {
    const { changePass, user } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('userName' in fieldValues)
            temp.userName = fieldValues.userName ? "" : "Enter username."
        if ('current' in fieldValues)
            temp.current = fieldValues.current ? "" : "Enter current password."
        if ('newpass' in fieldValues)
            temp.newpass = fieldValues.newpass ? "" : "Enter new password!"
        if ('confirmNew' in fieldValues)
            temp.confirmNew = fieldValues.confirmNew ? "" : "Re-enter new password!"
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
        e.preventDefault()
        if (validate()) {
            changePass(values, resetForm);
        }
    }

    useEffect(() => {
        if (user != null)
            setValues({
                ...user
            })
        // eslint-disable-next-line
    }, [user]);

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={12}>
                    <Controls.Input
                        name="userName"
                        label="Username"
                        value={values.userName}
                        onChange={handleInputChange}
                        error={errors.userName}
                    />
                    <Controls.Input
                        name="password"
                        label="Current password"
                        type="password"
                        value={values.currentPass}
                        onChange={handleInputChange}
                        error={errors.currentPass}
                    />
                    <Controls.Input
                        name="current"
                        label="Enter current password"
                        type="password"
                        value={values.current}
                        onChange={handleInputChange}
                        error={errors.current}
                    />
                    <Controls.Input
                        name="newpass"
                        label="Enter new password"
                        type="password"
                        value={values.newpass}
                        onChange={handleInputChange}
                        error={errors.newpass}
                    />
                    <Controls.Input
                        name="confirmNew"
                        label="Confirm new password"
                        type="password"
                        value={values.confirmNew}
                        onChange={handleInputChange}
                        error={errors.confirmNew}
                    />
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
