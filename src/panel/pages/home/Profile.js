import React from 'react'
import Grid from '@material-ui/core/Grid';
import Controls from '../../components/controls/Controls';
import { Form } from '../../components/features/useForm';

export default function Profile({user}) {
  return (
    <Form>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="firstName"
            label="First name"
            value = { user.firstName}
              inputProps={
					      { readOnly: true }
				      }
          />
          <Controls.Input
              name="lastName"
              label="Last name"
              value = { user.lastName}
                inputProps={
					      { readOnly: true }
				      }
          />
          <Controls.Input
              name="userName"
              label="Username"
              value = { user.userName}
                inputProps={
					      { readOnly: true }
				      }
          />
          <Controls.Input
              name="phone"
              label="Phone number"
              value = { user.phone}
                inputProps={
					      { readOnly: true }
				      }
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
              name="email"
              label="Email Address"
              value = { user.email}
                inputProps={
					      { readOnly: true }
				      }
          />
          <Controls.Input
              name="address"
              label="Home Address"
              value = { user.address}
              multiline
              rows={3}
              inputProps={
					    { readOnly: true }
				    }
          />
          <Controls.Input
              name="role"
              label="Role"
              value = { user.role}
                inputProps={
					      { readOnly: true }
				      }
          />
        </Grid>
      </Grid>
    </Form>
  )
}
