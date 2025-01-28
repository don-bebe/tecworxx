import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

const initialState = {
    category: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const AddNewCategory = createAsyncThunk('category/AddNewCategory', async(category, thunkAPI) =>{
    try {
        const response =await axios.post(`${url}/category`, category);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const UpdateCategory = createAsyncThunk('category/UpdateCategory', async({id,category}, thunkAPI) =>{
    try {
        const response = await axios.patch(`${url}/category/${id}`, category);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const categorySlice  = createSlice({
    name: "caty",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        //adding new category
        builder.addCase(AddNewCategory.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(AddNewCategory.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.category = action.payload;
        });
        builder.addCase(AddNewCategory.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        //updating existing category
        builder.addCase(UpdateCategory.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(UpdateCategory.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.category = action.payload;
        });
        builder.addCase(UpdateCategory.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const countCategory = async ()=>{
    try {
        return await axios.get(`${url}/countcategory`)
    } catch (error) {
        console.log(error)
    }
}

export const getAllCategory =async () =>{
    try {
        return await axios.get(`${url}/category`);
    } catch (error) {
        console.log(error)
    }
}

export const {reset} = categorySlice.actions;
export default categorySlice.reducer;