import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  user: null,
  error: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Example of how you would handle an async action or an additional reducer
    builder
      .addCase('someAsyncAction/pending', (state) => {
        state.loading = true;
      })
      .addCase('someAsyncAction/fulfilled', (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase('someAsyncAction/rejected', (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
})

export default authSlice
