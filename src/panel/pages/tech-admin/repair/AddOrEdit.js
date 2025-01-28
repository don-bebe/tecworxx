import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import Controls from '../../../components/controls/Controls';
import { useForm, Form } from '../../../components/features/useForm';

const initialFValues = {
    repair: '',
    image: '',
}

export default function AddOrEdit(props) {
    const { addOrEdit, recordForEdit, EditRecord } = props;
    const [img, setImage] = useState('');

    const handleFileChange = (e) => {
        setImage(e.target.files[0])
    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('repair' in fieldValues)
            temp.repair = fieldValues.repair ? "" : "Repair Category name is required."
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
            const formData = new FormData();
            formData.append('image', img)
            formData.append('repair', values.repair)
            if (recordForEdit != null) {
                let userData = {}
                formData.append('id', values.id)
                formData.forEach(function (value, key) {
                    userData[key] = value
                })
                EditRecord(userData, resetForm);
            }
            else {
                addOrEdit(formData, resetForm);
            }
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
                        name="repair"
                        label="Repair Type"
                        value={values.repair}
                        onChange={handleInputChange}
                        error={errors.repair}
                    />
                    <Controls.Input
                        name="image"
                        label="Image"
                        type='file'
                        onChange={handleFileChange}
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
