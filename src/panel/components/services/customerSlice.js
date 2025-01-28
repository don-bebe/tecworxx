import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    customer: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewCustomer = createAsyncThunk('customer/AddNewCustomer', async(customer, thunkAPI) =>{
    try {
        const response =await axios.post(`${url}/customer`, customer);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateCustomer = createAsyncThunk('customer/UpdateCustomer', async({id,customer}, thunkAPI) =>{
    try {
        const response = await axios.patch(`${url}/customer/${id}`, customer);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const customerSlice  = createSlice({
    name: "customer",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        //adding new Customer
        builder.addCase(AddNewCustomer.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(AddNewCustomer.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.customer = action.payload;
        });
        builder.addCase(AddNewCustomer.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing Customer
        builder.addCase(UpdateCustomer.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(UpdateCustomer.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.customer = action.payload;
        });
        builder.addCase(UpdateCustomer.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function getAllCustomers() {
    try {
        return await axios.get(`${url}/customer`);
    } catch (error) {
        console.log(error);
    }
}
export async function searchPhone(phone) {
    try {
        return await axios.get(`${url}/cphone/${phone}`);
    } catch (error) {
        console.log(error);
    }
}

export async function countCustomer() {
    try {
        return await axios.get(`${url}/countCustomer`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetCustomerID(customerID){
    try {
        return await axios.get(`${url}/customer/${customerID}`);
    } catch (error) {
        console.log(error);
    }
}

export const {reset} = customerSlice.actions;
export default customerSlice.reducer;