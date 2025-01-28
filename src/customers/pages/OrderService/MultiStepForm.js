import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import RepairType from './RepairType';
import Manufacturer from './Manufacturer';
import Model from './Model';
import Problem from './Problem';
import Book from './Book';
import StepperIcon from '../../components/StepperIcons';
import { Provider } from "../../components/MultiFormContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllRepairCategory, getAllManufacturerByRepair, getAllModelByManufacturer, OrderNewService, getAllProblemByModel, reset } from '../../features/orderServiceSlice';

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

const url = process.env.REACT_APP_BASE_URL;


const renderStep = (step) => {
  switch (step) {
    case 0:
      return <RepairType />;
    case 1:
      return <Manufacturer />;
    case 2:
      return <Model />;
    case 3:
      return <Problem />;
    case 4:
      return <Book />;
    default:
      throw new Error('Unknown step');
  }
};

const MultiStepForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [repairCat, setRepairCat] = useState([]);
  const [repairId, setRepairId] = useState('');
  const [manufact, setManufacture] = useState([]);
  const [manufactId, setManufactureId] = useState('');
  const [model, setModel] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date('yyyy-MM-dd'));
  const [modelId, setModelId] = useState('');
  const [availableServices, setAvailableServices] = useState([]);
  const [checked, setChecked] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [book, setBook] = useState(false);
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
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

  //get model according to manufacture
  useEffect(() => {
    const handleGetModels = async () => {
      try {
        const response = await getAllModelByManufacturer(manufactId)
        setModel(response.data)
      }
      catch (error) {
        console.log(error)
      }
    }
    handleGetModels();
  }, [manufactId]);

  //get problems according to model
  useEffect(() => {
    const GetFixableProblems = async () => {
      try {
        const response = await getAllProblemByModel(modelId)
        setAvailableServices(response.data)
      } catch (error) {
        console.log(error);
      }
    }
    GetFixableProblems();
  }, [modelId])

  //problems checked
  const handleCheckedChange = (item, event) => {
    if (event.target.checked) {
      setChecked((cartItem) => [...cartItem, item]);
      setTotalCost((total) => total + parseFloat(item.repairCost));
      setEnabled(true);
    }
    else {
      setChecked((cartItem) =>
        cartItem.filter((i) => i.problem !== item.problem));
      setTotalCost((total) => total - parseFloat(item.repairCost));
    }
  }


  const handleDateChange = (e) => {
    const date = e.target.value
    setSelectedDate(date);
    setBook(true)
  }

  //book appointment
  const BookNow = (e) => {
    e.preventDefault();

    if (new Date(selectedDate) < new Date()) {
      alert('Change your date')
      setBook(false)
    }
    else if (new Date(selectedDate) < new Date(new Date().getTime() + 2 * 60 * 60 * 1000)) {
      alert('Choose time that is 2 hours from now')
      setBook(false)
    }
    else {
      dispatch(OrderNewService({ modelId: modelId, services: checked, bookedDate: selectedDate }));
    }
  }


  useEffect(() => {
    if (service || isSuccess) {
      alert('Successfully booked for appointment');
      navigate('/menu')
    }
    dispatch(reset())
  }, [service, isSuccess, dispatch, navigate]);


  return (
    <Provider value={{
      repairCat, handleNext, setRepairId, handleBack, manufact, url,
      setManufactureId, model, setModelId, setSelectedDate,
      selectedDate, BookNow, isError, enabled, book,
      isLoading, message, availableServices, handleDateChange, totalCost, checked, handleCheckedChange,
      check, setCheck, openPopup, setOpenPopup, agree, setAgree
    }}>
      <Paper className={classes.paper}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {[1, 2, 3, 4, 5].map((e) => (
            <Step key={e}>
              <StepLabel StepIconComponent={StepperIcon} />
            </Step>
          ))}
        </Stepper>
        <main>{renderStep(activeStep)}</main>
      </Paper>
    </Provider>
  );
};
export default MultiStepForm;
