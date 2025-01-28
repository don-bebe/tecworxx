import React from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';

export default function PartsSelect(props) {
    const { name, label, value=[], onChange, options } = props;
  return (
    <div>
        <FormControl variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select
                labelId="demo-mutiple-checkbox-label"
                name={name}
                multiple
                value={value}
                onChange={onChange}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
                >
                    {options?.map((name) => (
                        <MenuItem key={name.product} value={name.product}>
                            <Checkbox />
                            <ListItemText primary={name.product} />
                        </MenuItem>
                    ))}
                </Select>
        </FormControl>
    </div>
  )
}
