import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    manufacturer: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewManufacturer = createAsyncThunk('manufacturer/AddNewAddNewManufacturer', async (manufacturer, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/manufacture`, manufacturer);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateManufacturer = createAsyncThunk('manufacturer/UpdateManufacturer', async ({ id, manufacturer }, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/manufacture/${id}`, manufacturer);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const manufactureSlice = createSlice({
    name: "manufacturer",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        //adding new category
        builder.addCase(AddNewManufacturer.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(AddNewManufacturer.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.manufacturer = action.payload;
        });
        builder.addCase(AddNewManufacturer.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing category
        builder.addCase(UpdateManufacturer.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdateManufacturer.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.manufacturer = action.payload;
        });
        builder.addCase(UpdateManufacturer.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function getAllManufacturer() {
    try {
        return await axios.get(`${url}/allmanufacture`);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllManufacturerByRepair(repairId) {
    try {
        return await axios.get(`${url}/allmanufacture/${repairId}`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetManufactureById(makeId){
    try {
        return await axios.get(`${url}/manufacturer/${makeId}`);
    } catch (error) {
        console.log(error);
    }
}

export const { reset } = manufactureSlice.actions;
export default manufactureSlice.reducer;
