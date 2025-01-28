import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';
import { getAllCategory } from '../../../components/services/categorySlice';
import { getBrand } from '../../../components/services/makeSlice';

const initialFValues = {
    catId: '',
    makeId: '',
    product: '',
    keepingUnit: '',
    description: '',
    price: '',
    quantity: ''
}
const min = 1;
const max = 250;

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit } = props;
    const [cat, setCat] = useState([]);
    const [cid, setCatId] = useState('');
    const [brand, setBrand] = useState([]);

    useEffect(() => {
        getCatData();
    }, []);

    async function getCatData() {
        try {
            let response = await getAllCategory();
            setCat(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function handleCat(e) {
        const getcatid = e.target.value;
        setCatId(getcatid);
        e.preventDefault();
    }

    useEffect(() => {
        async function getMake() {
            try {
                let data = await getBrand(cid);
                setBrand(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getMake();
    }, [cid])

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('catId' in fieldValues)
            temp.catId = fieldValues.catId ? "" : "Category name is required."
        if ('makeId' in fieldValues)
            temp.makeId = fieldValues.makeId ? "" : "Make or brand name is required."
        if ('product' in fieldValues)
            temp.product = fieldValues.product ? "" : "Product name or model is required."
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : "Product description is required."
        if ('price' in fieldValues)
            temp.price = fieldValues.price ? "" : "Product price is required."
        if ('quantity' in fieldValues)
            temp.quantity = fieldValues.quantity ? "" : "Quantity is required."
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
                <Grid item xs={6}>
                    <Controls.Select
                        name="catId"
                        label="Category name"
                        value={values.catId}
                        onChange={e => { handleCat(e); handleInputChange(e) }}
                        options={cat}
                        error={errors.catId}
                    />
                    <Controls.BrandSelect
                        name="makeId"
                        label="Brand name (make)"
                        value={values.makeId}
                        onChange={handleInputChange}
                        options={brand}
                        error={errors.makeId}
                    />
                    <Controls.Input
                        name="product"
                        label="Product name(model)"
                        value={values.product}
                        onChange={handleInputChange}
                        error={errors.product}
                    />
                    <Controls.Input
                        name="keepingUnit"
                        value={values.keepingUnit}
                        onChange={handleInputChange}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controls.Input
                        name="description"
                        label="Description"
                        value={values.description}
                        onChange={handleInputChange}
                        error={errors.description}
                        multiline
                        rows={3}
                    />
                    <Controls.Input
                        name="price"
                        label="Price ($)"
                        value={values.price}
                        onChange={handleInputChange}
                        error={errors.price}
                    />
                    <Controls.Input
                        type='number'
                        name="quantity"
                        label="Quantity"
                        value={values.quantity}
                        inputProps={{ min, max }}
                        onChange={handleInputChange}
                        error={errors.quantity}
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
