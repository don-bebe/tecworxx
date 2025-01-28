import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    model: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewModel = createAsyncThunk('model/AddNewModel', async (model, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/model`, model);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateModel = createAsyncThunk('model/UpdateModel', async ({ id, model }, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/model/${id}`, model);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const modelSlice = createSlice({
    name: "model",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        //adding new category
        builder.addCase(AddNewModel.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(AddNewModel.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.model = action.payload;
        });
        builder.addCase(AddNewModel.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing category
        builder.addCase(UpdateModel.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdateModel.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.model = action.payload;
        });
        builder.addCase(UpdateModel.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function getAllModel() {
    try {
        return await axios.get(`${url}/model`);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllModelByManufacturer(manufactureId) {
    try {
        return await axios.get(`${url}/model/${manufactureId}`);
    } catch (error) {
        console.log(error);
    }
}

export const { reset } = modelSlice.actions;
export default modelSlice.reducer;