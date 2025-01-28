import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';
import { getAllRepairCategory } from '../../../components/services/orderService/repairSlice';

const initialFValues = {
    repairId: '',
    manufacture: '',
    image: ''
}

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit, EditRecord } = props;
    const [category, setCategory] = useState([]);
    const [img, setImage] = useState('');

    const handleFileChange = (e) => {
        setImage(e.target.files[0])
    }

    useEffect(() => {
        getRepairCatData();
    }, []);

    const getRepairCatData = async () => {
        try {
            const response = await getAllRepairCategory();
            setCategory(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('repairId' in fieldValues)
            temp.repairId = fieldValues.repairId ? "" : "Repair Category name is required."
        if ('manufacture' in fieldValues)
            temp.manufacture = fieldValues.manufacture ? "" : "Make or brand name is required."
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
            formData.append('repairId', values.repairId)
            formData.append('manufacture', values.manufacture)
            if (recordForEdit != null) {
                let userData = {}
                formData.append('id', values.id)
                formData.forEach(function (value, key) {
                    userData[key] = value
                })
                EditRecord(userData, resetForm)
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
                    <Controls.RepairSelect
                        name="repairId"
                        label="Repair Category name"
                        value={values.repairId}
                        onChange={handleInputChange}
                        options={category}
                        error={errors.repairId}
                    />
                    <Controls.Input
                        name="manufacture"
                        label="Brand (make)"
                        value={values.manufacture}
                        onChange={handleInputChange}
                        error={errors.manufacture}
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
