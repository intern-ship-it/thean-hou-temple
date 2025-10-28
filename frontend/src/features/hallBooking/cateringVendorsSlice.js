// src/features/hallBooking/cateringVendorsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCateringVendors = createAsyncThunk(
  "cateringVendors/fetchCateringVendors",
  async ({ vendor_type = "" } = {}, { rejectWithValue }) => {
    try {
      const params = vendor_type ? `?vendor_type=${vendor_type}` : "";
      const response = await api.get(`/hall-booking/catering-vendors${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendors"
      );
    }
  }
);

const cateringVendorsSlice = createSlice({
  name: "cateringVendors",
  initialState: {
    vendors: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCateringVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCateringVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.data;
      })
      .addCase(fetchCateringVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = cateringVendorsSlice.actions;
export default cateringVendorsSlice.reducer;
