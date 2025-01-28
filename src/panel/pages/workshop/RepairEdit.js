import React, { useEffect } from 'react'
import Controls from "../../components/controls/Controls";
import { Grid } from '@material-ui/core';
import { useForm, Form } from '../../components/features/useForm';

const initialFValues = {
    cardNo: '',
    model: '',
    problemDesc: '',
    diagnosisResult: '',
    requirements: [],
    jobdone: '',
    partsUsed: [],
    timeTaken: ''
}

export default function RepairEdit(props) {
    const { addOrEdit, recordForEdit } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('cardNo' in fieldValues)
            temp.cardNo = fieldValues.cardNo ? "" : "Job card number should be available."
        if ('jobdone' in fieldValues)
            temp.jobdone = fieldValues.jobdone ? "" : "work done required."
        // if ('partsUsed' in fieldValues)
        //     temp.partsUsed = fieldValues.partsUsed ? "" : "Provide parts used."
        if ('timeTaken' in fieldValues)
            temp.timeTaken = fieldValues.timeTaken ? "" : "Provide time taken to finish repairing device."
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
                        label="Card no"
                        value={values.cardNo}
                        onChange={handleInputChange}
                        inputProps={
                            { readOnly: true }
                        }
                        error={errors.cardNo}
                    />
                    <Controls.Input
                        name="diagnosisResults"
                        label="Diagnosis results"
                        value={values.diagnosisResults}
                        multiline
                        rows={3}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="otherRequirements"
                        label="Other requirements"
                        value={values.otherRequirements}
                        multiline
                        rows={3}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controls.PartsSelect
                        name="partsUsed"
                        label="Parts used"
                        options={values.requirements}
                        value={values.partsUsed}
                        onChange={handleInputChange}
                        error={errors.partsUsed}
                    />
                    <Controls.Input
                        name="otherRequirementsUsed"
                        label="Other requirements used"
                        value={values.otherRequirementsUsed}
                        multiline
                        rows={2}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="jobdone"
                        label="Work done"
                        multiline
                        rows={3}
                        value={values.jobdone}
                        onChange={handleInputChange}
                        error={errors.jobdone}
                    />
                    <Controls.Input
                        name="timeTaken"
                        label="Time taken"
                        value={values.timeTaken}
                        onChange={handleInputChange}
                        error={errors.timeTaken}
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
