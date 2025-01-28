import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    repair: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewRepairCategory = createAsyncThunk('repair/AddNewRepairCategory', async(repair, thunkAPI) =>{
    try {
        const response =await axios.post(`${url}/repair`, repair);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateRepairCategory = createAsyncThunk('repair/UpdateRepairCategory', async({id,repair}, thunkAPI) =>{
    try {
        const response = await axios.patch(`${url}/repair/${id}`, repair);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const repairSlice  = createSlice({
    name: "repairCat",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        //adding new category
        builder.addCase(AddNewRepairCategory.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(AddNewRepairCategory.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.repair = action.payload;
        });
        builder.addCase(AddNewRepairCategory.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing category
        builder.addCase(UpdateRepairCategory.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(UpdateRepairCategory.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.repair = action.payload;
        });
        builder.addCase(UpdateRepairCategory.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function getAllRepairCategory() {
    try {
        return await axios.get(`${url}/repair`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetRepairId(catId){
    try {
        return await axios.get(`${url}/repairs/${catId}`)
    } catch (error) {
        console.log(error);
    }
}

export const {reset} = repairSlice.actions;
export default repairSlice.reducer;