import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    cardpay: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

//card payment
export const Paycard = createAsyncThunk('cardpay/Paycard', async ({ products, totalAmount, paidAmount, cardNo, method, rate, phone }, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/payment`, { products, totalAmount, paidAmount, cardNo, method, rate, phone });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});
//update card payment
export const UpdatePayCard = createAsyncThunk('cardpay/UpdatePayCard', async ({ amount, cardNo, method, rate, phone }, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/cardfees`, { amount, cardNo, method, rate, phone });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})
//get card payment
export async function GetPaymentStatus(cardNo) {
    try {
        return await axios.get(`${url}/payfee/${cardNo}`);
    } catch (error) {
        console.log(error);
    }
}
//get order payment
export async function FindOrderPaymentStatus(orderId) {
    try {
        return await axios.get(`${url}/orderfee/${orderId}`);
    } catch (error) {
        console.log(error);
    }
}
// /all payment
export async function FindAllPaymentStatus() {
    try {
        return await axios.get(`${url}/payment`);
    } catch (error) {
        console.log(error);
    }
}

export async function FindAllOrderPaymentStatus() {
    try {
        return await axios.get(`${url}/payorderpayment`);
    } catch (error) {
        console.log(error);
    }
}

//order payment
export const PaymentOrder = createAsyncThunk('cardpay/PaymentOrder', async ({ products, totalAmount, paidAmount, orderId, method, rate, phone }, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/payorderpayment`, { products, totalAmount, paidAmount, orderId, method, rate, phone });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

//update order payment
export const UpdatePayOrders = createAsyncThunk('cardpay/UpdatePayOrders', async ({ amount, orderId, method, rate, phone }, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/updateorderpayment`, { amount, orderId, method, rate, phone });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})


export const cardPaymentSlice = createSlice({
    name: "cardpay",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        //pay for card
        builder.addCase(Paycard.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(Paycard.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.cardpay = action.payload;
        });
        builder.addCase(Paycard.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //update pay card
        builder.addCase(UpdatePayCard.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdatePayCard.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.cardpay = action.payload;
        });
        builder.addCase(UpdatePayCard.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        builder.addCase(UpdatePayOrders.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdatePayOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.cardpay = action.payload;
        });
        builder.addCase(UpdatePayOrders.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //pay for order
        builder.addCase(PaymentOrder.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(PaymentOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.cardpay = action.payload;
        });
        builder.addCase(PaymentOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const { reset } = cardPaymentSlice.actions;
export default cardPaymentSlice.reducer;