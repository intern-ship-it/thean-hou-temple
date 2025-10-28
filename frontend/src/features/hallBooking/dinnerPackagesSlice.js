// src/features/hallBooking/dinnerPackagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchDinnerPackages = createAsyncThunk(
  "dinnerPackages/fetchDinnerPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hall-booking/dinner-packages");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dinner packages"
      );
    }
  }
);

export const calculatePackageTotal = createAsyncThunk(
  "dinnerPackages/calculateTotal",
  async ({ package_id, number_of_tables }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/hall-booking/dinner-packages/calculate-total",
        {
          package_id,
          number_of_tables,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to calculate total"
      );
    }
  }
);

const dinnerPackagesSlice = createSlice({
  name: "dinnerPackages",
  initialState: {
    packages: [],
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
      .addCase(fetchDinnerPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDinnerPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.data;
      })
      .addCase(fetchDinnerPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dinnerPackagesSlice.actions;
export default dinnerPackagesSlice.reducer;
