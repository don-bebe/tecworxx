import React, { useState } from 'react'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Title from '../dashboard/Title';
import MultiStepForm from '../pages/OrderService/MultiStepForm';
import MultiStepJob from '../pages/jobcard/MultiStepJob';

export default function IdentifyProblem() {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    return (
        <>
            <div style={{ marginLeft: 20, marginTop: 20 }}>
                <Title>Welcome, what are you ordiring today ?</Title>
            </div>
            <div style={{ marginLeft: 30 }}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Order for</FormLabel>
                    <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                        <FormControlLabel value="hardware" control={<Radio />} label="Order service for part replacement (hardware)" />
                        <FormControlLabel value="other" control={<Radio />} label="Other services (fault your device is experiencing)" />
                        <FormControlLabel value="software" disabled control={<Radio />} label="Software installation" />
                    </RadioGroup>
                </FormControl>
            </div>
            {
                value === "hardware" ?
                    <MultiStepForm /> :
                    value === "other" ?
                        <MultiStepJob />
                        : ''
            }
        </>
    )
}
