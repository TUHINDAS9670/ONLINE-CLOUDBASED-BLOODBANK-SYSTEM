import { createSlice } from "@reduxjs/toolkit";
import { userLogin, userRegister, getCurrentUser, updateUserProfile, changePassword, } from "./authAction";
const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const initialState = {
  loading: false,
  user: null,
  token,
  error: null,
};
// const initialState = {
//   loading: false,
//   error: null,
//   user: null,
//   token: localStorage.getItem("token") || null,
// };

const authSlice = createSlice({
  name: "auth",
  initialState:initialState,
 reducers: {
  logout: (state) => {
    state.user = null;
    state.token = null;
    state.loading = false;
    state.error = null;

    // 🔓 Clear from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
},

  extraReducers: (builder) => {
    //loginuser
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.token = payload.token;
      // on login
localStorage.setItem("user", JSON.stringify(payload.user));
  localStorage.setItem("token", payload.token);
    });
    builder.addCase(userLogin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    //register user
    builder.addCase(userRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userRegister.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
    });
    builder.addCase(userRegister.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    //CURRENT user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
    });
    builder.addCase(getCurrentUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(updateUserProfile.pending, (state) => {
  state.loading = true;
})
builder.addCase(updateUserProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload?.user || state.user;
})
builder.addCase(updateUserProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Profile update failed";
})
builder.addCase(changePassword.pending, (state) => {
  state.loading = true;
  state.error = null;
});
builder.addCase(changePassword.fulfilled, (state) => {
  state.loading = false;
});
builder.addCase(changePassword.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});


    
  },
});

export default authSlice;
