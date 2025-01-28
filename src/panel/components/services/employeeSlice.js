import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    employee: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}
export const AddNewEmployee = createAsyncThunk('user/AddNewEmployee', async(employee, thunkAPI) =>{
    try {
        const response = await axios.post(`${url}/employee`, employee)
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateEmployee = createAsyncThunk('user/UpdateEmployee', async({id,employee}, thunkAPI) =>{
    try {
        const response = await axios.patch(`${url}/employee/${id}`, employee);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const getAllEmployee =async () =>{
    try {
        return await axios.get(`${url}/employee`);
    } catch (error) {
        console.log(error)
    }
}

export const userRoles = ()=>([
    {id: '1', title: 'Admin' },
    {id: '2', title: 'User'},
    {id: '3', title: 'Technician'},
    {id: '4', title: 'Tech-Admin'}
]);


export const employeeSlice  = createSlice({
    name: "employee",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        //Add new user
        builder.addCase(AddNewEmployee.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(AddNewEmployee.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.employee = action.payload;
        });
        builder.addCase(AddNewEmployee.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //update user
        builder.addCase(UpdateEmployee.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(UpdateEmployee.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.employee = action.payload;
        });
        builder.addCase(UpdateEmployee.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const GetAllTechnicians = async () =>{
    try {
        return await axios.get(`${url}/technicians`)
    } catch (error) {
        console.log(error)
    }
}

export const {reset} = employeeSlice.actions;
export default employeeSlice.reducer;