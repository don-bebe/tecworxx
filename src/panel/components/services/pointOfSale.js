import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    pos: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const PointOfSale = createAsyncThunk('pos/PointOfSale', async({products, totalAmount, paidAmount, phone, newTotalAmount, method, rate}, thunkAPI) =>{
    try {
        const response =await axios.post(`${url}/pos`,{ products, paidAmount ,totalAmount, phone, newTotalAmount, method, rate});
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const GetAllSales = async ()=>{
    try {
        return await axios.get(`${url}/pos`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetSoldProducts() {
    try {
        return await axios.get(`${url}/sold`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetTotal() {
    try {
        return await axios.get(`${url}/sales`);
    } catch (error) {
        console.log(error);
    }
}


export const posSlice  = createSlice({
    name: "pos",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        //sell items
        builder.addCase(PointOfSale.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(PointOfSale.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.pos = action.payload;
        });
        builder.addCase(PointOfSale.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const {reset} = posSlice.actions;
export default posSlice.reducer;