import React, {useState, useEffect} from 'react';
import { Grid } from '@material-ui/core';
import Controls from '../../../components/controls/Controls';
import { useForm, Form } from '../../../components/features/useForm';
import { Typography } from '@material-ui/core';
import { GetAllTechnicians } from '../../../components/services/employeeSlice';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const initialFValues = {
    repairId: '',
    manufactureId: '',
    modelId: '',
    services: '',
    customerId: '',
    status: '',
    fullName: '',
    bookedDate: '',
    reschedule: '',
    technician: ''
}

export default function AssignTo(props) {
    const [tech, setTech] = useState([])
    const { addOrEdit, recordForEdit } = props;

    useEffect(()=>{
        getTechnicianNames();
    },[]);

    const getTechnicianNames = async () =>{
        try {
            const response = await GetAllTechnicians();
            setTech(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('technician' in fieldValues)
            temp.technician= fieldValues.technician ? "" : "Please assign a technician."
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
    <Form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
         <Grid container>
            <Grid item xs={6}>
                <Typography varient='h6' color='primary'>Customer details</Typography>
                <Controls.Input
                    name="customerID"
                    label="customerID"
                    value = { values.customer?.customerID}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="fullName"
                    label="Full name"
                    value = { values.customer?.fullName}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Typography varient='h6' color='primary'>Device details</Typography>
                <Controls.Input
                    name="orderId"
                    label="OrderID"
                    value = { values.orderId}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="repairId"
                    label="repair category"
                    value = { values.devicemodel?.manufacturer.repaircategory.repair}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="manufactureId"
                    label="Manufacture"
                    value = { values.devicemodel?.manufacturer.manufacture}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="modelId"
                    label="Device model"
                    value = { values.devicemodel?.model}
                    inputProps={
					    { readOnly: true }
				    }
                />
            </Grid>
            <Grid item xs={6}>
                <Typography varient='h6' color='primary'>Services ordered</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Problem</strong></TableCell>
                            <TableCell><strong>Cost ($)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            values.orderedservices?.map((element)=>(
                                <TableRow key={element.id}>
                                    <TableCell>{element.problem}</TableCell>
                                    <TableCell>{element.repairCost}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <Controls.Input
                    name="bookedDate"
                    label="Date for appointment"
                    value = { values.bookedDate}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="reschedule"
                    label="Rescheduled To"
                    value = { values?.reschedule}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Controls.Input
                    name="status"
                    label="Status"
                    value = { values.status}
                    inputProps={
					    { readOnly: true }
				    }
                />
                <Typography varient='h6' color='primary'>Assign technician</Typography>
                <Controls.TechnicianSelect
                    name="technician"
                    label="Assign to"
                    value={values.technician}
                    options={tech}
                    onChange={handleInputChange}
                    error={errors.technician}
            />
            <div>
                <Controls.Button
                    type="submit"
                    text="Submit" />
            </div>
            </Grid>
         </Grid>
    </Form>
  )
}
