import React, {useEffect} from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';

const initialFValues = {
    method: '',
    rate: '',
    isActive: false
}

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('method' in fieldValues)
            temp.method = fieldValues.method ? "" : "Method name is required."
        if ('rate' in fieldValues)
            temp.rate = fieldValues.rate ? "" : "Rate is required."
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
    }, [recordForEdit])
  return (
    <Form onSubmit={handleSubmit}>
        <Grid container>
            <Grid item xs={12}>
                <Controls.Input
                    name="method"
                    label="Payment method"
                    value={values.method}
                    onChange={handleInputChange}
                    error={errors.method}
                />
                <Controls.Input
                    name="rate"
                    label="Rate"
                    value={values.rate}
                    onChange={handleInputChange}
                    error={errors.rate}
                />
                <Controls.Checkbox
                    name="isActive"
                    label="isActive"
                    value={values.isActive}
                    onChange={handleInputChange}
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
