import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    work: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewWorkCard = createAsyncThunk('work/AddNewWorkCard', async( work, thunkAPI) =>{
    try {
        const response =await axios.post(`${url}/workcard`, work);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateWorkCard = createAsyncThunk('work/UpdateWorkCard', async({id, work}, thunkAPI) =>{
    try {
        const response = await axios.patch(`${url}/workcard/${id}`, work);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const workcardSlice  = createSlice({
    name: "work",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        //adding new WorkCard
        builder.addCase(AddNewWorkCard.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(AddNewWorkCard.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.work = action.payload;
        });
        builder.addCase(AddNewWorkCard.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating A WorkCard
        builder.addCase(UpdateWorkCard.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(UpdateWorkCard.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.work = action.payload;
        });
        builder.addCase(UpdateWorkCard.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const GetWorkCardForRepair = async ()=>{
    try {
        return await axios.get(`${url}/workcards`)
    } catch (error) {
        console.log(error)
    }
}

export const ViewMyWork = async ()=>{
    try {
        return await axios.get(`${url}/workcardss`)
    } catch (error) {
        console.log(error)
    }
}

export const CountIndividualWork = async ()=>{
    try {
        return await axios.get(`${url}/countwork`);
    } catch (error) {
        console.log(error)
    }
}

export const {reset} = workcardSlice.actions;
export default workcardSlice.reducer;