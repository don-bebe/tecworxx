import { configureStore } from '@reduxjs/toolkit';
import customReducer from './customers/features/customerAuthSlice';
import orderServiceReducer from './customers/features/orderServiceSlice';
import categoryReducer from './panel/components/services/categorySlice';
import customerReducer from './panel/components/services/customerSlice';
import employeeReducer from './panel/components/services/employeeSlice';
import cardReducer from './panel/components/services/jobcardSlice';
import makeReducer from './panel/components/services/makeSlice';
import assignReducer from './panel/components/services/orderService/assignSlice';
import manufactureReducer from './panel/components/services/orderService/manufactureSlice';
import modelReducer from './panel/components/services/orderService/modelSlice';
import problemReducer from './panel/components/services/orderService/problemSlice';
import repairReducer from './panel/components/services/orderService/repairSlice';
import posReducer  from './panel/components/services/pointOfSale';
import stockReducer from './panel/components/services/stockSlice';
import workcardReducer  from './panel/components/services/workSlice';
import authReducer from "./start/authSlice";
import paymentMethodReducer from "./panel/components/services/paymentMethodSlice";
import cardPaymentReducer from './panel/components/services/cardPaymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    custom: customReducer,
    caty: categoryReducer,
    make: makeReducer,
    stock: stockReducer,
    card: cardReducer,
    customer: customerReducer,
    employee: employeeReducer,
    work: workcardReducer,
    pos: posReducer,
    repairCat: repairReducer,
    manufacturer: manufactureReducer,
    model: modelReducer,
    problem: problemReducer,
    service: orderServiceReducer,
    assign: assignReducer,
    method: paymentMethodReducer,
    cardpay: cardPaymentReducer
  },
});