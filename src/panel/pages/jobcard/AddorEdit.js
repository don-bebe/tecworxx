import React, { useState, useEffect, useRef } from 'react'
import { Grid, Typography } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/features/useForm';
import { searchPhone } from '../../components/services/customerSlice';
import { getAllRepairCategory } from '../../components/services/orderService/repairSlice';
import { getAllManufacturerByRepair } from '../../components/services/orderService/manufactureSlice';
import TextField from '@material-ui/core/TextField';
import { JobCardToPrints } from './JobCardToPrints';
import { useReactToPrint } from 'react-to-print';
import SignatureCanvas from 'react-signature-canvas'

const initialFValues = {
  phone: '',
  customerID: '',
  catId: '',
  makeId: '',
  model: '',
  serialNo: '',
  problemDesc: '',
  comments: '',
  date: '',
  image: ''
}

export default function AddorEdit(props) {
  const { addOrEdit, recordForEdit, editOrAdd } = props;
  const [value, setValue] = useState(new Date(''))
  const [cat, setCat] = useState([]);
  const [catId, setCatId] = useState('');
  const [brand, setBrand] = useState([]);
  const [cust, setCust] = useState();
  const [img, setImage] = useState('');
  const [custId, setCustId] = useState([]);
  const [trimmedDataURL, setTrimmedDataUrl] = useState([]);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    getCatData();
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  const getCatData = async () => {
    try {
      let response = await getAllRepairCategory();
      setCat(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCat = (e) => {
    const getcatid = e.target.value;
    setCatId(getcatid);
    e.preventDefault();
  }

  useEffect(() => {
    if (catId !== '') {
      const getMake = async () => {
        try {
          let data = await getAllManufacturerByRepair(catId);
          setBrand(data.data)
        } catch (error) {
          console.log(error)
        }
      }
      getMake();
    }
  }, [catId]);

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

  let sigPad = {};

  const clear = () => {
    sigPad.clear()
  }

  const trim = () => {
    setTrimmedDataUrl(sigPad.getTrimmedCanvas().toDataURL('image/png'))
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('model' in fieldValues)
      temp.model = fieldValues.model ? "" : "Model  is required."
    if ('problemDesc' in fieldValues)
      temp.problemDesc = fieldValues.problemDesc ? "" : "Provide problem description."
    if ('comments' in fieldValues)
      temp.comments = fieldValues.comments ? "" : "Device should be physical verified."
    // if ('serialNo' in fieldValues)
    //   temp.serialNo = fieldValues.serialNo ? "" : "Provide the device serial number."
    if ('catId' in fieldValues)
      temp.catId = fieldValues.catId ? "" : "Category name is required."
    if ('makeId' in fieldValues)
      temp.makeId = fieldValues.makeId ? "" : "Make or brand name is required."
    if ('phone' in fieldValues)
      temp.phone = fieldValues.phone.length > 9 ? "" : "Minimum 10 numbers required."
    if ('customerID' in fieldValues)
      temp.customerID = fieldValues.customerID ? "" : "Customer id must appear"
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
      formData.append('customerID', values.customerID)
      formData.append('date', value)
      formData.append('catId', values.catId)
      formData.append('makeId', values.makeId)
      formData.append('model', values.model)
      formData.append('serialNo', values.serialNo)
      formData.append('problemDesc', values.problemDesc)
      formData.append('comments', values.comments)
      if (recordForEdit != null) {
        let userData = {}
        formData.append('id', values.id)
        formData.forEach(function (value, key) {
          userData[key] = value
        })
        handlePrint();
        editOrAdd(userData, resetForm);
      }
      else {
        handlePrint();
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
  }, [recordForEdit]);

  return (
    <>
      <Form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <Grid container>
          <Grid item xs={6}>
            <Controls.PhoneInputs
              label="Phone number"
              name="phone"
              id="phone"
              enableSearch={true}
              value={recordForEdit != null ? recordForEdit.customer.phone : values.phone}
              onChange={(e) => { setCust(e); handleInputChange({ target: { value: e, name: 'phone' } }) }}
              inputProps={{
                required: true
              }}
            />
            <Controls.Input
              name="customerID"
              value={values.customerID = (custId.customerID) || values.customerID}
              onChange={handleInputChange}
              inputProps={
                { readOnly: true }
              }
              error={errors.customerID}
              required
            />
            <Controls.RepairSelect
              name="catId"
              label="Device Category"
              value={values.catId}
              onChange={e => { handleCat(e); handleInputChange(e) }}
              options={cat}
              error={errors.catId}
              required
            />
            <Controls.ManufactureSelect
              name="makeId"
              label="Device Brand (make)"
              value={values.makeId}
              onChange={handleInputChange}
              options={brand}
              error={errors.makeId}
              required
            />
            <Controls.Input
              name="model"
              label="Model"
              required
              value={values.model}
              onChange={handleInputChange}
              error={errors.model}
            />
            <Controls.Input
              name="serialNo"
              label="Serial number"
              value={values.serialNo}
              onChange={handleInputChange}
            />
            <TextField
              id="datetime-local"
              label="Appointment date"
              // inputProps={{
              //   min: new Date().toISOString().slice(0, 16)
              // }}
              variant="outlined"
              name='date'
              type="datetime-local"
              onChange={(e) => setValue(e.target.value)}
              value={recordForEdit != null ? recordForEdit.date : value}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <Controls.Input
              name="image"
              label="Image"
              type='file'
              onChange={handleFileChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="problemDesc"
              label="Problem description"
              required
              multiline
              rows={5}
              value={values.problemDesc}
              onChange={handleInputChange}
              error={errors.problemDesc}
            />
            <Controls.Input
              name="comments"
              label="Comments on device status"
              multiline
              rows={5}
              value={values.comments}
              onChange={handleInputChange}
              error={errors.comments}
              required
            />
            <div style={{ width: 350 }}>
              <Typography variant="h6" color='primary' style={{ marginLeft: 5 }}>Customer`s signature here</Typography>
              <SignatureCanvas penColor='black'
                canvasProps={{ width: 345, height: 150, className: 'sigCanvas', style: { border: '1px solid blue', marginLeft: 5 } }}
                ref={(ref) => { sigPad = ref }}
              />
              <Controls.Button
                text="Clear signature"
                color="default"
                onClick={() => { clear() }}
              />
            </div>
            <div>
              <Controls.Button
                type="submit"
                text="Submit"
                onClick={() => { trim() }} />
              <Controls.Button
                text="Reset"
                color="default"
                onClick={resetForm} />
            </div>
          </Grid>
        </Grid>
      </Form>
      <div style={{ display: "none" }}>
        <JobCardToPrints
          ref={componentRef}
          makeId={values.makeId ? brand.filter(x => x.id === values.makeId).map(e => e.manufacture) : ''}
          catId={catId ? cat.filter(x => x.id === catId).map(e => e.repair) : ''}
          customer={custId ? custId : ''}
          date={value !== new Date('') ? value : new Date('')}
          model={values?.model}
          serialNo={values?.serialNo}
          problemDesc={values?.problemDesc}
          comments={values?.comments}
          trimmedDataURL={trimmedDataURL !== null ? trimmedDataURL : null}
        />
      </div>
    </>
  )
}
