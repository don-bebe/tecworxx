import React, {useEffect} from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';

const initialFValues = {
    category: '',
    description: '',
}

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('category' in fieldValues)
            temp.category = fieldValues.category ? "" : "Category name is required."
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : "Category description is required."
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
                    name="category"
                    label="Category name"
                    value={values.category}
                    onChange={handleInputChange}
                    error={errors.category}
                />
                <Controls.Input
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    error={errors.description}
                    multiline
                    rows={3}
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
