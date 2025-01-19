import {createAsyncThunk} from"@reduxjs/toolkit";
import API from "../../../services/api";
import {  toast } from 'react-toastify';

export const userLogin=createAsyncThunk(
  'auth/login',
  async({role,email,password},{rejectWithValue})=>{
    try {
      const{data} =await API.post('/auth/login',{role,email,password})
      //store token
      if(data.success){
        localStorage.setItem('token',data.token)
        toast.success(data.message)
      }
      return data;
    } catch (error) {
      if(error.response && error.response.data.message ){
        return rejectWithValue(error.response.data.message)
      }
      else{
        return rejectWithValue(error.message)
      }
    }
  }
)
//register
export const userRegister=createAsyncThunk(
  'auth/register',
  async({
      firstName,
      lastName,
      role,
      email,
      password,location,
      age,
      gender,
      phoneNumber,
      hospitalName,
      organisationName,
      bloodGroup,
     
  },{rejectWithValue})=>{
    try {
      const{data}=await API.post('/auth/register',{       
        firstName,
        lastName,
        role,
        email,
        password,
        location,
        age,
        gender,
        phoneNumber,
        hospitalName,
        organisationName,
        bloodGroup,})
        if(data.success){
          toast.success("Account Created Successfully")
          window.location.replace('/login')
        }
    } catch (error) {
      console.log(error);
      if(error.response && error.response.data.message ){
        return rejectWithValue(error.response.data.message)
      }
      else{
        return rejectWithValue(error.message)
      }
    }
  }
)