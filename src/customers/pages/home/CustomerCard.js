import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { IconButton } from '@material-ui/core';

export default function CustomerCard(props) {
  const { title,  icon, details } = props;
  return (
    <div>
      <Card elevation={3}>
        <CardHeader
          avatar={icon}
          action={
            <IconButton>
               {details}
            </IconButton>
          }
          title={title}
        />
      </Card>
    </div>
  )
}
