import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;


const initialState = {
    custom: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    alertmessage: ""
}

export const LoginCustomer= createAsyncThunk('custom/LoginCustomer', async(custom, thunkAPI) =>{
    try {
        const response =await axios.post(`${url}/custlogin`, {
            fullName: custom.fullName,
            phone: custom.phone
        });
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const customSlice  = createSlice({
    name: "custom",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        builder.addCase(LoginCustomer.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(LoginCustomer.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.custom = action.payload;
        });
        builder.addCase(LoginCustomer.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //SignUp user
        builder.addCase(Registration.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(Registration.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.custom = action.payload;
        });
        builder.addCase(Registration.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

    }
});

export const LogOut = createAsyncThunk("custom/LogOut", async() => {
    await axios.delete(`${url}/custlogout`);
});

export const Registration = createAsyncThunk('custom/Registration', async(custom, thunkAPI)=>{
    try {
        const response = await axios.post(`${url}/register`,{
            fullName: custom.fullName,
            phone: custom.phone,
            email: custom.email,
            address: custom.address,
            contactPerson: custom.contactPerson,
            contactPersonCell: custom.contactPersonCell,
            role: custom.role
        });
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const getMyProfile =async () =>{
    try {
        return await axios.get(`${url}/custprofile`);
    } catch (error) {
        console.log(error)
    }
}

export const GetMyJobCardsCount = async() =>{
    try {
        return await axios.get(`${url}/countmycards`);
    } catch (error) {
        console.log(error)
    }
}

export const GetAllMyJobCards = async() =>{
    try {
        return await axios.get(`${url}/mycards`);
    } catch (error) {
        console.log(error)
    }
}

export const {reset} = customSlice.actions;
export default customSlice.reducer;
