import React, {useState, useEffect} from 'react'
import PageHeader from '../../components/features/PageHeader';
import WorkTwoToneIcon from '@material-ui/icons/WorkTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell } from '@material-ui/core';
import useTable from '../../components/features/useTable';
import {ViewMyWork} from '../../components/services/workSlice';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(2),
        padding: theme.spacing(1)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
  }))

const headCells = [
    { id: 'id', label: '#' },
    { id: 'date', label: 'Date'},
    { id: 'cardNo', label: 'CardNo'},
    { id: 'category', label: 'Device'},
    { id: 'model', label: 'Model' },
    { id: 'problemDesc', label: 'Fault'},
    { id: 'jobdone', label: 'Work done' },
    { id: 'timeTaken', label: 'Time taken' },
    { id: 'status', label: 'Status' }
]

export default function ViewWork() {
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    // eslint-disable-next-line
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });

    const getMyWorkData = async () => {
        try {
            let response = await ViewMyWork();
            setRecords(response.data);
        } catch (error) {
            console.log(error);
        }
      };
      useEffect(() => {
        getMyWorkData();
      }, []);
    
      const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
      } = useTable(records, headCells,filterFn);
    
  return (
    <>
        <PageHeader
        title="Work cards"
        subTitle="My works"
        icon={<WorkTwoToneIcon fontSize="large" />}
        />
        <Paper className={classes.pageContent}>
            <TblContainer>
                <TblHead />
                <TableBody>
                    {
                        recordsAfterPagingAndSorting().map(me =>(
                            <TableRow key={me.id}>
                                <TableCell>{me.id}</TableCell>
                                <TableCell>{me.date}</TableCell>
                                <TableCell>{me.jobcard.cardNo}</TableCell>
                                <TableCell>{me.jobcard.manufacturer.repaircategory.repair+' '+me.jobcard.manufacturer.manufacture}</TableCell>
                                <TableCell>{me.jobcard.model}</TableCell>
                                <TableCell>{me.jobcard.problemDesc}</TableCell>
                                <TableCell>{me.jobdone}</TableCell>
                                <TableCell>{me.timeTaken}</TableCell>
                                <TableCell>{me.jobcard.status}</TableCell>
                            </TableRow>
                        )) 
                    }
                </TableBody>
            </TblContainer>
            <TblPagination />
        </Paper>
    </>
  )
}
