import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    assign: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AssignTechnician = createAsyncThunk('assign/AssignTechnician', async (workorder, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/assign`, workorder);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateAssignedOrder = createAsyncThunk('assign/UpdateAssignedOrder', async ({ id, order }, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/assigned/${id}`, order);
        return response.data
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const RepairAssignedOrder = createAsyncThunk('assign/RepairAssignedOrder', async ({ id, order }, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/assign/${id}`, order);
        return response.data
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const RescheduleAppointment = createAsyncThunk('assign/RescheduleAppointment', async ({ id, reschedule }, thunkAPI) => {
    try {
        const response = await axios.patch(`${url}/reservice/${id}`, { reschedule })
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const CollectionOrder = createAsyncThunk('assign/CollectionOrder', async (order, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/ordercollect`, order);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const OrderServiceForCustomer = createAsyncThunk('assign/OrderServiceForCustomer', async ({ modelId, services, bookedDate, customerId }, thunkAPI) => {
    try {
        const response = await axios.post(`${url}/orderfor`, { modelId, services, bookedDate, customerId })
        return response.data;
    }
    catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const assignSlice = createSlice({
    name: "assign",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        //adding new category
        builder.addCase(AssignTechnician.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(AssignTechnician.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.assign = action.payload;
        });
        builder.addCase(AssignTechnician.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //update
        builder.addCase(UpdateAssignedOrder.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(UpdateAssignedOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.assign = action.payload;
        });
        builder.addCase(UpdateAssignedOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        builder.addCase(CollectionOrder.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(CollectionOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.assign = action.payload;
        });
        builder.addCase(CollectionOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        builder.addCase(RepairAssignedOrder.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(RepairAssignedOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.assign = action.payload;
        });
        builder.addCase(RepairAssignedOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        builder.addCase(RescheduleAppointment.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(RescheduleAppointment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.assign = action.payload;;
        });
        builder.addCase(RescheduleAppointment.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        builder.addCase(OrderServiceForCustomer.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(OrderServiceForCustomer.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.assign = action.payload;;
        });
        builder.addCase(OrderServiceForCustomer.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export async function GetMyWorkingOrders() {
    try {
        return await axios.get(`${url}/assigned`);
    } catch (error) {
        console.log(error);
    }
}

export async function getOrderServiceByOrder(orderId) {
    try {
        return await axios.get(`${url}/getorder/${orderId}`);
    } catch (error) {
        console.log(error);
    }
}

export async function RepairOrder(id) {
    try {
        return await axios.get(`${url}orderfor/${id}`);
    } catch (error) {
        console.log(error);
    }
}


export async function OrderedServicesSum() {
    try {
        return await axios.get(`${url}orderSum`);
    } catch (error) {
        console.log(error)
    }
}

export async function countAssigned() {
    try {
        return await axios.get(`${url}countassigned`);
    } catch (error) {
        console.log(error);
    }
}

export const { reset } = assignSlice.actions;
export default assignSlice.reducer;