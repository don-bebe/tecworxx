import React, {useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid';
import {Paper, InputLabel} from '@material-ui/core';
import Controls from '../../../panel/components/controls/Controls';
import { Form } from '../../../panel/components/features/useForm';
import {getMyProfile} from "../../features/customerAuthSlice";
import PageHeader from '../../../panel/components/features/PageHeader';
import PersonTwoToneIcon from '@material-ui/icons/PersonTwoTone';

export default function Profile() {
    const [profile, setProfile] = useState([]);

    const getProfileData = async () => {
      try {
          let response = await getMyProfile();
          setProfile(response.data);
      } catch (error) {
          console.log(error);
      }
    };
    useEffect(() => {
      getProfileData();
    }, []);

  return (
    <>
    <PageHeader
        title="My Profile"
        icon={<PersonTwoToneIcon fontSize="large" />}
    />
    <Paper>
    <Form>
      <Grid container>
        <Grid item xs={6}>
          <InputLabel> <b>Customer Id</b></InputLabel>
          <Controls.Input
            name="customerID"
            value = { profile.customerID}
              inputProps={
					      { readOnly: true }
				      }
          />
          <InputLabel> <b>Full name</b></InputLabel>
          <Controls.Input
              name="fullName"
              value = { profile.fullName}
                inputProps={
					      { readOnly: true }
				      }
          />
          <InputLabel> <b>Phone number</b></InputLabel>
          <Controls.Input
              name="phone"
              value = { profile.phone }
                inputProps={
					      { readOnly: true }
				      }
          />
          <InputLabel> <b>Email address</b></InputLabel>
          <Controls.Input
              name="email"
              value = { profile.email }
                inputProps={
					      { readOnly: true }
				      }
          />
        </Grid>
        <Grid item xs={6}>  
        <InputLabel> <b>Location</b></InputLabel>
          <Controls.Input
              name="address"
              value = {profile.address}
              multiline
              rows={3}
              inputProps={
					    { readOnly: true }
				    }
          />
          <InputLabel> <b>Contact Person</b></InputLabel>
          <Controls.Input
              name="contactPerson"
              value = { profile.contactPerson }
                inputProps={
					      { readOnly: true }
				      }
          />
          <InputLabel> <b>Contact Person Cell</b></InputLabel>
          <Controls.Input
              name="contactPersonCell"
              value = { profile.contactPersonCell}
                inputProps={
					      { readOnly: true }
				      }
          />
          <Controls.Input
              name="role"
              value = { profile.role}
                inputProps={
					      { readOnly: true }
				      }
          />
        </Grid>
      </Grid>
    </Form>
    </Paper>
    </>
  )
}
