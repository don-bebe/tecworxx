import React from 'react'
import { Typography, Grid } from '@material-ui/core';
import Tecworx from '../../../start/tecworx.png';

export const JobCardToPrints = React.forwardRef((props, ref) => {
  const { makeId, catId, customer, date, model, serialNo, problemDesc, comments, trimmedDataURL } = props;

  return (
    <div style={{ width: '90%', margin: 25 }} ref={ref}>
      <Grid container>
        <Grid item xs={6} align='left'>
          <img src={Tecworx} alt="logo" sx={{ width: 100, height: 100 }} />
        </Grid>
        <Grid item xs={6} align='right' style={{ marginTop: '50px' }}>
          <Typography>Avondale Shops,</Typography>
          <Typography>Nando Buidling, Downstairs</Typography>
          <Typography>Harare Zimbabwe</Typography>
          <Typography>Call: 086 7721 0051</Typography>
          <Typography>www.tec-worx.com</Typography>
        </Grid>
      </Grid>
      <div>
        <Typography><b>Customer ID: </b>{customer?.customerID}</Typography>
        <Typography><b>FullName: </b>{customer?.fullName}</Typography>
        <Typography><b>Phone: </b>+{customer?.phone}</Typography>
        <Typography >{new Date(new Date()).toLocaleDateString() + ' ' + new Date().toLocaleTimeString()}</Typography>
      </div>
      <p></p>
      <Grid container>
        <Grid item xs={4}>
          <Typography><b>Repair Type: </b>{catId}</Typography>
          <Typography><b>Manufacturer: </b>{makeId}</Typography>
          <Typography><b>Model: </b>{model}</Typography>
          <Typography><b>Serialno: </b>{serialNo}</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography><b>Appointment Date: </b>{new Date(date).toDateString() + ' ' + new Date(date).toLocaleTimeString()}</Typography>
          <Typography><b>Problem Desc: </b>{problemDesc}</Typography>
          <Typography><b>Device condition: </b>{comments}</Typography>
        </Grid>
      </Grid>
      <div className="p-5">
        <Typography variant="h6" color='primary'>Terms and Conditions</Typography>
        <Typography variant="h6" color='primary'>Repair policy</Typography>
        <ol>
          <li>Repair estimate of the parts are suspected, in case during repair if we find some other problems will be treated as a new problem,
            we will intimate the same then processed.</li>
          <li>Physical verification of the material is only possible when it reaches to our workshop.</li>
          <li>All Software's and Data are of client responsibility, please backup all the data before submitting for repair.</li>
          <li>All repairs of Laptop / Desktop / Printer / Monitor are warranted for 15 days from date of Closed Call.</li>
          <li>This warranty applies only to those items which were found defective and repaired, it does not apply to products in which no defect
            was found and returned as is or merely recalibrated. Out of warranty products may not be capable of being returned to the exact original specifications or dimensions. </li>
          <li>In no event will we be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damages whatsoever
            arising from use of parts or loss of use of, data or profits arising out of, or in connection with.</li>
        </ol>
        <Typography variant="h6" color='primary'>Replacement Policy</Typography>
        <ol>
          <li>No advance replacement will be issued unless the faulty is returned.</li>
          <li>Computer Parts are likely to come from a different manufacturer and/or store, For any hardware defects you will have to deal with the appropriate manufacturer company</li>
          <li>If you want, on behalf of you we will provide the replacement service(pick n drop) on chargeable basis as per manufacturer terms</li>
        </ol>
        <Typography variant="h6" color='primary'>Diagnosis Fee</Typography>
        <p>This fee applies to all out-of-warranty service requests with no exception. It is payable even if we determine that the laptop is
          not faulty; that the fault is not repairable; or you decide not to proceed with the repair.
          However, it may be waived at our discretion if you instruct us to proceed with the quoted repair or if the laptop
          is salvaged to Tecworx Tech Repair.</p>
        <div style={{ marginBottom: 100 }}></div>
        
        <Typography variant="h6" color='primary' style={{marginTop: 70}}>Payment Terms</Typography>
        <ol>
          <li>Diagnosis fees at the time of Drop</li>
          <li>Full payment is strictly due on collection of your device. Your device will not be returned to you until full payment is received</li>
          <li>We retain a security interest in your device until full payment is made 48hours after repair is complete.</li>
          <li>we retain the right to sell your laptop at a private or public sale to pay for any outstanding invoice if
            payment is not received within 30 days of its due date.</li>
        </ol>
        <Typography variant="h6" color='primary'>Customer’s Responsibilities</Typography>
        <ol>
          <li> It is the Customer’s responsibility to complete a backup of all existing data, software, and programs on Supported Products prior to performing any Services.
            WE WILL NOT BE RESPONSIBLE FOR LOSS OF OR RECOVERY OF DATA, PROGRAMS, OR LOSS OF USE OF SYSTEM(S) OR NETWORK.</li>
          <li>You understand and agree that under no circumstances will Tecworx Tech Repair be responsible for any loss of software, programs, or data, even if our technicians
            have attempted to assist you with your backup, recovery, or similar services.</li>
          <li>Customer should come to collect their devices on their own. Sending someone to collect is at owner’s risk.</li>
        </ol>
        <p>I <b>{customer?.fullName}</b> do agree to the terms and conditions of Tecworx Tech Repair.</p>
        <Typography><b>Customer`s signature: </b>{trimmedDataURL ? <img alt='signature' style={{ width: 200, height: 30 }}
          src={trimmedDataURL} /> : null}</Typography>
      </div>
    </div>
  )
})
