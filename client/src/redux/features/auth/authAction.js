import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/API";
import { toast } from "react-toastify";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", { role, email, password });
      //store token
      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        window.location.replace("/");
      }
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
//register
export const userRegister = createAsyncThunk(
  "auth/register",
  async (
    {
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
      bloodGroup,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await API.post("/auth/register", {
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
        bloodGroup,
      });
      if (data && data.success) {
        toast.success("Account Created Successfully");
        window.location.replace("/login");
      }
      return data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

//current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async ({ rejectWithValue }) => {
    try {
      const res = await API.get("/auth/current-user");
      if (res && res.data) return res && res.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
