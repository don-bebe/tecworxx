import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';
import { getAllRepairCategory } from '../../../components/services/orderService/repairSlice';
import { getAllManufacturerByRepair } from '../../../components/services/orderService/manufactureSlice';

const initialFValues = {
    repairId: '',
    manufactureId: '',
    model: '',
    image: ''
}

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit, editOrAdd } = props;
    const [category, setCategory] = useState([]);
    const [cid, setCatId] = useState('');
    const [manufacture, setManufacture] = useState([]);
    const [img, setImage] = useState('');

    useEffect(() => {
        getRepairData();
    }, []);

    async function getRepairData() {
        try {
            let response = await getAllRepairCategory();
            setCategory(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function handleCat(e) {
        setCatId(e.target.value);
        e.preventDefault();
    }

    useEffect(() => {
        async function getManufacture() {
            try {
                const data = await getAllManufacturerByRepair(cid);
                setManufacture(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getManufacture();
    }, [cid])

    const handleFileChange = (e) => {
        setImage(e.target.files[0])
    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('repairId' in fieldValues)
            temp.repairid = fieldValues.repairId ? "" : "Repair Category name is required."
        if ('manufactureId' in fieldValues)
            temp.manufactureId = fieldValues.manufactureId ? "" : "Manufacture is required."
        if ('model' in fieldValues)
            temp.model = fieldValues.model ? "" : "Model name is required."
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
            formData.append('manufactureId', values.manufactureId)
            formData.append('model', values.model)
            if (recordForEdit != null) {
                let userData = {}
                formData.append('id', values.id)
                formData.forEach(function (value, key) {
                    userData[key] = value
                })
                editOrAdd(userData, resetForm);
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
                        onChange={e => { handleCat(e); handleInputChange(e) }}
                        options={category}
                        error={errors.repairId}
                    />
                    <Controls.ManufactureSelect
                        name="manufactureId"
                        label="Manufacture"
                        value={values.manufactureId}
                        options={manufacture}
                        onChange={handleInputChange}
                        error={errors.manufactureId}
                    />
                    <Controls.Input
                        name="model"
                        label="Model"
                        value={values.model}
                        onChange={handleInputChange}
                        error={errors.model}
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
