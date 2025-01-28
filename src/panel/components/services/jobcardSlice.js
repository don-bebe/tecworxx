import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    card: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewJobCard = createAsyncThunk('card/AddNewJobCard', async (card, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/cards`, card);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateJobCard = createAsyncThunk('card/UpdateJobCard', async ({ id, card }, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/cards/${id}`, card);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const Collection = createAsyncThunk('card/Collection', async (card, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/collect`, card);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})


export const cardSlice = createSlice({
    name: "card",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        //adding new JobCard
        builder.addCase(AddNewJobCard.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(AddNewJobCard.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.card = action.payload;
        });
        builder.addCase(AddNewJobCard.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //Update JobCard
        builder.addCase(UpdateJobCard.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdateJobCard.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.card = action.payload;
        });
        builder.addCase(UpdateJobCard.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //collection form
        builder.addCase(Collection.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(Collection.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.card = action.payload;
        });
        builder.addCase(Collection.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function getJobCardByCardId(cardNo) {
    try {
        return await axios.get(`${url}/card/${cardNo}`);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllJobCards() {
    try {
        return await axios.get(`${url}/cards`);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllJobCardsToDiagnose() {
    try {
        return await axios.get(`${url}/dcards`);
    } catch (error) {
        console.log(error);
    }
}

export async function countJobs() {
    try {
        return await axios.get(`${url}/cardcount`);
    } catch (error) {
        console.log(error);
    }
}

export async function countMeJobs() {
    try {
        return await axios.get(`${url}/myworkcards`);
    } catch (error) {
        console.log(error);
    }
}

export async function countJobCardsCancelled() {
    try {
        return await axios.get(`${url}cardCancel`);
    } catch (error) {
        console.log(error);
    }
}

export async function countJobCardsRepair() {
    try {
        return await axios.get(`${url}/cardRepair`);
    } catch (error) {
        console.log(error);
    }
}

export async function countJobCardsToDiagonise() {
    try {
        return await axios.get(`${url}/cardDiagonised`);
    } catch (error) {
        console.log(error);
    }
}

export async function CancelJobCard(id) {
    try {
        return await axios.patch(`${url}/jobcard/${id}`);
    } catch (error) {
        console.log(error);
    }
}

export async function RepairJobCard(id) {
    try {
        return await axios.patch(`${url}/jobcards/${id}`);
    } catch (error) {
        console.log(error);
    }
}

export const { reset } = cardSlice.actions;
export default cardSlice.reducer;
