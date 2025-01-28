import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;


const initialState = {
    service: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const OrderNewService = createAsyncThunk('service/OrderNewService', async ({ modelId, services, bookedDate }, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/service`, { modelId, services, bookedDate });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateOrderService = createAsyncThunk('service/UpdateOrderService', async (id, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/service/${id}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const RecordOrder = createAsyncThunk('service/RecordOrder', async ({ date, repairId, manufactId, model, serialNo, problemDesc, }, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/myrecord`, { date, repairId, manufactId, model, serialNo, problemDesc });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const orderServiceSlice = createSlice({
    name: "service",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(OrderNewService.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(OrderNewService.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.service = action.payload;
        });
        builder.addCase(OrderNewService.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        builder.addCase(UpdateOrderService.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdateOrderService.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.service = action.payload;;
        });
        builder.addCase(UpdateOrderService.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        builder.addCase(RecordOrder.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(RecordOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.service = action.payload;
        });
        builder.addCase(RecordOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function getAllRepairCategory() {
    try {
        return await axios.get(`${url}/repairCat`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetAllOrderPayments(){
    try {
        return await axios.get(`${url}/myorderpayment`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetAllCardPayments(){
    try {
        return await axios.get(`${url}/mycardpayment`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetAllSalesPayments(){
    try {
        return await axios.get(`${url}/mysalespayment`);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllManufacturerByRepair(repairId) {
    try {
        return await axios.get(`${url}/manufacture/${repairId}`);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllModelByManufacturer(manufactureId) {
    try {
        return await axios.get(`${url}/modelz/${manufactureId}`);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProblemByModel(modelId) {
    try {
        return await axios.get(`${url}/problem/${modelId}`);
    } catch (error) {
        console.log(error);
    }
}

export async function GetAllOrderedServices() {
    try {
        return await axios.get(`${url}/myservice`);
    } catch (error) {
        console.log(error);
    }
}

export async function Services() {
    try {
        return await axios.get(`${url}/services`);
    } catch (error) {
        console.log(error);
    }
}

export const { reset } = orderServiceSlice.actions;
export default orderServiceSlice.reducer;