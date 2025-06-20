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
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: "flip",
        });
        setTimeout(() => {
          window.location.replace("/");
        }, 1000); // Delay by 1 second
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
      const name = `${firstName} ${lastName}`.trim();

      const { data } = await API.post("/auth/register", {
        firstName,
        lastName,
        name,
        role,
        email,
        password,
        location:location,
        age,
        gender,
        phoneNumber,
        hospitalName,
        organisationName,
        bloodGroup,
      });
      
      if (data && data.success) {
        toast.success("Account created Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: "flip",
        });
        setTimeout(() => {
          window.location.replace("/login");
        }, 500); // Delay by 0.5 second
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
      if (res.data) return res && res.data;
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
// update profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    {
      userId,
      name,
      firstName,
      lastName,
      email,
      phoneNumber,
      organisationName,
      hospitalName,
      bloodGroup,
      location,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await API.put("/auth/update-profile", {
        userId,
        name,
        firstName,
        lastName,
        email,
        phoneNumber,
        organisationName,
        hospitalName,
        bloodGroup,
        location,
      });

      if (data && data.success) {
        toast.success("Profile updated successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
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
// Change password thunk
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      if (data?.success) {
        toast.success(data.message || "Password changed successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }

      return data;
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.message || "Failed to change password";
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return rejectWithValue(msg);
    }
  }
);

