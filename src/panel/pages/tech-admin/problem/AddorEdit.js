import React, {useState, useEffect} from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';
import {getAllRepairCategory} from '../../../components/services/orderService/repairSlice';
import {getAllManufacturerByRepair} from '../../../components/services/orderService/manufactureSlice';
import { getAllModelByManufacturer } from '../../../components/services/orderService/modelSlice';

const initialFValues = {
    repairId: '',
    manufactureId: '',
    problem: '',
    modelId: '',
    repairCost: ''
}

export default function AddorEdit(props) {
    const { addOrEdit, recordForEdit } = props;
    const [category, setCategory] = useState([]);
    const [manufacture, setManufacture] = useState([])
    const [cid, setCatId] = useState('');
    const [manid, setManId] = useState('');
    const [model, setModel] = useState([])
    
    useEffect(() => {
        getRepairCatData();
      }, []);

      const getRepairCatData = async () => {
        try {
          let response = await getAllRepairCategory();
          setCategory(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCat=(e)=>{
        const getcatid= e.target.value;
        setCatId(getcatid);
        e.preventDefault();
      }
    
    useEffect( ()=>{
        const getMake = async()=>{
          try {
            let data = await getAllManufacturerByRepair(cid);
            setManufacture(data.data)
          } catch (error) {
            console.log(error)
          }
        }
        getMake();
      },[cid]);

      const handleMake=(e)=>{
        const getmakeid = e.target.value;
        setManId(getmakeid);
        e.preventDefault();
      }

    useEffect( ()=>{
        const getModel = async()=>{
            try {
                let data = await getAllModelByManufacturer(manid);
                setModel(data.data)
            } catch (error) {
                console.log(error)
            }
        }
        getModel();
    }, [manid])

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('repairId' in fieldValues)
            temp.repairId= fieldValues.repairId ? "" : "Repair Category name is required."
        if ('manufactureId' in fieldValues)
            temp.manufactureId = fieldValues.manufactureId ? "" : "Make or brand name is required."
        if ('modelId' in fieldValues)
            temp.modelId = fieldValues.modelId ? "" : "Model name is required."
        if ('problem' in fieldValues)
            temp.problem = fieldValues.problem ? "" : "Problem to be fixed is required."
        if ('repairCost' in fieldValues)
            temp.repairCost = fieldValues.repairCost ? "" : "Repair cost is required."
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
            <Controls.RepairSelect
                name="repairId"
                label="Repair Category name"
                value={values.repairId}
                onChange={e=>{handleCat(e); handleInputChange(e)}}
                options={category}
                error={errors.repairId}
            />
            <Controls.ManufactureSelect
                name="manufactureId"
                label="Manufacture"
                value={values.manufactureId}
                onChange={e=>{handleMake(e);handleInputChange(e)}}
                options={manufacture}
                error={errors.manufactureId}
            />
            <Controls.ModelSelect
                name="modelId"
                label="Model"
                value={values.modelId}
                onChange={handleInputChange}
                options={model}
                error={errors.modelId}
            />
            <Controls.Input
                name="problem"
                label="Problem Statement"
                value={values.problem}
                onChange={handleInputChange}
                error={errors.problem}
            />
            <Controls.Input
                name="repairCost"
                label="Repair cost ($)"
                value={values.repairCost}
                onChange={handleInputChange}
                error={errors.repairCost}
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
