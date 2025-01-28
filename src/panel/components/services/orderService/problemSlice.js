import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    problem: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewProblem = createAsyncThunk('problem/AddNewProblem', async (problem, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/problem`, problem);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateProblem = createAsyncThunk('problem/UpdateProblem', async ({ id, problem }, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/problem/${id}`, problem);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const problemSlice = createSlice({
    name: "problem",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        //adding new category
        builder.addCase(AddNewProblem.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(AddNewProblem.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.problem = action.payload;
        });
        builder.addCase(AddNewProblem.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing category
        builder.addCase(UpdateProblem.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdateProblem.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.problem = action.payload;
        });
        builder.addCase(UpdateProblem.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function getAllProblem() {
    try {
        return await axios.get(`${url}/problem`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetAllOrderedServices() {
    try {
        return await axios.get(`${url}/service`);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProblemByModel(modelId) {
    try {
        return await axios.get(`${url}/problems/${modelId}`);
    } catch (error) {
        console.log(error)
    }
}

export const { reset } = problemSlice.actions;
export default problemSlice.reducer;