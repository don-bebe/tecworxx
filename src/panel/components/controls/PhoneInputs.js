import React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'

export default function PhoneInputs(props) {
  const { name, label, value, error = null, onChange, ...other } = props;
  return (
    <PhoneInput
      label={label}
      name={name}
      country={'zw'}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
      inputStyle={{marginLeft: 8, width: '80%'}}
    />
  )
}
