import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    stock: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewInventory = createAsyncThunk('stock/AddNewInventory', async(stock, thunkAPI) =>{
    try {
        const response =await axios.post(`${url}/products`, stock);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateInventory = createAsyncThunk('stock/UpdateInventory', async({id,stock}, thunkAPI) =>{
    try {
        const response = await axios.patch(`${url}/products/${id}`, stock);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const stockSlice  = createSlice({
    name: "stock",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        //adding new category
        builder.addCase(AddNewInventory.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(AddNewInventory.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.stock = action.payload;
        });
        builder.addCase(AddNewInventory.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing category
        builder.addCase(UpdateInventory.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(UpdateInventory.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.stock = action.payload;
        });
        builder.addCase(UpdateInventory.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

    }
});

export async function getAllProducts() {
    try {
        return await axios.get(`${url}/products`);
    } catch (error) {
        console.log(error);
    }
}

export async function countProducts() {
    try {
        return await axios.get(`${url}/countproduct`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetProductBySku(keepingUnit) {
    try {
        return await axios.get(`${url}/product/${keepingUnit}`);
    } catch (error) {
        console.log(error);
    }
}

export const {reset} = stockSlice.actions;
export default stockSlice.reducer;