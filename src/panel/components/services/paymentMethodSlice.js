import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    method: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewPaymentMethod = createAsyncThunk('method/PaymentMethod', async(method, thunkAPI) =>{
    try {
        const response =await axios.post(`${url}/method`, method);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdatePaymentMethod = createAsyncThunk('method/UpdatePaymentMethod', async({id,method}, thunkAPI) =>{
    try {
        const response = await axios.patch(`${url}/method/${id}`, method);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const paymentMethodSlice  = createSlice({
    name: "method",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        //adding new PaymentMethod
        builder.addCase(AddNewPaymentMethod.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(AddNewPaymentMethod.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.method = action.payload;
        });
        builder.addCase(AddNewPaymentMethod.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing PaymentMethod
        builder.addCase(UpdatePaymentMethod.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(UpdatePaymentMethod.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.method = action.payload;
        });
        builder.addCase(UpdatePaymentMethod.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const GetllAllPaymentMethods =async()=>{
    try {
        return await axios.get(`${url}/methods`);
    } catch (error) {
        console.log(error)
    }
}

export const GetAllActivePaymentMethod = async() =>{
    try {
        return await axios.get(`${url}/method`);
    } catch (error) {
        console.log(error)
    }
}
export const {reset} = paymentMethodSlice.actions;
export default paymentMethodSlice.reducer;
