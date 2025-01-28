import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from '../../../components/features/useForm';
import { searchPhone } from '../../../components/services/customerSlice';
import { getAllRepairCategory } from '../../../components/services/orderService/repairSlice';
import { getAllManufacturerByRepair } from '../../../components/services/orderService/manufactureSlice';
import { getAllModelByManufacturer } from '../../../components/services/orderService/modelSlice';
import { getAllProblemByModel } from '../../../components/services/orderService/problemSlice';

const initialFValues = {
  repairId: '',
  manufactureId: '',
  modelId: '',
  bookedDate: '',
  customerId: '',
  phone: '',
  customer: '',
  services: [],
}

export default function AddOrder(props) {
  const { addNewOrder } = props
  const [cust, setCust] = useState();
  const [custId, setCustId] = useState([]);
  const [category, setCategory] = useState([]);
  const [manufacture, setManufacture] = useState([])
  const [cid, setCatId] = useState('');
  const [manid, setManId] = useState('');
  const [model, setModel] = useState([]);
  const [modelId, setModelId] = useState('');
  const [availableServices, setAvailableServices] = useState([]);
  const [checked, setChecked] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date('yyyy-MM-dd'));

  useEffect(() => {
    if (cust != null) {
      const getCustID = async () => {
        try {
          let data = await searchPhone(cust);
          setCustId(data.data)
        } catch (error) {
          console.log(error);
        }
      }
      getCustID();
    }
  }, [cust]);

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

  useEffect(() => {
    const getMake = async () => {
      try {
        let data = await getAllManufacturerByRepair(cid);
        setManufacture(data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getMake();
  }, [cid]);

  useEffect(() => {
    const getModel = async () => {
      try {
        let data = await getAllModelByManufacturer(manid);
        setModel(data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getModel();
  }, [manid])

  //get problems according to model
  useEffect(() => {
    const GetFixableProblems = async () => {
      try {
        const response = await getAllProblemByModel(modelId)
        setAvailableServices(response.data)
      } catch (error) {
        console.log(error);
      }
    }
    GetFixableProblems();
  }, [modelId])

  //problems checked
  const handleCheckedChange = (item, event) => {
    if (event.target.checked) {
      setChecked((cartItem) => [...cartItem, item]);
      setTotalCost((total) => total + parseFloat(item.repairCost));
    }
    else {
      setChecked((cartItem) =>
        cartItem.filter((i) => i.problem !== item.problem));
      setTotalCost((total) => total - parseFloat(item.repairCost));
    }
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('repairId' in fieldValues)
      temp.repairId = fieldValues.repairId ? "" : "Repair name is required."
    if ('modelId' in fieldValues)
      temp.modelId = fieldValues.modelId ? "" : "Model is required."
    if ('customer' in fieldValues)
      temp.customer = fieldValues.customer ? "" : "Customer is required."
    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const {
    values,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFValues, true, validate);

  const handleSubmit = e => {
    e.preventDefault()
    //if (validate()) {
      addNewOrder(modelId, checked, selectedDate, custId.id);
   // }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.PhoneInputs
            label="Phone number"
            name="phone"
            id="phone"
            enableSearch={true}
            value={values.phone}
            onChange={(e) => { setCust(e); handleInputChange({ target: { value: e, name: 'phone' } }) }}
            inputProps={{
              required: true
            }}
          />
          <Controls.Input
            name="customer"
            value={values.customerId = (custId.fullName) || values.customerId}
            onChange={handleInputChange}
            inputProps={
              { readOnly: true }
            }
            required
          />
          <Controls.RepairSelect
            name="repairId"
            label="Repair Category name"
            value={values.repairId}
            onChange={e => { setCatId(e.target.value); handleInputChange(e) }}
            options={category}
            error={errors.repairId}
          />
          <Controls.ManufactureSelect
            name="manufactureId"
            label="Manufacture"
            value={values.manufactureId}
            onChange={e => { setManId(e.target.value); handleInputChange(e) }}
            options={manufacture}
            error={errors.manufactureId}
          />
          <Controls.ModelSelect
            name="modelId"
            label="Model"
            value={values.modelId}
            onChange={e => { setModelId(e.target.value); handleInputChange(e) }}
            options={model}
            error={errors.modelId}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant='h6' color='primary' style={{ marginLeft: 5, marginBottom: 5 }}>Services</Typography>
          {availableServices.map(items => (
            <FormGroup style={{ marginLeft: 5 }}>
              <FormControlLabel
                control={<Checkbox multiple checked={checked[items.problem] === null ? false : checked[items.problem]}
                  onChange={(e) => handleCheckedChange(items, e)}
                  key={items.id} />}
                label={items.problem}
              />
            </FormGroup>
          ))}
          <Controls.Input
            name="total"
            label="Total"
            value={totalCost}
            inputProps={
              { readOnly: true }
            }
          />
          <TextField
            id="datetime-local"
            label="Appointment date"
            inputProps={{
              min: new Date().toISOString().slice(0, 16)
            }}
            variant="outlined"
            name='bookedDate'
            type="datetime-local"
            defaultValue={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
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
