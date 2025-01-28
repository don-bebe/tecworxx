import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CardStepper from '../../components/CardStepper';
import { Provider } from "../../components/MultiFormContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Fault from './Fault';
import RepairType from '../OrderService/RepairType';
import { getAllRepairCategory, getAllManufacturerByRepair, RecordOrder, reset } from '../../features/orderServiceSlice';
import Manufacturer from '../OrderService/Manufacturer';

const url = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(1) * 2)]: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const renderStep = (step) => {
    switch (step) {
        case 0:
            return <RepairType />
        case 1:
            return <Manufacturer />
        case 2:
            return <Fault />
        default:
            throw new Error('Unknown step');
    }
};

const MultiStepJob = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [repairCat, setRepairCat] = useState([]);
    const [repairId, setRepairId] = useState('');
    const [manufact, setManufacture] = useState([]);
    const [manufactId, setManufactureId] = useState('');
    const [problemDesc, setProblemDesc] = useState('');
    const [serialNo, setSerial] = useState('');
    const [model, setModel] = useState('');
    const [date, setDate] = useState(new Date(''))
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [agree, setAgree] = useState(false);

    const { service, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.service
    );

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    //get all repair category
    const GetRepairs = async () => {
        try {
            const response = await getAllRepairCategory();
            setRepairCat(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        GetRepairs()
    }, []);

    //get manufacture according to repair category
    useEffect(() => {
        const handleGetManufacture = async () => {
            try {
                const response = await getAllManufacturerByRepair(repairId);
                setManufacture(response.data)
            } catch (error) {
                console.log(error);
            }
        }
        handleGetManufacture();
    }, [repairId]);

    //order 
    const OrderRecord = (e) => {
        e.preventDefault();
        if (new Date(date) < new Date()) {
            alert('Change your date')
        }
        else if (new Date(date) < new Date(new Date().getTime() + 0.5 * 60 * 60 * 1000)) {
            alert('Choose time that is either 30mins + from now')
        }
        else {
            dispatch(RecordOrder({ date: date, repairId: repairId, manufactId: manufactId, model: model, serialNo: serialNo, problemDesc: problemDesc }))
        }
    }

    useEffect(() => {
        if (service || isSuccess) {
            alert('Successfully booked for appointment');
            navigate('/mycards')
        }
        dispatch(reset())
    }, [service, isSuccess, dispatch, navigate]);

    return (
        <Provider value={{
            repairCat, handleNext, setRepairId, handleBack, manufact, date, setDate, isError, message,
            setManufactureId, problemDesc, setProblemDesc, serialNo, setSerial, model, setModel, OrderRecord,
            isLoading, checked, setChecked, openPopup, setOpenPopup, agree, setAgree, url
        }}>
            <Paper className={classes.paper}>
                <Stepper activeStep={activeStep} className={classes.stepper}>
                    {[1, 2, 3].map((e) => (
                        <Step key={e}>
                            <StepLabel StepIconComponent={CardStepper} />
                        </Step>
                    ))}
                </Stepper>
                <main>{renderStep(activeStep)}</main>
            </Paper>
        </Provider>
    );
};

export default MultiStepJob;
