import React, { useEffect, useState} from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';
import { getAllCategory } from '../../../components/services/categorySlice';

const initialFValues = {
    catId: '',
    make: '',
}

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit } = props;
    const [cat, setCat] = useState([]);

    useEffect(() => {
        getCatData();
      }, []);

      const getCatData = async () => {
        try {
          let response = await getAllCategory();
          setCat(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('catId' in fieldValues)
            temp.catId= fieldValues.catId ? "" : "Category name is required."
        if ('make' in fieldValues)
            temp.make = fieldValues.make ? "" : "Make or brand name is required."
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
            <Controls.Select
                name="catId"
                label="Category name"
                value={values.catId}
                onChange={handleInputChange}
                options={cat}
                error={errors.catId}
            />
            <Controls.Input
                name="make"
                label="Brand (make)"
                value={values.make}
                onChange={handleInputChange}
                error={errors.make}
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
