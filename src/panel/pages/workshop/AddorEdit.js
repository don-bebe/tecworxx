import React, { useEffect, useState } from 'react'
import Controls from "../../components/controls/Controls";
import { Grid, InputAdornment } from '@material-ui/core';
import { useForm, Form } from '../../components/features/useForm';
import { getAllProducts } from '../../components/services/stockSlice';

const initialFValues = {
    cardNo: '',
    model: '',
    problemDesc: '',
    comments: '',
    diagnosisResult: '',
    requirements: [],
    otherRequirements: '',
    estimatedTime: '',
    labourCharge: ''
}

export default function AddOrEdit(props) {
    const { addOrEdit, recordForEdit } = props;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProductData();
    }, []);

    const getProductData = async () => {
        try {
            let response = await getAllProducts();
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('cardNo' in fieldValues)
            temp.cardNo = fieldValues.cardNo ? "" : "Job card number should be available."
        if ('diagnosisResults' in fieldValues)
            temp.diagnosisResults = fieldValues.diagnosisResults ? "" : "Please enter results obtained from diagnosis."
        if ('requirements' in fieldValues)
            temp.requirements = fieldValues.requirements ? "" : "Provide requirements need to fix device."
        if ('estimatedTime' in fieldValues)
            temp.estimatedTime = fieldValues.estimatedTime ? "" : "Provide time estimate to finish repairing device."
        if ('labourCharge' in fieldValues)
            temp.labourCharge = fieldValues.labourCharge ? "" : "Enter estimated labour charge"
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
            console.log(values)
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
        // eslint-disable-next-line
    }, [recordForEdit]);
    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                        name="cardNo"
                        value={values.cardNo}
                        onChange={handleInputChange}
                        inputProps={
                            { readOnly: true }
                        }
                        error={errors.cardNo}
                    />
                    <Controls.Input
                        name="model"
                        label="Model"
                        value={values.model}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="problemDesc"
                        label="Problem description"
                        value={values.problemDesc}
                        multiline
                        rows={3}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="comments"
                        label="Comments"
                        value={values.comments}
                        multiline
                        rows={4}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="diagnosisResults"
                        label="diagnosisResults"
                        multiline
                        rows={3}
                        value={values.diagnosisResults}
                        onChange={handleInputChange}
                        error={errors.diagnosisResults}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controls.MultipleSelect
                        name="requirements"
                        label="Requirements"
                        options={products}
                        value={values.requirements}
                        onChange={handleInputChange}
                        error={errors.requirements}
                    />
                    <Controls.Input
                        name="otherRequirements"
                        label="Other Requirements"
                        multiline
                        rows={3}
                        value={values.otherRequirements}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="estimatedTime"
                        label="Time estimate"
                        value={values.estimatedTime}
                        onChange={handleInputChange}
                        error={errors.estimatedTime}
                    />
                    <Controls.Input
                        name="labourCharge"
                        label="Labour charge"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                $
                            </InputAdornment>)
                        }}
                        value={values.labourCharge}
                        onChange={handleInputChange}
                        error={errors.labourCharge}
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
