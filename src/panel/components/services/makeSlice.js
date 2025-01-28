import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    make: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewMake = createAsyncThunk('make/AddNewMake', async (make, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/make`, make);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateMake = createAsyncThunk('make/UpdateMake', async ({ id, make }, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/make/${id}`, make);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const makeSlice = createSlice({
    name: "make",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        //adding new category
        builder.addCase(AddNewMake.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(AddNewMake.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.make = action.payload;
        });
        builder.addCase(AddNewMake.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing category
        builder.addCase(UpdateMake.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdateMake.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.make = action.payload;
        });
        builder.addCase(UpdateMake.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function getAllBrands() {
    try {
        return await axios.get(`${url}/make`);
    } catch (error) {
        console.log(error);
    }
}

export async function getBrand(catId) {
    try {
        return await axios.get(`${url}/make/${catId}`);
    } catch (error) {
        console.log(error);
    }
}

export const { reset } = makeSlice.actions;
export default makeSlice.reducer;
