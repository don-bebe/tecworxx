import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { IconButton } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const url = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 150,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export default function MyJobCards({ items }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={items.manufacturer.manufacture}
        action={
          <IconButton>
            <font color='blue'>{items.cardNo}</font>
          </IconButton>
        }
        title={items.model}
        subheader={items.serialNo}
      />
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={`${url}${items.image}`}
          title=""
        />
      </CardActionArea>
      <CardContent>
        <Typography variant="body2" component="p">
          {items.date}<br />
          <b>{items.status}</b>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph variant="h6" color='primary'>Problem description</Typography>
          <Typography paragraph>
            <b>Fault description:</b> {items.problemDesc}<br />
            <b>Comments:</b> {items.comments}<br />
          </Typography>
          <Typography paragraph variant="h6" color='primary'>Diagnosis</Typography>
          <Typography paragraph>
            <b>Date:</b> {items.workshop?.date}<br />
            <b>Results:</b> {items.workshop?.diagnosisResults}<br />
            <b>Requirements:</b>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Product</strong></TableCell>
                  <TableCell><strong>Price ($)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  items.workshop?.requirements?.map((element) => (
                    <TableRow key={element.id}>
                      <TableCell>{element.product}</TableCell>
                      <TableCell>{element.price}</TableCell>
                    </TableRow>
                  ))
                }
                <TableRow>
                  <TableCell>Labour charge</TableCell>
                  <TableCell>{items.workshop?.labourCharge}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <b>OtherRequirements:</b> {items.workshop?.otherRequirements}<br />
          </Typography>
          {
            items.workshop?.invoice != null ?
              <iframe src={`${url}/${items.workshop?.invoice}`} title="Invoice" height="20%" width="100%" /> : ''
          }
        </CardContent>
      </Collapse>
    </Card>
  )
}
