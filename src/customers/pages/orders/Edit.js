import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core';
import Controls from '../../../panel/components/controls/Controls';
import { useForm, Form } from '../../../panel/components/features/useForm';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const initialFValues = {
    date: '',
    repairId: '',
    manufactureId: '',
    modelId: '',
    services: '',
    bookedDate: '',
}

export default function Edit(props) {
    const { recordForEdit } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
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
    } = useForm(initialFValues, true, validate);



    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
        // eslint-disable-next-line
    }, [recordForEdit])
    return (
        <Form>
            <Grid container>
                <Grid item xs={12}>
                    <Controls.Input
                        name="date"
                        label="Date"
                        value={values.date}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="repairId"
                        label="repair category"
                        value={values.devicemodel?.manufacturer.repaircategory.repair}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="manufactureId"
                        label="Manufacture"
                        value={values.devicemodel?.manufacturer.manufacture}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="modelId"
                        label="Device model"
                        value={values.devicemodel?.model}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Problem</strong></TableCell>
                                <TableCell><strong>Cost ($)</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                values.orderedservices?.map((element) => (
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
                        value={values.bookedDate}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                    <Controls.Input
                        name="status"
                        label="Status"
                        value={values.status}
                        inputProps={
                            { readOnly: true }
                        }
                    />
                </Grid>
            </Grid>
        </Form>
    )
}
